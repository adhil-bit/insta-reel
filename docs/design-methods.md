# Design methods plan (Fable, 19 Nov 2026)

Read with docs/design-system.md, docs/1k-playbook.md and docs/design-refs/06-naadu-methodology.md.
Evidence: Marco Polo–Ezhimala (Naadu style, world-link + strange-law twist + debate ending) = 13.1 s, 2,023 views, 89 shares.
Payyanur salt = 9.7 s, 203 views, 2 shares. Dharmadam held 13.7 s and still got 254 views: watch time alone does not make shares, the story shape does.

## 1. Why Marco Polo beat Payyanur salt
- Story shape: world name + promised strange law + twist + true-or-myth ending with a tag target. Salt closed on a statement, nothing to argue or forward.
- Shot variety: Marco Polo changed hero and look every beat. Salt reused one beach for three beats.
- Text: full Naadu stack (chapter title, gold kicker, loc tag, HUD) top, hero below. Salt had no loc/hud and a 4-line hook mid-frame.
- Hero readability: carrack silhouette reads instantly; the salt mound was a grey triangle.
- Depth: Marco Polo scenes had 3-5 CINE.layer calls; salt had none in 4 scenes.
- Shared faults to fix: bottom ~40% near-black; hook frames identical (no state change); anim_5 has no layers; source line collides with caption; every anim file re-declares the helper library.

## 2. Story-shape templates (beats = anim_0..anim_5; style "naadu", loc on every scene, pin in scene 1)
A. Strange law / custom: hook (hero moving, law teased, fast push) -> "today" same place blue hour + pin -> parchment/witness insert + hud years-ago -> wide trade/daily life pan -> TWIST law enacted close (twist_scene 4, whip [4]) -> widest gold payoff, true-or-myth question, loop (letterbox [5], dust).
B. Prisoner-to-hero twist (warriors): warrior 45% of frame, weapon swinging -> fort wall + pin wide -> enemy fleet/army + hud "YEARS AT WAR" -> TWIST betrayal blue hour, torch crowd (twist_scene 3, embers) -> legacy today at dawn (letterbox [4]) -> "hero or rebel?" loop.
C. Place that changes: split then/now -> map strip + pin -> look A (monsoon) wide -> same camera look B, prop swap, cross-dissolve -> TWIST cause insert (twist_scene 4) -> dawn wide + hud year, "have you seen it?" (letterbox [5], fog).
D. Myth vs fact: myth object lamp-lit -> place + pin blue hour, stars -> folk story silhouette pantomime -> evidence insert + hud date -> TWIST evidence contradicts/deepens -> dawn wide, "what story did you hear?" (letterbox [5]).

