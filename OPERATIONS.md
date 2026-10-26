# Operating rules (read this before changing anything)

## Rule 1: posting times live in TWO places and must always match

1. `config.py` → `POST_SLOTS` (IST, set 1 minute before each post time, e.g. `"06:06"` for a 6:07 post)
2. **cron-job.org** jobs that trigger `post-reel.yml` with `{"action": "auto"}` (these are the ONLY trigger;
   GitHub has no posting timer of its own, so nothing posts unless cron-job.org fires)

**Whenever the posting times change, update both in the same change.**
After editing `POST_SLOTS`, run:

```
python main.py cron-plan
```

It prints the exact cron-job.org jobs (UTC) for the new table. Replace the cron-job.org jobs with that
list (one job per group of days that share the same times), delete any job that no longer matches, and
do a Test run (expect HTTP 204). Then confirm a Telegram "posted" alert arrives at the next slot.

### Current schedule (keep this section updated)

| Days | Post times (IST) | cron-job.org (UTC, minute 37) |
|---|---|---|
| Mon + Fri | 6:07 AM · 12:07 PM · 4:07 PM | hours 0, 6, 10 |
| Tue + Thu | 7:07 AM · 1:07 PM · 5:07 PM | hours 1, 7, 11 |
| Wed | 8:07 AM · 2:07 PM · 7:07 PM | hours 2, 8, 13 |
| Sat + Sun | 10:07 AM · 2:07 PM · 8:07 PM | hours 4, 8, 14 |

cron-job.org job settings (same for every job): POST
`https://api.github.com/repos/adhil-bit/insta-reel/actions/workflows/post-reel.yml/dispatches`,
headers `Authorization: Bearer <cron-trigger token>` and `Accept: application/vnd.github+json`,
body `{"ref":"main","inputs":{"reel":"","action":"auto"}}`, time zone UTC.

## Rule 2: one-off changes
For a single day, use `SLOT_OVERRIDES` in `config.py`, and make sure a cron-job.org run exists at
(or just after) the new time, otherwise nothing fires.

## Rule 3: alerts
Every post, failed post and render is reported to the Telegram group "Adl and insta-reel".
Cancelled runs and runs that never start are NOT reported.
