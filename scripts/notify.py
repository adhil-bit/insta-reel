"""Telegram alerts. Usage: python scripts/notify.py posted <reel> | post_failed <reel> | render <status> | test"""
import json, os, subprocess, sys
from datetime import datetime, timedelta, timezone

TOKEN, CHAT = os.getenv("TELEGRAM_BOT_TOKEN"), os.getenv("TELEGRAM_CHAT_ID")
IST = timezone(timedelta(hours=5, minutes=30))
now = datetime.now(IST).strftime("%a %d %b, %I:%M %p IST")
repo, run = os.getenv("GITHUB_REPOSITORY", ""), os.getenv("GITHUB_RUN_ID", "")
run_link = f"https://github.com/{repo}/actions/runs/{run}" if run else ""

def send(text: str) -> None:
    if not TOKEN or not CHAT:
        print("Telegram not configured"); return
    import urllib.parse, urllib.request
    data = urllib.parse.urlencode({"chat_id": CHAT, "text": text}).encode()
    try:
        with urllib.request.urlopen(f"https://api.telegram.org/bot{TOKEN}/sendMessage", data=data, timeout=30) as r:
            print("telegram:", r.status)
    except Exception as e:
        print("telegram failed:", e)

def title_of(folder: str) -> str:
    try:
        return next(e.get("title", folder) for e in json.load(open("history.json")) if e["folder"] == folder)
    except Exception:
        return folder

def tail(path: str, n: int = 600) -> str:
    try:
        return open(path, encoding="utf-8", errors="ignore").read()[-n:]
    except Exception:
        return "(see the GitHub Actions log)"

kind = sys.argv[1] if len(sys.argv) > 1 else "test"
arg = sys.argv[2] if len(sys.argv) > 2 else ""
if kind == "posted":
    log = tail("logs/last-post-log.txt", 4000)
    link = next((w for w in reversed(log.split()) if w.startswith("https://www.instagram.com/")), "")
    send(f"✅ Posted to Instagram\n{title_of(arg)}\n{link}\n{now}")
elif kind == "post_failed":
    send(f"❌ Post FAILED: {arg or 'unknown reel'}\n{now}\nError:\n{tail('logs/last-post-log.txt')}\n{run_link}")
elif kind == "render":
    done = tail("output/rendered.txt", 2000).split()
    if arg == "success":
        if done:
            send(f"🎬 Rendered and ready: {', '.join(done)}\n{now}\nhttps://github.com/{repo}/releases")
    else:
        err = "\n".join(l for l in tail("output/render-log.txt", 6000).splitlines() if any(k in l.lower() for k in ("error", "quota", "limit", "failed")))[-500:]
        send(f"⚠️ Render {arg}: done={done}\n{now}\n{err}\n{run_link}")
else:
    send(f"🔔 Telegram alerts are connected.\n{now}")
