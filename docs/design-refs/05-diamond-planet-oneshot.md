# Design 05: "വജ്രഗ്രഹം?" (A diamond planet?), a 3D one-shot planet reel

**Reference reels:**
- പ്രപഞ്ചം നിറയുന്ന വൈറസ് (Viruses fill the universe), @cinemagic.official, ~2.1K likes: a 26s dark 3D one-shot camera move with centred subtitles
- നിഗൂഢമായ ഗ്രഹം (GJ 1214 b), @_cinemagic_official_: the planet infographic with Earth size comparison and data labels

**Style:** A, a space infographic in a **single continuous 3D camera move**
**Length:** 30–35s (short = high rewatch, like the virus reel)

---

## 1. Why the references work

- **Virus reel:** no cuts, one smooth camera journey, a dark moody 3D look. It is short, so people watch it again.
- **Planet reel:** the Earth comparison gives an instant sense of scale; simple data labels make it feel "scientific".
- **Combining them:** a short one-shot that still has data moments.

---

## 2. Concept

The camera flies from Earth across the starfield to **55 Cancri e**, a scorching planet close to its star. Scientists once suggested it might be rich in carbon, possibly even diamond. The camera circles the glowing planet, data labels appear, and the reel ends with a twist: newer observations question the diamond idea. The question is left open.

**Hook (0–3s):**
> ഭൂമിയേക്കാൾ വലിയ ഒരു വജ്രം… ബഹിരാകാശത്ത്?
> *(A diamond bigger than Earth… floating in space?)*

---

## 3. Fact sheet (verify before recording)

| Item | Approx. value |
|---|---|
| Name | 55 Cancri e ("Janssen") |
| Distance | ~41 light years |
| Size | ~1.9 × Earth's radius |
| Mass | ~8 × Earth's mass |
| One year (orbit) | ~18 hours |
| Dayside temperature | ~2,000 °C+ |
| Diamond idea | Proposed in 2012 (carbon-rich model) |
| Twist | Later studies question it; James Webb (2024) found signs of an atmosphere |

> Say it honestly: "scientists **once thought**… now the debate continues." The open question makes a stronger ending.

---

## 4. Design system

### Palette

| Role | Hex |
|---|---|
| Space | `#04060C` |
| Star field | `#FFFFFF` 30–90% |
| Earth | real texture, small, cool blue |
| Host star (55 Cancri) | `#FFD9A0` core → `#FF8A3D` glow |
| Planet dayside | Lava cracks `#FF5A1F` on dark rock `#1A0F0D` |
| **Diamond accent** | Icy white-cyan `#CFF6FF` with sparkle |
| Data labels | `#4FD1C5` lines + white text |

**Visual idea:** the planet looks like **dark rock with glowing lava cracks**. When the voice says "diamond", the cracks briefly flash to **icy cyan sparkle** for 2s, then go back to orange (the twist).

### Typography

- Centred Malayalam subtitles (like the virus reel): Noto Sans Malayalam SemiBold 52px, y = 1150, white with a soft shadow
- Data labels: Montserrat Medium 44px + Trim-Path lines
- Big numbers: Montserrat Bold 140px, `#FFD166`

---

## 5. Camera path (one shot, no cuts)

```
  START                                         END
  Earth ──► fly through stars ──► star flare ──► orbit planet ──► pull back
  (0s)        (3–9s)               (9–12s)       (12–28s)          (28–34s)
```

