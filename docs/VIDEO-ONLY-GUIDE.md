# Reel video generation guide (video only, manual posting)

Use this if your Claude credits run out and you continue from **another Claude account**.
It covers making the videos only. **You post them yourself** in the Instagram app.
Last updated: 20 Nov 2026.

---

## 1. What you need

1. **GitHub access to the repo `adhil-bit/insta-reel`** for the new account.
   - The repo is private. Either sign in to the same GitHub account (`adhil-bit`), or add the new account as a collaborator: GitHub → repo → Settings → Collaborators.
   - In the new Claude session, attach / connect the repo (Claude Code on the web: add the repository to the session).
2. **Nothing else.** The voice keys (Gemini) and Instagram tokens are GitHub Actions secrets, so videos render on GitHub's servers. No keys have to be shared.

---

## 2. Paste this as your first message in the new Claude session

> You are continuing an existing Instagram Reels project. Repo: `adhil-bit/insta-reel` (private, attach it).
> Read these files first, in this order:
> `docs/VIDEO-ONLY-GUIDE.md`, `HANDOFF.md`, `docs/1k-playbook.md`, `docs/design-methods.md`, `docs/design-refs/06-naadu-methodology.md`.
> I only need **videos**. **Never post or schedule anything**: I post manually.
> **Never reuse the previous reel's design**: pick a different design template from section 6 for every reel (rotation rules in section 6).
> For each reel: write `jobs/<slug>/script.json` + `anim_0.js … anim_5.js` (copy the job folder listed for the chosen template in section 6), add the `relief` map block (section 7), preview with `python3 tools/preview.py jobs/<slug> /tmp/sheet.jpg` and look at the sheet, fix problems, then push and render with the `render-one.yml` workflow, download `reel.mp4` + `cover.jpg` + `caption.txt` from the GitHub release named after the slug, check the cover, and send me all three.
> Today's topic: **<write the topic here>** for **<@unexplored.truths or @kathayum.sathyangalum>**.

---

## 3. The two pages

| | @unexplored.truths (account **1**) | @kathayum.sathyangalum (account **2**) |
|---|---|---|
| Folder name | `jobs/<slug>` | `jobs/k2-<slug>` (**must** start with `k2-`) |
| Render with | `account=1` | `account=2` |
| On-screen text | Malayalam (small English line under the headline) | Malayalam only |
| Post time (manual) | **7:04 AM** | **8:04 AM** |

Rules: **one reel per page per day, mornings only. Never archive a reel in its first 7 days. Never repeat a topic** (check `logs/stats.json` titles).

---

## 4. Step by step (what Claude runs)

```bash
cd insta-reel && git pull -q origin main
R=repos/adhil-bit/insta-reel/actions/workflows

# 1) copy the job folder of the chosen design template (section 6), then rewrite script.json + anim_*.js
cp -r jobs/<template-job> jobs/<slug>     # page 2: jobs/k2-<slug>
rm -rf jobs/<slug>/relief                 # the map is rebuilt for the new place

# 2) build the 3D map for the location scene (needs the "relief" block, section 7)
gh api -X POST $R/relief-build.yml/dispatches -f ref=main -f inputs[job]=<slug>   # ~1 min, commits jobs/<slug>/relief/
git pull -q origin main

# 3) preview: 6 scenes × 3 frames; every line must say errors: []
python3 tools/preview.py jobs/<slug> /tmp/sheet.jpg

# 4) push (keep the auto-renderer paused, see section 9)
git add jobs/<slug> && git commit -m "Add <slug>" && git pull --rebase origin main && git push origin HEAD:main

# 5) render on GitHub (≈ 5 min)
gh api -X POST $R/render-one.yml/dispatches -f ref=main -f inputs[job]=<slug> -f inputs[account]=1
sleep 15; id=$(gh run list -R adhil-bit/insta-reel -w render-one.yml -L 1 --json databaseId -q '.[0].databaseId')
gh run watch $id -R adhil-bit/insta-reel --exit-status

# 6) download the video, cover and caption from the release named <slug>
for f in reel.mp4 cover.jpg caption.txt; do
  i=$(gh api repos/adhil-bit/insta-reel/releases/tags/<slug> --jq ".assets[]|select(.name==\"$f\")|.id")
  gh api repos/adhil-bit/insta-reel/releases/assets/$i -H "Accept: application/octet-stream" > $f
done
```

