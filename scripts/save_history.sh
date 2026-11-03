#!/usr/bin/env bash
# Commit history.json safely even if another workflow changed it meanwhile.
set -e
MSG="${1:-update history}"
git config user.name "autoreel-bot"
git config user.email "autoreel-bot@users.noreply.github.com"
HIST="${HISTORY_PATH:-history.json}"
cp "$HIST" /tmp/local-history.json 2>/dev/null || echo "[]" > /tmp/local-history.json
mkdir -p /tmp/keep && cp -r logs /tmp/keep/ 2>/dev/null || true
for i in 1 2 3; do
  git fetch -q origin main && git reset -q --hard origin/main
  python main.py merge-history /tmp/local-history.json
  python main.py queue-md > /dev/null || true
  cp -r /tmp/keep/logs . 2>/dev/null || true
  git add "$HIST" QUEUE.md logs 2>/dev/null || true
  git commit -q -m "$MSG" || exit 0
  git push -q && exit 0
  sleep 5
done
exit 1
