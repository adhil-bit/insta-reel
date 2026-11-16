# Reel video generation guide (video only, manual posting)

Use this if your Claude credits run out and you continue from **another Claude account**.
It covers making the videos only. **You post them yourself** in the Instagram app.

---

## 1. What you need

1. **GitHub access to the repo `adhil-bit/insta-reel`** for the new account.
   - The repo is private. Either sign in to the same GitHub account (`adhil-bit`), or add the new account as a collaborator: GitHub → repo → Settings → Collaborators.
   - In the new Claude session, attach / connect the repo (Claude Code on the web: add the repository to the session).
2. **Nothing else.** The voice keys (Gemini) and Instagram tokens are stored as GitHub Actions secrets, so videos render on GitHub's servers. No keys have to be shared with the new account.

---

## 2. Paste this as your first message in the new Claude session

> You are continuing an existing Instagram Reels project. Repo: `adhil-bit/insta-reel` (private, attach it).
> Read these files first, in this order:
> `docs/VIDEO-ONLY-GUIDE.md`, `HANDOFF.md`, `docs/1k-playbook.md`, `docs/design-system.md`, `docs/design-refs/00-editing-breakdown.md`.
> I only need **videos**. **Never post or schedule anything**: I post manually.
> For each reel: write `jobs/<slug>/script.json` + `anim_0.js … anim_5.js` (copy the structure of `jobs/st-angelo-sold-v4` for @unexplored.truths, `jobs/k2-gundert-1847-v2` for @kathayum.charithravum), preview with `python3 tools/preview.py jobs/<slug> /tmp/sheet.jpg` and look at the sheet, fix problems, then push and render with the `render-one.yml` workflow, download `reel.mp4` + `cover.jpg` from the GitHub release named after the slug, check the cover, and send me both files plus the caption text from `caption.txt`.
> Today's topic: **<write the topic here>** for **<@unexplored.truths or @kathayum.charithravum>**.

---

## 3. The two pages

| | @unexplored.truths (account **1**) | @kathayum.charithravum (account **2**) |
|---|---|---|
| Folder name | `jobs/<slug>` | `jobs/k2-<slug>` (**must** start with `k2-`) |
| Render with | `account=1` | `account=2` |
| Look | dark cinematic (dusk, night, sea) | ink-wash paper (`"theme": "inkwash"`, `"account": "2"`) |
| On-screen text | Malayalam captions (English only as small kicker) | Malayalam only |
| Post time (manual) | **7:04 AM** | **8:04 AM** |
| Template job | `jobs/st-angelo-sold-v4`, `jobs/pala-yakshi-tree` | `jobs/k2-gundert-1847-v2`, `jobs/k2-1341-kochi-v4` |

Rules: **one reel per page per day, mornings only. Never archive a reel in its first 7 days. Never repeat a topic** (check the titles in `logs/stats.json`).

---

## 4. Step by step (what Claude runs)

```bash
cd insta-reel && git pull -q origin main
# 1) write jobs/<slug>/script.json and anim_0.js … anim_5.js (copy a template job folder first)
cp -r jobs/st-angelo-sold-v4 jobs/<slug>        # page 1   |  cp -r jobs/k2-gundert-1847-v2 jobs/k2-<slug>  # page 2

# 2) preview: 6 scenes × 3 frames; every line must say errors: []
python3 tools/preview.py jobs/<slug> /tmp/sheet.jpg

# 3) push WITHOUT the auto-renderer running (it is paused around every push)
R=repos/adhil-bit/insta-reel/actions/workflows
gh api -X PUT $R/render-jobs.yml/disable
git add jobs/<slug> && git commit -m "Add <slug>" && git pull --rebase origin main && git push origin HEAD:main
gh api -X PUT $R/render-jobs.yml/enable

# 4) render on GitHub (≈ 4–5 min)
gh api -X POST $R/render-one.yml/dispatches -f ref=main -f inputs[job]=<slug> -f inputs[account]=1
sleep 15; id=$(gh run list -R adhil-bit/insta-reel -w render-one.yml -L 1 --json databaseId -q '.[0].databaseId')
gh run watch $id -R adhil-bit/insta-reel --exit-status

# 5) download the video, cover and caption from the release named <slug>
for f in reel.mp4 cover.jpg caption.txt; do
  i=$(gh api repos/adhil-bit/insta-reel/releases/tags/<slug> --jq ".assets[]|select(.name==\"$f\")|.id")
  gh api repos/adhil-bit/insta-reel/releases/assets/$i -H "Accept: application/octet-stream" > $f
done
```