- `"post_on": "2099-01-01"` stays in every script.json so **nothing posts automatically**.
- **Voice limit:** Gemini allows about 6–8 renders a day; it resets at **1:30 PM IST**. If a render fails with *quota / RESOURCE_EXHAUSTED*, start it again after 1:30 PM IST. **Do not use `wait_until_utc`**: a waiting run is billed as GitHub Actions minutes the whole time (on 20 Nov six waiting renders used ~1,900 minutes and the account hit its limit).
- **A release can't be overwritten.** To fix a reel, copy the folder to `<slug>-v2`, change it, render the new slug.
- Right after a render the release can show 404 for a minute; wait and download again.

---

## 5. script.json (the fields that matter)

```json
{
  "priority": 0, "post_on": "2099-01-01", "template": "explainer", "opening": {"type": "hero"},
  "style": "naadu", "design": "casefile",
  "voice_lock": "Despina", "category": "HISTORY",
  "topic": {"title": "...", "key_facts": ["..."], "sources": ["..."]},
  "headline": ["ENGLISH", "TITLE."], "english_sub": "THE REAL-LIFE DHOOM HEIST",
  "thumbnail_ml": "Short Malayalam cover line (2–3 lines max)", "thumbnail_accent": ["one-word"],
  "hook_voiceover": "≤ 2.5 s: a known name + a twist + an open question",
  "scenes": [ {"voiceover": "...", "caption": "≤ 4 words", "highlight": "one word", "kicker": "", "labels": [], "visual": ""} ],
  "relief": {"scene": 1, "lat": 11.152, "lon": 75.866, "town": "ചേലേമ്പ്ര", "district": "MALAPPURAM", "kicker": "LOCATION"},
  "instagram_caption": "...", "series": "കണ്ണൂർ രഹസ്യങ്ങൾ #6", "twist_scene": 3,
  "sound_plan": {"drone": "C", "layers": [{"type": "heartbeat", "clip": 0, "at": 0.0, "count": 3}]}
}
```

- 5 scenes + the hook = 6 animations (`anim_0.js` = hook … `anim_5.js` = last scene). Scene 1 is replaced by the 3D map when `relief` is set.
- **Total voice ≤ 450 Malayalam characters (≈ 32–35 s).** From the 19 Nov stats: the two hits (63K and 68K views) held viewers 18–20 s and had 8–12 % shares/reach; everything else stalled at ~1.3K.
- **Share line in the middle (scene 3)**, e.g. "ഇത് കണ്ണൂരുകാർക്ക് പോലും അറിയില്ല, അയച്ചു കൊടുക്കൂ", not only at the end.
- Page 2 adds `"account": "2"`.
- `sound_plan` layer types: `river`, `crickets`, `shimmer`, `heartbeat`, `rumble`, `gong` (`clip` = scene index).

---

## 6. Design templates — never reuse the last one

