"""Step 1 + 2: Claude finds a topic (with web search) and writes the script."""
import anthropic

import config
from .utils import parse_json

client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)
CATEGORIES = ", ".join(config.BRAND["categories"])


def _ask(prompt: str, use_search: bool = False, max_tokens: int = 4000) -> str:
    """Send one prompt, follow server-tool pauses, return the final text."""
    messages = [{"role": "user", "content": prompt}]
    kwargs = {}
    if use_search:
        kwargs["tools"] = [{"type": "web_search_20250305", "name": "web_search", "max_uses": 6}]

    for _ in range(5):
        resp = client.messages.create(
            model=config.PLANNER_MODEL, max_tokens=max_tokens, messages=messages, **kwargs
        )
        if resp.stop_reason != "pause_turn":
            break
        # Long web searches can pause; send the partial turn back to continue
        messages = messages + [{"role": "assistant", "content": resp.content}]

    return "".join(block.text for block in resp.content if block.type == "text")


def find_topic(recent_titles: list[str], focus: str | None = None) -> dict:
    avoid = "\n".join(f"- {t}" for t in recent_titles[-60:]) or "- (none yet)"
    if focus:
        task = f"Research this topic on the web and find its most surprising angle: {focus}\nThe angle should:"
    else:
        task = "Search the web for what people are talking about this week. Pick ONE topic that:"
    prompt = f"""You pick topics for an Instagram Reels explainer page.
Niche: {config.BRAND['niche']}
Allowed categories: {CATEGORIES}

{task}
- connects to something current, but can be explained in 40 seconds
- has a surprising "wait, really?" angle
- is backed by reliable sources (major news, academic, official data)
- is not already covered in this list:
{avoid}

Reply with ONLY a JSON object, no other text:
{{"title": "short working title", "category": "one of the allowed categories",
  "angle": "the surprising angle in one sentence",
  "key_facts": ["4-6 specific, verifiable facts with numbers/dates"],
  "sources": ["url", "url"]}}"""
    topic = parse_json(_ask(prompt, use_search=True))
    topic["category"] = topic.get("category", "WORLD").upper()
    if topic["category"] not in config.BRAND["categories"]:
        topic["category"] = next(iter(config.BRAND["categories"]))
    return topic


def write_script(topic: dict) -> dict:
    prompt = f"""Write a 30-35 second Instagram Reel script for this topic: about 60 Malayalam words in total, each voiceover line max ~12 words. The LAST line must echo one word or phrase from the hook (the loop), so a replay feels seamless.

Topic: {topic['title']}
Category: {topic['category']}
Angle: {topic['angle']}
Facts you may use (use ONLY these or common knowledge, do not invent numbers):
{chr(10).join('- ' + f for f in topic.get('key_facts', []))}

Style: a curious, confident narrator. Short sentences.
Write every voiceover line (hook_voiceover and scenes[].voiceover) in natural, spoken
{config.VOICE_LANGUAGE} in its own script, the way a popular explainer creator talks. Keep names
and technical terms that people say in English as they are. Captions, headline and
image/visual fields stay in English.
Scene 0 is the cover: the hook that makes people stop scrolling.

WHAT MAKES MALAYALIS SHARE (use at least one): a link to something trending (a new Malayalam film, the season,
this week's weather or news), Kerala identity or nostalgia (grandmother's stories, Gulf, Onam, school days),
or a debate people have opinions on. Each scene may carry a small "kicker" label under its title
(e.g. "KERALA · 2,000 YEARS AGO", "LEGEND 1 · KALAKATTU ILLAM").
CAPTION: bilingual. First line a Malayalam hook + emoji, then the English line; then 2 short paragraphs,
each Malayalam followed by English; end with a personal question ("Which story did your grandmother tell
you?") and ONE share line ("Share this with that friend who loves history."); 4-5 hashtags incl. #UnexploredTruths.

DESIGN PLAN (you are the video designer as well as the writer)
- opening: decide how the reel opens.
  * "globe" = a 3D globe spins and zooms to the location with a pin, then the cover visual appears.
    Use it ONLY when the story is about one specific place most viewers couldn't point to on a map
    (a remote village, lake, crater, island, ruin) and seeing WHERE it is adds to the surprise.
  * "hero" = open straight on the most striking visual of the subject. Use this for objects,
    inventions, people, science ideas, events not tied to one obscure place, and well-known places.
  When unsure, choose "hero". Most reels should be "hero"; never use the globe out of habit.
- Every scene gets a punchy English headline (the caption, max 5 words, ALL CAPS feel) and up to two
  small map-style labels (ALL CAPS, max 3 words) for the key names, numbers or parts on screen.
- Visuals: full-screen, one clear hero subject per scene, motion that explains the point.
End with a twist or a thought-provoking last line, not "follow for more".

Reply with ONLY a JSON object, no other text:
{{
  "headline": ["2-3 SHORT LINES", "ALL CAPS", "MAX 14 CHARACTERS EACH"],
  "accent_words": ["1-2 words from the headline to colour"],
  "hook_voiceover": "first spoken line, under 12 words",
  "cover_visual": "one striking hero visual that sums up the topic, and how it moves",
  "opening": {{"type": "hero or globe", "lat": 0.0, "lon": 0.0, "label": "PLACE · REGION (globe only)", "why": "one line"}},
  "scenes": [
    {{"voiceover": "1-2 spoken sentences",
      "caption": "on-screen text, max 7 words",
      "highlight": "one word from the caption to colour",
      "visual": "hero subject for this moment + the one thing that moves/changes",
      "labels": [{{"text": "SHORT LABEL", "x": 0.5, "y": 0.45}}],
      "search_query": "2-4 word stock photo search"}}
  ],
  "thumbnail_ml": "a short, curiosity-driving question or claim in Malayalam for the cover (max 8 words)",
  "thumbnail_accent": ["1-2 words from thumbnail_ml to colour"],
  "instagram_caption": "first line under 60 chars with a name or number; 2-3 sentences; ONE ask only, phrased 'Share this with someone from <place>'; 4-6 hashtags at the end",
  "fact_check": ["each factual claim in the script -> which fact/source supports it"]
}}
Use 5-7 scenes."""
    script = parse_json(_ask(prompt))
    script["category"] = topic["category"]
    script["headline"] = [line.upper() for line in script["headline"]]
    script["accent_words"] = [w.upper() for w in script.get("accent_words", [])]
    return script