- `"post_on": "2099-01-01"` stays in every script.json so **nothing posts automatically**.
- **Voice limit:** Gemini allows about 6–8 renders a day. It resets at **1:30 PM IST**. If a render fails with *quota / RESOURCE_EXHAUSTED*, start it with a delay instead: add `-f inputs[wait_until_utc]=08:05` to the dispatch (it waits and renders right after the reset).
- **A release can't be overwritten.** To fix a reel, copy the folder to `<slug>-v2`, change it, render the new slug.
- Right after a render finishes, the release can show 404 for a minute; wait and download again.

---

## 5. script.json (the fields that matter)

```json
{
  "priority": 0, "post_on": "2099-01-01", "template": "explainer", "opening": {"type": "hero"},
  "voice_lock": "Despina", "category": "HISTORY",
  "topic": {"title": "...", "key_facts": ["..."], "sources": ["..."]},
  "headline": ["ENGLISH", "TITLE."], "accent_words": ["TITLE."],
  "thumbnail_ml": "Cover line in Malayalam with the twist?", "thumbnail_accent": ["twist-word"],
  "hook_voiceover": "≤ 2.5 s: a known name + a twist + an open question",
  "scenes": [
    {"voiceover": "...", "caption": "≤ 4 words", "highlight": "one word", "kicker": "SMALL LINE", "labels": [], "visual": ""}
  ],
  "instagram_caption": "...", "search_ml": ["..."], "hashtags": ["..."],
  "series": "കണ്ണൂർ രഹസ്യങ്ങൾ #1",
  "pin": {"scene": 1, "town": "പയ്യന്നൂർ", "x": 540, "y": 980},
  "twist_scene": 3,
  "cine": {"overlay": "dust"},
  "sound_plan": {"drone": "C", "layers": [{"type": "heartbeat", "clip": 0, "at": 0.0, "count": 3},
                                          {"type": "gong", "clip": 5, "at": 0.1, "f": 196}]}
}
```

- 5 scenes + the hook = 6 animations (`anim_0.js` = hook … `anim_5.js` = last scene).
- **Total voice ≤ 500 Malayalam characters** (≈ 40 s).
- Page 2 adds `"account": "2", "theme": "inkwash"`; captions/headline in Malayalam.
- `cine.overlay`: `dust`, `embers`, `rain`, `fog`, `stars` (dark) or `ink` (paper).
- `sound_plan` layer types: `river`, `crickets`, `shimmer`, `heartbeat`, `rumble`, `gong` (`clip` = scene index, 0 = hook; `at` = 0–1 position in that clip).

---

## 6. Scene files (anim_N.js)

Each file draws one scene on a 1080×1920 canvas. Globals: `W`, `H`, `DURATION`, `makeCanvas()`.
Minimum shape:

```js
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) {          // t = seconds into this scene (0 … DURATION)
  // draw everything for time t - never use Math.random() here (use a seeded generator)
};
```

- Copy the drawing kit (`const Z = …` / `const T = …`) from the top of a template job's `anim_0.js`.
- The pipeline adds automatically: camera moves, punch-ins, overlay, grain, colour grade, flash on `twist_scene`, letterbox on the payoff, series badge, map pin, text safety.
- Optional depth: draw inside `CINE.layer(depth, () => { … })` with depths sky 0.1, far 0.25, mid 0.5, hero 1.0, foreground 1.8.

---

## 7. The rules that decide 1K+ views (short version)

