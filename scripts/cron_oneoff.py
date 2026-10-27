"""One-off cron-job.org trigger: post a specific reel at an exact time.
Usage: python scripts/cron_oneoff.py <reel-folder> "YYYY-MM-DD HH:MM" (IST)"""
import json, os, sys, urllib.request
from datetime import datetime, timedelta
reel, when_ist = sys.argv[1], sys.argv[2]
utc = datetime.strptime(when_ist, "%Y-%m-%d %H:%M") - timedelta(hours=5, minutes=30)
exp = (utc + timedelta(hours=2)).strftime("%Y%m%d%H%M%S")
job = {"title": f"insta-reel once {reel} {when_ist} IST", "enabled": True, "saveResponses": True, "requestMethod": 1,
       "url": "https://api.github.com/repos/adhil-bit/insta-reel/actions/workflows/post-reel.yml/dispatches",
       "schedule": {"timezone": "UTC", "expiresAt": int(exp), "mdays": [utc.day], "months": [utc.month], "wdays": [-1],
                    "hours": [utc.hour], "minutes": [utc.minute]},
       "extendedData": {"headers": {"Authorization": f"Bearer {os.environ['CRON_TRIGGER_TOKEN']}", "Accept": "application/vnd.github+json"},
                        "body": json.dumps({"ref": "main", "inputs": {"reel": reel, "action": "post"}})}}
req = urllib.request.Request("https://api.cron-job.org/jobs", method="PUT", data=json.dumps({"job": job}).encode(),
                             headers={"Authorization": f"Bearer {os.environ['CRONJOB_API_KEY']}", "Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=30) as r:
    print("scheduled:", job["title"], "->", r.read().decode()[:120])