ANIMATION_RULES = """Write a JavaScript animation for one scene of a vertical (1080x1920) explainer reel.

Already defined for you (do NOT redefine): W, H, ACCENT (hex colour), DURATION (seconds),
rand() (seeded random 0-1), lerp(a,b,t), clamp(x,a=0,b=1), ease.in/out/inOut/sine(t),
rgba(hex, alpha), makeCanvas() (creates and returns a W x H canvas), THREE (three.js r128).

HARD RULES
- Define window.renderFrame = function(t) { ... } that draws the COMPLETE frame at time t
  seconds (0 <= t <= DURATION). Same t must always give the same image.
- Call rand() only during setup (e.g. to place particles), never inside renderFrame.
- No requestAnimationFrame, setTimeout, setInterval, Date, performance.now, Math.random,
  fetch, images, external files, fonts, or ANY text/letters/numbers on screen.
- For 3D: const renderer = new THREE.WebGLRenderer({canvas: makeCanvas(), antialias: true,
  preserveDrawingBuffer: true}); renderer.setSize(W, H, false); call renderer.render()
  inside renderFrame. Otherwise use Canvas 2D (makeCanvas().getContext('2d')).
- Each frame must render fast: pre-draw static parts (backgrounds, big gradients) once to
  offscreen canvases and drawImage them; at most ~3000 particles; no per-pixel loops.

LOOK
- Cinematic and premium: very dark background (near #05070d) with soft gradients and depth.
- ONE clear hero subject, centred around y = 0.38*H and about 60-75% of the width,
  built from shapes, gradients, glow, particles or simple 3D geometry. Make it recognisable.
- The lower 40% of the frame stays dark and fairly empty (captions go there).
- Use ACCENT for the key highlight; keep everything else muted blues/greys/whites.
- Constant subtle motion the whole time (drift, rotate, float, shimmer) PLUS one clear
  event that tells the story (something grows, fills, spreads, breaks, lights up, moves),
  eased over the scene with ease.inOut and finished by about 85% of DURATION.

Here is an example of the expected quality and structure:
```javascript
""" + "{EXAMPLE}" + """
```

Reply with ONLY the code in one ```javascript block."""


def _animation_prompt() -> str:
    from .animate import FALLBACK_JS
    return ANIMATION_RULES.replace("{EXAMPLE}", FALLBACK_JS.strip())


def write_animation(scene: dict, accent: str, duration: float) -> str:
    from .animate import extract_code
    prompt = (f"{_animation_prompt()}\n\nSCENE\nVisual: {scene['visual']}\n"
              f"Narration during this scene: {scene['voiceover']}\n"
              f"ACCENT = {accent}, DURATION = {duration:.2f}s")
    return extract_code(_ask(prompt, max_tokens=8000))


def fix_animation(code: str, error: str) -> str:
    from .animate import extract_code
    prompt = (f"{_animation_prompt()}\n\nThis animation failed with:\n{error}\n\n"
              f"Fix it and return the full corrected code.\n```javascript\n{code}\n```")
    return extract_code(_ask(prompt, max_tokens=8000))
