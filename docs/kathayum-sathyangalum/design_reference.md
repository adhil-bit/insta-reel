# കഥയും സത്യങ്ങളും (@kathayum.sathyangalum): brand and design reference

For the developer turning scripts into canvas 2D scenes (1080×1920, 6 animations per reel).
Nothing here has been built or rendered yet. All coordinates, sizes and hex values are a starting spec; check them on a real frame before locking.

Sources read: MindVault blueprint (mood only), `pipeline/lib/designs.js`, `pipeline/cine.py` (DESIGNS), `pipeline/explainer.py` (`_design_css`), `docs/design-methods.md` (rotation rule), and the 30 drafted topics.

---

## 0. The idea in one line

Every reel is **a knot that becomes a straight line**: the story (കഥ) is a tangled blue thread, the truth (സത്യം) is the same thread pulled straight and lit amber.

That one device gives the page its logo, its hook reveal, its in-scene motif and its cover mark. It also separates this page from @unexplored.truths, which is warm, outdoor and place-based: this page is cool, indoor and inside the head.

What is kept from MindVault: deep navy and black, electric blue, a faceless Observer, story first, verified claims only.
What is dropped: realistic AI photos, English captions and voice, film grain and volumetric light, Montserrat.

---

## 1. Signature template: `mind`

### 1.1 Palette (exact hex)

| Token | Hex | Use |
|---|---|---|
| `NIGHT` | `#05070F` | top and bottom of the background, floor band |
| `NAVY` | `#0B1530` | main background field |
| `PANEL` | `#142350` | cards, phone body, cinema screen frame, chips |
| `FIGURE` | `#1B2F66` | Observer and all other figures (one flat fill) |
| `BLUE` | `#2E7BFF` | the thread, outlines, rim light, the "story" colour |
| `ICE` | `#7FB2FF` | thread core, small labels, subtitle highlight word |
| `AMBER` | `#FFB23E` | the one warm accent: truth thread, truth outlines, mundu border |
| `WHITE` | `#F4F7FF` | titles and body text |
| `MUTE` | `#8A97B8` | source line, secondary labels |

Rules:
- **Amber budget.** In canvas art, amber appears only (a) on the Observer's mundu border, (b) in the last second of the hook, (c) from the truth beat (scene 3) onward. Scenes 1 and 2 are blue only. This is what makes the truth moment visible without any effect.
- No red, no green. A scam warning is shown in amber, not red (red belongs to `casefile` and `newsprint`).
- `BLUE` on `NAVY` is roughly 4.6:1, fine for lines and large text. For any text under 44 px use `ICE` or `WHITE`.

### 1.2 Background

Drawn in this order, all flat:
1. Vertical gradient: `NIGHT` (y 0) → `NAVY` (y 700) → `#0A1228` (y 1920).
2. One "lamp pool": radial gradient at the scene's focal point, `rgba(46,123,255,0.16)` → transparent, radius about 700. Pass the focal point per scene.
3. Neuron dust: about 60 dots from `FX.NOISE`, 2–3 px, `ICE` at alpha 0.08–0.25. Join 6–8 neighbouring dots with 1 px lines at alpha 0.10. Drift each dot by `4*sin(t*0.4+i)`.
4. Floor band: `NIGHT` rectangle from y 1210 down, with a 2 px `BLUE` line at alpha 0.25 on its top edge, so figures stand on something.

**No grid and no monospace HUD text.** Those belong to `forensic` and `blueprint`; leaving them out is what keeps `mind` from looking like a recolour of either.

Suggested finish (`cine.DESIGNS`): `"mind": {"overlay": "none", "grade": False, "leak": False, "grain": 0.03, "vignette": 0.40, "accent": "#FFB23E", "letterbox": []}`.

### 1.3 Recurring motif: the thought thread (ചിന്താനൂൽ)

One continuous line that leaves the Observer's head and links the objects of the scene.

