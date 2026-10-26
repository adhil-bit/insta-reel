#!/usr/bin/env bash
# Finds chat ids that have talked to the bot and sends a status test message.
mkdir -p logs
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates" > /tmp/updates.json
python3 - << 'PY'
import json
d = json.load(open("/tmp/updates.json")); ids = {}
for u in d.get("result", []):
    for k in ("message", "my_chat_member", "channel_post", "edited_message"):
        if k in u and "chat" in u[k]:
            c = u[k]["chat"]; ids[str(c["id"])] = c.get("title") or c.get("first_name", "")
json.dump({"chat_ids": ids}, open("logs/telegram.json", "w"), indent=2); print("chats:", ids)
PY
if [ -n "$TELEGRAM_CHAT_ID" ]; then
  STATUS=$(python3 scripts/status.py)
  MSG=$(printf '🔔 Test from the reel pipeline (@unexplored.truths)\n%s' "$STATUS")
  bash scripts/notify.sh "$MSG"
fi
