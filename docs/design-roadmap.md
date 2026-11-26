# Design roadmap: @unexplored.truths (page 1) and @kathayum.sathyangalum (page 2)

Written 26 Nov 2026 from the repo and from memory (no web). Nothing here is built or rendered. Unsure facts carry **[VERIFY]**.
Read: `pipeline/lib/designs.js`, `pipeline/cine.py` (DESIGNS), `pipeline/explainer.py` (`_design_css`), `docs/VIDEO-ONLY-GUIDE.md`, `docs/design-methods.md`, `docs/kathayum-sathyangalum/design_reference.md` and `ideas.md`, the December spreadsheet, `logs/stats.json`, and the six example jobs.

---

## 1. Audit of the 12 existing templates

### 1.1 What looks the same on a phone grid

At grid size (about 120 px wide) the 12 templates collapse into four looks:

| Grid look | Templates | Why they merge |
|---|---|---|
| Dark blue with thin pale lines | `forensic`, `blueprint`, `mind` | Navy field, cyan/ice line work, grid or dots. Page 2 uses all three, so it reads as "the blue page". |
| Dark brown with a pale rectangle | `casefile`, `album`, `palmleaf` (and `shadow` at its edges) | Dark desk or page, one cream card in the middle, warm vignette. |
| Cream paper, black ink, red accent | `newsprint`, `woodcut`, cream panels of `mural` | The three reds are nearly one colour: `#C8302B`, `#B7281D`, `#B8341F`. |
| On their own | `vhs` (green), `chalk` (dark green, hand lines), `mural` on full ochre, `shadow` (lamp glow) | These four are the only ones that stay distinct. |

Three more blunt points:

- **Nothing is bright.** There is no pink, no yellow field, no white UI, no saturated red. Both grids are brown and navy.
- **Most kits are a wrapper, not a medium.** `ALBUM.photo`, `CASE.polaroid`, `NEWS.clip`, `VHS.cam` and `LAB.xray` all take the same G-kit silhouette drawing and put a frame and a CSS filter on it. The drawing inside does not change. The new kits below change how figures are *constructed* (type as hero, chat bubbles, pixels, heat values, paper pieces).
- **Six subtitle boxes are the same box**: dark translucent rounded rectangle with pale text (`album`, `vhs`, `forensic`, `shadow`, `blueprint`, `mind`). Only the border differs.

### 1.2 Overused or stale, per page

**Page 2 (the 12 built reels plus ദൃശ്യം):**
- `mind` is on 5 of 13 (ദൃശ്യം, പരീക്ഷ, ഡിജിറ്റൽ അറസ്റ്റ്, കമന്റിൽ സിംഹം, ഉറക്കത്തിലെ വീഴ്ച). സത്യം #1 and #2 are both `mind`, back to back, which breaks its own rule. Hold it to 4 in the next 18.
- `vhs` twice in 7 reels, both "horror film" (മഞ്ഞുമ്മൽ, രോമാഞ്ചം). `newsprint` twice in 8 (ദാമു, IFFK).
- The spreadsheet's remaining plan uses `woodcut` ×3 and `mural` ×2. Both are heritage looks from the old history page. On a psychology page they pull the grid back toward page 1.
- Retire on page 2: `mural`, `palmleaf`. Limit: `woodcut` (one, for ഭ്രമയുഗം), `casefile` (scams only, and `chat` now does that better), `forensic` (keep off until `thermal` exists, then drop it).

**Page 1:**
- Last five posts: newsprint, vhs, forensic, mural, shadow. The built queue repeats them: `vhs` ×2 (Roopkund, Bhangarh), `newsprint` ×2 (Hanno, Akkamma), `mural` (Pathiramanal), `forensic` (Antikythera).
- `chalk` is weak here (only Zero Shadow Day fits, and that is out of season until April [VERIFY]).
- **The evidence does not yet say design is the lever.** The two hits (കോതായിമുക്ക് 65K, ഏഴിമല–മൂഷിക 68K) and മാടായിപ്പാറ (4.5K) all predate the design rotation of 20 Nov. Every template reel since then with settled numbers sits near 1.3–1.4K, including കതിവന്നൂർ വീരൻ in `mural` (1.3K, 2 shares). The 23–26 Nov reels may still be climbing. The topic is the lever; a design helps only if it puts the **town name** into the art. That is the brief for `ticket` and `theyyam` below.

### 1.3 Which template suits which page

| Template | Page 1 | Page 2 |
|---|---|---|
| `newsprint` | news finds, discoveries | meme/news, max 1 in 8 |
| `casefile` | crime, global mysteries | scams only |
| `album` | communities, people | nostalgia films, smell/memory |
| `vhs` | ghost legends | horror films, max 1 in 10 |
| `forensic` | "what was inside", science mysteries | retire once `thermal` is built |
| `mural` | heroes, legends | no |
| `shadow` | night legends | quiet everyday scenes |
| `blueprint` | forts, structures | body diagrams, never next to `mind` |
| `chalk` | rarely | everyday mind, study tips |
| `woodcut` | voyages, battles | one b/w film only |
| `palmleaf` | chronicles, proclamations | no |
| `mind` | no | signature, 8–10 per 30 |

---

## 2. Eight new templates

Shared rules for all eight:
- Canvas art stays in y 430–1200; scene title (HTML) y 272–400; subtitles (HTML) y 1250–1490; nothing readable outside y 300–1500.
- Malayalam on canvas: minimum 44 px, no letter-spacing, never set on a curve or per-glyph (it breaks conjuncts), always through `FX.fit`. Reveal Malayalam by word or by alpha, not by `slice(0, n)`.
- Each spec gives a `cine.DESIGNS` row and a `_design_css` row in the existing tuple order `(ink, accent, shadow, sub_bg, sub_ink, sub_extra, font, shade)`.
- Fonts registered today: Baloo, Chilanka, Noto, Inter, Hand (`pipeline/animate.py`). `fonts/Manjari-Bold.ttf` and `fonts/Gayathri-Bold.ttf` are in the repo but not registered; none of the eight needs them.

Summary:

| # | id | Medium | Page / pillar | Effort |
|---|---|---|---|---|
| 1 | `ticket` | letterpress ticket print | both: P1 place stories, P2 news/season | M |
| 2 | `chat` | phone-UI message story | P2: troll, scams, forwards | M |
| 3 | `theyyam` | screenprint festival poster in theyyam colours | P1: Kannur and Kasaragod legends | M |
| 4 | `matchbox` | matchbox / trade-label litho | P1: trade, objects, "famous name" stories | M |
| 5 | `comic` | comic panel grid | P2: movie dialogue, memes; P1: heists | L |
| 6 | `pixel` | 8-bit game | P2: everyday, news | M |
| 7 | `thermal` | thermal-camera false colour | P2: strange-but-true body science | M |
| 8 | `collage` | cut-paper stop motion | P2: season, everyday; P1 occasionally | M |

---

### 2.1 `ticket`: letterpress ticket print

**Suits:** both pages. Page 1: any story with two places in it (the ticket prints FROM and TO, so the town name is the art). Page 2: lottery, queue, festival and travel topics.

**Palette**

| Token | Hex | Use |
|---|---|---|
| `PINK` | `#F2B8C6` | ticket stock (the one fixed stock colour) |
| `DEEP` | `#E08FA6` | guilloche lines, tint blocks |
| `INK` | `#1E1B3A` | letterpress blue-black |
| `RED` | `#C8262C` | serial numbers, fare, accent word |
| `VIO` | `#5B3FA0` | rubber-stamp ink, pencil scribble |
| `STUB` | `#FFF6E0` | counterfoil, subtitle box |
| `BG` | `#12343B` | dark teal surround |

**Background and texture:** `BG` field with faint horizontal ribs (painted bus seat-back metal). One huge ticket fills x 70–1010, y 250–1520, so on the grid the reel is a pink rectangle. On the stock: a guilloche rosette (14 sine-modulated rings, `DEEP`, alpha 0.35), 500 fibre specks, a row of half-circle perforation notches on top and bottom edges cut with `destination-out`, a dashed tear line at y ≈ 1230. Letterpress fault: every line is printed twice, the ghost 3 px right and 2 px down at alpha 0.22.

**Figures:** "printer's stock cuts". A figure is the G-kit drawing shot through `FX.shot`, tinted to one ink and set in a double-ruled box no larger than 520×420, like a small block on a handbill. Type and numbers are the hero; figures are emblems.

**Typography:** Baloo 800 for stage names and the claim; Noto 600 for small print; `"DejaVu Sans Mono"` for serials, fares and dates; Chilanka in `VIO` for the conductor's pencil scribble; Inter 800 caps for the English line.

**Subtitle box (tear-off stub):**
```
"ticket": ("#1E1B3A", "#C8262C", "none", "#FFF6E0", "#1E1B3A",
           "border-radius:0; border-top:4px dashed #1E1B3A; border-bottom:4px dashed #1E1B3A;", "Baloo", "rgba(0,0,0,0)")
DESIGNS:  "ticket": {"overlay": "none", "grade": False, "leak": False, "grain": 0.05, "vignette": 0.12, "accent": "#C8262C", "letterbox": []}
```
Add `ticket` to `LIGHT_DESIGNS`.

**Signature hook motion, "punch and tear":** 0.0–0.5 s the ticket feeds up out of a slot; 0.5–0.9 s the red serial spins and stops; 1.5 s a punch hole snaps through the key word (a `destination-out` circle, a pink disc falls away); 2.0 s the ticket tears on the perforation and the lower stub swings 6° away, showing `?` on the layer beneath. The same tear, slower, is the truth or twist moment in scene 3.

**Cover layout:** y 300–360 ticket header rule with `No. 000417` in red and the series mark; y 400–760 headline set as the ticket's main lines, one word in red with the punch hole beside it; y 780–1240 one stock cut in a ruled box plus one very large number (a fare, a year, a count); y 1260–1340 the dashed tear line and stub carrying `കഥ → സത്യം: ?` (page 2) or the town pair `തലശ്ശേരി → മാഹി` (page 1).

