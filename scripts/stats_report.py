"""Telegram summary of logs/stats.json: yesterday's reels, the winners, and what to fix."""
import json, subprocess
from datetime import datetime, timedelta, timezone
d = json.load(open("logs/stats.json")); acct = d["account"]; R = d["reels"]
now = datetime.now(timezone.utc)
def age_h(r): return (now - datetime.strptime(r["timestamp"], "%Y-%m-%dT%H:%M:%S%z")).total_seconds() / 3600
sec = lambda r: (r.get("ig_reels_avg_watch_time") or 0) / 1000
lines = [f"📊 Daily stats · {acct.get('followers_count')} followers · following {acct.get('follows_count')}", "", "Last 24-48 h:"]
for r in sorted([r for r in R if 18 <= age_h(r) <= 48], key=lambda r: -(r.get("views") or 0)):
    flag = "🟢" if sec(r) >= 10 else "🟡" if sec(r) >= 7 else "🔴"
    lines.append(f"{flag} {r.get('views', 0)} views · {sec(r):.1f}s watched · {r.get('shares', 0)} shares · {r['title'][:38]}")
lines += ["", "🏆 Best by watch time (all):"]
for r in sorted([r for r in R if age_h(r) >= 18], key=lambda r: -sec(r))[:3]:
    lines.append(f"  {sec(r):.1f}s · {r.get('views', 0)} views · {r['title'][:38]}")
lines += ["", "Rule: 🟢 10s+ gets pushed to 1,000+ people; 🔴 under 7s stops near 150."]
msg = "\n".join(lines); print(msg)
subprocess.run(["bash", "scripts/notify.sh", msg], check=False)
