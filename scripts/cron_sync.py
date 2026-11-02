"""Make cron-job.org match config.POST_SLOTS (needs CRONJOB_API_KEY and CRON_TRIGGER_TOKEN).
Creates/updates one job per group of days with the same times; disables other 'insta-reel' jobs.
Usage: python scripts/cron_sync.py [--apply]   (without --apply it only prints the plan)"""
import json, os, sys, urllib.request, urllib.error
sys.path.insert(0, ".")
import config

API = "https://api.cron-job.org"
KEY = os.environ.get("CRONJOB_API_KEY", "")
TRIGGER = os.environ.get("CRON_TRIGGER_TOKEN", "")
APPLY = "--apply" in sys.argv
WD = {"Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6}
URL = "https://api.github.com/repos/adhil-bit/insta-reel/actions/workflows/post-reel.yml/dispatches"


def call(method, path, body=None):
    import time
    for attempt in range(5):
        try:
            return _call(method, path, body)
        except urllib.error.HTTPError as e:
            if e.code == 429 or e.code >= 500:          # cron-job.org rate limit: wait and retry
                time.sleep(3 * (attempt + 1)); continue
            raise RuntimeError(f"{method} {path} -> HTTP {e.code}: {e.read().decode()[:200]}")
    raise RuntimeError(f"{method} {path}: still rate-limited")


def _call(method, path, body=None):
    import time
    time.sleep(1.5)                                       # stay under the API's per-second limit
    req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        txt = r.read().decode() or "{}"
        return json.loads(txt)


# 1) wanted jobs: group days whose UTC fire times (slot + 1 min) are identical
groups = {}
for day, slots in config.POST_SLOTS.items():
    utc = tuple(sorted(((int(s[:2]) * 60 + int(s[3:]) + 1 - 330) % 1440) for s in slots))
    groups.setdefault(utc, []).append(day)
wanted = []
for utc, days in groups.items():
    by_min = {}
    for m in utc:
        by_min.setdefault(m % 60, []).append(m // 60)
    for minute, hours in by_min.items():
        title = f"insta-reel {'+'.join(days)}" + (f" :{minute:02d}" if len(by_min) > 1 else "")
        wanted.append({"title": title, "wdays": sorted(WD[d] for d in days), "hours": sorted(hours), "minutes": [minute]})
# daily voicing/render run, just after Gemini's free allowance resets (07:00 UTC)
wanted.append({"title": "insta-reel render daily", "wdays": [0, 1, 2, 3, 4, 5, 6], "hours": [7], "minutes": [20],
               "url": "https://api.github.com/repos/adhil-bit/insta-reel/actions/workflows/render-jobs.yml/dispatches",
               "body": json.dumps({"ref": "main"})})
wanted.append({"title": "insta-reel stats daily", "wdays": [0, 1, 2, 3, 4, 5, 6], "hours": [3], "minutes": [30],
               "url": "https://api.github.com/repos/adhil-bit/insta-reel/actions/workflows/stats.yml/dispatches",
               "body": json.dumps({"ref": "main"})})
print("Wanted cron-job.org jobs (UTC):")
for w in wanted:
    print(f"  {w['title']}: weekdays {w['wdays']} hours {w['hours']} minute {w['minutes']}")
if not KEY:
    sys.exit("CRONJOB_API_KEY missing: nothing changed")

existing = call("GET", "/jobs").get("jobs", [])
ours = {j["title"]: j for j in existing if j.get("title", "").lower().startswith("insta-reel")}
print("Existing insta-reel jobs:", {t: (j["jobId"], j.get("enabled")) for t, j in ours.items()})
result = {"created": [], "updated": [], "disabled": []}
for w in wanted:
    job = {"title": w["title"], "url": w.get("url", URL), "enabled": True, "saveResponses": True, "requestMethod": 1,
           "schedule": {"timezone": "UTC", "expiresAt": 0, "mdays": [-1], "months": [-1],
                        "wdays": w["wdays"], "hours": w["hours"], "minutes": w["minutes"]},
           "extendedData": {"headers": {"Authorization": f"Bearer {TRIGGER}", "Accept": "application/vnd.github+json"},
                            "body": w.get("body") or json.dumps({"ref": "main", "inputs": {"reel": "", "action": "auto"}})}}
    if w["title"] in ours:
        if APPLY: call("PATCH", f"/jobs/{ours[w['title']]['jobId']}", {"job": job})
        result["updated"].append(w["title"])
    else:
        if not TRIGGER: sys.exit("CRON_TRIGGER_TOKEN missing: can't create jobs")
        if APPLY: call("PUT", "/jobs", {"job": job})
        result["created"].append(w["title"])
for title, j in ours.items():
    if title not in {w["title"] for w in wanted} and j.get("enabled") and not title.startswith("insta-reel once"):   # never touch exact-time one-off triggers
        if APPLY: call("PATCH", f"/jobs/{j['jobId']}", {"job": {"enabled": False}})
        result["disabled"].append(title)
print(("APPLIED: " if APPLY else "DRY RUN (add --apply): ") + json.dumps(result))
os.makedirs("logs", exist_ok=True)
json.dump({"applied": APPLY, **result, "wanted": wanted}, open("logs/cron-sync.json", "w"), indent=2)
