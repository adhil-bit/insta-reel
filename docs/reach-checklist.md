# Reach checklist (owner's standing rule, 26 Nov 2026)

Every new reel on **both pages** is written against these 7 rules before it is rendered.
Source: the owner's 7-slide "why people share" guide. A reel must score **at least 5 of 7**,
and **Curiosity, Simplicity and Conversation starter are required**. Write the score in
`script.json` under `"reach"` (see the bottom of this page).

| # | Rule | Test before rendering | Page 1 @unexplored.truths | Page 2 @kathayum.sathyangalum |
|---|---|---|---|---|
| 1 | **Relatability** | Could a Malayali viewer say "this happened to me / I've been there"? | Tie the mystery to a place, food, festival or habit they know ("you've crossed this river on the Kozhikode bus"). | Open in a scene from their week: Sunday at home, the family WhatsApp group, aunties' comments, the exam hall, KSRTC, 90s-kid memories. |
| 2 | **Emotion** | Name ONE feeling the reel aims at: humour, surprise, nostalgia, happiness or inspiration. | Surprise or awe first; avoid fear-only endings. | Humour or nostalgia first, then the "oh, that's why" surprise. |
| 3 | **Usefulness** | Is there one thing the viewer can use or tell someone today? | A fact worth repeating, or a place worth visiting. | A tip to try ("next time this happens, do X"), a scam to spot, a study or sleep trick. |
| 4 | **Identity** | Does it let someone say "this is so me" or "this is my friend"? | Kerala pride, the pravasi, the history nerd. | Introverts, exam students, overthinkers, 90s kids, pravasis, content creators. The share line names that person: "ഇത് ആ ഓവർതിങ്കർ ഫ്രണ്ടിന് അയയ്ക്കൂ". |
| 5 | **Conversation starter** (required) | Does it end with a question people can answer in one word? | "Legend or history: which do you believe?" | "നിങ്ങളും ഇങ്ങനെ ചെയ്തിട്ടുണ്ടോ?", "ഇതിൽ നിങ്ങൾ ആരുടെ ഭാഗത്താണ്?", "പഴയകാലമോ പുതിയകാലമോ?" Spoken in the last scene **and** the last line of the caption. |
| 6 | **Curiosity** (required) | Does the hook hold back the answer until the end? | "ഇതിന്റെ പിന്നിലെ യഥാർത്ഥ കാരണം…", "നിങ്ങൾക്കറിയാമോ?" | "Most people don't know this", "നിങ്ങൾ ഇതുവരെ ശ്രദ്ധിക്കാത്ത ഒരു കാര്യം". Never "നിങ്ങൾ ഊഹിക്കില്ല". |
| 7 | **Simplicity** (required) | One idea per reel; could a 14-year-old repeat it after one watch? | ≤ ~60 spoken words, on-screen captions ≤ 7 words, one hero visual per scene. | Explain the psychology term once in plain Malayalam; no second term in the same reel. |

## How it fits the existing house rules

- The caption still has **one ask**: rule 5's question, then rule 4's share/tag line. Nothing else.
- The hook rules in `HANDOFF.md` §6 still apply; rule 6 is how the hook is written.
- The 30–35 s length, share line mid-reel and text inside y 300–1500 are unchanged.

## In `script.json`

```json
"reach": {
  "relatable": "family WhatsApp group forward",
  "emotion": "humour",
  "useful": "check the source before forwarding",
  "identity": "the uncle who forwards everything",
  "question": "നിങ്ങളുടെ ഫാമിലി ഗ്രൂപ്പിൽ ഇങ്ങനെ ഒരാളുണ്ടോ?",
  "curiosity": "why a lie feels true the 3rd time",
  "score": 7
}
```