**Storyboard: page 2, ബമ്പർ, "ഇത്തവണ എനിക്കടിക്കും" (gambler's fallacy), 17 Dec**
- **Hook:** the ticket feeds up, serial spins; ten small violet `അടിച്ചില്ല` stamps slam in a row at y 900; the eleventh box holds `?`; the punch goes through `ഉറപ്പ്`.
- **Scene 1 (കഥ):** stock cut of the Observer at a stall, a string of small tickets swaying above him; pencil scribble `ഇത്തവണ!`.
- **Scene 2 (കഥ):** ten torn stubs pile up on the left, each with its own serial; printed line `ഇനി എന്റെ ഊഴം`.
- **Scene 3 (സത്യം):** the tear. The stub beneath reads `ഓരോ നറുക്കും പുതിയത്`; a printed row of six coin discs, five filled and the sixth half-filled, with `50%` in red; share line.
- **Scene 4 (തെളിവ്):** a printed row of 26 black dots, `മോണ്ടെ കാർലോ, 1913` [VERIFY the count and year], bars of chips shrinking beside it; source line `Tversky & Kahneman, 1971` [VERIFY, as cited in the spreadsheet].
- **Scene 5:** two tickets side by side, `വിനോദം` and `നിക്ഷേപം?`; neutral on buying; question `ബമ്പർ അടിച്ചാൽ ആദ്യം എന്ത് ചെയ്യും?`

Page 1 use: `മാഹി: ഒരു ബസ് ടിക്കറ്റിൽ രണ്ട് രാജ്യം` (French until 1954 [VERIFY date]); stage list on the ticket is the route.

**Kit API**
```
TICKET.bg(g, t)
TICKET.stock(g, x, y, w, h, rot, inner, col, o)        // o: {key, perf:'tb'|'none', punches:[[x,y,r,tt]]}; inner(c, w, h) prints on the stock
TICKET.guilloche(c, cx, cy, r, n, col, a)
TICKET.print(c, s, x, y, size, p, o)                   // o: {font, weight, col, align, max}; alpha press-in with ghost
TICKET.serial(c, x, y, n, p, size)                     // spinning red number, settles on n
TICKET.cut(c, key, fn, x, y, w, h, col, r)             // one-ink stock cut in a ruled box
TICKET.rule(c, x, y, w, kind)                          // 'double' | 'dash' | 'thick'
TICKET.fare(c, label, value, x, y, p)                  // small-print label + big number
TICKET.tear(tt, dur)                                   // -> {dy, rot, gap} for the lower stock
TICKET.scribble(c, s, x, y, size, p, rot)              // violet pencil, Chilanka
// stamps: reuse CASE.stamp(g, s, x, y, rot, tt, size, TICKET.VIO)
```
**Effort: M.**

---

### 2.2 `chat`: phone-UI message story

**Suits:** page 2 troll, scam and forward topics. It must not look like `mind`'s phone frame, so it is **light, full-bleed, with no phone body**: the whole canvas is the chat.

**Palette**

| Token | Hex | Use |
|---|---|---|
| `WALL` | `#EEF1F4` | wallpaper |
| `DOODLE` | `#DDE3EA` | wallpaper marks (rings, plus signs, arcs) |
| `BAR` | `#1F2A37` | header band behind the scene title |
| `IN` | `#FFFFFF` | incoming bubble |
| `OUT` | `#F26B5B` | outgoing bubble (coral, white text) |
| `INK` | `#1B2430` | text on white |
| `MUTE` | `#7C8794` | times, "forwarded" label |
| `TEAL` | `#2BB3A3` | the truth side of a flipped bubble, read ticks |
| `WARN` | `#FFC83D` | highlight behind one scam phrase |
| `DEEP` | `#D9432F` | accent word in HTML text (darker coral, readable on white) |

**Background and texture:** flat `WALL`, 90 scattered doodle marks from `FX.NOISE`. No grain, no vignette. A `BAR` band at y 0–430; the HTML scene title sits on it in white, so the title *is* the chat header. A 4 px `TEAL` line under the band.

**Figures:** people are avatars: a blank disc with a head-and-shoulders bump, no features. The Observer's thumb enters from the bottom edge as one rounded shape. Anything outside the chat (the study in scene 4) is a "sticker": the G-kit drawing through `FX.paint` with a white 8 px outline and a soft shadow, pasted into the thread at a slight angle. Reactions are our own simple glyphs (heart, tick, exclamation), not any vendor's emoji.

**Typography:** Noto 600, 46 px for bubble text (UI voice); Baloo 800 for the title on the bar; Inter 600, 26 px for times and counters. At most three bubbles on screen at once, each at most three lines.

**Subtitle box (message input field):**
```
"chat": ("#FFFFFF", "#FFC83D", "none", "#FFFFFF", "#1B2430",
         "border-radius:44px; border:2px solid #DDE3EA; box-shadow:0 6px 18px rgba(31,42,55,.18);", "Noto", "rgba(0,0,0,0)")
SUBHI:   "chat": "#D9432F"
DESIGNS: "chat": {"overlay": "none", "grade": False, "leak": False, "grain": 0.0, "vignette": 0.0, "accent": "#D9432F", "letterbox": [], "push": 0.03, "pan": 0}
```
Add `chat` to `LIGHT_DESIGNS`. Title ink is white because it sits on `BAR`; the accent word on the bar is `WARN`.

**Signature hook motion, "long-press flip":** 0.0–0.5 s typing dots bounce; 0.5 s the message pops in with overshoot; 0.9 s a `ഫോർവേഡ് ×3` counter ticks; 1.6 s the thumb long-presses the bubble (it dims and shrinks to 0.97), and the bubble flips on its vertical axis to a `TEAL` back face reading `സത്യം?`. In scene 3 the same flip shows the actual truth line. This is the template's version of the knot becoming a line.

**Cover layout:** y 250–430 `BAR` with a small avatar disc at x 110 and the brand name; y 400–760 headline (HTML, white, on a taller bar that runs to y 780 for the cover frame); y 800–1240 two incoming bubbles and one outgoing, the last half-flipped to teal; y 1260–1340 a typing bubble holding `സത്യം: ?`.

**Storyboard: page 2, ടാസ്ക് തട്ടിപ്പ് (foot-in-the-door and sunk cost), 10 Dec**
- **Hook:** typing dots; incoming `ടാസ്ക് കഴിഞ്ഞു. ₹500 അയച്ചു` with a teal `+₹500` card; at 1.6 s an outgoing `−₹5,00,000` card slides up and the first bubble flips to `സത്യം?`.
- **Scene 1 (കഥ):** unknown-number avatar; bubbles `വീട്ടിലിരുന്ന് ജോലി` and `ഒരു ലൈക്ക് = ₹50`; the thumb taps, a like counter ticks to 10. Small tag `ഉദാഹരണം` on every amount.
- **Scene 2 (കഥ):** `പ്രീമിയം ടാസ്ക്: ₹5,000 ഇടൂ, ₹8,000 കിട്ടും`; outgoing payment cards stack up, 5,000 → 50,000 → 2 ലക്ഷം; last incoming: `പിൻവലിക്കാൻ ഒരു തവണ കൂടി`.
- **Scene 3 (സത്യം):** long-press on the first `+₹500` bubble: it flips to `ചൂണ്ട: ചെറിയ "ശരി" വലിയ "ശരി"യിലേക്ക്`; the stack flips to `പോയത് തിരിച്ചുപിടിക്കാൻ വീണ്ടും ഇടുന്നു`; share line as a bubble, `ഫാമിലി ഗ്രൂപ്പിൽ ഇടൂ`.
- **Scene 4 (തെളിവ്):** the thread scrolls up; a sticker diagram: a house with a small sign, then the same house with a huge sign, two bars of different height; pinned-message strip `Freedman & Fraser, 1966`.
- **Scene 5:** pinned safety card: `1930` at 220 px, `cybercrime.gov.in`, chips `കട്ട് ചെയ്യൂ · വിളിക്കൂ · പറയൂ`; the thumb presses a generic block button and the scam thread greys out. Never blame the person who paid.

**Kit API**
```
CHAT.wall(g, t)
CHAT.bar(g, y1)                                        // header band to y1 (430 in scenes, 780 on the cover frame)
CHAT.avatar(g, x, y, r, col)
CHAT.bubble(g, s, x, y, w, side, p, o)                 // side 'in'|'out'; o: {size, fwd, time, ticks, flip, back, hi}; returns height
CHAT.typing(g, x, y, t, side)
CHAT.thumb(g, x, y, press)
CHAT.counter(g, label, n, x, y)
CHAT.pay(g, amount, x, y, w, kind, p)                  // 'in' teal | 'out' coral; a plain card, no payment-app marks
CHAT.sticker(g, key, fn, x, y, s, rot)
CHAT.notif(g, sender, s, y, p)                         // banner sliding down from the bar
CHAT.pinned(g, s, y, p)                                // source strip
CHAT.safety(g, p)                                      // the fixed 1930 card
CHAT.wrap(g, s, max)                                   // word wrap for Malayalam (split on spaces only)
```
**Effort: M** (Malayalam word wrap and bubble heights are most of it).

---

### 2.3 `theyyam`: festival-notice screenprint in theyyam colours

**Suits:** page 1, Kannur and Kasaragod legends, the തെയ്യക്കഥകൾ series, kavu and madappura stories. This is the look for the page's best-sharing pillar. Not for page 2.

It must not read as `mural`. Differences: saturated red field instead of ochre wall; no outlines at all; strict left-right symmetry; white dot ornament; visible print misregistration.

**Palette**

| Token | Hex | Use |
|---|---|---|
| `RED` | `#D4201A` | field |
| `ORG` | `#F26A1B` | background rays, second ray ring |
| `YEL` | `#F7C531` | accent, town name, flame, bronze objects |
| `WHT` | `#FFF4E0` | rice-paste dots, headline |
| `BLK` | `#150A07` | every figure, bands |
| `GRN` | `#1E6B3A` | tender-leaf detail, under 5% of the frame |

**Background and texture:** `RED` field; 28 `ORG` wedge rays from the scene's focal point, turning at 0.02 rad/s; a soft `BLK` radial edge darkening; ink mottle (`FX.grainDots` in `BLK` 0.16 and `WHT` 0.10). A fringe of thin pointed leaf strips (kuruthola) hangs from y 250 and rises from y 1500, swaying. Cine overlay: embers in `YEL`.

**Figures:** flat `BLK` silhouettes. Ornament is rows of small `WHT` dots clipped to the silhouette (`source-atop`) at chest, waist and wrist height. Behind each figure sits a 4 px offset orange ghost of the same shape (misregistered second plate). The performer is shown **only from behind or as a headdress outline**: the mudi is a fan of alternating `YEL` and `WHT` wedges with a dot ring, and the place where a face would be is a plain black disc. No face writing, no deity-specific pattern, ever.

**Typography:** Baloo 800, `WHT`, with a hard 6 px `BLK` offset shadow and no blur (poster lettering); town name in `YEL`; Chilanka for the `എന്നാണ് വിശ്വാസം` tag; Inter 800 caps in `YEL` for the English line.

**Subtitle box (black band, turmeric rules):**
```
"theyyam": ("#FFF4E0", "#F7C531", "6px 6px 0 #150A07", "#150A07", "#FFF4E0",
            "border-radius:0; border-top:6px solid #F7C531; border-bottom:6px solid #F7C531;", "Baloo", None)
DESIGNS:   "theyyam": {"overlay": "embers", "color": "#F7C531", "grade": False, "leak": False, "grain": 0.05, "vignette": 0.30, "accent": "#F7C531", "letterbox": []}
```

**Signature hook motion, "മുടി വിരിയൽ" (the headdress opens):** 0.0–0.6 s the fan opens wedge by wedge from the centre out to both sides; 0.9 s a drum-hit camera kick; 1.6 s the black figure plate slams in with a one-frame 8 px misregistration that settles to 4 px; torches at the fan tips light one after another. The state changes at 0.6 s and 1.6 s, as the hook rules ask.

**Cover layout:** fringe at y 250–300; y 300–360 black band with `തെയ്യക്കഥകൾ #2 · കണ്ണൂർ` in `YEL`; y 400–760 headline; y 780–1300 the fan and a back-view figure, dead centre; y 1340–1460 black band with the English line. The symmetric fan is the grid signature.

**Storyboard: page 1, പറശ്ശിനിക്കടവ് മുത്തപ്പൻ and the dogs (2 Dec)**. Every claim below is [VERIFY] before scripting; legend parts carry the `എന്നാണ് വിശ്വാസം` tag.
- **Hook:** red field, the fan opens over a back-view figure; at 0.9 s a dog silhouette trots in and sits in front of it; headline `ഈ മടപ്പുരയിൽ നായയ്ക്ക് ആദ്യം പ്രസാദം?` with `പറശ്ശിനിക്കടവ്` in yellow.
- **Scene 1:** the automatic relief map: Parassinikadavu on the Valapattanam river, road from Kannur (`"look": "night"`).
- **Scene 2:** the legend: a hunter figure with a bow walking, two dogs at heel, dot bands on all three; the leaf fringe sways; legend tag.
- **Scene 3 (twist, share line):** the gate with two dog figures on plinths in `YEL` (bronze); live dogs lie among the visitors' silhouettes and nobody moves them; `നായപ്രേമികൾക്ക് അയക്കൂ`.
- **Scene 4:** a leaf with the offerings as flat `WHT`/`YEL` icons; a row of mixed silhouettes walks in under one fringe: `എല്ലാവർക്കും പ്രവേശനം`.
- **Scene 5:** the field shifts to turmeric yellow for the payoff; back-view figure and a dog side by side; question `നിങ്ങളുടെ നാട്ടിലെ മടപ്പുര എവിടെ?`

**Kit API**
```
THEY.bg(g, t, focus, spin, field)                      // field defaults to RED; YEL for the payoff scene
THEY.rays(g, cx, cy, r0, r1, n, p, cols, rot, a, span) // wedge fan; p opens from the centre outward
THEY.mudi(g, cx, cy, r, p, t, span)                    // headdress fan + dot rings + blank disc
THEY.dots(g, cx, cy, r, n, span, p, col, size)
THEY.figure(g, key, fn, o)                             // o: {bands:[y...], mis:4}; black plate + orange ghost + dot rows
THEY.fringe(g, y, dir, t, col)
THEY.torch(g, x, y, s, t)
THEY.band(g, y, h, label, p)
THEY.title(g, s, x, y, size, col)                      // hard-shadow canvas lettering
THEY.tag(g, s, x, y, p)                                // Chilanka legend tag
```
**Effort: M.**

---

### 2.4 `matchbox`: matchbox and trade-label litho

**Suits:** page 1 stories about a thing with a famous name: trade goods, crafts, ports, "firsts". The reel is a set of five collectable labels, which suits list-shaped facts. Occasional page 2 meme use.

**Palette**

| Token | Hex | Use |
|---|---|---|
| `YEL` | `#F6C62B` | sunburst field |
| `RED` | `#D8321F` | ribbons, border |
| `BLU` | `#1D3C8F` | second plate, inner border |
| `CRM` | `#F3E6C4` | label paper |
| `BLK` | `#1A1410` | keyline, type |
| `GRN` | `#2E8B57` | leaves only |
| `TBL` | `#3A2A22` | table behind the label |

**Background and texture:** `TBL` table with a few loose matchsticks. One label per scene at x 90–990, y 420–1220: `CRM` paper, a double border (`RED` outside, `BLU` inside), a `YEL` sunburst of 24 rays behind the emblem, a swallow-tail ribbon across the top and a number badge (`No. 3` = scene number) at the bottom. Coarse litho faults: each colour plate is offset 3–4 px from the keyline, edges are worn with `destination-out` specks, heavy grain 0.06.

**Figures:** one centred emblem per label: the G-kit drawing through `FX.paint` with flat fills and a 7 px `BLK` keyline, symmetrical where possible, at least 45% of the label height. People appear as small emblem figures, never as portraits.

**Typography:** Baloo 800 on straight ribbons for Malayalam. Only Latin letters and numerals go on an arc (`MATCH.arcText`); Malayalam is never curved. Inter 800 caps for the arc line.

**Subtitle box:**
```
"matchbox": ("#1A1410", "#D8321F", "none", "#F3E6C4", "#1A1410",
             "border:5px solid #1D3C8F; border-radius:10px; box-shadow:6px 6px 0 #D8321F;", "Baloo", "rgba(0,0,0,0)")
DESIGNS:    "matchbox": {"overlay": "none", "grade": False, "leak": False, "grain": 0.06, "vignette": 0.22, "accent": "#D8321F", "letterbox": []}
```
Add to `LIGHT_DESIGNS`. The scene title sits on the cream upper field of the label.

**Signature hook motion, "strike":** the frame starts dim (label at 30% brightness). 0.0–0.4 s a matchstick drags across a striker strip at y 1180; a spark, then a flame; 0.4–0.9 s colour floods the label outward from the flame. Scene changes are the box tray sliding sideways to show the next label.

**Cover layout:** the label is the cover: ribbon y 320–400 with the series name; headline on cream y 420–760; emblem on sunburst y 780–1240; bottom ribbon y 1280–1400 with the number badge and the town name.

**Storyboard: page 1, "Tellicherry" pepper (10 Dec)**. [VERIFY all: the grade is a size grade named after the port; the sieve size; the GI status of Malabar pepper.]
- **Hook:** dark; the match strikes and lights label 1: a pepper vine on the sunburst, `TELLICHERRY` on the arc; headline `ലോകം വാങ്ങുന്ന "തലശ്ശേരി" കുരുമുളക് തലശ്ശേരിയിലേതല്ല?`
- **Scene 1:** the relief map: Thalassery.
- **Scene 2:** tray slides; label 2: an uru at a pier, sacks marked with a plain stencil; ribbon `പേര് തുറമുഖത്തിന്റേത്`.
- **Scene 3 (twist, share line):** label 3: a sieve; small berries fall through, large ones stay; badge with the sieve size; ribbon `"തലശ്ശേരി" = വലുപ്പം`.
- **Scene 4:** label 4: a globe and a pepper mill; ribbon with the grade's full name in Latin on the arc.
- **Scene 5:** label 5: an open palm with berries; ribbon `നിങ്ങളുടെ വീട്ടിലെ കുരുമുളക് എവിടുന്ന്?`; the tray closes back to the dark box so the reel loops.

**Kit API**
```
MATCH.table(g, t)
MATCH.label(g, x, y, w, h, o, inner)                   // o: {dim, rot, wear}; inner(g) draws clipped label content
MATCH.border(g, x, y, w, h, kind)
MATCH.burst(g, cx, cy, r, n, cols, rot)
MATCH.emblem(g, key, fn, fill, o)                      // o: {key:7, mis:[3,2], second:{fn, fill}}
MATCH.ribbon(g, s, x, y, w, col, p)                    // straight swallow-tail banner, Malayalam safe
MATCH.arcText(g, latin, cx, cy, r, a0)                 // Latin and digits only
MATCH.badge(g, n, x, y, r)
MATCH.strike(g, tt)                                    // -> {x, y, lit} flame position and 0..1 light level
MATCH.flame(g, x, y, s, t)
MATCH.tray(g, k, drawA, drawB)                         // slide transition between two labels
```
**Effort: M.**

---

### 2.5 `comic`: panel grid

**Suits:** page 2 movie-dialogue and meme topics (the line goes in a balloon, the actor never appears); page 1 heists and chases.

**Palette:** `PAPER #FBF3DC`, `INK #111111`, `CYAN #19A7CE`, `MAG #E8336D`, `YEL #FFD23F`, `DEEPMAG #C01F55` (highlight word on yellow).

**Background and texture:** paper with 28 px gutters. Panels live in y 420–1220 and come from named layouts: `stack2` (two wide), `L3` (one tall, two small), `wide+inset`, `splash` (one panel, used for the truth scene). Panel borders are 6 px ink with a slight wobble. Mid-tones are Ben-Day dots made with the existing `FX.halftone` in `CYAN` or `MAG` (dot 9). Solid black shadow shapes, speed lines, jagged bursts.

**Figures:** `FX.paint` flat fill with a 6 px ink keyline, then a dot layer over the shadow half. Faces stay blank. A character is identified only by a caption box with the character's name; no costume, hair or pose that points at an actor.

**Typography:** Baloo 800 sentence case in balloons; Baloo 700 in yellow caption boxes; sound words (`ഠിം!`, `ധും!`) in Baloo 800 with an ink stroke, skewed with a canvas transform (the whole word, not per glyph).

**Subtitle box (caption box):**
```
"comic": ("#111111", "#E8336D", "none", "#FFD23F", "#111111",
          "border:5px solid #111; border-radius:0; box-shadow:8px 8px 0 #111;", "Baloo", "rgba(0,0,0,0)")
SUBHI:   "comic": "#C01F55"
DESIGNS: "comic": {"overlay": "none", "grade": False, "leak": False, "grain": 0.03, "vignette": 0.05, "accent": "#E8336D", "letterbox": []}
```
Add to `LIGHT_DESIGNS`.

**Signature hook motion, "panel slam":** three panels drop in on the three spoken beats (0.0, 0.8, 1.6 s), each with a four-frame overshoot; the last panel's `?` burst breaks out past its own border. Truth scene: the gutters close and three panels merge into one splash.

**Cover layout:** y 300–360 issue strip (`സത്യം #19 · ലക്കം`); y 400–700 headline in a yellow caption box tilted −2°; y 740–1240 one splash panel with a burst; pillar chip as a corner tab.

**Storyboard: page 2, "ഇപ്പ ശര്യാക്കിത്തരാം" (illusion of explanatory depth), 14 Dec**. [VERIFY the exact wording of the line.]
- **Hook:** panel 1: a shout balloon `ഇപ്പ ശര്യാക്കിത്തരാം!` over a spanner; panel 2: a plain road-roller shape with a `?`; panel 3: burst `പക്ഷേ എങ്ങനെ?`
- **Scene 1 (കഥ):** wide panel, caption `വെള്ളാനകളുടെ നാട് · 1988`; a blank mechanic silhouette in a confident stance, speed lines behind.
- **Scene 2 (കഥ):** two panels: the Observer beside a bicycle with thought balloon `എനിക്കറിയാം`; then asked to explain: sweat drops, balloon `അത്... പിന്നെ...`
- **Scene 3 (സത്യം):** splash: a seven-step confidence meter drops from 6 to 3; caption `അറിയാമെന്ന തോന്നൽ അറിവല്ല`; share line.
- **Scene 4 (തെളിവ്):** three small panels: rate, explain, rate again (lower bar); caption `Rozenblit & Keil, 2002`.
- **Scene 5:** one panel, a zip drawn large with `?` bursts; balloon `സിപ്പ് എങ്ങനെ പ്രവർത്തിക്കുന്നു? വിശദീകരിക്കാമോ?`

**Kit API**
```
COMIC.page(g, t)
COMIC.layout(name)                                     // -> [[x,y,w,h], ...]
COMIC.panel(g, key, rect, fn, o)                       // o: {tilt, drop:tt, bg}; clipped scene + ink border
COMIC.inked(g, key, fn, fill, lw)
COMIC.dots(g, key, fn, rect, col, dot)                 // FX.halftone in colour
COMIC.balloon(g, s, x, y, w, tail, p, kind)            // 'say' | 'think' | 'shout'
COMIC.caption(g, s, x, y, w, p)
COMIC.sfx(g, s, x, y, size, rot, tt, col)
COMIC.burst(g, x, y, r, n, tt, col)
COMIC.speed(g, cx, cy, r0, r1, n, a)
COMIC.merge(g, k, rects)                               // gutters close into a splash
```
**Effort: L** (layouts, balloons with Malayalam wrap, per-panel clipping).

---

### 2.6 `pixel`: 8-bit game

**Suits:** page 2 everyday and news topics that have a goal, a failure and a rule: traffic, habits, exams, scams as "levels".

**Palette (fixed, our own ten):** `NIGHT #12122A`, `INDIGO #2B2F77`, `TEAL #1FA39A`, `LEAF #3FBF5A`, `SAND #F2D98C`, `BRICK #C8553D`, `PINK #FF6FA3`, `SUN #FFD23F`, `SKY #58C4F6`, `WHITE #F6F1E7`.

**Background and texture:** the scene is drawn at full size in palette colours, shot into a 135×240 buffer (`FX.shot(key, fn, [0,0,W,H], 0.125)`) and drawn back with `imageSmoothingEnabled = false`, so every pixel is 8×8. Existing G-kit drawings become sprites for free. Tiled ground and sky bands; whole-pixel scrolling only.

**Figures:** chunky sprites. Motion is stepped: time is quantised to 8 fps (`PIX.step(t)`), positions snap to 8 px (`PIX.snap`), walks are a two-frame bob. That stepped timing is the medium; smooth easing would break it.

**Typography:** Malayalam is **never pixelated** (conjuncts die at this size). It is drawn at full resolution in a dialog box with a stepped 8 px border, Baloo 800. Score digits and Latin words go through the low-res buffer so they are true pixels.

**Subtitle box (dialog box):**
```
"pixel": ("#F6F1E7", "#FFD23F", "4px 4px 0 #12122A", "#12122A", "#F6F1E7",
          "border-radius:0; border:6px solid #F6F1E7; box-shadow:0 0 0 6px #12122A;", "Baloo", None)
DESIGNS: "pixel": {"overlay": "none", "grade": False, "leak": False, "grain": 0.0, "vignette": 0.0, "accent": "#FFD23F", "letterbox": [], "push": 0.0, "pan": 0, "kick": 0}
```
Camera push, pan and kick must be zero: sub-pixel camera moves make the 8 px grid shimmer. [VERIFY that `kick: 0` is honoured on the twist scene; `config_for` hard-codes 0.10 there.]

**Signature hook motion, "GAME OVER?":** a blinking start chip (2 Hz); the sprite runs in on stepped frames; it hits the obstacle at 1.2 s; the screen shakes in whole 8 px steps; the dialog box shows the hook question. The truth scene is "debug view": hit boxes, timers and hidden counters appear over the game.

**Cover layout:** y 300–360 HUD strip (three hearts, `സത്യം #25`); y 400–760 headline in a dialog box; y 780–1240 the pixel scene; y 1280–1340 a `▶ START` chip.

**Storyboard: page 2, "ലെയ്ൻ മാറി. അപ്പോൾ പഴയ ലെയ്ൻ ഓടി." (20 Dec)**
- **Hook:** top-down two-lane road scrolling in steps; our yellow car is stuck, the other lane flows; the car hops lanes; the old lane starts moving at once; dialog `ലെയ്ൻ മാറി. അപ്പോൾ പഴയ ലെയ്ൻ ഓടി.`
- **Scene 1 (കഥ):** HUD `LEVEL 1`, dialog `ബ്ലോക്ക്`; the Observer sprite at the wheel; hearts drain as a patience meter.
- **Scene 2 (കഥ):** a bright counter `നമ്മളെ കടന്നവ: 12` ticks slowly; a dim counter `നമ്മൾ കടന്നവ: 12` ticks fast and is easy to miss.
- **Scene 3 (സത്യം):** debug view: two time bars, "being overtaken" long, "overtaking" short, though both counts are 12; share line.
- **Scene 4 (തെളിവ്):** two lanes as progress bars reaching the finish line together; dialog `Redelmeier & Tibshirani, 1999`.
- **Scene 5:** `CONTINUE?` chip with dialog `ലെയ്നിൽ തുടരൂ`; question `നിങ്ങൾ ലെയ്ൻ മാറ്റുന്ന ആളാണോ?`

**Kit API**
```
PIX.frame(g, key, fn, o)                               // o: {px:8, r:[0,0,W,H]}; fn draws full-size, comes back as pixels
PIX.step(t, fps)                                       // quantised time
PIX.snap(v, px)
PIX.tiles(x, kind, scroll)                             // 'road' | 'grass' | 'floor' | 'sky', drawn inside fn
PIX.sprite(x, name, px, py, frame, flip)               // small built-in bitmaps: 'obs', 'car', 'phone', 'heart', 'coin'
PIX.dialog(g, s, x, y, w, p)                           // full-resolution Malayalam in a stepped box
PIX.hud(g, o)                                          // o: {hearts, score, level}
PIX.shake(tt)                                          // -> [dx, dy] in 8 px steps
PIX.blink(t, hz)
PIX.debug(g, rects, p)                                 // truth overlay
```
**Effort: M** (the pixel filter is small; the sprite bitmaps and dialog box are the work).

---

### 2.7 `thermal`: thermal-camera false colour

**Suits:** page 2 strange-but-true topics about the body: heat, pain, chills, blushing, sleep. It replaces `forensic` on page 2. It is naturally faceless, which fits the likeness rule.

**Palette (heat ramp, cold to hot):** `#0B0221`, `#3B0F70`, `#8C2981`, `#DE4968`, `#FE9F6D`, `#FCFDBF`. Interface: `#FFFFFF` crosshair and readouts.

**Background and texture:** the author draws the scene in grey "heat values" (`THERM.heat(0..1)` returns a grey fill; white is hot). The kit shoots it at 0.25 scale (270×480), blurs it 3 px so heat bleeds, maps luminance through a 256-step lookup of the ramp with `getImageData` / `putImageData`, and scales it up smoothed. On top: a ramp scale bar at x 960–990, y 500–1100 with three tick labels, a centre crosshair with a spot reading, light sensor noise.

**Figures:** bodies are nested shapes at different heat values (hot head and chest, cooler limbs, cold objects in deep purple). Because heat is the only information, a figure cannot carry a likeness.

**Typography:** Baloo 800 white; readouts in `"DejaVu Sans Mono"`; labels Noto 600 in white pills.

**Subtitle box (ramp underline):**
```
"thermal": ("#FFFFFF", "#FE9F6D", "0 3px 18px rgba(11,2,33,.9)", "rgba(11,2,33,.88)", "#FFFFFF",
            "border-radius:0; border-bottom:8px solid; border-image:linear-gradient(90deg,#3B0F70,#DE4968,#FCFDBF) 1;", "Baloo", None)
DESIGNS:   "thermal": {"overlay": "none", "grade": False, "leak": False, "grain": 0.04, "vignette": 0.30, "accent": "#FE9F6D", "letterbox": []}
```

**Signature hook motion, "the wipe":** 0.0–0.5 s a plain flat view (navy shapes on grey); a vertical scan bar crosses left to right in 0.4 s and everything behind it turns thermal; the spot reading races and settles. The hook's surprise is a colour: the thing that should be hot is not, or the reverse. In scene 3 the view wipes back to plain for the labelled diagram.

**Cover layout:** y 300–360 strip with the series mark and a small ramp bar; y 400–760 headline, one word in `#FE9F6D`; y 780–1240 a thermal figure with crosshair and temperature chip; scale bar on the right edge.

**Storyboard: page 2, "എരിവ് ചൂടല്ല" (capsaicin and TRPV1), 15 Dec**
- **Hook:** plain view: the Observer bites a small chilli; the wipe; the mouth does not glow, the spot reading stays put; headline `നാവ് കത്തി. തീ എവിടെ?`
- **Scene 1 (കഥ):** thermal kitchen: stove flame white-hot, the pot orange, the chilli on its plate cold purple.
- **Scene 2 (കഥ):** the bite: cool blue sweat dots on the forehead, a hand fanning; the reading still does not move.
- **Scene 3 (സത്യം):** wipe back to plain: a head contour, the tongue with a small door glyph; two keys, `ചൂട്` and `കാപ്സെയ്സിൻ`, open the same door; chip `സത്യം: ഒരേ സെൻസർ, രണ്ട് താക്കോൽ`; share line.
- **Scene 4 (തെളിവ്):** the signal runs as a line to one brain region that lights `പൊള്ളൽ!`; source `Caterina et al., 1997, Nature`; chip `2021 നൊബേൽ`.
- **Scene 5:** thermal again: two cold glasses, water and milk, no advice claimed [VERIFY before saying which helps]; question `നിങ്ങളുടെ എരിവ് ലെവൽ? 1 മുതൽ 10 വരെ`.

**Kit API**
```
THERM.view(g, key, fn, t, o)                           // o: {wipe:1, blur:3, noise:0.04}; fn draws heat values
THERM.heat(v)                                          // 0..1 -> grey fillStyle
THERM.ramp(v)                                          // 0..1 -> ramp colour, for vector overlays
THERM.body(x, cx, cy, s, pose, core)                   // nested-heat figure, drawn inside fn
THERM.wipe(g, key, fnPlain, fnHeat, k, t)              // scan-bar transition
THERM.scale(g, x, y, h, lo, hi)
THERM.spot(g, x, y, temp, p, label)
THERM.pill(g, s, x, y)
```
**Effort: M.**

---

### 2.8 `collage`: cut-paper stop motion

**Suits:** page 2 seasonal and domestic topics (it is the warmest and most handmade look); page 1 occasionally for children's-story legends.

**Palette:** board `#F4EDE0`; papers `TERRA #D9543A`, `MUSTARD #E9B63B`, `TEAL #1F7A7A`, `NAVY #253A5E`, `PINK #F2A7B5`, `LEAF #5E9B5A`, `BLACK #1C1A19`; shadow `rgba(40,25,10,0.28)`.

**Background and texture:** off-white board with fibre grain. Every shape is a separate paper piece with a hard offset shadow (6, 10). Torn pieces get a 5 px pale rim; scissor-cut pieces have straight, slightly faceted edges. Fibre specks are clipped to each piece. Corners are held by strips of masking tape. **Stop-motion timing:** positions update at 12 fps and each piece jitters ±2 px and ±0.5° every second frame.

**Figures:** paper dolls built from separate pieces (head, shirt, mundu, arms) with small round brads at the shoulders, so arms rotate from the joint. Faces are blank paper.

**Typography:** Baloo 800, one word per paper strip, strips in alternating paper colours at small angles (one font throughout, so Malayalam stays intact); Chilanka for pencil notes on the board.

**Subtitle box (taped strip):**
```
"collage": ("#1C1A19", "#D9543A", "none", "#FFFDF6", "#1C1A19",
            "border-radius:3px; transform:rotate(-0.8deg); box-shadow:6px 10px 0 rgba(40,25,10,.22); border-top:14px solid rgba(233,182,59,.75);", "Baloo", "rgba(0,0,0,0)")
DESIGNS:   "collage": {"overlay": "none", "grade": False, "leak": False, "grain": 0.06, "vignette": 0.10, "accent": "#D9543A", "letterbox": [], "push": 0.04}
```
Add to `LIGHT_DESIGNS`.

**Signature hook motion, "place and peel":** pieces drop in from above on the spoken beats, each landing with a small bounce while its shadow tightens; on beat three the corner of the top piece curls back (a growing triangle with a paler underside) and shows a `?` piece beneath. The peel, completed, is the truth reveal in scene 3.

**Cover layout:** y 300–360 a taped strip with the brand; y 400–760 headline as word strips; y 780–1240 the doll and one object; y 1260–1340 a taped label `കഥ → സത്യം: ?`.

**Storyboard: page 2, ക്രിസ്മസ് സമ്മാനം (prosocial spending), 24 Dec**
- **Hook:** two paper notes drop; one slides to the doll's pocket, one to a wrapped box; a corner peels to `?`; headline `നൂറു രൂപ തനിക്ക്. നൂറു രൂപ മറ്റൊരാൾക്ക്. സന്തോഷം എവിടെ?`
- **Scene 1 (കഥ):** a paper star lantern and a doorway are placed piece by piece; the doll holds an envelope.
- **Scene 2 (കഥ):** two paths laid out in strips: a shopping bag for oneself, a wrapped gift for someone else.
- **Scene 3 (സത്യം):** the peel: under `മറ്റൊരാൾക്ക്` a larger sun piece than under `തനിക്ക്`; share line.
- **Scene 4 (തെളിവ്):** two paper bars, morning and evening; pencil note `Dunn, Aknin & Norton, 2008`; second note `2020-ലെ ആവർത്തനം: ചെറുത്, പക്ഷേ ഉണ്ട്`. Voice says `ഒരു ചെറിയ തുക`, not ₹100, for the study itself.
- **Scene 5:** two paper hands pass the box; question `ഈ ക്രിസ്മസിന് നിങ്ങൾ ആർക്കാണ് കൊടുക്കുന്നത്?`

**Kit API**
```
COLL.board(g, t)
COLL.piece(g, key, fn, col, o)                         // o: {x, y, rot, torn, sh:[6,10], lift, i}
COLL.poly(g, pts, col, o)
COLL.strip(g, s, x, y, col, rot, p)                    // one word on a paper strip
COLL.tape(g, x, y, w, rot)
COLL.doll(g, x, y, s, pose, cols, t)
COLL.drop(tt)                                          // -> {dy, lift} landing curve
COLL.peel(g, x, y, w, h, k, under)                     // corner curl; under(g) draws what is beneath
COLL.step(t, fps)                                      // 12 fps time
COLL.jit(i, t)                                         // -> [dx, dy, rot] hand jitter
```
**Effort: M.**

---

### 2.9 Bench (not specified further)

- `led`: temple-festival LED board (lit dots on black, chasing border lights). Good for page 1 festival legends. Too close to `pixel` on the grid to build both now.
- `crt`: 1980s television set (wooden cabinet, rounded tube, colour bars). Too close to `vhs`; build only if `vhs` is retired.
- `poster`: hand-painted film-poster lettering. Strong for the movie pillar but the highest copying risk, and it needs Gayathri or Manjari registered in `animate.py`.
- `kalam`: powder floor drawing. A real Kerala medium, but it is ritual art; not recommended.

### 2.10 Look-alike pairs to add to the rotation rule

Never adjacent: `ticket`–`newsprint`, `comic`–`newsprint`, `comic`–`woodcut`, `theyyam`–`mural`, `theyyam`–`matchbox`, `thermal`–`forensic`, `chat`–`mind`, `pixel`–`led`, `collage`–`mural`.

### 2.11 Wiring checklist for each new kit

1. Kit IIFE in `pipeline/lib/designs.js`.
2. Row in `cine.DESIGNS`; add light ones to `LIGHT_DESIGNS`.
3. Row in `_design_css`, and `SUBHI` where given.
4. Row in `docs/VIDEO-ONLY-GUIDE.md` section 6 with the job to copy.
5. One reference job, previewed with `tools/preview.py`, before any calendar slot depends on it.

---

## 3. Rotation calendars

### 3.1 Page 2, 9–26 Dec (18 slots, 7:00 AM)

Assumption: the 12 built reels run 27 Nov–8 Dec in spreadsheet order, so the last five are പ്രേമം `album` (4), കമന്റിൽ സിംഹം `mind` (5), IFFK `newsprint` (6), രോമാഞ്ചം `vhs` (7), ഉറക്കത്തിലെ വീഴ്ച `mind` (8). [VERIFY the actual posting order; the adjacency checks below depend on it.]

New templates are marked *. Each has a fallback in case the kit is not ready; if a fallback is used, re-check the five-reel window around it.

| Date | Day | Pillar | Topic | Template | Fallback | Source |
|---|---|---|---|---|---|---|
| 9 Dec | Wed | ട്രോൾ | ഗഫൂർ കാ ദോസ്ത്: പഴയ ഡയലോഗ് ഇന്നും ജീവിക്കുന്നത് (claim as corrected in ideas.md) | `woodcut` | | sheet 13 |
| 10 Dec | Thu | വാർത്ത | ടാസ്ക് തട്ടിപ്പ് | `chat`* | `casefile` | sheet 17 |
| 11 Dec | Fri | വിചിത്രം | പാട്ട് കേൾക്കുമ്പോൾ രോമാഞ്ചം (frisson) | `blueprint` | | sheet 14 |
| 12 Dec | Sat | മനസ്സ് | വാങ്ങാൻ തീരുമാനിച്ചു. ഇപ്പോൾ എല്ലായിടത്തും അത്. | `shadow` | | sheet 19 |
| 13 Dec | Sun | സിനിമ | സ്ഫടികം: മാർക്കിനനുസരിച്ചുള്ള സ്നേഹം (exam season) | `mind` | | spare 1 |
| 14 Dec | Mon | ട്രോൾ | "ഇപ്പ ശര്യാക്കിത്തരാം": അറിയാം എന്ന തോന്നൽ | `comic`* | `chalk` | spare 5 |
| 15 Dec | Tue | വിചിത്രം | എരിവ് ചൂടല്ല | `thermal`* | `blueprint` | spare 15 |
| 16 Dec | Wed | സിനിമ | കുമ്പളങ്ങി നൈറ്റ്സ്: കേൾക്കാൻ ഒരാൾ (14416) | `mind` | | sheet 18 |
| 17 Dec | Thu | വാർത്ത | ബമ്പർ: "ഇത്തവണ എനിക്കടിക്കും" | `ticket`* | `newsprint` | sheet 22 |
| 18 Dec | Fri | മനസ്സ് | ആ പാട്ട് തലയിൽ നിന്ന് പോകുന്നില്ല (a tape that keeps rewinding) | `vhs` | | sheet 16 |
| 19 Dec | Sat | സിനിമ | ഭ്രമയുഗം: എന്തുകൊണ്ട് ഓട്ടം നിർത്തി? | `woodcut` | | sheet 21 |
| 20 Dec | Sun | വാർത്ത | ബ്ലോക്ക്: മറ്റേ ലെയ്ൻ എപ്പോഴും വേഗം | `pixel`* | `chalk` | spare 10 |
| 21 Dec | Mon | മനസ്സ് | ദേജാ വു | `mind` | | sheet 23 |
| 22 Dec | Tue | വിചിത്രം | അമ്മയുടെ കറിയുടെ മണം (pravasi homecoming week) | `album` | | sheet 26 |
| 23 Dec | Wed | ട്രോൾ | ഫോർവേഡ് പലതവണ കണ്ടാൽ സത്യമായി തോന്നും | `chat`* | `newsprint` | sheet 27 |
| 24 Dec | Thu | വാർത്ത | ക്രിസ്മസ് സമ്മാനം | `collage`* | `shadow` (then move 25 Dec to `chalk`) | sheet 24 |
| 25 Dec | Fri | വാർത്ത | കരോൾ: ഒരുമിച്ചു പാടിയാൽ പെട്ടെന്ന് അടുക്കും (Pearce, Launay & Dunbar 2015) | `shadow` | | bench |
| 26 Dec | Sat | സിനിമ | ആവേശം: ഗുണ്ടയാണ്, എന്നിട്ടും ഇഷ്ടം | `mind` | | sheet 28 |

Checks:
- **Pillar mix:** സിനിമ 4, ട്രോൾ 3, വാർത്ത 5, മനസ്സ് 3, വിചിത്രം 3.
- **`mind`:** 13, 16, 21, 26 Dec: never adjacent, never two in any three. With the 4 already in the first 12 that is **8 of 30**.
- **Other templates:** none repeats within five reels (`woodcut` 9/19, `chat` 10/23, `shadow` 12/25, `vhs` 7/18, `album` 4/22, `blueprint` 2/11).
- **Look-alike pairs:** none adjacent (`blueprint` 11 and `mind` 13 are separated by `shadow`; `chat` 23 is two away from `mind` 21).
- **Grid tone:** no three dark covers in a row except 20–22 if `pixel` falls back to `chalk`.
- **Templates in use:** 6 new, 6 old, 12 different looks in 18 reels.

Changes from the spreadsheet, and why:
- **മണിച്ചിത്രത്താഴ്** is held out: ideas.md rates it high risk and asks for a clinician's read. Do not schedule it until that has happened.
- **2018, കമന്റ് ബോക്സ്, ആദ്യ കാഴ്ച, ന്യൂ ഇയർ** move to 27–31 Dec. Suggested: 27 കമന്റ് ബോക്സ് `comic`*, 28 ആദ്യ കാഴ്ച `casefile`, 29 2018 `newsprint`, 30 ന്യൂ ഇയർ `pixel`*, 31 പപ്പാഞ്ഞി `mind` (the month's last reel is `mind` by rule).
- `mural` is gone from page 2.
- [VERIFY] IFFK 2026 dates: the IFFK reel is set for about 6 Dec; if the festival opens later, swap it with a later slot. [VERIFY] the bumper draw date and Christmas exam dates.

### 3.2 Page 1, 27 Nov–10 Dec (14 days, 7:04 AM)

Last five posted: newsprint (23), vhs (23 pm), forensic (24), mural (25), shadow (26). "Built" means the job folder already exists with that design.

| Date | Day | Template | Topic | Status |
|---|---|---|---|---|
| 27 Nov | Fri | `blueprint` | ബേക്കൽ കോട്ട (കാസർഗോഡ് കഥകൾ #2) | built: `bekal-fort-bombay-v4` |
| 28 Nov | Sat | `woodcut` | Zheng He at Kozhikode | built: `zheng-he-kozhikode` |
| 29 Nov | Sun | `casefile` | Dyatlov Pass | built: `dyatlov-pass` |
| 30 Nov | Mon | `ticket`* | മാഹി: ഒരു ബസ് ടിക്കറ്റിൽ രണ്ട് രാജ്യം (തലശ്ശേരി → മാഹി) [VERIFY 1954 date] | new kit |
| 1 Dec | Tue | `forensic` | Antikythera | built: `antikythera-computer` |
| 2 Dec | Wed | `theyyam`* | പറശ്ശിനിക്കടവ് മുത്തപ്പൻ and the dogs (തെയ്യക്കഥകൾ #2) [VERIFY] | new kit |
| 3 Dec | Thu | `newsprint` | Hanno, the Pope's elephant | built: `hanno-pope-elephant` |
| 4 Dec | Fri | `palmleaf` | മൂഷികവംശം: ഏഴിമലയുടെ രാജാക്കന്മാരെ എഴുതിയ കാവ്യം (follow-up to the 68K reel) [VERIFY author, century] | new job, old kit |
| 5 Dec | Sat | `vhs` | Roopkund | built: `roopkund-skeleton-lake-v2` |
| 6 Dec | Sun | `mural` | പാതിരാമണൽ | built: `pathiramanal-island` |
| 7 Dec | Mon | `blueprint` | കൊട്ടിയൂർ: കെട്ടിടമില്ലാത്ത ക്ഷേത്രം (an empty plan is the picture) [VERIFY] | new job, old kit |
| 8 Dec | Tue | `theyyam`* | A second Kannur/Kasaragod theyyam legend, e.g. a Mappila theyyam and the harmony story behind it [VERIFY which, and the local telling] | new job |
| 9 Dec | Wed | `newsprint` | ഗുണ്ടർട്ടും രാജ്യസമാചാരവും, ഇല്ലിക്കുന്ന്, തലശ്ശേരി (rework of `k2-gundert-1847-v2`) | rework |
| 10 Dec | Thu | `matchbox`* | "Tellicherry" pepper [VERIFY] | new kit |

Checks: no template twice in five reels (`blueprint` 27/7, `theyyam` 2/8, `newsprint` 3/9); no look-alike pair adjacent (`mural` 6 and `theyyam` 8 are separated; `theyyam` 8 and `matchbox` 10 are separated). Eight of fourteen are North Malabar topics, and five of the six new jobs are Kannur or Kasaragod.

**3 PM test slots this week** (assumed 27–29 Nov): 27 `palmleaf` (Velu Thampi, built), 28 `chalk` (Zero Shadow Day, built), 29 `vhs` (Bhangarh, built). Two cautions. The 3 PM reels count in the rotation, and this order keeps every rule. But none of the three is a Kannur story, so a weak 3 PM result will say more about the topic than the time. If the test is meant to judge the time slot, put one Kannur legend at 3 PM and a non-local built job at 7:04 that day.

---

## 4. Build order

| Order | Kit | Needed by | Why first |
|---|---|---|---|
| 1 | `ticket` | 30 Nov (page 1), 17 Dec (page 2) | The only new kit both pages use. It prints the town names as the artwork, which is what the two hits had in common. It also gives both grids their first bright, light cover. Type-led, so storyboards are cheap. |
| 2 | `theyyam` | 2 Dec (page 1) | Page 1's shares come from Kannur legends and the page has no look of its own for them; `mural` is shared with every hero story. A symmetric red fan is recognisable at grid size and can carry a numbered series. |
| 3 | `chat` | 10 Dec (page 2) | Scam and forward reels are the ones people send to family, and three are due in December. It is light and full-bleed, so it breaks up the blue page. It retires `casefile` on page 2. |

Then: `comic` (14 Dec), `thermal` (15 Dec), `pixel` (20 Dec), `collage` (24 Dec), `matchbox` (10 Dec on page 1; it can slip to January without breaking the page 1 calendar if the 10 Dec slot takes `casefile`).

The sketches below follow `designs.js` conventions (globals `W`, `H`, `clamp`, `lerp`, `ease`, `FX`). They are untested.

### 4.1 `TICKET`

```js
// ---------- TICKET: letterpress ticket print (pink stock, guilloche, perforation, red serial, punch + tear) ----------
const TICKET = (() => {
  const PINK = '#F2B8C6', DEEP = '#E08FA6', INK = '#1E1B3A', RED = '#C8262C', VIO = '#5B3FA0', STUB = '#FFF6E0', BG = '#12343B';
  function bg(g, t) { g.fillStyle = BG; g.fillRect(-200, -200, W + 400, H + 400);
    g.save(); g.globalAlpha = 0.10; g.strokeStyle = '#7FD1C7'; g.lineWidth = 2; for (let y = 40; y < H; y += 46) { g.beginPath(); g.moveTo(-50, y); g.lineTo(W + 50, y); g.stroke(); } g.restore(); }
  function guilloche(c, cx, cy, r, n = 14, col = DEEP, a = 0.35) { c.save(); c.strokeStyle = col; c.globalAlpha = a; c.lineWidth = 1.5;
    for (let k = 0; k < n; k++) { c.beginPath(); for (let i = 0; i <= 180; i++) { const th = i / 180 * 6.283, rr = r * (0.55 + 0.45 * Math.sin(8 * th + k * 0.45));
      const px = cx + Math.cos(th) * rr, py = cy + Math.sin(th) * rr * 0.8; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); } c.restore(); }
  // paper stock on its own buffer so notches and punch holes are real holes; inner(c, w, h) prints on it in local coords
  function stock(g, x, y, w, h, rot, inner, col = PINK, o = {}) {
    const [k, c] = FX.buf(o.key || 'tk' + Math.round(x) + '_' + Math.round(y), Math.round(w), Math.round(h));
    c.fillStyle = col; c.fillRect(0, 0, w, h); guilloche(c, w / 2, h * 0.52, Math.min(w, h) * 0.42);
    c.save(); c.fillStyle = '#7a4a55'; for (let i = 0; i < 500; i++) { const q = FX.NOISE[i]; c.globalAlpha = 0.25 * q[2]; c.fillRect(q[0] * w, q[1] * h, 2, 2); } c.restore();
    inner && inner(c, w, h);
    c.save(); c.globalCompositeOperation = 'destination-out';
    if (o.perf !== 'none') for (let i = 14; i < w; i += 28) for (const yy of [0, h]) { c.beginPath(); c.arc(i, yy, 8, 0, 6.283); c.fill(); }
    (o.punches || []).forEach(([px, py, r, tt]) => { if (tt < 0) return; c.beginPath(); c.arc(px, py, r * clamp(tt / 0.08), 0, 6.283); c.fill(); });
    c.restore();
    g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 26; g.shadowOffsetY = 12; g.drawImage(k, -w / 2, -h / 2); g.restore();
  }
  // letterpress line: pressed in by alpha (never sliced mid-conjunct), with a faint offset ghost
  function print(c, s, x, y, size, p = 1, o = {}) { if (p <= 0) return; const k = ease.out(clamp(p)); c.save(); c.textAlign = o.align || 'center'; c.fillStyle = o.col || INK;
    FX.fit(c, s, o.max || 860, `${o.weight || 800} ${size}px ${o.font || 'Baloo'}`);
    c.globalAlpha = 0.22 * k; c.fillText(s, x + 3, y + 2); c.globalAlpha = k; c.fillText(s, x, y); c.restore(); }
  function serial(c, x, y, n, p, size = 54) { const k = clamp(p), spin = k < 1 ? Math.floor(FX.NOISE[Math.floor(p * 90) % 900][0] * 999999) : n;
    c.save(); c.fillStyle = RED; c.font = `700 ${size}px "DejaVu Sans Mono", monospace`; c.textAlign = 'left'; c.fillText('No. ' + String(spin).padStart(6, '0'), x, y); c.restore(); }
  function rule(c, x, y, w, kind = 'double') { c.save(); c.strokeStyle = INK; c.fillStyle = INK;
    if (kind === 'dash') { c.setLineDash([14, 10]); c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.stroke(); }
    else if (kind === 'thick') c.fillRect(x, y, w, 10); else { c.fillRect(x, y, w, 6); c.fillRect(x, y + 12, w, 2); } c.restore(); }
  // one-ink stock cut of fn (scene coords, region r) inside a double-ruled box
  function cut(c, key, fn, x, y, w, h, col = INK, r) { const rr = r || [0, (H - W * h / w) / 2, W, W * h / w], k = FX.tint(FX.shot(key, fn, rr, 0.4), col);
    c.save(); c.strokeStyle = col; c.lineWidth = 4; c.strokeRect(x, y, w, h); c.lineWidth = 2; c.strokeRect(x + 10, y + 10, w - 20, h - 20); c.drawImage(k, x + 14, y + 14, w - 28, h - 28); c.restore(); }
  function fare(c, label, value, x, y, p = 1) { print(c, label, x, y, 34, p, { font: 'Noto', weight: 600, align: 'left', max: 400 });
    c.save(); c.globalAlpha = clamp(p); c.fillStyle = RED; c.font = '800 150px Baloo'; c.textAlign = 'left'; c.fillText(value, x, y + 150); c.restore(); }
  function tear(tt, dur = 0.45) { const k = ease.out(clamp(tt / dur)); return { dy: 120 * k, rot: 0.10 * k, gap: 36 * k }; }   // apply to the lower stock
  function scribble(c, s, x, y, size, p, rot = -0.05) { if (p <= 0) return; c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha = clamp(p * 2); c.fillStyle = VIO; c.font = `700 ${size}px Chilanka, Hand`; c.textAlign = 'center'; c.fillText(s, 0, 0); c.restore(); }
  return { PINK, DEEP, INK, RED, VIO, STUB, BG, bg, guilloche, stock, print, serial, rule, cut, fare, tear, scribble };
})();
// Hook use: const tr = TICKET.tear(t - 2.0);
//   TICKET.stock(g, 70, 250, 940, 980, 0, top, TICKET.PINK, { key: 'a', punches: [[640, 520, 34, t - 1.5]] });
//   TICKET.stock(g, 70, 1230 + tr.dy, 940, 290, tr.rot, stub, TICKET.STUB, { key: 'b' });   stamps: CASE.stamp(..., TICKET.VIO)
```

### 4.2 `THEY`

```js
// ---------- THEYYAM: festival-notice screenprint (vermilion field, wedge rays, black plate + rice-paste dots, headdress fan) ----------
const THEY = (() => {
  const RED = '#D4201A', ORG = '#F26A1B', YEL = '#F7C531', WHT = '#FFF4E0', BLK = '#150A07', GRN = '#1E6B3A';
  // fan of n wedges centred on 12 o'clock across `span` radians; p opens it from the centre outward; a null colour leaves a gap
  function rays(g, cx, cy, r0, r1, n, p, cols, rot = 0, a = 1, span = 6.283) { const st = span / n, mid = (n - 1) / 2; g.save(); g.globalAlpha = a;
    for (let i = 0; i < n; i++) { const col = cols[i % cols.length]; if (!col || Math.abs(i - mid) > clamp(p) * n / 2) continue;
      const a0 = -Math.PI / 2 + rot + (i - mid - 0.5) * st; g.fillStyle = col; g.beginPath();
      g.moveTo(cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0); g.arc(cx, cy, r1, a0, a0 + st); g.arc(cx, cy, r0, a0 + st, a0, true); g.fill(); } g.restore(); }
  function bg(g, t, focus = [540, 980], spin = 0.02, field = RED) { g.fillStyle = field; g.fillRect(-200, -200, W + 400, H + 400);
    rays(g, focus[0], focus[1], 0, 1700, 28, 1, [field === RED ? ORG : WHT, null], t * spin, 0.55);
    const vg = g.createRadialGradient(focus[0], focus[1], 300, focus[0], focus[1], 1300); vg.addColorStop(0, 'rgba(21,10,7,0)'); vg.addColorStop(1, 'rgba(21,10,7,0.55)');
    g.fillStyle = vg; g.fillRect(-200, -200, W + 400, H + 400); FX.grainDots(g, BLK, 0.16, 900, 3); FX.grainDots(g, WHT, 0.10, 600, 2); }
  function dots(g, cx, cy, r, n, span, p, col = WHT, size = 9) { const st = span / n, mid = (n - 1) / 2; g.save(); g.fillStyle = col;
    for (let i = 0; i < n; i++) { if (Math.abs(i - mid) > clamp(p) * n / 2) continue; const a = -Math.PI / 2 + (i - mid) * st; g.beginPath(); g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, size, 0, 6.283); g.fill(); } g.restore(); }
  // headdress: black backing, two wedge rings, two dot rings, and a plain black disc where a face would be (never painted)
  function mudi(g, cx, cy, r, p = 1, t = 0, span = 4.4) { const k = ease.out(clamp(p)), n = 25;
    rays(g, cx, cy, r * 0.28, r * 1.05, n, k, [BLK], 0, 1, span + 0.14);
    rays(g, cx, cy, r * 0.60, r, n, k, [YEL, WHT], 0, 1, span); rays(g, cx, cy, r * 0.32, r * 0.58, n, k, [RED, ORG], 0, 1, span);
    dots(g, cx, cy, r * 0.80, n, span, k, BLK, 7); dots(g, cx, cy, r * 0.45, n, span, k, WHT, 6);
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * span / 5; torch(g, cx + Math.cos(a) * r * 1.08, cy + Math.sin(a) * r * 1.08, 0.5, t + i, clamp(p * 5 - 3.6 - i * 0.2)); }
    g.save(); g.fillStyle = BLK; g.beginPath(); g.arc(cx, cy, r * 0.30, 0, 6.283); g.fill(); g.restore(); }
  // black plate of fn with rice-paste dot rows clipped to the figure, over a misregistered orange ghost
  function figure(g, key, fn, o = {}) { const k = FX.tint(FX.shot(key, fn, [0, 0, W, H], 0.5), BLK), x = k.getContext('2d');
    x.save(); x.globalCompositeOperation = 'source-atop'; x.fillStyle = WHT;
    (o.bands || []).forEach(y => { for (let i = 0; i < k.width; i += 11) { x.beginPath(); x.arc(i, y * 0.5 + 2 * Math.sin(i * 0.2), 2.6, 0, 6.283); x.fill(); } }); x.restore();
    const m = o.mis === undefined ? 4 : o.mis, gh = FX.tint(FX.shot(key + '_g', fn, [0, 0, W, H], 0.25), ORG);
    g.save(); g.globalAlpha = 0.45; g.drawImage(gh, m, m, W, H); g.globalAlpha = 1; g.drawImage(k, 0, 0, W, H); g.restore(); }
  function fringe(g, y, dir = 1, t = 0, col = WHT) { g.save(); for (let x = 8; x < W; x += 22) { const sw = Math.sin(t * 1.6 + x * 0.05) * 5, len = 70 + ((x * 37) % 40);
      g.fillStyle = (x / 22) % 3 < 1 ? YEL : col; g.beginPath(); g.moveTo(x - 8, y); g.lineTo(x + 8, y); g.lineTo(x + sw, y + dir * len); g.fill(); } g.fillStyle = BLK; g.fillRect(0, y - 6, W, 12); g.restore(); }
  function torch(g, x, y, s, t, a = 1) { if (a <= 0) return; const f = 1 + 0.18 * Math.sin(t * 11); g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
    g.fillStyle = ORG; g.beginPath(); g.ellipse(0, -30, 26, 54 * f, 0, 0, 6.283); g.fill(); g.fillStyle = YEL; g.beginPath(); g.ellipse(0, -22, 14, 32 * f, 0, 0, 6.283); g.fill(); g.restore(); }
  function band(g, y, h, label, p = 1) { g.save(); g.fillStyle = BLK; g.fillRect(0, y, W * clamp(p), h); g.fillStyle = YEL; g.fillRect(0, y, W * clamp(p), 6); g.fillRect(0, y + h - 6, W * clamp(p), 6);
    if (label && p > 0.6) { g.textAlign = 'center'; FX.fit(g, label, 940, '800 44px Baloo'); g.fillText(label, 540, y + h / 2 + 15); } g.restore(); }
  function title(g, s, x, y, size, col = WHT) { g.save(); g.textAlign = 'center'; FX.fit(g, s, 960, `800 ${size}px Baloo`); g.fillStyle = BLK; g.fillText(s, x + 6, y + 6); g.fillStyle = col; g.fillText(s, x, y); g.restore(); }
  function tag(g, s, x, y, p = 1) { if (p <= 0) return; g.save(); g.globalAlpha = clamp(p * 2); g.font = '700 44px Chilanka, Baloo'; const w = g.measureText(s).width + 48;
    g.fillStyle = WHT; g.fillRect(x, y - 46, w, 66); g.fillStyle = BLK; g.textAlign = 'left'; g.fillText(s, x + 24, y); g.restore(); }
  return { RED, ORG, YEL, WHT, BLK, GRN, rays, bg, dots, mudi, figure, fringe, torch, band, title, tag };
})();
// Hook use: THEY.bg(g, t); THEY.mudi(g, 540, 900, 380, t / 0.6, t); if (t > 1.6) THEY.figure(g, 'back', backView, { bands: [1010, 1090], mis: t < 1.64 ? 8 : 4 });
//   THEY.fringe(g, 250, 1, t); THEY.fringe(g, 1500, -1, t);
```

### 4.3 `CHAT`

```js
// ---------- CHAT: full-bleed message thread (light wall, coral outgoing, bubbles that flip to a teal truth side) ----------
const CHAT = (() => {
  const WALL = '#EEF1F4', DOODLE = '#DDE3EA', BAR = '#1F2A37', IN = '#FFFFFF', OUT = '#F26B5B', INK = '#1B2430', MUTE = '#7C8794', TEAL = '#2BB3A3', WARN = '#FFC83D';
  function wall(g, t) { g.fillStyle = WALL; g.fillRect(-200, -200, W + 400, H + 400); g.save(); g.strokeStyle = DOODLE; g.lineWidth = 3;
    for (let i = 0; i < 90; i++) { const q = FX.NOISE[i * 7], x = q[0] * W, y = q[1] * H; g.beginPath();
      if (i % 3 === 0) g.arc(x, y, 14, 0, 6.283); else if (i % 3 === 1) { g.moveTo(x - 14, y); g.lineTo(x + 14, y); g.moveTo(x, y - 14); g.lineTo(x, y + 14); } else { g.moveTo(x - 16, y + 8); g.quadraticCurveTo(x, y - 18, x + 16, y + 8); }
      g.stroke(); } g.restore(); }
  function bar(g, y1 = 430) { g.save(); g.fillStyle = BAR; g.fillRect(-200, -200, W + 400, y1 + 200); g.fillStyle = TEAL; g.fillRect(-200, y1, W + 400, 4); g.restore(); }   // the HTML scene title sits on this band
  function wrap(g, s, max) { const out = []; let line = ''; for (const w of s.split(' ')) { const nx = line ? line + ' ' + w : w; if (line && g.measureText(nx).width > max) { out.push(line); line = w; } else line = nx; } if (line) out.push(line); return out; }
  function avatar(g, x, y, r, col = '#B9C4D0') { g.save(); g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.clip(); g.fillStyle = 'rgba(255,255,255,0.78)';
    g.beginPath(); g.arc(x, y - r * 0.18, r * 0.36, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(x, y + r * 0.9, r * 0.72, r * 0.56, 0, 0, 6.283); g.fill(); g.restore(); }
  // side 'in' | 'out'. p pops the bubble in. o.flip 0..1 turns it over to o.back (the truth side). Returns the bubble height.
  function bubble(g, s, x, y, w, side = 'in', p = 1, o = {}) { if (p <= 0) return 0; const size = o.size || 46, lh = size * 1.32, f = clamp(o.flip || 0), back = f > 0.5 && o.back;
    g.save(); g.font = `600 ${size}px Noto, Baloo`; const lines = wrap(g, back ? o.back : s, w - 64), top = o.fwd && !back ? 46 : 0, h = lines.length * lh + 40 + top;
    const k = ease.out(clamp(p / 0.25)), pop = 0.6 + 0.4 * k + 0.06 * Math.sin(k * Math.PI), ax = side === 'out' ? x + w : x;
    g.globalAlpha = k; g.translate(ax, y + h); g.scale(pop, pop); g.translate(-ax, -(y + h));                    // pop from the tail corner
    g.translate(x + w / 2, 0); g.scale(Math.max(0.02, Math.abs(1 - 2 * f)), 1); g.translate(-(x + w / 2), 0);   // flip about the vertical axis
    g.fillStyle = back ? TEAL : side === 'out' ? OUT : IN; g.shadowColor = 'rgba(31,42,55,0.16)'; g.shadowBlur = 14; g.shadowOffsetY = 5;
    g.beginPath(); g.roundRect(x, y, w, h, 30); g.fill(); g.shadowColor = 'transparent';
    g.beginPath(); if (side === 'out') { g.moveTo(x + w - 6, y + h - 34); g.lineTo(x + w + 22, y + h); g.lineTo(x + w - 40, y + h); } else { g.moveTo(x + 6, y + h - 34); g.lineTo(x - 22, y + h); g.lineTo(x + 40, y + h); } g.fill();
    if (top) { g.fillStyle = MUTE; g.font = '600 28px Noto, Baloo'; g.textAlign = 'left'; g.fillText(o.fwd === true ? 'പലതവണ ഫോർവേഡ് ചെയ്തത്' : o.fwd, x + 32, y + 44); g.font = `600 ${size}px Noto, Baloo`; }
    if (o.hi && !back) { g.fillStyle = WARN; g.globalAlpha = 0.55 * k; g.fillRect(x + 26, y + top + 20 + o.hi * lh, w - 52, lh - 6); g.globalAlpha = k; }   // o.hi = line index to highlight
    g.fillStyle = back || side === 'out' ? '#FFFFFF' : INK; g.textAlign = 'left'; lines.forEach((l, i) => g.fillText(l, x + 32, y + top + 14 + size + i * lh));
    g.restore(); return h; }
  function typing(g, x, y, t, side = 'in') { g.save(); g.fillStyle = side === 'out' ? OUT : IN; g.beginPath(); g.roundRect(x, y, 150, 76, 30); g.fill(); g.fillStyle = MUTE;
    for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x + 42 + i * 33, y + 38 - 8 * Math.max(0, Math.sin(t * 7 - i * 0.9)), 9, 0, 6.283); g.fill(); } g.restore(); }
  function thumb(g, x, y, press = 0) { g.save(); g.translate(x, y + 30 * (1 - clamp(press))); g.rotate(-0.25); g.fillStyle = '#C9B8A6'; g.beginPath(); g.roundRect(-55, 0, 110, 700, 55); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.roundRect(-34, 16, 68, 80, 30); g.fill(); g.restore(); }
  function counter(g, label, n, x, y) { g.save(); g.font = '700 30px Noto, Baloo'; const s = label + ' ×' + n, w = g.measureText(s).width + 36; g.fillStyle = BAR; g.beginPath(); g.roundRect(x, y - 36, w, 52, 26); g.fill(); g.fillStyle = '#fff'; g.textAlign = 'left'; g.fillText(s, x + 18, y); g.restore(); }
  function pinned(g, s, y, p = 1) { if (p <= 0) return; g.save(); g.globalAlpha = clamp(p * 2); g.fillStyle = '#FFFFFF'; g.fillRect(0, y, W, 84); g.fillStyle = TEAL; g.fillRect(0, y, 10, 84); g.fillStyle = INK; g.textAlign = 'left'; FX.fit(g, s, 940, '600 34px Noto, Inter'); g.fillText(s, 40, y + 54); g.restore(); }
  return { WALL, BAR, IN, OUT, INK, MUTE, TEAL, WARN, wall, bar, wrap, avatar, bubble, typing, thumb, counter, pinned };
})();
// Hook use: CHAT.wall(g, t); CHAT.bar(g); if (t < 0.5) CHAT.typing(g, 150, 520, t);
//   const h = CHAT.bubble(g, 'ടാസ്ക് കഴിഞ്ഞു. ₹500 അയച്ചു', 150, 520, 620, 'in', t - 0.5, { flip: (t - 1.7) / 0.35, back: 'സത്യം?' });
//   CHAT.thumb(g, 620, 760, (t - 1.5) / 0.15);
```

---

## 5. Risks and how to avoid them

| Risk | Where | Rule |
|---|---|---|
| A real lottery or bus ticket | `ticket` | Our own layout. No state lottery name, emblem, signature strip or barcode; no KSRTC or private operator name or logo; invented six-digit serials; small print `ചിത്രീകരണം മാത്രം` on every ticket so it cannot pass as real. Pink stock is a generic convention. The bumper is named in the voice as news, never drawn as its real ticket. |
| A real messaging or payment app | `chat` | No green header, no beige doodle wallpaper, no double blue ticks, no app icon, no vendor emoji, no payment-app mark. Our colours are slate, coral and teal. "Forwarded many times" is written as plain text with no icon. Avatars are blank discs: no profile photo of anyone. |
| Sacred imagery | `theyyam` | Theyyam is living worship. Performer only from behind or as a headdress outline; a plain disc where the face is; no deity-specific face writing or costume; legends carry `എന്നാണ് വിശ്വാസം`; nothing comic; no named real performer. Not used on page 2 or for non-ritual topics (do not use it for a New Year or party subject). Have one Kannur viewer look at the first cover before it posts. |
| Real matchbox and trade brands | `matchbox` | No existing brand name, mascot or the familiar big-cat and ship label compositions. Every emblem is drawn from the reel's own subject. No "Safety Matches" wording copied from a real box. The pepper reel shows no exporter's mark. |
| Comic publishers and characters | `comic` | No corner-box logo, no publisher masthead, no imitation of a known Malayalam children's-magazine character or cartoonist's style. Generic bursts and balloons only. |
| Game sprites and fonts | `pixel` | No plumber, ghost, maze, invader or block shapes from known games; no console logo; no game typeface. Our own ten-colour palette. No chiptune copied from a game. |
| Thermal-camera vendor interface | `thermal` | No vendor logo or its exact overlay layout. The image is an illustration, not a measurement: temperatures shown are round illustrative values and the source line already says "Animated illustration". No medical advice from a picture. |
| Film likeness | `comic`, `chat`, `poster` (bench) | Characters exist only as a name in a caption or balloon plus one prop. Blank faces. No signature hair, moustache, costume colour or pose. Film titles in plain Baloo, never imitation title lettering. No stills, no song. Quoted lines are short and marked [VERIFY] for wording. |
| Real people in news topics | `chat`, `ticket`, `newsprint` | Scam reels use the Observer or blank avatars; no real case, victim, officer, bank or channel. End with 1930 and never blame the person cheated. |
| Malayalam breaking in a "designed" font treatment | all | Never curve, letter-space or reveal Malayalam per character. Arc text is Latin and digits only. Pixel text is never Malayalam. |
| Two templates reading as a recolour | `theyyam`/`mural`, `thermal`/`forensic`, `ticket`/`newsprint` | The differences are structural (symmetry and no outline; heat values and no boxes; one giant stock and no clippings). Keep them non-adjacent anyway (2.10). If a first render looks like a recolour on a contact sheet at 120 px, change the composition, not the hue. |

---

## 6. Repo notes found while reading

- `docs/VIDEO-ONLY-GUIDE.md` section 3 still says page 2 posts at 8:04 AM, and section 6 lists six templates; the code has thirteen (`route` included). The spreadsheet also says 8:04. The brief for this plan says 7:00.
- `jobs/k2-drishyam-memory/script.json` hook still reads "ശാസ്ത്രം അത് തെളിയിച്ചിട്ടുണ്ട്!", which ideas.md asked to soften.
- `k2-exam-testing-effect` and `-v2` both exist as `mind`; only one should be posted.
- `design_reference.md` lists `MIND.flip` and `MIND.phone`; neither is in `designs.js`. `chat` covers the phone use; the flip is done inline with `MIND.knot(..., s)`.