- Stroke in three passes instead of `shadowBlur` (cheaper per frame in headless Chromium): width 18 at alpha 0.12, width 8 at alpha 0.35, width 4 at alpha 1. Core colour `ICE` on a `BLUE` glow; in truth state, core `#FFD58A` on an `AMBER` glow.
- Path: smooth curve through a list of points, drawn to progress `p` (same contract as `CASE.string` and `BP.trace`).
- Nodes: where the thread touches an object, a filled dot r 10 plus a ring r 22 at alpha 0.3 that pulses once.
- **Knot** (story state): a three-loop scribble about 180 px wide, drawn as a Lissajous curve (`x = sin(2a)`, `y = sin(3a)`), slowly rotating. It always sits just above the Observer's head.
- **Line** (truth state): the knot's points interpolate to a straight horizontal line.

**Brand glyph:** a circle (the head, r 44, 5 px `BLUE` stroke) with the knot inside it; one end exits to the right as a straight 120 px line ending in an amber dot. It reads at 60 px and is the profile picture, the cover mark and the end-card mark.

Suggested kit surface, matching the style of `designs.js`:

```
MIND.bg(g, t, focus=[540,900])
MIND.thread(g, pts, p, truth=false)      // partial draw, three-pass glow
MIND.knot(g, x, y, r, t, straighten=0)   // 0 = knot, 1 = straight line
MIND.node(g, x, y, p, truth=false)
MIND.observer(g, x, y, s, pose, opts)    // see 1.5
MIND.chip(g, label, x, y, kind)          // 'katha' | 'sathyam' | pillar chips
MIND.flip(g, tt)                         // the truth moment, see 1.4
MIND.phone(g, x, y, w, h, inner)         // phone frame, clipped inner draw
MIND.hall(g, t, inner)                   // cinema hall, inner draws on the screen
MIND.glyph(g, x, y, r, p)
```

### 1.4 How the hook reveals the truth: "കുരുക്കഴിയൽ" (the untangle)

Hook length 2.5 s, three beats that follow the three spoken beats.

| Time | Picture |
|---|---|
| 0.0–0.9 s | Cold frame. Observer and one story object, blue only. The knot turns above his head. |
| 0.9–1.5 s | The knot pulls tight (radius shrinks 20%); small camera kick. |
| 1.5–2.5 s | Snap. The knot straightens into a line that races left to right across y ≈ 820 in 0.35 s (`ease.out`), tip lit amber. Everything the line passes switches from blue outline to amber outline. A `സത്യം?` chip stamps in at the tip. A two-frame amber wash at 12% alpha marks the snap (use the existing `flash`). |

The hook shows that a truth exists; it never shows the answer. The same move, slower (0.8 s) and without the question mark, opens scene 3. Set `twist_scene: 3` so `cine` adds its kick and flash there.

Scene roles in every `mind` reel:

| Animation | Role | Colour state | Fixed element |
|---|---|---|---|
| Hook | question | blue → amber tip | knot → line |
| Scene 1 | കഥ: setup | blue | `കഥ` chip (Chilanka) |
| Scene 2 | കഥ: the odd moment | blue | knot tightens |
| Scene 3 | സത്യം: the name of the effect | amber arrives | `സത്യം` chip, share line |
| Scene 4 | തെളിവ്: the study, shown as a simple diagram | amber + blue | source chip (researcher, year) |
| Scene 5 | takeaway and comment question | amber | glyph, thread ends in a `?` curl |

### 1.5 The Observer (നിരീക്ഷകൻ)

A Malayali everyman, never a face.

- Height about 620 px at scale 1; stands on the floor line (feet at y ≈ 1210).
- Head: ellipse rx 46, ry 54. **No eyes, nose, mouth, moustache or beard, ever.** Hair is a flat cap shape offset 8 px to one side.
- Half-sleeve shirt: trapezoid torso, two small triangles for the collar, short sleeve stubs.
- Mundu: tapered rectangle from waist to ankle, one vertical fold line. The **kara** (border) is a 6 px amber line down the front edge and along the hem. This is the page's signature detail and the only amber allowed in story scenes.
- Variant `madakki`: mundu folded to the knee (two legs visible), for walking, running and comic beats.
- Fill `FIGURE`; a 3 px `ICE` rim-light stroke on the side facing the lamp pool. In truth state the rim turns amber and a node sits on the head.
- Poses to build first: `stand`, `walk`, `sit` (chair or floor), `lie` (bed), `phone` (hand to ear), `scroll` (phone at chest, head tilted down), `back` (seen from behind, for cinema and crowd scenes), `think` (hand to chin).
- If the existing `person()` in `scenes.js` has usable poses, tint it with `FX.tint` and add the kara on top; otherwise draw the poses fresh.

