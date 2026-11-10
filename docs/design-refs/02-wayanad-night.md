# Design 02: "വയനാട് ഉറങ്ങാത്ത ആ രാത്രി" (The night Wayanad didn't sleep)

**Reference reel:** കേരളം മുങ്ങിയ ആ രാത്രി (Kerala floods), @cinemagic.official, ~6K likes
**Style:** B2, a flat vector night scene with a rain overlay and one red accent
**Length:** 50–60s

> ⚠️ This is a real tragedy with real victims. Keep the tone **respectful**: no dramatised deaths, no faces of victims, and focus on what happened and on how people came together. Verify all numbers from official sources (Kerala government / NDMA) before publishing.

---

## 1. Why the reference works

- A **date stamp** in the first second sets the reel in real time and place.
- The **rain overlay** runs over every shot and makes the cuts feel seamless.
- Navy-only colours with **one red accent** hit hard emotionally.
- It goes from a single home to the whole state to the people watching on TV, so it moves from personal to collective.

---

## 2. Concept

The early hours of **30 July 2024**. Villages like **Mundakkai and Chooralmala** sleep under heavy rain. Then the hillside gives way. The reel moves from the quiet village to the landslide, then to the rescue (the Army-built Bailey bridge, volunteers), and ends on Kerala coming together.

**Hook (0–3s):**
> 2024 ജൂലൈ 30. പുലർച്ചെ. വയനാട് ഉറങ്ങുകയായിരുന്നു…
> *(30 July 2024. Early morning. Wayanad was asleep…)*

---

## 3. Design system

### Palette

| Role | Hex |
|---|---|
| Night sky | `#0B1530` |
| Hills | `#16264D`, `#22396B` |
| Houses / tea estate | `#2F4C86` |
| Window light (life) | `#F2D27A` |
| Mud / slide | `#3A2A22` → `#5C4433` |
| **Accent: rescue red** | `#D63A3A` (only on rescue items: jackets, lights, stretchers) |

**Colour story:** yellow windows mean life. Mud brown covers the yellow during the slide. Then **red** appears, which means help is coming.

### Typography

- Date stamp: Bebas Neue 72px, letter-spacing +150, top-left zone (x=110, y=320), typed on one character at a time
- Place names: Noto Sans Malayalam Bold 64px with a thin line pointing to a map location
- Subtitles: 52px, centred at y=1150

### Layers per scene

```
L5 Rain overlay (CC Rainfall, 35% opacity), constant across all scenes
L4 Foreground: tea bushes / leaves, blurred
L3 Subject: house / river / rescue workers
L2 Hills with tea rows
L1 Sky with clouds slowly drifting
```

---

## 4. Shot list

| Time | Shot | Camera / motion | Voiceover idea |
|---|---|---|---|
| 0–4s | Hillside village at night; yellow windows; date stamp types on | Slow push-in 100→108% | Hook |
| 4–10s | Close-up of one house; a lamp inside; rain on the roof | Push-in; window light flickers gently | "Days of non-stop rain…" |
| 10–16s | Top-view **map** of the hills; river line glowing; labels "മുണ്ടക്കൈ", "ചൂരൽമല" | Tilt down along the river | Location |
| 16–18s | **Black frame + rumble** | — | *(silence 0.5s, then deep rumble)* |
| 18–26s | Hillside: a mud mass slides down (mask reveal), covering windows one by one | Shake `wiggle(6,8)` that decays over 2s | What happened, kept factual |
| 26–32s | Morning: grey-blue sky, a river cutting through, the broken bridge | Slow lateral pan | The village cut off |
| 32–42s | **Red** appears: rescue jackets, a line of workers, the **Bailey bridge** being built (pieces slide in) | Parallax pan, stop-motion build of the bridge | Army, NDRF, fire force, volunteers |
| 42–50s | People silhouettes passing relief bags hand to hand (a chain) | Lateral pan | "All of Kerala came together…" |
| 50–55s | Wide shot of the hills, rain stopping, first light | Pull-out 115→100%, rain fades out | Closing line |
| 55–60s | Dip to black, then a text card: "ഓർമ്മകളിൽ" ("In memory") plus the logo | — | — |

---

## 5. Motion specs

- **Date typing:** Text Animator → Opacity 0, Range Selector Start 0→100% over 20 frames, plus a cursor blink.
- **Mud slide:** a mud-brown shape layer with an animated mask path from top to bottom over 3s (ease-in), plus Turbulent Displace (amount 20, evolution `time*50`) so the edge looks organic.
- **Windows going dark:** each window light opacity 100→0, staggered 3 frames apart as the mud reaches it.
- **River on the map:** a stroke path with Trim Paths, plus a soft Glow.
- **Bailey bridge build:** 6 segments, each sliding in 8 frames apart with Snap ease and a metal "clank" sound on each.
- **Rain stops:** CC Rainfall opacity 35→0% over 3s in the final shot.

---

## 6. Sound

- Constant rain ambience (lower it under the voice)
- Distant thunder at 4s and 12s
- **Total silence** for 0.5s before the slide, then a low rumble (sub-bass)
- Rescue section: a soft hopeful piano enters
- Ending: rain fades, birds chirp faintly at first light

## 7. Cover

- Dark hills, a single lit window, mud texture at the bottom
- Text: **"ആ രാത്രി"** ("That night"), 110px, with a small "30.07.2024" above it

## 8. Caption

> 2024 ജൂലൈ 30, വയനാട്. ഒരിക്കലും മറക്കാനാകാത്ത രാത്രി.
> #wayanad #kerala #cinemagicmalayalam #malayalam #history
