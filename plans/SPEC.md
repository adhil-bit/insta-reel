# Locked design plans

Each reel gets one file `plans/<slug>.json`, written by the **planner (Claude Fable 5.1)** and then
**built exactly as written** by the builder (Claude Opus 5.5). Once `"locked": true`, the builder
must not change the story, facts, wording, opening, headlines, labels or shot list; it only turns
each `build_cmd` into animation code. Changes go back to the planner.

## Format

```json
{
  "slug": "lake-nyos",
  "title": "Lake Nyos: the lake that breathed out death",
  "category": "NATURE",                 // HISTORY SCIENCE NATURE MYSTERY SPACE MONEY TECH WORLD CULTURE CLIMATE
  "priority": 7,                        // posting order (6-11 for this batch)
  "locked": true,
  "facts": [{"claim": "...", "source": "..."}],
  "opening": {"type": "hero | globe", "lat": 6.44, "lon": 10.30, "label": "LAKE NYOS · CAMEROON",
              "why": "globe only if WHERE it is adds to the surprise; otherwise hero"},
  "accent": "#hex colour for this reel",
  "voice": "auto | Charon | Despina | Enceladus | Callirrhoe | Puck | Zephyr",
  "music_mood": "one line",
  "cover": {
    "headline": ["MAX 14 CHARS", "PER LINE"],  "accent_words": ["ONE"],
    "thumbnail_ml": "Malayalam hook, max 8 words", "thumbnail_accent": ["word"],
    "hook_voiceover_ml": "first spoken line in conversational Malayalam, under 14 words",
    "visual": "the cover shot", "build_cmd": "exact instructions for the cover animation"
  },
  "scenes": [                            // 5 scenes, whole reel 30-40 s
    {
      "voiceover_ml": "1-2 short spoken sentences, conversational Kerala Malayalam",
      "headline": "MAX 5 WORDS (English, shown big at the top)",
      "highlight": "one word of the headline to colour",
      "labels": [{"text": "MAX 3 WORDS", "x": 0.5, "y": 0.45, "at": 0.3}],   // optional, max 2
      "visual": "what the viewer sees",
      "build_cmd": "exact instructions: shapes, layout (x/y as fractions of 1080x1920), colours, what moves, timing as fractions of the scene, camera moves. Keep the top 20% and bottom 25% of the frame clear for the headline and subtitles."
    }
  ],
  "instagram_caption": "2-3 sentences + 4-6 hashtags",
  "fact_check": ["claim -> source"]
}
```

## Rules the plan must follow
- Length: about 35 s (≈60 Malayalam words incl. the hook). No shot holds longer than ~4 s: give every scene a mid-scene change.
- Loop line: the last spoken line echoes a word or phrase from the hook.
- Hero subject first: every scene has one clear subject; motion explains the point.
- Globe opening is rare: only remote/unknown places where location is part of the surprise.
- Malayalam narration is conversational (like talking to a friend), English headlines are punchy.
- No real people's faces, no gore, no brand logos or copyrighted characters.
- Every number or claim must appear in `facts` with a source.