Other people use the same construction and are told apart by outline only: saree or churidar outline, child at 0.6 scale, elder with a slight stoop and a stick. Everyone is `FIGURE` navy; no skin tones.

**Likeness rule.** A movie character is never drawn as a recognisable figure: no signature hairstyle, beard, costume colour or famous pose. Characters appear as (1) a ticket chip with the character name and (2) one prop.

### 1.6 Typography

| Role | Font | Size | Notes |
|---|---|---|---|
| Scene title (`.head`), y 272–400 | Baloo 800 | 76 px, line-height 1.14 | `WHITE`, one key word in `AMBER` |
| Hook claim (`.claim`) | Baloo 800 | 96 px | max 3 lines |
| Subtitles (`.sub`), y 1250–1490 | Baloo 700 | 52 px, line-height 1.34 | see below |
| Story voice: `കഥ` chip, thought bubbles, the comment question | Chilanka 700 | 44–64 px | handwriting marks "this is the story" |
| Labels on diagrams, source chip | Noto Sans Malayalam 600 | 30–36 px | `ICE` or `MUTE` |
| Study name and year in Latin script | Inter 700 | 28 px | `MUTE` |

Malayalam rules: no letter-spacing (it breaks conjuncts), no all-caps styling, line-height at least 1.25, minimum 44 px for anything the viewer must read, always run canvas labels through `FX.fit`.

**Subtitle box.** Suggested `_design_css` row:

```
"mind": ("#F4F7FF", "#FFB23E", "0 4px 24px rgba(3,6,16,.8)", "rgba(7,12,30,.90)", "#F4F7FF",
         "border-radius:18px; border:2px solid rgba(46,123,255,.55);", "Baloo", None)
```

