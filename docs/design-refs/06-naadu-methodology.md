# Naadu (by Revaik): Design Methodology

A breakdown of the visual, audio and storytelling system used by **@naadu.revaik** (*നാട് | Naadu: "World for malayalees"*), an AI-powered Malayalam channel that retells Kerala history as short cinematic reels.

Based on the profile grid plus a frame-by-frame review of the **10 most recent reels** (Nov 2026). Use it as a playbook for making content in the same style.

---

## 1. Core Concept

| Pillar | What it means |
|---|---|
| **Hyper-local subject** | Every reel is about Kerala: history, places, "firsts", myths and science. |
| **Native language first** | Headlines, narration and subtitles are in Malayalam. English is a small secondary line. |
| **Kerala and the world** | Each story links a Kerala place to a global name or event (Newton, Bruce Lee, Rome, Angkor Wat, Somalia). |
| **Curiosity hooks** | Titles are surprising claims or questions, not plain facts. |
| **Series format** | Numbered seasons: *കേരള ചരിത്രം · 15/20 · Kerala history in 20 reels*, then *സീസൺ 2*, plus *സ്പെഷ്യൽ* one-offs. |
| **Sourced and credible** | Every caption lists sources and licences. |

---

## 2. Last 10 Reels: Snapshot

| # | Hook (Malayalam, translated) | Kerala ↔ World link | Series | Length |
|---|---|---|---|---|
| 1 | The "King of the Lake" who drained Vembanad into 2,000+ acres of paddy | Kuttanad ↔ WWII rice famine | Season 2 | 70s |
| 2 | A word in every geography book was born in Malappuram | Angadipuram ↔ Angkor Wat ("laterite") | Season 2 | 75s |
| 3 | 25 Sep 2026, 11:20 PM: every coastal phone screamed (Kallakkadal) | Kerala coast ↔ storm 10,000 km away | Season 2 | 86s |
| 4 | Landing in Kochi from Dubai, you land on sunlight | Expat money ↔ world's first solar airport | Season 2 | 72s |
| 5 | Was the guru of Bruce Lee's and Jackie Chan's gurus a South Indian? | Kalari ↔ Kung Fu / Shaolin | 20/20 | 82s |
| 6 | Did Jatayu fall in Kollam or Lepakshi? | Chadayamangalam ↔ Ramayana film | Special | 84s |
| 7 | Same sea and wind, so why is Somalia a desert and Kerala green? | Western Ghats ↔ Somalia | 6/20 | 79s |
| 8 | India's first IT park was built in Kerala, not Bangalore | Technopark ↔ Bangalore/Hyderabad | 18/20 | 85s |
| 9 | 300 years before Newton, a man from Irinjalakuda wrote calculus | Madhava ↔ Newton/Leibniz | 15/20 | 80s |
| 10 | Was Aryabhata, who gave the world zero, a Malayali? | Kodungallur ↔ world mathematics | 3/20 | 66s |

**Takeaways**
- **Length:** 65–86 seconds (average about 78s). Long enough to tell a story and short enough to finish.
- **Topic mix:** history (4), science/geography (3), modern pride (2), myth (1).
- **Timely hooks:** the Kallakkadal reel uses a real alert from the week before. The Jatayu reel rides on the *Ramayana* film release.
- **Debate bait:** many titles end with "?" and ask the viewer to pick a side (Kollam or Lepakshi, yes or no).

---

## 3. Cover / Thumbnail Anatomy

```
┌─────────────────────────────┐
│  MALAYALAM HEADLINE         │  ← Layer 1: white, heavy, centred, 1–2 lines
│   ENGLISH SUBTITLE IN CAPS  │  ← Layer 2: tiny, gold, letter-spaced
│                             │
│    CINEMATIC HERO IMAGE     │  ← Layer 3: photoreal AI art, golden hour / dusk
│   (subject in lower 2/3)    │
└─────────────────────────────┘
```

- **Headline:** 2–6 words, pure white with a soft shadow, in the clear sky area.
  e.g. *കായൽ രാജാവ്* (King of the Lake), *കേരളത്തെ കാത്ത മതിൽ* (The wall that protected Kerala).
- **Subtitle:** ALL CAPS English in warm yellow, for example *THIS WHOLE FIELD WAS ONCE A LAKE*.
- **Hero image:** photoreal, film-still AI art. The top third stays empty for text.

---

## 4. In-Reel Visual System

The covers are photoreal, but **inside the reels the look changes to stylised 3D animation** (simple low-poly or game-engine scenes: paddy grids, laterite quarries, planes, palm-lined paths, temples on water). This keeps production fast and the look consistent.