| Time | Camera | On screen | Voiceover idea |
|---|---|---|---|
| 0–3s | Close to Earth, slowly turning away | Earth on the left, black space | Hook |
| 3–9s | **Fly forward** fast through the starfield (stars stretch into streaks) | Label at top: "41 light years" | "41 light years away…" |
| 9–12s | Slow down; the host star **lens flare** fills the right side | The star glows | "Very close to its star" |
| 12–16s | Planet comes into view; camera eases into orbit | Small Earth icon appears beside it for comparison (×2 size) | Size: ~2× Earth |
| 16–20s | Orbiting (rotate the camera 40° around the planet) | Labels: "1 year = 18 hours", "2000°C+" with counters | Data |
| 20–23s | Push in close to the surface | **Cracks flash cyan, sparkle**: "💎 Carbon?" | "Scientists thought… maybe diamond!" |
| 23–28s | Hold; the cracks turn back to orange | Text: "2024: James Webb" | The twist: new data suggests an atmosphere |
| 28–34s | Pull back into the starfield; the planet shrinks to a dot | Big subtitle: "സത്യം എന്താണ്?" ("What's the truth?") | Open question, then "comment your guess" |

---

## 6. How to build it

### Option 1: Blender (best result, free)

1. **Scene:** World background black; add a star-texture HDRI or particle stars (an icosphere instanced 5,000×, emission 2–8).
2. **Planet:** UV sphere (subdiv 5) + a dark rock texture; for the lava cracks, a **Voronoi texture → ColorRamp → Emission** (orange, strength 8). Keyframe the ColorRamp colour from orange to cyan to orange at 20–28s.
3. **Star:** a sphere with emission strength 50 + bloom (Eevee) or a Glare node (Cycles).
4. **Camera:** follow an animated **Bezier curve path** (Follow Path constraint). Set the F-curve to ease in/out with Bezier handles; no stops.
5. **Speed streaks (3–9s):** turn on motion blur (shutter 2.0) during the fast move.
6. Render 1080 × 1920, 30 fps, Eevee (fast). Add labels and subtitles later in After Effects or CapCut.

### Option 2: After Effects (2.5D)

- Planet = **CC Sphere** with a lava texture; Rotation Y `time*8`
- Fly-through = 3 starfield layers in 3D at different Z values plus a camera Z move (the "warp" comes from the parallax speed difference)
- Star = Optical Flares or a free lens-flare + Glow
- Diamond flash = an adjustment layer: **Tint to cyan + CC Star Burst sparkles**, opacity 0→100→0 over 2s

### Option 3: AI video (quickest)

Generate 3 clips and join them with a zoom-through:
1. *"cinematic camera flying forward through a dense starfield, light streaks, deep space, 9:16"*
2. *"dark rocky exoplanet with glowing orange lava cracks, close to a bright orange star, slow orbit camera, cinematic, 9:16"*
3. *"close-up of an exoplanet surface with lava cracks shimmering into icy blue diamond crystals, cinematic, 9:16"*

---

## 7. Motion specs

- **Camera curve:** one continuous move; ease-in at the start (from Earth), **fastest at 6s**, ease-out into the orbit at 12s, then constant orbit speed and a gentle ease at the end.
- **Labels:** line Trim Path 12f → text fade-up 10f → hold until the next label → fade 6f.
- **Counters:** 0 → 18 ("hours"), 0 → 2000 ("°C") over 24f with Snap ease.
- **Earth comparison icon:** slides in 8f with soft ease, and stays exactly 1/2 the planet's diameter.
- **Sparkle:** 6–8 four-point stars that scale 0→100→0 over 10f, staggered.

---

## 8. Sound

- A deep space drone throughout
- Fly-through: a rising whoosh plus a sub-bass swell, peaking at 6s
- Star flare: a bright shimmer sound
- Diamond moment: a **crystal chime** (a high, glassy sound)
- Twist: the music drops to near silence, then the final line
- End: soft drone fade

## 9. Cover

- The glowing lava planet in the centre with cyan sparkles on one side
- Text: **"വജ്രഗ്രഹം?"** ("Diamond planet?"), 120px, with the "?" in `#CFF6FF`

## 10. Caption

> ഭൂമിയേക്കാൾ വലിയ വജ്രം? 💎 സത്യം എന്താണെന്ന് നിങ്ങൾ കരുതുന്നു? 👇
> #cinemagicmalayalam #sciencemalayalam #space #exoplanet #jameswebb #malayalam
