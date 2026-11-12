# HANDOFF: AutoReel, two Instagram pages (read this first in a new chat)

Last updated: **Tue 3 Nov 2026, ~8 PM IST**. Repo: **`adhil-bit/insta-reel`** (private).
Older detail: `RUNBOOK.md`, `OPERATIONS.md`, `QUEUE.md`. Full chat transcripts: `/mnt/transcripts/` (see `journal.txt`).

---

## 1. Start of a new chat: what Claude needs

1. **A GitHub token** with repo + workflow access (the user pastes it; Claude saves it to `/home/claude/.ghtoken`, never into files or commits).
2. Clone: `git clone https://github.com/adhil-bit/insta-reel /tmp/ir`, and push with the header `AUTHORIZATION: basic base64(x-access-token:TOKEN)`.
3. Everything else (Instagram tokens, Gemini keys, Telegram, cron-job.org) lives in **GitHub Actions secrets**. Never print or commit secret values.

Secrets in use: `IG_ACCESS_TOKEN`, `IG_USER_ID` (page 1) · `IG_ACCESS_TOKEN_2`, `IG_USER_ID_2` (page 2) · `GEMINI_API_KEY`, `GEMINI_API_KEY_2` (fallback) · Telegram bot secrets · `CRONJOB_API_KEY` · YouTube `YT_*` (page 1 only).

---

## 2. The two pages

| | Page 1 | Page 2 |
|---|---|---|
| Handle | **@unexplored.truths** | **@kathayum.charithravum** (created 3 Nov 2026) |
| `IG_ACCOUNT` | `"1"` (default) | `"2"` |
| Focus | Mysteries, legends, "the real story behind…" | Kerala's people, places, food and history, as stories |
| On-screen text | English titles + Malayalam subtitles | **Everything in Malayalam** (brand, headlines, scene titles, chips) |
| Brand line on video | `UNEXPLORED TRUTHS · <CATEGORY>` | `കഥയും ചരിത്രവും · <Malayalam category>` |
| Posts per day | **2**: 7:07 AM + 8:07 PM (Sat/Sun 10:07 AM + 8:07 PM) | **1**: 1:07 PM (first post Tue 3 Nov) |
| History file | `history.json` | `history_2.json` |
| Job folders | `jobs/<slug>` | `jobs/k2-<slug>` (the `k2-` prefix routes everything to page 2) |
| YouTube cross-post | Yes | **Off** |
| Followers (3 Nov) | 119 (following 271, must go under 50) | 0, 2 posts |
| Token renewal | Before ~22 Dec 2026 (Telegram reminder 15 Dec) | Generated 3 Nov → **expires ~2 Jan 2027**. The user pasted it in chat, so **regenerate it soon** and update the secret |

**Never post the same reel on both pages** (duplicate content cuts reach on both). Each topic belongs to one page.

---

## 3. How the multi-account lane works

- `config.py`: `ACCOUNT = os.getenv("IG_ACCOUNT", "1")`. For `"2"` it swaps in `IG_USER_ID_2` / `IG_ACCESS_TOKEN_2`, uses `HISTORY_FILE = history_2.json`, sets `BRAND["name"] = "കഥയും ചരിത്രവും"` and `BRAND["category_labels"]` (HISTORY→ചരിത്രം, CULTURE→സംസ്കാരം, MYSTERY→രഹസ്യം, SCIENCE→ശാസ്ത്രം, NATURE→പ്രകൃതി, MYTH→ഐതിഹ്യം).
- `post-reel.yml` and `render-one.yml` take an input **`account`** (`"1"`/`"2"`). They set `IG_ACCOUNT`, `HISTORY_PATH` and expose the `_2` secrets. `scripts/save_history.sh` saves `$HISTORY_PATH`.
- `pipeline/explainer.py`: the brand and category come from config. On page 2, kicker and brand letter-spacing is 0 (letter-spacing breaks Malayalam).
- `pipeline/animate.py`: the animation template loads Inter, Baloo and Noto Malayalam, so canvas text can be Malayalam. Use `'800 40px Inter, Baloo, Noto'` in canvas fonts.
- `scripts/cron_oneoff.py`: a reel whose folder starts with `k2-` is posted with `account: "2"` automatically.
- `check-account-2.yml` writes `logs/account-2.json` (username, followers, media count) to verify page 2.

