#!/usr/bin/env bash
# Send a Telegram message (needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID). Never fails the workflow.
if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then echo "Telegram not configured"; exit 0; fi
curl -s -o /dev/null -w "telegram: %{http_code}\n" -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" --data-urlencode "text=$1" || true