### Recurring on-screen layers (every reel)

```
┌─────────────────────────────┐
│   ചാപ്റ്റർ ഹെഡിങ് / Chapter  │  ← Chapter title: Malayalam, white, bold
│   ENGLISH LINE IN GOLD CAPS │     changes at every story beat
│        [DATA HUD]           │  ← Optional counters: "DAYS 8 · KM 9,850", "ACRES 208"
│                             │
│     3D SCENE / EARTH        │
│                             │
│     [ KUTTANAD · VEMBANAD ] │  ← Lower-third location tag: gold caps on a dark strip
│  നറേഷൻ സബ്‌ടൈറ്റിൽ ഇവിടെ     │  ← Subtitle: 1–2 short lines, white on a dark box
└─────────────────────────────┘
```

| Element | Spec |
|---|---|
| **Chapter title** | Format is `YEAR · NAME` or a short phrase (e.g. *1800 · ഫ്രാൻസിസ് ബുക്കാനൻ*, *യുദ്ധകാലം · അരിക്ഷാമം*). It updates every 8–15s. |
| **English sub-line** | Gold, all caps, tiny. It translates or contextualises the chapter. |
| **Location tag** | Lower third: `PLACE · REGION` in gold caps with a dark band. |
| **Subtitles** | These are the narration word for word. Chunks of 1–2 lines, centred, white on a semi-transparent black box. |
| **Data HUD** | Small counters for numbers (days, km, acres, years). Turns facts into visuals. |

### Signature transitions
- **NASA Earth zoom:** almost every reel opens or bridges with a 3D globe (NASA Blue Marble / Black Marble) that zooms into Kerala or swings out to the other location (Africa, China, Cambodia). This is the main "Kerala ↔ World" device.
- **Satellite to ground:** satellite imagery dissolves into the 3D scene.
- **Archival inserts:** old maps, museum photos and newspaper clippings appear briefly as proof.

---

## 5. Audio Methodology

> Note: I can't listen to audio. These findings come from the **on-screen subtitles (which follow the voice-over line by line), the caption credits, the audio label, and a loudness measurement** of the reel audio taken in the browser.

| Aspect | What they do |
|---|---|
| **Audio source** | All 10 reels use **"Original audio"**, with no trending songs. The sound is part of the brand. |
| **Voice** | **AI-generated Malayalam narration** (credit: *"Voice, sound effects and animation: Revaik"*). One narrator in an explainer or storyteller voice. |
| **Sound design** | Custom SFX by Revaik (alarms, water, wind, aircraft and similar to match each scene). |
| **Density** | Narration starts **in the first second**, and there is **no dead air**. Measured loudness stays steady at about −14 to −23 dBFS per second (median about −16, peaks about −10), with no silent gaps. The mix is dense and well compressed, so it works well on phone speakers. |
| **Pacing** | Short spoken sentences, each matching one subtitle chunk (about 2–3 seconds each). That gives roughly 25–35 lines per reel. |
| **Script ↔ screen sync** | Every chapter-title change matches a new beat in the narration (a year, a person or a place). |
| **Spoken CTA** | The **last spoken line is the comment question**, word for word as in the caption (e.g. *"നിങ്ങളുടെ ഉത്തരം കമന്റ് ചെയ്യൂ"*, *"നിങ്ങളുടെ വീടും ചെങ്കല്ലാണോ? കമന്റ് ചെയ്യൂ"*). |

### Narration script pattern
```
0–3s   Hook line: claim or question + a name/date the viewer knows
3–15s  Context: "In the 1940s Travancore was short of rice…"
15–55s Story beats (3–5), one chapter title each, with numbers stated aloud
55–70s Twist or payoff: "…and that water gave us Kochi."
Last   Spoken question → "comment below"
```

### Recreating the audio
- Malayalam TTS voice: clear, warm, slightly dramatic. Keep one consistent voice across all reels.
- A low ambient music bed (keep it quiet under the voice) plus 1–2 SFX hits for each beat.
- Normalise to about −14 LUFS for Instagram and avoid long silences.
- Write each subtitle chunk as one breath of narration.

---

## 6. Reel Story Structure

1. **Hook (0–3s):** a bold claim or question over a globe or hero shot.
   *"Same sea, same wind… a desert?"* · *"25 September, 11:20 PM."*
2. **Bridge to the present:** link the history to something viewers lived through (the 2018 floods, a phone alert, flying home from the Gulf).
3. **Zoom out:** the Earth turns to show the global link.
4. **Story beats:** 3–5 chapters, each with a year or place title and numbers.
5. **Twist or payoff:** the surprising result.
6. **Close:** a spoken question that invites comments, sometimes as a yes/no or one-or-the-other choice.