**To move a reel to page 2:** copy `jobs/<slug>` → `jobs/k2-<slug>`; in its `script.json` set `"account": "2"` and `"post_on": "2099-01-01"`; translate `headline`, `accent_words`, scene `caption` / `highlight` / `kicker` / `labels`, and the English strings inside `anim_*.js` to Malayalam; mark the page-1 entry `status: "moved"`; push; render with `account: "2"`.

---

## 4. Everyday operations (GitHub API calls)

```bash
T=$(cat /home/claude/.ghtoken); A="https://api.github.com/repos/adhil-bit/insta-reel"
# Render one job (page 2: add "account":"2")
curl -X POST -H "Authorization: Bearer $T" $A/actions/workflows/render-one.yml/dispatches -d '{"ref":"main","inputs":{"job":"SLUG","account":"1"}}'
# Post now
curl -X POST -H "Authorization: Bearer $T" $A/actions/workflows/post-reel.yml/dispatches -d '{"ref":"main","inputs":{"reel":"SLUG","action":"post","account":"1"}}'
# Exact-time trigger (IST). k2- reels go to page 2 automatically
curl -X POST -H "Authorization: Bearer $T" $A/actions/workflows/cron-oneoff.yml/dispatches -d '{"ref":"main","inputs":{"reel":"SLUG","when_ist":"2026-11-05 07:07"}}'
# Delete triggers whose title contains TEXT
curl -X POST -H "Authorization: Bearer $T" $A/actions/workflows/cron-oneoff.yml/dispatches -d '{"ref":"main","inputs":{"reel":"--delete","when_ist":"TEXT"}}'
# Stats (writes logs/stats.json + logs/followers.jsonl); sync cron-job.org after changing POST_SLOTS
curl -X POST -H "Authorization: Bearer $T" $A/actions/workflows/stats.yml/dispatches -d '{"ref":"main"}'
curl -X POST -H "Authorization: Bearer $T" $A/actions/workflows/cron-sync.yml/dispatches -d '{"ref":"main","inputs":{"apply":"true"}}'
# Real photos with licence credits (Wikipedia/Commons) → assets/<slug>/credits.json
curl -X POST -H "Authorization: Bearer $T" $A/actions/workflows/fetch-images.yml/dispatches -d '{"ref":"main","inputs":{"slug":"SLUG","titles":"Page A|Page B"}}'
```

**Gotchas learned the hard way:**
- **Never use `-w "@..."` in curl** (curl reads `@` as a file). Keep labels plain.
- Before **re-rendering** a slug: delete its GitHub release and tag, and remove its entry from the history file, or the render is skipped.
- Disable `render-jobs.yml` while pushing new jobs (then re-enable), so the scheduled render doesn't race you.
- `cron-sync` **no longer disables `insta-reel once …` triggers** (fixed 2 Nov). Still check `logs/cron-sync.json` → `disabled: []`.
- `SLOT_OVERRIDES` `["23:59"]` (sentinel) = regular checks quiet; posts come **only** from exact-time triggers. Set for **3–9 Nov**. From 10 Nov the default `POST_SLOTS` (2/day) applies to page 1, posting from the queue (only items without `post_on: 2099`).
- A duplicate guard stops double posts (it fired correctly when two triggers ran for porotta on 3 Nov).
- Single bash calls time out at 300 s: wait for renders in separate calls.

---

## 5. Schedule (triggers set ✅ / still to build 🛠)

