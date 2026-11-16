# Design system & motion flow (16 Nov 2026, after the Fable design review)

Read with docs/1k-playbook.md (hooks/flow) and docs/design-refs/ (reference reels).

## What the review found in our reels
1. Hero too small (fort ~10-15% of frame height); bottom ~45% of the frame is dead flat ground / black.
2. One composition all reel (same fort + horizon in every scene; Kochi = one coastline 9 times).
3. No depth: the whole canvas moved as one plane.
4. Too many text tiers (English headline + Malayalam line + caption + sources), text over the hero, labels clipped at the right edge.
5. Weak payoff, generic ending, night scenes too dark for a phone outdoors.

## AUTOMATIC now (pipeline/cine.py, every reel)
- Camera: hook = fast ease-out push (0.12); other scenes alternate push/pull + 60 px pan; punch-in 0.04 at cuts, 0.10 on the twist.
- Parallax API: draw with `CINE.layer(depth, () => {...})` (sky 0.1, far 0.25, mid 0.5, hero 1.0, foreground 1.8) and the global move switches off for that scene.
- One overlay across all scenes; film grain (0.07 dark / 0.05 paper); colour grade per act (cool -> warm); drifting light leak on dark themes; vignette.
- White flash on the twist scene (`"twist_scene": 3` in script.json); letterbox bars on the payoff scene (default: second-last scene); optional `"whip": [2]` whip-pan into a scene.
- Series badge on every scene: `"series": "കണ്ണൂർ രഹസ്യങ്ങൾ #1"`.
- Map-pin drop with town name: `"pin": {"scene": 1, "town": "പയ്യന്നൂർ", "x": 540, "y": 980}`.
- Text safety: any text wider than 900 px on screen is shrunk; text is nudged inside x 60-1020.
- The English title no longer shows in the video hook (only on request: `"english_title": true`).

## Rules for scene authors (manual, every reel)
Palette
- 3 values (dark / mid / light) + 1 accent; accent ≤ 8% of pixels, only on the hero/twist object and one caption word.
- Colour arc over 2-3 acts. Night: darkest large area no darker than #0b1530, never pure black.
Text (two tiers, both Malayalam; English only as the small kicker)
- Hook line 84-96 px, ≤ 6 words / 2 lines, around y 300-520, never on top of the hero.
- Scene caption ≤ 4 words, Malayalam, one accent word. In-scene labels ≥ 44 px, max 2 on screen.
- Safe zone: x 70-930, y 250-1500; keep x > 930 clear below y 1100 (Reels buttons). Cover: central 1080x1350.
Illustration (pure canvas)
- Silhouettes with a 3-4 px rim light on the sun side; ground-contact shadow; soft `screen` glow behind the hero.
- Atmospheric perspective: each farther layer lerped 25% toward the sky colour.
- Texture instead of flat fills: top-lit gradients + 30-60 seeded strokes (stone courses, bark, ripples).
- One human-scale figure (4-6% of height) next to big things.
Composition
- Hero ≥ 40% of frame height in the hook and the payoff. Horizon at 1/3 or 2/3, never the middle.
- Bottom third always has a foreground layer (rocks, palms, boat prow, grass) - no dead ground.
Motion
- Consecutive scenes never share the same shot scale (wide -> close -> insert -> wide).
- Hook: hero + hook line + motion already at speed on frame 0; something changes state by 0.7 s.
- Payoff: the widest, brightest shot; hold ≥ 1.5 s with no caption (screenshot moment).
- Ending: last 0.5 s pushes into the same framing as frame 0 (loop).
- Captions rise 24 px + fade over 6 frames; accent word pops 1.15 -> 1.0; years count up.
Share devices
- Local-pride cover: town name in the accent colour + twist + hero silhouette + district chip.
- Map-pin moment by 5 s; series badge; one screenshot card near the end (e.g. 1505 -> 1663 -> 1772 -> 1790).

## Checklist (test before rendering)
1. Frame 0: hero ≥ 40% of frame height; hook text not on the hero; mean brightness > 45/255; no fade-in.
2. No 200 px band of one flat colour; ≥ 4 depth layers incl. a foreground in every scene.
3. Adjacent scenes differ in shot scale; frames 1 s apart visibly differ.
4. Two text tiers, inside the safe zone, nothing clipped; caption ≤ 4 words, hook ≤ 6.
5. Town name on screen by 3 s, pin by 5 s; series badge set.
6. One flash, one letterbox max; payoff held ≥ 1.5 s without text; last frame matches frame 0.
7. Cover readable at 270 px wide.