**Hook (first 2 s):** frame 1 = strongest image + question on screen (no fade-in, no map).
The first spoken line names a place Malayalis know + a twist + an open question, answered only near the end.

**Flow (35–45 s):** hook → why it matters → 3 reveals (a new turn every 5–7 s) → the answer → "comment + tag a friend from <place>".

**Look:** main subject ≥ 40% of frame height; foreground in the bottom third (no empty ground); a different shot size every scene; Malayalam captions ≤ 4 words; the payoff = brightest, widest shot, held 1.5 s without text.

**Shares decide virality.** Hits were hyper-local and made people proud (Payyanur, Kannur). Put the town on the cover, run series (#1, #2…), add a mid-reel line like "ഇത് പയ്യന്നൂരുകാർക്ക് പോലും അറിയില്ല, അയച്ചു കൊടുക്കൂ".

**Facts:** label legends as legends ("എന്നാണ് വിശ്വാസം"), leave out anything uncertain, no victims' names in news topics, respectful with faith practices, no other pages' watermarks/artwork, no celebrity photos or brand logos.

Full details: `docs/1k-playbook.md`, `docs/design-system.md`, `HANDOFF.md`.

---

## 8. Checking the result before you post

- Watch the whole reel once. Check: the voice matches the text, nothing is cut off at the edges, nothing overlaps the cover headline.
- `cover.jpg`: the headline is readable and no picture element sits on top of the text. If it does, fix the hook scene (`anim_0.js`) and render `<slug>-v2`.
- Post: upload `reel.mp4`, choose **cover.jpg** as the cover (Instagram → Edit cover → Add from camera roll), paste `caption.txt`, add the location (Kerala / the town), post at 7:04 AM (page 1) or 8:04 AM (page 2).

---

## 9. Topic queue (week of 17 Nov 2026, not yet built)

**@unexplored.truths – "കണ്ണൂർ രഹസ്യങ്ങൾ" series**

| # | Topic | Hook idea |
|---|---|---|
| 1 | Payyanur salt satyagraha 1930 | "ദണ്ഡിയിലെ ഉപ്പ്, കേരളത്തിൽ കുറുക്കിയത് പയ്യന്നൂരിൽ!" |
| 2 | Marco Polo saw Ezhimala ("Kingdom of Eli") | "700 വർഷം മുമ്പ് മാർക്കോ പോളോ ഏഴിമലയെ കുറിച്ച് എഴുതിയത്…" |
| 3 | Madayipara "Jootha Kulam" | "കണ്ണൂരിലെ ഒരു കുന്നിൽ ജൂതന്മാരുടെ കുളം?" |
| 4 | Payyanur Pavithra Mothiram | "ലോകത്ത് പയ്യന്നൂരിൽ മാത്രം ഉണ്ടാക്കുന്ന മോതിരം" |
| 5 | Thalassery biriyani | "തലശ്ശേരിയോ കോഴിക്കോടോ?" (debate) |
| 6 | Arakkal Beevi | "കേരളത്തിലെ ഏക മുസ്ലിം രാജവംശം ഭരിച്ചത് ഒരു രാജ്ഞി!" |

**@kathayum.charithravum:** Kunjali Marakkar · Battle of Colachel 1741 · Vaikom Satyagraha 1924 · Kayyur revolt 1941 · Malayali Memorial 1891 · Temple Entry Proclamation 1936.

---

## 10. If something breaks

| Problem | Fix |
|---|---|
| Render fails: quota / RESOURCE_EXHAUSTED | Re-run after 1:30 PM IST, or dispatch with `inputs[wait_until_utc]=08:05` |
| Preview shows `errors: [...]` | A JavaScript error in that anim file - fix it before pushing |
| Page-2 reel shows "UNEXPLORED TRUTHS" branding | Folder must start with `k2-`, script has `"account": "2"`, render with `account=2` |
| Release 404 right after render | Wait 1–2 minutes and download again |
| Need to change a rendered reel | New folder `<slug>-v2`, render again (releases can't be overwritten) |
| Git push rejected | `git pull --rebase origin main` then push again |