| Day | @unexplored.truths | @kathayum.charithravum |
|---|---|---|
| Tue 3 | ✅ Photography Prohibited (posted 7:09 AM) · ✅ **Bigg Boss & Orwell's 1984, 8:07 PM** | ✅ Thathri (posted) · ✅ Porotta (posted 7:06 PM) |
| Wed 4 | ✅ 7:07 Silent Valley · ✅ 8:07 Pathinettam Koottam Part 5 | ✅ 1:07 PM Who owned Kerala's land? (`k2-janmi-kudiyan`) |
| Thu 5 | ✅ 7:07 Emden & Chempakaraman Pillai · ✅ 8:07 Beypore Part 2 | 🛠 Murickan, the Kayal King |
| Fri 6 | ✅ 7:07 Kalla Kothayi's treasure · 🛠 8:07 Vasco's empty grave | 🛠 Kolumban & the Idukki dam |
| Sat 7 | 🛠 10:07 Kayamkulam Kochunni · 🛠 8:07 The 1341 flood | 🛠 Keeleri Kunhikannan (circus) |
| Sun 8 | 🛠 10:07 Flood of '99 · 🛠 8:07 Chinese fishing nets | 🛠 Vizhinjam |
| Mon 9 | 🛠 7:07 Mullaperiyar's lease · 🛠 8:07 Kadamattathu Kathanar | 🛠 Kunjali Marakkar |
| Tue 10 | 🛠 7:07 Theyyam (reworked) | 🛠 Mavoor & the Chaliyar |
| Wed 11 | | 🛠 Plachimada |
| On hold | Padmanabhaswamy Vault B (user's call) · Endosulfan (discuss first) | |

Full editable plan: `topic-plan-both-pages.xlsx` (given to the user on 3 Nov). Build each day's reels **a day ahead**, research first, real photos/maps where possible, and send videos for review before setting triggers.

Dropped (moved to `jobs/_dropped/`): Kottayam literacy, Roopkund, Indus script, Iron Pillar, Lonar, Damascus steel, Malayalam palindrome, Neelakurinji, plus Petrichor, Technopark, Sikdar, Shakthan Thampuran, Chendamangalam, Odiyan, Kunnamkulam rework.

---

### Queued scripts (added Sat 7 Nov, 1 AM): not rendered yet
| Job | Story | Planned style | Note |
|---|---|---|---|
| plans/drafts/muniyara-dolmens | Muniyara dolmens, Marayoor | Manim + Three.js dolmen | facts marked VERIFY |
| plans/drafts/mananchira | Mananchira, Kozhikode | Retro collage + real photo | facts marked VERIFY |
| plans/drafts/overbury-folly | Overbury's Folly, Thalassery | Anidoodle | facts marked VERIFY |

## 6. House rules for every reel

- **Hook:** short (**under 10 words** in the v2 format), ends with a question or claim. Use **"നിങ്ങൾക്കറിയാമോ?"**; never "ഊഹിക്കില്ല".
- **v2 format (from 3 Nov):** about **30 s, so ≤ ~38 Malayalam words** at our narrator's pace; 4 beats; **motion in frame 1** (no still photo as the opening); a **debate or share line**; a loop ending.
- **Facts:** research first (`research.yml`, `fetch-images.yml`). Label legends, claims and theories clearly; give both sides on contested history (Tipu/Mysore, 1921, caste). Example correction: Tipu died in 1799, not 1792.
- **Images:** real photos only with an allowed licence, **credited on screen + in the caption**. No identifiable private people (crop to objects). **No show/brand logos or celebrity likenesses** (the user asked for the Bigg Boss logo; declined. Use the name in text plus "trademark of its owners · not affiliated").
- **Neutral visuals:** `SK.lamp` = kerosene lantern; `SK.nilavilakku` only for explicitly Hindu ritual stories.
- **Hashtags:** 5 topic tags, no generic ones (#malayalam, #unexploredtruths, #viral are filtered).
- **TTS:** if a word is mispronounced (e.g. "വിനോദമോ"), re-word it ("എന്റർടെയിൻമെന്റ് ഷോയാണോ") and write acronyms with dots ("ടി.ആർ.പി").
- **Spacing:** posts at least ~4 h apart on the same page.

---

## 7. What the data says (as of 3 Nov)

- Reels either stop at **~130–150 views** (Instagram's test group) or pass **1,000+**. The decider is **average watch: ≥10 s → hit, <8 s → stuck**.
- Ceiling ~2K because of **low completion (36–42%)** and **few shares (0.2–0.5% of reach)**. Hence v2: shorter, share line, loop.
- **Best time bands (IST):** mornings 6–10 AM (median 1,567), late morning, afternoon and night ~1,000–1,170; **4–7 PM weakest (217)**.
- Top reels: KGF 2,150 · Kalari 2,043 · Munnar 1,660 · Crows 1,393 · Manichitrathazhu 1,297 · Kola 1,251 · Kairali 1,251 · Lake Nyos 1,194 · Madras Presidency 1,172.
- World-science reels (Nyos, Kola) held best (15–18 s). Keep **1 world/science mystery per day** on page 1.
- Follow conversion ~0.3–0.5% of viewers (target 1–3%). Fixes: following < 50, series, one consistent narrator voice, the name change on 10 Nov.
- Instagram's API **doesn't give follows per reel**; the user must read them in the app (Reel → View insights → Profile activity).
- Reference page **@aimyshow** (444 followers from 5 posts): a numbered district series ("#2 KANNUR", 107K views), 3D satellite maps with objects, food + place, a meme moment, following 6.

---

## 8. Open items

- [User] Unfollow down to < 50 on page 1; pin Kalari, KGF, Madras Presidency; change the display name from **10 Nov**.
- [User] **Regenerate page 2's token** (it was pasted in chat) and give the new one to Claude for the `IG_ACCESS_TOKEN_2` secret.
- [User] Send a screenshot of **Professional dashboard → Total followers → Most active times** to tune the slots.
- [Claude] Build Thu–Wed topics a day ahead (table above); page 2 reels as `k2-` jobs in Malayalam.
- [Claude] Check Bigg Boss (first v2 reel) at the 3–4 h mark against older reels: completion %, shares, comments.
- [Claude] Optional: Remotion caption test (skills installed in `.claude/skills/remotion-*`); a district series ("#1 Kasaragod …") for page 2.
- Archived on page 1 (hidden, restorable): Mary Celeste, Two protests, Chandrayaan, Chundan Vallam, Thalassery cake, Jatinga, Theyyam. Kept: Kuttanad (first reel). Archive Kola/Kunnamkulam later only if needed.

---

## 9. Genre styles (from 5 Nov 2026): every reel uses a different look

Set `"theme"` in `script.json` and call `NB.use('<style>')` at the top of every `anim_*.js`. Kit: `NB` in `pipeline/lib/scenes.js`;
text themes in `pipeline/explainer.py` (`THEMES`). Keep drawings inside y 560–1380 (headline above, subtitles below).

| Style | `theme` / `NB.use` | Look | Use for |
|---|---|---|---|
| Notebook | `notebook` | Pen inks lines over a faint pencil ghost on cream paper, then washes | Food, everyday history |
| Ink-wash | `inkwash` | Tapered brush strokes, misty mountains (`NB.ridge`, `NB.mist`), red seal | Legends, folklore, ghosts |
| Retro collage | `retro` | Real photos as B/W torn cut-outs (`NB.cutout`), paper labels, clippings, halftone on red paper; text on cream strips | Colonial / maritime history with archive photos |
| Whiteboard | `whiteboard` | A hand draws with a blue marker on white | Explainers, laws, "how it works" |
| Manim | `manim` | Glowing lines on black, no pen | Science, numbers, maps |
| Cartoon | (no theme) | Existing flat SK scenes | Character stories |

Rules: frame 1 must already show the idea (ghost sketch or a photo cut-out at ≥55% opacity); never open on an empty page.

**Style map (upcoming):**
| When | Page | Reel | Style |
|---|---|---|---|
| Fri 6 · 7:07 AM | main | Kalla Kothayi's treasure (`kothayi-ink-v2`) | Ink-wash ✅ |
| Fri 6 · 1:07 PM | page 2 | Murickan, the Kayal King | Whiteboard (to build Fri morning) |
| Fri 6 · 8:07 PM | main | Kalari fire: tradition or show? (`kalari-fire`) | Cartoon + 3D map ✅ |
| Sat 7 · 10:07 AM | main | Beypore Part 2 (`beypore-2-collage`) | Retro collage ✅ |
| Sat 7 · 1:07 PM | page 2 | Kolumban & the Idukki dam | Ink-wash |
| Sat 7 · 8:07 PM | main | The 1341 flood that created Kochi | Manim (animated map) |
| Sun 8 · 10:07 AM | main | Kayamkulam Kochunni | Cartoon (CT fighter rig) |
| Sun 8 · 1:07 PM | page 2 | Keeleri Kunhikannan (circus) | Cartoon |
| Sun 8 · 8:07 PM | main | Who brought Kochi's Chinese nets? | Ink-wash |
| Mon 9 · 7:07 AM | main | Mullaperiyar's 999-year lease | Whiteboard |
| Mon 9 · 1:07 PM | page 2 | Vizhinjam | Manim |
| Mon 9 · 8:07 PM | main | Kadamattathu Kathanar | Cartoon |
| Tue 10 · 7:07 AM | main | Theyyam (reworked, costume details, no faces) | Retro collage |
| Tue 10 · 1:07 PM | page 2 | Kunjali Marakkar | Retro collage (public-domain engravings) |
| Wed 11 · 1:07 PM | page 2 | Mavoor & the Chaliyar | Notebook |
| Thu 12 · 1:07 PM | page 2 | Plachimada | Whiteboard |
| unscheduled | main | Vasco's empty grave | Retro collage |

**Session gotchas (5 Nov):** `gh` GraphQL is blocked here, so use `gh api` REST only (dispatch: `gh api -X POST repos/adhil-bit/insta-reel/actions/workflows/<wf>.yml/dispatches -f ref=main -f 'inputs[job]=…'`).
Releases can't be deleted from a Claude session, and a render skips any job that already has a release, so **re-render under a new slug** (e.g. `-v2`) and repoint the trigger
(delete by title text, then create). Trigger results show in the cron-oneoff job log (`scheduled:` / `deleted:` lines).
Done 5 Nov: `k2-christmas-cake-1883` (notebook, Thalassery cake reworked from the archived reel) posted to page 2.

## 10. Motion-flow rules (owner's standing instruction, 10 Nov 2026)

The owner asked that **future reels use the motion flows in `docs/design-refs/`** (a cinematic
Malayalam explainer page's editing breakdown + 5 worked designs). Style reference only: no other
page's watermark, name, hashtags or artwork. How to apply them in this pipeline:

1. **Constant slow movement, few cuts.** Every scene has a slow push-in, pan or parallax
   (3–5 layers moving at different speeds). No static frames. Prefer one continuous camera
   idea across the reel (descent, fly-through, pan along a landscape) over unrelated scenes.
2. **Colour tells the story.** Pick a palette arc (bright/safe → dark/danger, day → night,
   turquoise → black) and **one accent colour** per reel (e.g. rescue red, lamp gold).
3. **One overlay layer across all scenes** (rain, stars, fog, dust, marine snow) so cuts feel seamless.
4. **History/real events open with a date/place stamp** in the first second ("1721 · അഞ്ചുതെങ്ങ്").
5. **Voice leads.** Change the visual when the narration changes idea, not to a beat.
6. **Sound plan on every reel** (`sound_plan` in script.json, pipeline/story_sound.py):
   ambience bed + a moment of silence before the big reveal + one signature hit (rumble, gong, chime).
7. **Template:** 0–3 s hook (strongest visual + question) · 3–10 s setup (slow push-in) ·
   10–40 s one visual per idea, a diagram in the same art style, an everyday analogy ·
   last 10 s payoff (most beautiful shot) + ending (loop zoom / "Part 2" / question CTA).
8. **Long topics become a series** (Part 1/2/3, same title and cover layout).
9. **Real tragedies:** respectful tone, no dramatised deaths or victims' faces, official numbers only.
10. Keep our proven rules on top: stakes in the first 3 s, 30–45 s length, North Malabar local
    stories share best, Despina voice.
11. **Owner rule (12 Nov 2026): ONE post per day, MORNING ONLY (7:04 AM IST), on both pages. No evening posts.**

### Plan agreed 10 Nov 2026
@unexplored.truths, 7:05 PM daily: Wed 11 konnal-papam-v2 (proverb) · Thu 12 ambalappuzha-chess (rendered, scheduled) ·
Fri 13 7:04 AM cyber-teacher-hacker-v2 · Sat 14 7:04 AM Dharmadam Island · then Muziris, St. Angelo (mornings).
(Thalassery circus posted on page 2, 12 Nov.)
കഥയും ചരിത്രവും (owner approves each video before posting): Thalassery, cradle of Indian circus (Keeleri Kunhikannan) ·
Pazhassi Raja's last stand (1805) · 3-part series Muziris → 1341 flood → birth of Kochi (owner OK'd overlap with the main-page Muziris reel this once).
Topics came from Claude's own knowledge (no web search available): fact-check every script; soft wording for legends.
