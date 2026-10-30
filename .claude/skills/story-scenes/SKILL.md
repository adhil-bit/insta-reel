---
name: story-scenes
description: Build fully animated, story-style Malayalam explainer scenes (warm flat illustrations, silhouettes, Kerala motifs) with a catchy staccato opening. Use when writing anim_*.js for a reel, planning an opening hook, or restyling scenes for @unexplored.truths.
---

# Story scenes: how to build engaging animated reels

Learned from top Malayalam explainer pages (Oct 2026). Use with `pipeline/lib/scenes.js` (global `SK`),
which is loaded into every animation page.

## 1. The opening (first 3 seconds decide everything)
- **Staccato paradox hook**: 2-3 tiny beats that set up a normal world, then the twist.
  e.g. "തീയില്ല. വെള്ളപ്പൊക്കമില്ല. ശബ്ദം പോലുമില്ല. എന്നിട്ടും ഒറ്റ രാത്രിയിൽ 1,700 പേർ മരിച്ചു."
  Each beat ends with "." or "," so the subtitles show one beat at a time.
- **English title at the top from frame 1**, short, often a question or contradiction
  ("NO WIND. NO RAIN. FLOOD." / "REMEMBER …?" / "₹12 CRORE WIN?"), accent colour on the twist word.
- **The scene animates the twist**: start calm and pretty, then the event happens *in the same shot*
  (the sea climbs the beach, the door opens to light, the crowd turns). No cut needed for the payoff.

- **Malayalam phrasing:** end a held-back hook with **'നിങ്ങൾക്കറിയാമോ?'** (do you know?). Never use 'നിങ്ങൾ ഊഹിക്കില്ല' (you'd never guess): it can sound negative.

## 2. The look
- One warm palette per reel: `SK.sky(g, 'sunset' | 'dusk' | 'dawn' | 'day' | 'night' | 'temple')`.
- Flat silhouettes in near-black (`SK.ink`) against glowing skies; Kerala motifs: palms, sloped-roof
  houses with lit windows, boats, lamps, temple towers, crowds.
- Always finish a frame with `SK.grain(g, t)` (film grain + vignette).
- Composition: subject in the middle band (y 0.25–0.7 of the frame). Keep the **top 20 %** for the title
  and the **bottom 25 %** for subtitles.
- Every scene changes at least once mid-way (≤ 4 s per beat): a reveal, a camera push, light turning on.
- Flashback / story-within-story: `SK.filmFrame(g, t)`. Revelations: `SK.door(...)` + `SK.rays(...)`.
- Real maps for geography (globe opening, satellite look) with a red line or pin for the place.

## 3. Kit reference (`SK.*`, canvas 1080×1920, t in seconds)
| Function | Draws |
|---|---|
| `sky(g, preset, horizon)` | gradient sky |
| `sun(g, x, y, r)` · `birds(g, t, n, y)` | sun with glow · flock |
| `sea(g, top, t, cols, foam, bottom)` | water band with moving waves (raise `top` to flood) |
| `ground(g, top, c1, c2)` | sand/earth |
| `palm(g, x, base, h, lean, col, t)` | coconut palm (fronds sway) |
| `house(g, x, y, s, col, lit, t)` | Kerala house, lit windows |
| `boat(g, x, y, s, col, t)` | country boat, bobbing |
| `person(g, x, y, h, 'stand'|'arm_up'|'pray'|'child', col, t)` · `crowd(g, x0, x1, y, n, h, t)` | silhouettes |
| `lamp(g, x, y, s, t)` | flickering nilavilakku |
| `gopuram(g, x, y, s, col, lit)` | temple tower |
| `door(g, x, y, w, h, open)` · `rays(g, x, y, spread, len, a)` | opening door onto light · light beams |
| `grain(g, t, amount)` · `filmFrame(g, t, a)` | finish · film strip border |
| `stage(g, t)` · `puppet(g, x, y, h, t, armUp)` | shadow-puppet theatre (lit screen, oil lamps) for myths and legends |

Example (calm beach, then the sea rises):
```js
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = t => { const rise = ease.inOut(clamp((t / DURATION - 0.45) / 0.5));
  SK.sky(g, 'day', 0.5); SK.sun(g, W * .72, H * .24, 60); SK.birds(g, t, 5, .18);
  SK.sea(g, H * .44, t, undefined, true, H * .55); SK.ground(g, H * .55);
  SK.palm(g, W * .12, H * .6, 440, 40, SK.ink, t); SK.house(g, W * .7, H * .62, .5, '#7a2a2a', 1, t);
  if (rise > 0) SK.sea(g, lerp(H * .56, H * .5, rise), t * 1.4, ['#3aa8c8', '#2a88b0'], true, lerp(H * .56, H * .66, rise));
  SK.grain(g, t); };
```

## 4. What makes Malayalis share
- **Tie the topic to something current**: a new Malayalam film (myths behind Bramayugam/Lokah-style stories),
  the season (monsoon onset, Thulavarsham thunder), this week's news.
- **Identity and nostalgia**: grandmother's stories, the Gulf, school days, festivals.
- **Subtitles in tiny beats**: 1-3 words each ("പക്ഷേ" alone is fine).
- **Scene kickers**: a small label under each title ("KERALA · 2,000 YEARS AGO", "LEGEND 1 · …").
- **Caption**: bilingual (Malayalam line, then English), a personal question ("Which story did your grandmother
  tell you?"), one share line, 4-5 hashtags incl. #UnexploredTruths.

## 5. Sound
The music bed adds a deep boom at frame 1 and a soft pulse; narration carries the story. Keep the
hook spoken within the first second; no silent intro.