**Rule:** no two reels in a row on a page use the same `"design"`; each template at most once in any 5 reels. Colour changes on the same design do **not** count as a new design. The look comes from `pipeline/lib/designs.js` (drawing kits) + `pipeline/cine.py` (finish) + `pipeline/explainer.py` (subtitles/cover). Every kit turns the shared drawings (`person`, `bank`, `pond`, `fort` … inside each job's anim files) into a different medium.

| `"design"` | Look | Best for | Copy this job | Kit calls |
|---|---|---|---|---|
| `newsprint` | cream newspaper, halftone clippings, red marker circles, gold spot colour | news events, discoveries | `jobs/kannur-treasure-pot-v2` | `NEWS.paper`, `NEWS.clip`, `FX.halftone`, `NEWS.marker`, `NEWS.scrawl`, `NEWS.tab` |
| `casefile` | dark desk, manila folder, polaroids, red string, typewriter, rubber stamps, redactions | crime, heists, investigations | `jobs/chelembra-money-heist-v3` | `CASE.desk`, `CASE.folder`, `CASE.polaroid`, `CASE.string`, `CASE.typed`, `CASE.stamp`, `CASE.redact`, `CASE.note` |
| `album` | black photo-album page, sepia deckled photos, white handwriting, colour returns at the twist | people, communities, nostalgia | `jobs/last-jews-of-kochi-v2` | `ALBUM.page`, `ALBUM.photo(…, warm)`, `ALBUM.write` |
| `vhs` | night-vision camcorder: REC, timestamp, scanlines, glitch, torch beam; DAY mode for the reveal | ghost stories, legends, mysteries | `jobs/karyavattom-haunted-pond-v3` | `VHS.cam`, `VHS.torch`, `VHS.hud`, `VHS.post` |
| `forensic` | lab HUD: x-ray scans, bounding boxes, scan sweep, evidence tents, readouts | police cases, science, "what was inside" | `jobs/kannur-vault-38-v2` | `LAB.bg`, `LAB.xray`, `LAB.box`, `LAB.scan`, `LAB.readout`, `LAB.tent`, `LAB.wave` |
| `mural` | Kerala mural wall: ochre, vermilion, leaf green, thick black outlines, petal borders | heroes, kings, legends (page 2) | `jobs/k2-thalakkal-chandu-v2` | `MURAL.wall`, `MURAL.band`, `MURAL.panel`, `FX.paint(fill, outline)` |
| (none) | the old cinematic silhouettes (sky moods: day, monsoon, storm, blue, dawn, gold) | at most 1 in 5 reels | `jobs/ezhimala-marco-polo` | `G.sky`, `G.sea`, … |

Ideas for the next new templates (build one when the rotation needs it): **blueprint** (white lines on blue, measurements), **comic panels** (halftone + speech balloons), **shadow puppet** (Tholpavakoothu: lamp-lit screen, cut-out figures), **museum label** (object on plinth + catalogue card), **chalkboard** (teacher diagrams).

Layout rules for every template: Instagram's feed shows reels cropped to 4:5 (only y ≈ 285–1635 is visible) and the profile grid to 3:4 (y ≈ 240–1680), so all text sits inside **y 300–1500**. Keep **y 300–700** free of drawings in the hook (headline sits there); main art **y 720–1480**; subtitles sit around **y 1250–1490**; the series badge is top-right at y 118. Check the cover (`cover.jpg` is made from the hook frame): nothing may touch the headline or the English line.

---

## 7. The automatic 3D map (location scene)

Add `"relief": {"scene": 1, "lat": …, "lon": …, "town": "<Malayalam>", "district": "<ENGLISH>", "kicker": "LOCATION"}`.
Optional: `"from": "kozhikode"` (city for the distance line; `false` = none), `"look": "ink"` (paper-coloured map for light templates: newsprint, album, mural) or `"night"` (default).
It flies from all of Kerala down to the town, draws the Kerala outline, a dashed distance line from the nearest district town with a km counter, drops a pin and shows a callout. Data: Copernicus DEM (© DLR/ESA) + Natural Earth, downloaded on GitHub; the credit line is drawn automatically. Build it with `relief-build.yml` (section 4) so you can preview it.

---

## 8. The rules that decide 1K+ views (short version)

**Hook (first 2 s):** frame 1 = strongest image + question on screen. First spoken line names a place Malayalis know + a twist + an open question.
**Flow (32–35 s):** hook → map (where) → 3 reveals (a new turn every 5–6 s, share line in the middle) → the answer → comment question.
**Shares decide virality.** Hits were hyper-local and made people proud (Payyanur, Kannur). Put the town on the cover, run series (#1, #2 …). **Send each new reel to 3–5 local WhatsApp/Facebook groups of that town in the first hour.**
**Facts:** label legends as legends ("എന്നാണ് വിശ്വാസം"), leave out anything uncertain, no victims' names in news topics, respectful with faith practices, no other pages' watermarks/artwork, no celebrity photos or brand logos. Real photos / satellite clips only if you supply them (Google Earth Studio with its credit is fine; **never Apple Maps imagery**).

---

## 9. Automation switches

- `render-jobs.yml` (auto-render of every unrendered job, daily 1:42 PM IST) is **paused since 20 Nov** so half-finished designs don't render. Re-enable with `gh api -X PUT $R/render-jobs.yml/enable` only when every job folder is final; otherwise render with `render-one.yml`.
- Scheduled auto-posting (`cron-oneoff.yml`) is only for the original account. In video-only mode, don't touch it.

---

## 10. Queue status (20 Nov 2026)

Designed, not yet rendered (render after 1:30 PM IST with `render-one`, page-1 jobs `account=1`, `k2-` jobs `account=2`):

| Post slot | Job | Design |
|---|---|---|
| Sat 21 · 7:04 | `kannur-treasure-pot-v2` | newsprint |
| Sat 21 · 5:04 PM | `chelembra-money-heist-v3` | casefile |
| Sun 22 · 7:04 | `last-jews-of-kochi-v2` | album |
| Sun 22 · 8:04 | `k2-thalakkal-chandu-v2` | mural |
| Sun 22 · 5:04 PM | `karyavattom-haunted-pond-v3` | vhs |
| Mon 23 · 7:04 | `kannur-vault-38-v2` | forensic (check the news facts first) |

Already rendered: `k2-unniyarcha-v2` (Sat 8:04), `k2-thalassery-fort-v2` (Sat 5:34 PM).
Topic ideas not yet built: Ananthapura lake temple crocodile, Mahe, Bekal fort, Mishkal mosque, Kappad, Nilambur teak, zero shadow day, Kottiyoor; page 2: Ayyankali, Velu Thampi, Akkamma Cheriyan, Vaikom Satyagraha, Kayamkulam Kochunni, Arattupuzha Velayudha Panicker.

---

## 11. If something breaks

| Problem | Fix |
|---|---|
| Render fails: quota / RESOURCE_EXHAUSTED | Re-run after 1:30 PM IST (never use `wait_until_utc`, it burns Actions minutes) |
| Every run fails in 2 s: "recent account payments have failed or your spending limit needs to be increased" | GitHub Actions minutes/billing: GitHub → Settings → Billing and plans → fix the payment method or raise the Actions budget, or wait for the monthly reset. Post manually meanwhile. |
| Preview shows `errors: [...]` | A JavaScript error in that anim file (e.g. `fort` must be `G.fort`) — fix before pushing |
| `relief map skipped` in the log | The map files are missing: run `relief-build.yml` for the job |
| Page-2 reel shows page-1 branding | Folder must start with `k2-`, script has `"account": "2"`, render with `account=2` |
| Release 404 right after render | Wait 1–2 minutes and download again |
| Need to change a rendered reel | New folder `<slug>-v2`, render again |
| Git push rejected | `git pull --rebase origin main` then push again |


## Location map with real road (night look, Nov 2026)
The relief location scene (`"relief": {...}` in script.json, night look) now zooms into real Sentinel-2 satellite land and draws the real road (OSRM) from the nearest district town: glowing blue line, white van, bilingual town label ("FROM THALASSERY / തലശ്ശേരി" when the town is off-screen), "xx km by road" chip, Copernicus Sentinel + OpenStreetMap credit.
- Override the start town with `"from": "thalassery"` (a CITIES key) or switch the road off with `"from": false`. `"sat": false` keeps the painted relief.
- Build once with relief-build.yml (job=<slug>); meta version 4 caches the tiles and road.
- Use it as the in-between location scene of story reels. Do not make whole travel/route reels (user said no).

## Location map outside Kerala (Nov 2026)

The satellite map scene also works for places outside Kerala. Add a `region` to the relief block:

```json
"relief": {"scene": 1, "lat": 35.875, "lon": 23.305, "town": "ആന്റികിതേര", "district": "GREECE", "kicker": "SHIPWRECK",
           "from": false, "look": "night",
           "region": {"c": [37.3, 23.6], "ml": "ഗ്രീസ്", "en": "GREECE · EUROPE", "off": [0.4, 1.2]}}
```

- `c` = centre of the opening wide view (instead of Kerala); `ml` / `en` = the big label; `off` = label offset in degrees [lat, lon].
- No Kerala outline and no road line are drawn when `region` is set. Elevation (Copernicus DEM) and Sentinel-2 imagery are worldwide.
- Examples: `jobs/antikythera-computer` (Greece), `jobs/dyatlov-pass` (Urals), `jobs/k2-bhangarh-fort` (Rajasthan).