and add `"mind": "#7FB2FF"` to `SUBHI`, so the spoken word lights up ice blue while title key words stay amber. A full thin outline (not `forensic`'s left bar) keeps the two boxes distinct.

### 1.7 Safe zones

| Zone | y range | What goes there |
|---|---|---|
| Instagram top UI | 0–250 | background only |
| Scene title | 272–400 | `.head` / `.claim` (HTML overlay) |
| **Action zone** | 430–1200 | all figures, objects, canvas labels, the thread |
| Share-line chip (scene 3 only) | 1150–1220 | `ഇത് ഒരാൾക്ക് അയക്കൂ` with a paper-plane triangle |
| Subtitles | 1250–1490 | `.sub` |
| Instagram caption and buttons | 1500–1920 | background only; nothing readable |

- All text inside y 300–1500 (4:5 feed crop). Horizontal margin: x 70–1010; keep labels left of x 930 below y 1100 (like/share buttons).
- Figures stand at y ≈ 1210, so feet touch the floor band just above the subtitle box and never sit under it.
- Canvas labels must not enter 272–400 or 1250–1490, because the HTML title and subtitle are drawn over the canvas.

### 1.8 Cover layout (1080×1920, y ranges)

| y range | Element |
|---|---|
| 300–360 | Brand strip: glyph (60 px) at x 70, `കഥയും സത്യങ്ങളും` in Baloo 700 34 px, pillar chip right-aligned at x 1010 |
| 400–760 | Headline: Baloo 800, 96–112 px (`fitKick` already shrinks it), max 3 lines, one amber word |
| 780–1240 | Hero: the Observer plus exactly one object, knot above his head, lamp pool behind |
| 1260–1340 | Reference bar: `കഥ: <reference>` on the left in Chilanka 44 px, a thin arrow, `സത്യം: ?` on the right in amber |
| 1380–1480 | Episode mark `സത്യം #07` in Baloo 800 44 px and the handle in Inter 28 px `MUTE` |

Everything sits inside y 300–1500. The headline and hero (y 400–1240) also survive the profile-grid crop. [VERIFY: Instagram's grid has shown 3:4 thumbnails since 2025; check the current crop on a test post.]

---

## 2. Rotation

### 2.1 Three things that never change, whatever the template

These carry the brand when the reel is in `newsprint` or `vhs`:
1. **The thread**, redrawn in the template's own medium: red marker line (`NEWS.marker` style) in newsprint, red string (`CASE.string`) in casefile, chalk line in chalk, white-ink line in album, green trace in vhs, cyan trace in forensic, carved line in woodcut, black outline in mural, dimension line in blueprint.
2. **The `കഥ` → `സത്യം` chips** in scenes 1 and 3, in the template's ink.
3. **The cover layout** of section 1.8, recoloured by the template.

The Observer appears in every `mind` reel and, as a plain silhouette in the template's ink, in at least one scene of every other reel.

### 2.2 Rules

- `mind` appears in **8–10 of every 30 reels** (about one in three or four), at most once in any 3 reels, never twice in a row. The first reel after the genre switch and the last reel of each month are `mind`.
- Every other template keeps the existing rule: never twice in a row, at most once in any 5 reels. The signature needs an explicit exception to that rule in `docs/design-methods.md`.
- Look-alike pairs must not be adjacent: `mind`–`forensic`, `mind`–`blueprint`, `forensic`–`blueprint`, `forensic`–`vhs`, `chalk`–`blueprint`, `casefile`–`album`, `casefile`–`palmleaf`, `newsprint`–`woodcut`.
- Aim for one dark-cool, one dark-warm and one light cover in each grid row of three.
- `palmleaf` and `mural` are heritage looks from the old history page. Use `mural` rarely and `palmleaf` only for proverb or folk-belief episodes; otherwise the page drifts back toward @unexplored.truths.

### 2.3 Template by pillar

| Pillar | First choices | Why |
|---|---|---|
| Movies | `vhs` (horror, thriller), `album` (nostalgia), `casefile` (crime), `shadow` (period, drama), `woodcut` (mass, action), `mind` | each maps to a film genre without showing the film |
| Troll / meme | `newsprint`, `woodcut`, `chalk`, `mind` (phone frame) | loud, flat, poster-like |
| News / season | `newsprint`, `casefile`, `forensic`, `mind` (phone frame for scams) | clippings, evidence, notifications |
| Everyday mind | `mind` (home ground), `chalk`, `shadow` | quiet, domestic |
| Strange but true | `blueprint`, `forensic`, `mind` | diagram and cut-away |

### 2.4 Suggested assignment for the 30 drafted topics

Order as drafted. Checked against every rule above. "was" shows the drafted template where it changes.

| # | Topic | Template | # | Topic | Template |
|---|---|---|---|---|---|
| 1 | ദൃശ്യം | **mind** (was casefile) | 16 | പാട്ട് തലയിൽ | forensic |
| 2 | മുറിയിലേക്ക് വന്നത് | chalk | 17 | ടാസ്ക് തട്ടിപ്പ് | casefile |
| 3 | ദശമൂലം ദാമു | newsprint | 18 | കുമ്പളങ്ങി നൈറ്റ്സ് | **mind** (was album) |
| 4 | ഡിജിറ്റൽ അറസ്റ്റ് | **mind** (was forensic) | 19 | അതേ കാർ | shadow |
| 5 | മഞ്ഞുമ്മൽ ബോയ്സ് | vhs | 20 | കമന്റ് ബോക്സ് | chalk (was newsprint) |
| 6 | കോട്ടുവായ് | blueprint | 21 | ഭ്രമയുഗം | woodcut |
| 7 | എല്ലാവരും നോക്കുന്നു | shadow | 22 | ബമ്പർ | **mind** (was vhs) |
| 8 | പ്രേമം | album | 23 | ദേജാ വു | vhs (was blueprint) |
| 9 | കമന്റിൽ സിംഹം | **mind** (was woodcut) | 24 | ക്രിസ്മസ് സമ്മാനം | mural |
| 10 | IFFK ക്യൂ | newsprint | 25 | 2018 | newsprint (was palmleaf) |
| 11 | രോമാഞ്ചം | vhs | 26 | കറിയുടെ മണം | album |
| 12 | ഉറക്കത്തിലെ വീഴ്ച | **mind** (was chalk) | 27 | വാട്‌സ്ആപ്പ് ഫോർവേഡ് | **mind** (was chalk) |
| 13 | ഗഫൂർ കാ ദോസ്ത് | woodcut (was palmleaf) | 28 | ആവേശം | woodcut (was forensic) |
| 14 | രോമാഞ്ചം (പാട്ട്) | blueprint | 29 | ആദ്യ കാഴ്ച | casefile |
| 15 | മണിച്ചിത്രത്താഴ് | mural | 30 | ന്യൂ ഇയർ | **mind** (was newsprint) |

Counts: mind 8, newsprint 3, vhs 3, woodcut 3, and 2 each of chalk, blueprint, shadow, album, mural, casefile; forensic 1; palmleaf 0.

---

## 3. Per-pillar treatments

**Movies (സിനിമ).** The film is never on screen; the audience is. The base frame is a cinema hall seen from the back row: a row of head-and-shoulder silhouettes along y 1000–1200 (the Observer is one of them, marked by nothing but his position under the knot), a projector cone from the top right, and a blank glowing screen rectangle at roughly x 120–960, y 440–900. Whatever happens "in the film" is drawn on that screen as words and props only: the character name in Baloo, a short catchphrase in quotes, and one flat prop (a rope, a coin on a board, a diary page with a date, a locked door). A ticket-stub chip carries the title and year. From scene 3 the view leaves the hall and goes to the Observer's ordinary life, because the truth is about the viewer, not the film. No stills, no posters, no actor likeness, no title-logo lettering, no song or BGM in the audio.

**Troll / meme (ട്രോൾ).** The frame is a phone held upright: `PANEL` body, 36 px corner radius, screen at about x 190–890, y 450–1180. Inside it, draw the page's own generic interface: a chat list, a comment thread with round blank avatars, a "പലതവണ ഫോർവേഡ് ചെയ്തത്" label, reaction counters ticking up. A meme is shown as an empty meme template: a two-panel box whose picture areas hold a plain silhouette and a name tag (for example `ദാമു`), with the caption text set big above and below in Baloo with a dark outline. The joke is in the words. Do not copy any real app's logo, icon set or exact layout, and do not reproduce a real troll page's watermark.

**News (വാർത്ത).** Two interchangeable frames. (1) A front page: a made-up masthead that just says `വാർത്ത`, a headline strip, grey bars for body text and one circled word; in `newsprint` this is `NEWS.clip` plus `NEWS.marker`. (2) A lock screen: a stack of three notification cards sliding down from y 460, each with a blank round icon, a sender line and one line of text, the scam message last and outlined in amber. People in news stories are always the Observer or generic silhouettes; no real victim, officer, politician, channel logo or newspaper name. Scam episodes end with a fixed safety card: `1930` in large numerals and `cybercrime.gov.in` below it. Write news scenes so the reel still makes sense a year later: say "ഈയിടെ" in the voice and keep dates out of the picture.

**Everyday mind (മനസ്സ്).** This is the `mind` template's home. Scenes are small Kerala interiors built from a few flat shapes: a door frame, a kitchen shelf with three jars, a bed with a window and a moon, a bus seat, a mirror. One object per scene, the Observer, the lamp pool and the thread, and nothing else. The viewer should recognise their own house in two seconds. The study in scene 4 is drawn as the simplest possible diagram (two rooms and a door; two bars of different height; a row of ten dots with one lit), never as a chart with axes.

**Strange but true (വിചിത്രം).** Cut-away diagrams. A side-profile head outline (no facial detail, just the contour) with the brain as five or six rounded regions; one region lights up and the thread runs from it to the body part or object in question. In `blueprint` use `BP.trace` and `BP.dim` for labels; in `forensic` use `LAB.box` and `LAB.wave`; in `mind` use nodes and the thread. Labels are single Malayalam words. Show one mechanism per reel, and when the science is unsettled put a small `ഇപ്പോഴും പഠനത്തിൽ` chip on scene 4 instead of drawing a confident arrow.

---

## 4. Sample storyboards

Each line is one animation. Coordinates are for the action zone (y 430–1200).

### 4.1 ദൃശ്യം: ഓർമ്മയെ പറ്റിച്ചതെങ്ങനെ? (movie, `mind`)

- **Hook:** cinema hall from the back row; the screen shows only a calendar page reading `ഓഗസ്റ്റ് 2`; the knot above the Observer's head snaps straight, the line crosses the screen and the date flickers to `?` in amber.
- **Scene 1 (കഥ):** on the screen, four small silhouettes (two adults, two children) and a row of props appear one by one: a bus ticket, a meal token, a cinema ticket; ticket-stub chip `ദൃശ്യം · 2013`.
- **Scene 2 (കഥ):** three witness silhouettes stand in a row at y 1210, each with a thought bubble holding the same calendar page; a blue thread runs from the screen into each head; the knot tightens.
- **Scene 3 (സത്യം):** the hall fades; one head outline fills the frame (x 300–780, y 460–1000); inside it a calendar page is erased and redrawn with a different date; chip `സത്യം: പിന്നീട് കേട്ടത് ഓർമ്മയെ മാറ്റും`; thread turns amber; share-line chip at y 1150.
- **Scene 4 (തെളിവ്):** two flat cars meet nose to nose at y 800; above the left one the word `ഇടിച്ചു`, above the right one `തകർത്തു`; under the right car, small glass shards fade in as dotted outlines (they were never there); source chip `Loftus & Palmer, 1974`.
- **Scene 5:** the Observer sits holding a photo frame whose picture is a `?`; the thread ends in a question curl; comment question in Chilanka: `തെറ്റിപ്പോയ ഒരു ഓർമ്മ നിങ്ങൾക്കുണ്ടോ?`

### 4.2 ഡിജിറ്റൽ അറസ്റ്റ് (news, `mind`, phone frame)

- **Hook:** dark room, the Observer in `phone` pose; a phone frame rises to fill the centre showing an incoming video call: a cap-and-shoulders silhouette with a blank badge shape (no real insignia); the line snaps across and the badge outline turns to an amber `?`.
- **Scene 1 (കഥ):** lock-screen stack: three notification cards slide in, the last reads `നിങ്ങളുടെ പേരിൽ ഒരു കേസ്`; the Observer's shoulders rise (two key poses).
- **Scene 2 (കഥ):** inside the phone, the caller silhouette with a speech strip `ആരോടും പറയരുത്`; a countdown ring shrinks around the phone; the door behind the Observer closes (a rectangle narrowing to a line); the knot is tight.
- **Scene 3 (സത്യം):** the phone shrinks to the left; two amber labels attach to it by thread: `യൂണിഫോം = അനുസരണ` and `തിരക്ക് = ചിന്തയില്ല`; chip `സത്യം: "ഡിജിറ്റൽ അറസ്റ്റ്" എന്നൊന്ന് നിയമത്തിലില്ല`; share-line chip `വീട്ടിലെ മുതിർന്നവർക്ക് അയക്കൂ`.
- **Scene 4 (തെളിവ്):** simple diagram: a figure in a lab coat outline, a figure at a switch panel, a row of ten dots of which about two thirds light up; source chip `Milgram, 1963`.
- **Scene 5:** safety card: `1930` in Baloo 800 at 220 px (y 620–820), `cybercrime.gov.in` below, three one-word steps as chips `കട്ട് ചെയ്യൂ · വിളിക്കൂ · പറയൂ`; the Observer opens the door (line widens to a rectangle of amber light).

### 4.3 രോമാഞ്ചം: ഓജോ ബോർഡ് നീങ്ങുന്നതെങ്ങനെ? (movie, `vhs`, brand elements carried over)

- **Hook:** night-vision top-down view of a board with letters round its edge and a small round pointer in the centre; three hands (flat finger shapes, no bodies) touch it; the pointer slides on its own; a green thread trace follows its path; HUD `REC`.
- **Scene 1 (കഥ):** `VHS.cam` wide shot: a room, a single hanging bulb, a ring of seated silhouettes (the Observer among them) round the board; ticket-stub chip `രോമാഞ്ചം · 2023`; `കഥ` chip in the template's green.
- **Scene 2 (കഥ):** close on the pointer drifting toward a letter; `VHS.torch` narrows the light; `VHS.post` glitch rises as it stops.
- **Scene 3 (സത്യം):** the camera mode switches from `night` to `day` (the template's own truth switch); the same hands, now with thin white lines along the forearm muscles twitching by 2–3 px; chip `സത്യം: കൈ അറിയാതെ അനങ്ങുന്നു`; share-line chip.
- **Scene 4 (തെളിവ്):** two versions of the board side by side: eyes-open (pointer path lands on letters) and blindfolded with the board secretly turned (path wanders to the wrong places); source chip `ideomotor effect · Carpenter, 1852`.
- **Scene 5:** the Observer alone with a pendulum on a string that swings although his hand "does not move"; comment question `ഓജോ കളിച്ചിട്ടുണ്ടോ? എന്ത് സംഭവിച്ചു?`

Note for 4.3: the board is a generic letter board; do not copy a commercial Ouija board's artwork. [VERIFY which object the film's characters use as the pointer before writing the voice line.]

---

## 5. Brand assets

### 5.1 Cover formula

`[pillar chip] + [reference in 1–3 words] + [headline: a question or an unfinished claim, max 7 words, one amber word] + [Observer + one object] + [കഥ → സത്യം: ?]`

- The headline asks; it never answers. The answer is the reel.
- The amber word is the object of curiosity (`ഓർമ്മ`, `കോട്ടുവായ്`, `ക്യൂ`), not the film title.
- One object only. If two objects are needed, the cover idea is not sharp enough yet.
- Film titles appear as plain Baloo text, never as imitation title lettering.
- Example: chip `സിനിമ` · `ദൃശ്യം` · headline `ജോർജുകുട്ടി മാറ്റിയത് ആരുടെ` **`ഓർമ്മ`**`?` · Observer holding a calendar page.

### 5.2 Bio line options

Name field (searchable): `കഥയും സത്യങ്ങളും | Malayalam Psychology`

1. `ആദ്യം ഒരു കഥ. പിന്നെ അതിന്റെ സത്യം.` / `സിനിമ · ട്രോൾ · വാർത്ത · മനസ്സ്` / `ഓരോ സത്യത്തിനും ഉറവിടമുണ്ട്.`
2. `നിങ്ങൾക്കറിയാവുന്ന കഥ. നിങ്ങൾ അറിയാത്ത കാരണം.` / `മനസ്സിന്റെ ശാസ്ത്രം, മലയാളത്തിൽ.`
3. `സിനിമയിലും ട്രോളിലും വാർത്തയിലും ഒളിഞ്ഞിരിക്കുന്ന സൈക്കോളജി.` / `30 സെക്കൻഡ്. ഒരു കഥ. ഒരു സത്യം.`
4. `എന്തുകൊണ്ട് നമ്മൾ ഇങ്ങനെ? ദിവസവും ഒരു ഉത്തരം.` / `പഠനങ്ങൾ പറയുന്നത് മാത്രം.`

For the first month add one line: `(പഴയ @kathayum.charithravum)`. Sister-page line, if wanted: `സ്ഥലങ്ങളും ചരിത്രവും: @unexplored.truths`.

### 5.3 Five highlight names

1. `സിനിമ`
2. `ട്രോൾ`
3. `തട്ടിപ്പ്` (scam explainers with the 1930 card; the most shareable public-service set)
4. `മനസ്സ്`
5. `ഉറവിടം` (one story frame per reel listing the study; this is the "verified claims only" promise made visible)

Spare: `വിചിത്രം`, `നിങ്ങൾ പറഞ്ഞത്` (best comment answers).
Highlight covers: the glyph on `NAVY` with a different small prop inside the head circle (ticket, speech bubble, phone, knot, open book).

### 5.4 Pinned posts

1. **The switch reel** (new, 20–25 s): `ഈ പേജ് മാറുകയാണ്.` The Observer closes a history book; the knot rises from it and straightens. It states the promise: one story, one truth, every source named. It also tells old followers where history content now lives.
2. **The best movie reel**, starting with ദൃശ്യം; replace it whenever another movie reel beats its shares.
3. **The scam safety reel** (ഡിജിറ്റൽ അറസ്റ്റ്), because it is useful on any day and is the one people forward to family.

Optional later replacement for slot 1: a carousel `ഈ പേജ് എങ്ങനെ വായിക്കാം` showing the five pillar chips and the sourcing rule.

---

## 6. Open points

- Nothing here has been rendered. The amber-budget rule and the three-pass thread glow should be tried on one real scene before the kit is written.
- The share of `mind` reels (8 of 30) is a judgement, not a tested number; raise it if the grid looks too mixed after two weeks.
- The subtitle highlight needs a `SUBHI` entry; without it the spoken word will be amber and the amber budget will only hold inside the canvas.
- The `mind` exception to the "once in any 5 reels" rule has to be written into `docs/design-methods.md` by whoever owns that file.
