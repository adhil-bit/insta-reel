# Design 01: "മരിയാന ട്രെഞ്ചിലേക്ക്!" (Into the Mariana Trench)

**Reference reel:** ആമസോൺ നദിയിലേക്ക്! (Amazon river), @cinemagic.official, ~7K likes, their most-liked recent reel
**Style:** A, a flat silhouette **one-shot** with parallax layers
**Length:** 75–90s (a YouTube teaser, like the reference)

---

## 1. Why the reference works

- One continuous camera move feels like a short film, not a slideshow.
- The colour changes tell the story (bright and safe, then dark and dangerous).
- Silhouettes are cheap to make but look premium.
- It ends on a creature reveal, which leaves viewers wanting the full video.

**What we copy:** one-shot parallax, colour-as-story, a creature reveal at the end.
**What we change:** the camera moves **vertically** (descending) instead of sideways, which is new for their feed.

---

## 2. Concept

A small submarine silhouette sinks from the sunny ocean surface down to the deepest point on Earth, **Challenger Deep (~11 km)**. The colour turns from turquoise to absolute black, and a depth counter runs down the side. At the bottom, a glowing deep-sea creature appears.

**Hook line (0–3s):**
> എവറസ്റ്റ് കൊടുമുടി മുഴുവനായി മുക്കിയാലും… മുകളിൽ ഇനിയും 2 കിലോമീറ്റർ വെള്ളം ബാക്കി!
> *(Even if you sank Mount Everest here… there'd still be 2 km of water above it!)*

---

## 3. Fact sheet (verify before recording)

| Item | Value |
|---|---|
| Challenger Deep depth | ~10,900–10,935 m |
| Everest height | 8,849 m |
| Sunlight zone | 0–200 m |
| Twilight zone | 200–1,000 m |
| Midnight zone | 1,000–4,000 m |
| Abyss | 4,000–6,000 m |
| Hadal zone | 6,000 m to the bottom |
| Pressure at the bottom | ~1,000× the pressure at the surface |
| First humans to reach it | Jacques Piccard & Don Walsh, *Trieste*, 1960 |

---

## 4. Design system

### Palette (the background colour changes with depth)

| Depth zone | Background | Silhouettes | Accent |
|---|---|---|---|
| Surface | `#7FD3D8` → `#2BA6B5` | `#0B3B4A` | Sun rays `#FFF4C9` |
| Twilight | `#1B5E7A` → `#0F3550` | `#06202F` | — |
| Midnight | `#081A2E` | `#030B15` | Bioluminescence `#5CF2E6` |
| Hadal | `#020509` | `#000000` | Sub lamp `#FFD166` |

**Rule:** the **sub lamp (warm yellow)** is the only warm colour after 200 m. The viewer's eye follows it.

### Typography

- Depth counter: Montserrat Bold 64px, white 80%, placed **left side x=110, y=900**, with the unit "m" in 36px
- Zone name label: Noto Sans Malayalam SemiBold 48px, fades in at each zone boundary
- Subtitles: Noto Sans Malayalam 52px, centred at y=1150

### Layers (build in Illustrator, at least 1080 × 9000 tall)

```
L5 Overlay     – floating particles ("marine snow"), slow upward drift
L4 Foreground  – dark rock edges / kelp entering left & right, blurred 10
L3 Subject     – submarine silhouette (stays centred; lamp glow + light cone)
L2 Midground   – fish schools, whale silhouette, trench walls
L1 Background  – tall vertical gradient strip (all zones stacked)
```

---

## 5. Shot list (one continuous take)

| Time | Depth | Visual | Camera / motion | Voiceover idea |
|---|---|---|---|---|
| 0–4s | 0 m | Sunny surface, waves line, sub floating, sun rays | Static, then starts sinking | Hook (Everest line) |
| 4–14s | 0–200 m | Fish school passes, turtle silhouette | Tilt down, slow (Y −1200px over 10s) | "This is the sunlit zone…" |
| 14–24s | 200–1,000 m | Light fades; whale silhouette crosses in the distance | Tilt continues; L2 parallax 40% | Twilight zone |
| 24–26s | — | **Sub lamp switches ON** (2-frame flicker) | Hold 0.5s | *(silence + click sound)* |
| 26–40s | 1,000–4,000 m | Jellyfish with teal glow dots; light cone from the sub | Slower tilt; counter speeds up | Midnight zone, no sunlight ever |
| 40–55s | 4,000–6,000 m | Trench walls close in from the sides (L4) | Walls slide inward; slight shake `wiggle(2,3)` | Pressure fact (~1,000×) |
| 55–70s | 6,000–10,900 m | Total black, only the lamp cone; counter flashes as it passes 8,849 m | Very slow push-in 100→110% | Everest comparison, *Trieste* 1960 |
| 70–80s | Bottom | Sub lands, dust puff; **a glowing creature eye opens** in the dark | Hold; tiny camera drift | "But we're not alone here…" |
| 80–88s | — | Dip to black, then end card | — | "Full story on YouTube" |

---

## 6. Motion specs

- **Camera:** one Null controls Y position through the whole video. Use ease-in only at the start and ease-out only at the bottom. The middle stays **linear**, so the descent feels steady.
- **Depth counter:** Slider 0 → 10,935, keyframes **matched to the camera Y** (linked by expression), so the number and the movement always agree:
  ```
  Math.round(linear(thisComp.layer("CAM").transform.position[1], startY, endY, 0, 10935)) + " m"
  ```
- **Sub bob:** Position Y `wiggle(0.5, 6)`, Rotation `wiggle(0.3, 2)`.
- **Fish school:** 20 duplicated fish, linear X move, random speed 80–120%.
- **Bioluminescent dots:** opacity `wiggle(3, 50)` with a Glow effect (radius 20, intensity 1.5).
- **Light cone:** a white triangle shape at 15% opacity, Gaussian Blur 30, Add blend mode.

---

## 7. Sound

- 0–14s: muffled underwater ambience plus light waves
- 14s on: a deep drone pad that **gets lower in pitch** as depth increases
- Sonar ping every 6–8s (very quiet)
- Lamp click at 24s, metal creak at the pressure line, deep "boom" when the creature appears
- Voice at −14 LUFS; music ducks −6 dB under the voice

---

## 8. Cover / thumbnail

- Black background, small sub with a yellow lamp cone in the centre
- Text: **"11 കിലോമീറ്റർ താഴെ!"** ("11 km down!"), 110px, with "11" in `#FFD166`
- A glowing eye faintly in the bottom-right

## 9. Caption

> ഭൂമിയിലെ ഏറ്റവും ആഴമേറിയ സ്ഥലം! 🌊 Full video on YouTube.
> #cinemagicmalayalam #sciencemalayalam #ocean #marianatrench #malayalam
