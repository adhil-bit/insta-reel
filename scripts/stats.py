"""Pull recent reel stats from the Instagram API into logs/stats.json (read-only)."""
import json, os, sys
import requests
sys.path.insert(0, ".")
import config
from pipeline.instagram import GRAPH
tok, uid = config.IG_ACCESS_TOKEN, config.IG_USER_ID
acct = requests.get(f"{GRAPH}/{uid}", params={"fields": "username,followers_count,follows_count,media_count", "access_token": tok}, timeout=60).json()
media = requests.get(f"{GRAPH}/{uid}/media", params={"fields": "id,caption,timestamp,like_count,comments_count,permalink,media_product_type", "limit": 30, "access_token": tok}, timeout=60).json()
out = {"account": acct, "reels": []}
for m in media.get("data", []):
    row = {k: m.get(k) for k in ("id", "timestamp", "like_count", "comments_count", "permalink")}
    row["title"] = next((l for l in (m.get("caption") or "").splitlines() if l.strip()), "")[:70]
    r = requests.get(f"{GRAPH}/{m['id']}/insights", params={"metric": "views,reach,saved,shares,total_interactions,ig_reels_avg_watch_time,ig_reels_video_view_total_time", "access_token": tok}, timeout=60).json()
    if "data" in r:
        for d in r["data"]:
            row[d["name"]] = d["values"][0]["value"] if d.get("values") else d.get("total_value", {}).get("value")
    else:
        row["insights_error"] = r.get("error", {}).get("message", "")[:120]
    for metric in ("follows", "profile_visits"):          # not available for every media type: try each, ignore errors
        x = requests.get(f"{GRAPH}/{m['id']}/insights", params={"metric": metric, "access_token": tok}, timeout=60).json()
        if "data" in x and x["data"]:
            d = x["data"][0]; row[metric] = d["values"][0]["value"] if d.get("values") else d.get("total_value", {}).get("value")
        else:
            row.setdefault("extra_errors", {})[metric] = x.get("error", {}).get("message", "")[:100]
    out["reels"].append(row)
os.makedirs("logs", exist_ok=True)
json.dump(out, open("logs/stats.json", "w"), indent=2, ensure_ascii=False)
import datetime
with open("logs/followers.jsonl", "a") as f:                   # follower history, one line per run
    f.write(json.dumps({"at": datetime.datetime.utcnow().isoformat(timespec="minutes"), "followers": acct.get("followers_count"), "following": acct.get("follows_count")}) + "\n")
print("account:", acct); print(len(out["reels"]), "reels")
