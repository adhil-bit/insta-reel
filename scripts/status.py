"""One-line-per-item pipeline status for Telegram."""
import json
h = json.load(open("history.json"))
posted = [e for e in h if e["status"] == "posted"]
pending = sorted([e for e in h if e["status"] == "pending"], key=lambda e: e.get("priority", 999))
print(f"Posted so far: {len(posted)}")
print(f"Waiting in queue: {len(pending)}")
print("Next up: " + ", ".join(e.get("title", e["folder"]) for e in pending[:3]))