---

## 7. Caption Formula

```
[Hook question in Malayalam] + 1 emoji (🌾 🧱 🚨 ☀️ 🥋 🦅 🌧️ 💻 📱 🤔)

[2–3 line story teaser in Malayalam; ends on an open question]

[Comment CTA: "Have you seen…? / Answer yes or no. Comment 👇"]
[Targeted share CTA: "Share with your Kuttanad friend / your geography teacher /
 your expat friend / family WhatsApp group." + "Don't forget to save!"]

[One-line English summary]

[Series tag: കേരള ചരിത്രം · 15/20 · Kerala history in 20 reels]

Credits:
• Source · specific fact cited · licence
• Earth imagery: NASA Blue Marble, Black Marble and MODIS · public domain
• Voice, sound effects and animation: Revaik
• Cover art: Revaik

#Topic #Place #KeralaHistory #MalayalamReels #KeralaPride   (exactly 5)
```

**The targeted share CTA matters most.** Each reel names a specific person to send it to: *a Kuttanad friend, a geography teacher, an expat friend waiting to come home, a friend who learned Kalari, someone going to watch Ramayana*. This drives DM shares.

---

## 8. Colour Palette

| Role | Colours |
|---|---|
| Warm primary | Saffron `#E8892B`, Gold `#F2B33D`, Amber `#C9731F` |
| Kerala greens | Paddy `#5FA83A`, Palm `#2F5D2A` |
| Earth | Laterite red `#A8452A`, Terracotta `#8C3B22` |
| Cool accent | Backwater teal `#2E8C9A`, Space/Night `#0B1426` |
| Text | White `#FFFFFF`, Label gold `#F5C542`, Subtitle box `#000000` at about 60% opacity |

---

## 9. Profile and Grid Strategy

- **Bio:** Brand name in English and Malayalam, the mission line, "Powered by Revaik", an email and a link.
- **Avatar:** A minimal "R" monogram on a warm gradient.
- **Pinned posts:** The 3 strongest hooks.
- **Grid:** Every cover uses the same text template and warm grade, so the grid reads as one series.
- **Cadence:** About one reel every 1–2 days. Finite numbered seasons create a binge and completion urge.

---

## 10. Topic Ideation Framework

**Title rule:** *Familiar Kerala place + famous global name/event + surprising claim or question.*

| Angle | Examples |
|---|---|
| Kerala beat the world first | Madhava before Newton · Technopark before Bangalore · first solar airport |
| Hidden origin | "Laterite" from Malappuram · Kerala gurus behind Kung Fu |
| Geography as hero | The Western Ghats as Kerala's wall · Kallakkadal swells |
| Disaster or turning point | The 1341 flood that buried Muziris |
| Myth vs. claim | Jatayu: Kollam or Lepakshi? · Aryabhata a Malayali? |
| News-jacking | A recent alert, film release or anniversary turned into a history reel |

---

## 11. Prompt Templates

**Cover art (photoreal):**
```
Cinematic [aerial / low-angle] shot of [Kerala subject], [era] Kerala,
golden hour, volumetric light, atmospheric haze, coconut palms,
photorealistic film still, warm amber and teal grade, vertical 9:16,
empty sky in top third for title text
```

**In-reel scenes (stylised 3D):**
```
Low-poly stylised 3D scene of [subject], bright saturated colours,
simple geometry, soft daylight, drone camera move, vertical 9:16
```

---

## 12. Production Checklist

- [ ] Kerala topic with a global link and a surprising angle
- [ ] Cover: white Malayalam headline, gold English line, photoreal AI art, top third clear
- [ ] Hook spoken in the first second, with no dead air
- [ ] NASA globe zoom for the Kerala ↔ World transition
- [ ] Chapter title at each beat (`YEAR · NAME`) with an English sub-line
- [ ] Lower-third location tag and data HUD for numbers
- [ ] Subtitles that follow the narration in chunks of 1–2 lines
- [ ] AI Malayalam voice, custom SFX, "Original audio"
- [ ] Twist or payoff, then the spoken comment question
- [ ] 65–85 seconds total
- [ ] Caption: hook, teaser, comment CTA, **targeted** share CTA, save, English line, series tag, credits, 5 hashtags

---

*Source: instagram.com/naadu.revaik, profile grid and the 10 latest reels, reviewed 17 Nov 2026. Hex colours are approximate. Audio findings are inferred from subtitles, credits and loudness measurement, not from listening.*
