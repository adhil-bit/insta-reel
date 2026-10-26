# RUNBOOK: @unexplored.truths automated Reels pipeline

Everything you need to run, fix and rebuild this system without the original chat.
Last updated: 27 Oct 2026. Keep this file current whenever something changes.

> Related files in this repo: **OPERATIONS.md** (rules for posting times), **QUEUE.md** (live posting order,
> auto-updated), **plans/SPEC.md** (design-plan format), **instagram/voice.md** and **youtube/voice.md**
> (channel voice for the agent skills).

---

## 1. What this is

A fully automated Malayalam explainer page on Instagram (**@unexplored.truths**). Reels are animated
illustrations (no AI images, no faces) with Malayalam narration, English headlines and Malayalam subtitles.
It posts **3 reels a day** with no manual work, and reports every post and render to Telegram.

```
 PLAN            BUILD              VOICE + RENDER           POST                    REPORT
 Claude Fable -> Claude Opus    ->  GitHub Actions        -> cron-job.org triggers -> Telegram group
 plans/*.json    jobs/<slug>/       (daily ~12:50 PM IST,    post-reel.yml at each    "Adl and insta-reel"
 (locked)        script.json +      max 4 reels, Gemini      slot; Instagram API      ✅ posted / ❌ failed
                 anim_*.js          voices) -> Releases      publishes the reel       🎬 rendered / ⚠️ failed
```

---

## 2. Accounts and services (what each one does)