## 3. Set & prop library (shared pipeline/kit.js, injected once; every asset (g, t, x, y, scale, look); SIL fill + 3-4 px rim on the sun side + contact shadow; far copies lerped 25% to sky)
Build first: 1 skyKit (4 looks, sun/moon, 12 rays, haze) · 2 seaKit (glitter path + 3 moving wave bands) · 3 foreground (fronds/rocks/grass/boat prow at depth 1.8, tops y 1500-1920, floor never darker than #2a1810 - fixes the black bottom) · 4 figure rig (walk, stand, raise arm, sword, urumi, bow, seated scribe; heads: mundu-thalappavu, turban, colonial hat, Gandhi cap) · 5 crowd (20-40 figures, 2 depth rows, phase-offset bob, torches/flags) · 6 keralaStrip (stylised coast Kasaragod→Kochi, town dots, self-drawing dashed route = our stand-in for Naadu's globe zoom).
Then: carrack/warship (+sail billow) · uru/dhow · fortWall (laterite courses, crenellations, cannon flash) · lateritePlateau (+seasonal tint) · templeTank · naluketu/pavilion · oilLamp (flicker, glow r300) · parchment (+self-writing text, seal stamp) · theyyam (headdress disc, red accent, sway) · kalariPair (urumi arc trail) · hillRange · flag & stamp ("SOLD", "1954" slam).

## 4. Colour & light scripts
| Look | Sky top→horizon | SIL / RIM | Light | Overlay | Use |
|---|---|---|---|---|---|
| Golden hour | #24162e #8a3b2a #e8892b #f2b33d | #1a0d08 / #ffcf7a | sun r70 at (540,1090), rays | dust | hook, payoff, trade |
| Blue-hour lamp-lit | #0b1530 #14233f #2e4f6e #c9731f | #0d1322 / #ffb45a | moon r34 at (800,420); lamps warm | stars / embers | "today", betrayal, myth |
| Monsoon grey-green | #1c2b2e #3d5a52 #7fa08a #c8d6c0 | #12201c / #d8ead8 | soft top light, no sun | rain / fog | hardship, journey, "before" |
| Dawn hope | #3a2a3a #c9731f #f2b33d #ffe3a0 | #2a1810 / #fff1cf | half-risen sun (300,1150) | dust | legacy, final question |
One accent per reel (#F5C542, or #d83a2b for theyyam/blood). ≥ 2 looks per reel; the look changes on the twist.

## 5. Hook rules (0-3 s)
Headline y 250-470, ≤ 2 lines / 6 words, town in gold, English kicker under it. Hero ≥ 40% of height within y 640-1500.
A state change by 0.7 s (sail fills, lamp ignites, stamp slams) and another by 2 s. First spoken words = town + world name. No mid-frame text.
Example hooks: Mahe "1954 വരെ ഇവിടെ ഫ്രാൻസ്!" (flag swaps) · Arakkal "കേരളത്തിലെ ഏക മുസ്ലിം രാജവംശം, ഭരിച്ചത് ബീവിമാർ" · Thalassery "ഇന്ത്യയിലെ ആദ്യ കേക്ക് തലശ്ശേരിയിൽ?" · Parassinikadavu "ഈ ക്ഷേത്രത്തിൽ നായയ്ക്ക് ആദ്യം പ്രസാദം" (facts to be checked before scripting).

## 6. Planning form (fill before coding)
Topic · Template (A/B/C/D) · Local hook (town) · World link · Twist · Debate question (either/or) · Tag-target town · Looks per beat · 6-beat shot list (anim_0..5: hero, camera, look, hud/pin) · cine flags (pin, twist_scene, letterbox, overlay, series).
Example: Gundert at Illikkunnu · D→A · Thalassery · Germany / Hermann Hesse · grandson won the Nobel · "മലയാളത്തിന് ഏറ്റവും വലുത് ചെയ്ത വിദേശി ആര്?" · തലശ്ശേരിക്കാരൻ ചങ്ക് · blue lamp → gold → dawn ·
anim_0 scribe + lamp push-in; anim_1 keralaStrip pin Thalassery; anim_2 route Germany→Malabar + uru, hud YEAR 1838; anim_3 parchment writing itself, hud DICTIONARY 1872; anim_4 twist portrait pair, look flips gold; anim_5 bungalow at dawn, question, loop · pin scene 1, twist_scene 4, letterbox [5], dust.

## 7. Pre-render QA (testable)
1. Frame 0: hero ≥ 40% height; headline y 250-470 not touching the hero; mean luma > 45.
2. Frames at 0, 0.7 s, 2 s visibly differ.
3. Every anim incl. anim_5 has ≥ 4 CINE.layer calls, one at depth 1.8.
4. No 200 px single-colour band; rows 1500-1920 mean luma > 25.
5. Each scene differs in hero or shot scale from its neighbours.
6. ≥ 2 looks; the look changes on the twist scene.
7. loc on every scene; pin in scene 1; town name on screen by 3 s.
8. ≥ 1 hud number.
9. No phrase twice on screen; ≤ 3 text elements besides the badge.
10. Source line clear of caption and hero.
11. Final line = either/or question naming a tag-target town.
12. Script has a world name and passes "would a Payyanur person forward this?"; last frame matches frame 0.