| Service | Used for | Where it lives |
|---|---|---|
| **GitHub** `adhil-bit/insta-reel` (private) | Code, jobs, renders (Actions), finished videos (Releases) | github.com/adhil-bit/insta-reel |
| **Instagram** @unexplored.truths (Creator account) | Where reels are posted | Instagram app |
| **Meta app "Reel tester"** (App ID 1521657249782448) | Instagram API with Instagram Login (posting) | developers.facebook.com |
| **Google AI Studio (Gemini API)** | Narration voices (free tier ≈ 15 voice requests/day) | aistudio.google.com |
| **cron-job.org** | Fires the posting workflow on schedule (GitHub's own timer is unreliable) | console.cron-job.org |
| **Telegram bot** `@insta_reel_post_bot` | Alerts to the group "Adl and insta-reel" | t.me/insta_reel_post_bot |
| **Claude** (Fable 5.1 plans, Opus 5.5 builds) | Topic research, scripts, design plans, animation code | claude.ai |
| ElevenLabs | Old voice provider, **not used** any more | — |
| Google Cloud (YouTube) | YouTube Shorts upload: **paused**, code is ready | console.cloud.google.com |

### GitHub Actions secrets (Settings → Secrets and variables → Actions)
Names only, never paste values into files or chats you don't control.

| Secret | Purpose | Status |
|---|---|---|
| `IG_ACCESS_TOKEN` | Instagram posting token | ✅ set · **expires ~22 Dec 2026** (see §8) |
| `IG_USER_ID` | Instagram account id | ✅ set |
| `GEMINI_API_KEY` | Gemini voices | ✅ set |
| `TELEGRAM_BOT_TOKEN` | Telegram alerts | ✅ set |
| `TELEGRAM_CHAT_ID` | The group (-5581267888) | ✅ set |
| `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` | Old voices | set, unused |
| `ANTHROPIC_API_KEY` | Only for automatic batches without chat (`auto-batch.yml`) | not set (optional, paid) |
| `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN` | YouTube Shorts | not set (paused) |

### Tokens to know about
- **cron-trigger** (GitHub fine-grained token, only "Actions: read & write" on this repo): stored inside the
  cron-job.org jobs. If it expires, create a new one and paste it into each cron-job.org job header.
- **The classic GitHub token used during setup has full account access. Revoke it** at
  github.com/settings/tokens. For future Claude sessions, create a new **fine-grained** token for this repo
  only (Contents: read & write, Actions: read & write, Secrets: read & write) and give it to Claude.

---

## 3. Repository map

| Path | What it is |
|---|---|
| `main.py` | Command line: `render`, `render-pending`, `post`, `next`, `due`, `queue-md`, `cron-plan`, `skip`, `list`… |
| `config.py` | All settings: brand, categories, voices, posting slots, limits (see §5) |
| `pipeline/` | `animate.py` (renders animations), `explainer.py` (reel design: headlines, subtitles, pins, globe), `media.py` (voices), `video.py` + `sound.py` (assembly, music), `endcard.py`, `instagram.py`, `claude.py` (planner prompts), `youtube.py` |
| `plans/<slug>.json` | **Locked design plans** written by Fable (format: `plans/SPEC.md`) |
| `jobs/<slug>/` | What gets built: `script.json` (narration, captions, labels…) + `anim_0..5.js` (one animation per scene) |
| `history.json` | The queue: every reel with status `pending` / `posted` / `skipped`, voice, priority |
| `QUEUE.md` | Human-readable posting order, refreshed after every render and post |
| `OPERATIONS.md` | Rules that must not be broken (posting times ↔ cron-job.org) |
| `.claude/skills/` | Installed agent skills: 13 `ig-*` (Instagram) and 11 `yt-*` (YouTube), MIT licensed |
| `scripts/` | `plan_to_job.py`, `notify.sh` (Telegram), `status.py`, `save_history.sh`, `telegram_setup.sh` |
| `fonts/`, `vendor/` | Fonts (Noto Malayalam, Baloo Chettan 2, Archivo, Inter…), three.js, Earth texture |

### Workflows (`.github/workflows/`)
| Workflow | When it runs | What it does |
|---|---|---|
| `post-reel.yml` | **Only** when cron-job.org calls it (`action: auto`), or manually | Posts the next due reel, alerts Telegram |
| `render-jobs.yml` | Daily **07:20 UTC (12:50 PM IST)**, on pushes to `jobs/`, or manually | Voices + renders up to 4 unrendered reels → Releases |
| `render-one.yml` | Manually (input: job folder) | Renders one reel immediately, in parallel |
| `telegram-setup.yml` | Manually | Finds chat ids and sends a test/status message |
| `voice-test.yml` | Manually (input: voice names) | Makes voice samples into `logs/voices/` (uses Gemini allowance) |
| `check-instagram.yml` | Manually | Read-only check that the Instagram token works |
| `auto-batch.yml` | Nightly, only if `ANTHROPIC_API_KEY` is set | Plans + writes new reels without a chat (paid) |

---

## 4. The daily flow (what happens automatically)

1. **~12:50 PM IST, render run.** Picks the **4 most urgent** unrendered reels (date-locked reels due within
   2 days first, then by `priority`), records each narration in **one Gemini request**, builds the video,
   uploads it to **Releases**, adds it to `history.json` as `pending`, refreshes `QUEUE.md`, alerts Telegram.
   If Gemini's daily allowance is used up, the reel simply waits for tomorrow's run (no fallback voice).
2. **At each posting slot, post run.** cron-job.org calls `post-reel.yml`. It checks a slot is due, picks the
   next `pending` reel (dated reels on their date first, then lowest `priority`, then oldest), downloads it from
   Releases, posts to Instagram with its cover, marks it `posted`, alerts Telegram.
3. Nothing else is needed. You only step in for new batches, approvals and the token renewal.

---

## 5. Current settings (config.py)

**Posting schedule (IST)**, 3 a day, posts land ~:07–:10

| Days | Times | cron-job.org job (UTC, minute 37) |
|---|---|---|
| Mon + Fri | 6:07 AM · 12:07 PM · 4:07 PM | hours 0, 6, 10 |
| Tue + Thu | 7:07 AM · 1:07 PM · 5:07 PM | hours 1, 7, 11 |
| Wed | 8:07 AM · 2:07 PM · 7:07 PM | hours 2, 8, 13 |
| Sat + Sun | 10:07 AM · 2:07 PM · 8:07 PM | hours 4, 8, 14 |

Every cron-job.org job: **POST** `https://api.github.com/repos/adhil-bit/insta-reel/actions/workflows/post-reel.yml/dispatches`,
headers `Authorization: Bearer <cron-trigger token>` and `Accept: application/vnd.github+json`,
body `{"ref":"main","inputs":{"reel":"","action":"auto"}}`, time zone UTC. Test run must return **204**.

| Setting | Value |
|---|---|
| Voices (Gemini, alternate male/female) | **Charon, Enceladus, Puck** (male) · **Despina, Callirrhoe, Zephyr** (female). Midhun/Sobhana are **not** used. A reel can force one with `"voice_lock"`. |
| `RENDER_LIMIT` | 4 reels per render run (just-in-time voicing) |
| `TARGET_SECONDS` | 35 s per reel (narration ≈ 60 Malayalam words) |
| Template | `explainer`: full-screen visuals, English headline pops in per scene, word-by-word Malayalam subtitles, labelled pins, mid-scene punch-in, 2 s follow card |
| Opening | `hero` by default; `globe` (3D globe zooms to the place) **only** when the location itself is the surprise |
| `PLANNER_MODEL` | `claude-fable-5-1` (used only by the paid auto-batch) |

---

## 6. How to do common tasks

### Make the next batch (with Claude in chat)
1. Open a new Claude chat, switch the model to **Claude Fable 5.1**, give it a fine-grained GitHub token, and paste:
   > Read RUNBOOK.md, OPERATIONS.md, QUEUE.md and plans/SPEC.md in github.com/adhil-bit/insta-reel.
   > Plan the next 6 reels from the World Topic Bank / new hidden-place mysteries (Kerala or India link where
   > possible). Score 3 hooks each with `.claude/skills/ig-reel/hookscore.py` (winner must be 55+), write
   > locked plans in plans/ following SPEC.md (≈35 s, loop line, globe only where location matters), give
   > them the next priority numbers after the current queue, and push. Don't write animation code.
2. Switch the chat to **Claude Opus 5.5** and say: *"Read RUNBOOK.md, then build the locked plans."*
   It converts each plan with `python scripts/plan_to_job.py <slug>`, writes `anim_0..5.js` from the build
   commands, previews them and pushes. Voicing happens automatically, 4 per day.

### Check what's coming
Open **QUEUE.md** on GitHub, or watch the Telegram group.

### Change the posting order
Edit `"priority"` (lower = sooner) in `jobs/<slug>/script.json` **and** the same reel's entry in `history.json`.

### Hold a reel until you approve it
Add `"post_on": "2099-01-01"` to its `script.json` and `history.json` entry. Remove it to release.
For a festival, set the real date (e.g. `"post_on": "2026-11-01"`); it posts first on that day.

### Remove a reel for good
Set its `history.json` status to `"skipped"` (or run `python main.py skip <slug>`).

### Re-render a reel (after a script change)
Delete its **Release** (and tag) on GitHub, remove its entry from `history.json`, push. The next render run
rebuilds it (or run `render-one.yml` with the folder name to do it now).

### Post something right now
Actions → **Post reel** → Run workflow → action `post` (optionally give a folder name).

### Change posting times
Follow **OPERATIONS.md**: edit `POST_SLOTS` in config.py, run `python main.py cron-plan`, then update the
cron-job.org jobs to match. One-off change for a single date: `SLOT_OVERRIDES` in config.py (and make sure a
cron-job.org run happens at that time).

### Try new voices
Actions → **Voice test** → voices `Iapetus,Gacrux` (uses that day's Gemini allowance, so test 2–4 at a time).
Samples appear in `logs/voices/`.

---

## 7. Content rules (what works on this page)

- **Winning topic type:** surprising, little-known places/objects with a secret ("lost railway", "town the sea
  took", "mirror without glass"): 1.3–1.7K views. **Avoid** stories Malayalis already know (Nehru Trophy,
  Chandrayaan, Thalassery cake): ~130–140 views.
- **Hook:** score 3 options with `/ig-reel` (hookscore.py); use the winner (55+). Speak to "you", keep the answer
  hidden.
- **Length** ~35 s, **5 scenes**, no shot longer than ~4 s, **last line echoes the hook** (loop).
- **Caption:** first line < 60 characters with a name or number; one ask only: *"Share this with someone from …"*
  (the posting step converts "Send this to" automatically); 4–6 hashtags at the end.
- **Facts:** every number/date/"first" must be in the reel's fact list with a source; legends are "it is said".
  Check the fact list on the Release page before sensitive topics (temples, politics) post.
- No real faces, no gore, no brand logos or copyrighted characters.

---

## 8. Maintenance calendar

| When | Task | How |
|---|---|---|
| **Before ~22 Dec 2026** (every ~60 days) | **Renew the Instagram token** | developers.facebook.com → app "Reel tester" → Instagram → API setup with Instagram login → Generate token for @unexplored.truths → copy → GitHub secret `IG_ACCESS_TOKEN`. Then run **Check Instagram** workflow. (A long-lived token can also be refreshed via `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=<token>`; ask Claude to automate this monthly.) |
| Weekly | Look at Insights; tell Claude which reels won/lost | Keeps topic choice sharp |
| Every 2–3 days | Make sure ≥ 6 reels are planned ahead | Otherwise the queue runs dry (Telegram goes quiet) |
| Monthly | GitHub Actions minutes | Settings → Billing. Expected ~800 of 2,000 free minutes |
| When it expires | cron-trigger token | New fine-grained token → update the 4 cron-job.org jobs |

---

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No post and **no** Telegram message at a slot | cron-job.org didn't fire (job disabled, token expired) | console.cron-job.org → check job history → Test run must be 204 |
| ❌ "Post FAILED" in Telegram | Instagram token expired / API error | Renew token (§8), then Actions → Post reel → run `post` |
| ⚠️ Render failed: "daily voice limit" | Gemini free allowance used up | Nothing: it retries in the next daily run. Avoid voice tests on busy days |
| Queue empty (QUEUE.md has no rows) | No new batch planned | Make the next batch (§6) |
| A reel posted with wrong voice/design | It was rendered before a change | Re-render it (§6) before its slot |
| Post run "cancelled" | Someone pressed Cancel while it waited for its slot | Next scheduled run catches up |
| Workflow shows a YAML error | A bad edit in `.github/workflows/*.yml` | Revert the last change to that file |

---

## 10. Starting over in a new Claude chat

1. Create a fine-grained GitHub token for `adhil-bit/insta-reel` (see §2) and paste it in the chat.
2. Say: *"Read RUNBOOK.md, OPERATIONS.md and QUEUE.md in github.com/adhil-bit/insta-reel and continue
   running the page. Today I want to …"*
3. Claude can clone the repo, check runs, edit jobs and push. It cannot log in to Instagram, Meta,
   cron-job.org or Google for you; those steps are yours (or use Claude in Chrome).

## 11. Paused / optional

- **YouTube Shorts:** upload code is ready (`pipeline/youtube.py`, step in `post-reel.yml`). Needs a Google Cloud
  OAuth client + refresh token saved as `YT_*` secrets; the setup stopped at the Branding/Publish step.
- **Automatic batches without chat:** add `ANTHROPIC_API_KEY`; `auto-batch.yml` then plans nightly (paid).
- **Facebook Reels:** link Instagram to a Facebook Page in Accounts Center to auto-share every reel.
