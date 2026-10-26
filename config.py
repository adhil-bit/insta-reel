"""All settings live here. Edit BRAND to make the page your own."""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

ROOT = Path(__file__).parent
OUTPUT_DIR = ROOT / "output"
MUSIC_DIR = ROOT / "music"
FONTS_DIR = ROOT / "fonts"
HISTORY_FILE = ROOT / "history.json"

# ---------------- API settings ----------------
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-sonnet-5-5")
# Video design planning (research, script, scene-by-scene visual plan and animation code)
# is done by Claude Fable 5.1. Override with the PLANNER_MODEL variable if needed.
PLANNER_MODEL = os.getenv("PLANNER_MODEL", "claude-fable-5-1")

# "code": Claude writes a fresh code animation per scene (no image API needed)
# "image": AI images / stock photos with a slow zoom
VISUAL_MODE = os.getenv("VISUAL_MODE", "code").lower()
IMAGE_PROVIDER = os.getenv("IMAGE_PROVIDER", "openai").lower()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_IMAGE_MODEL = os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-1")
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")

VOICE_PROVIDER = os.getenv("VOICE_PROVIDER", "gemini").lower()  # gemini (falls back to edge) | edge | elevenlabs | openai
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")
ELEVENLABS_MODEL = os.getenv("ELEVENLABS_MODEL", "eleven_v3")  # v3 supports Malayalam
# Different narrator for each reel, rotating through this list. These are ElevenLabs'
# built-in voices; replace or add IDs from your Voice Library (e.g. native Malayalam voices).
VOICE_POOL = [
    {"name": "Brian", "id": "nPczCjzI2devNBz1zQrb", "style": "deep male storyteller"},
    {"name": "Adam", "id": "pNInz6obpgDQGcFmaJgB", "style": "deep male"},
    {"name": "Daniel", "id": "onwK4e9ZLuTAKqWW03F9", "style": "authoritative male"},
    {"name": "Lily", "id": "pFZP5JQG7iQjIQuC4Bku", "style": "gentle female"},
]
# Gemini text-to-speech (Google AI Studio key). Expressive voices; the style prompt
# below is applied to every line. Falls back to the Edge voices if Gemini fails.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_TTS_MODEL = os.getenv("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
GEMINI_TTS_MODELS = [GEMINI_TTS_MODEL, "gemini-2.5-pro-preview-tts"]   # each has its own free daily limit
GEMINI_STYLE = os.getenv("GEMINI_STYLE", "You are a native Malayali from Kerala narrating a popular Malayalam Instagram explainer. "
                         "Speak in natural, conversational Kerala Malayalam with an authentic Kerala accent, like talking "
                         "to a friend: warm, curious, expressive, medium-fast, a little dramatic pause before the twist. "
                         "Say English words (KGF, 1902) the way Malayalis naturally say them. Leave a clear one-second pause "
                         "between paragraphs. Read this")
GEMINI_VOICE_POOL = [   # your picks; reels alternate male / female
    {"name": "Charon", "id": "Charon", "gender": "m", "style": "informative"},
    {"name": "Despina", "id": "Despina", "gender": "f", "style": "smooth"},
    {"name": "Enceladus", "id": "Enceladus", "gender": "m", "style": "breathy"},
    {"name": "Callirrhoe", "id": "Callirrhoe", "gender": "f", "style": "easy-going"},
    {"name": "Puck", "id": "Puck", "gender": "m", "style": "upbeat"},
    {"name": "Zephyr", "id": "Zephyr", "gender": "f", "style": "bright"},
]

# Free native Malayalam voices (Microsoft read-aloud). Variants by speed and pitch so
# reels don't all sound the same. id format: "voice|rate|pitch"
EDGE_VOICE_POOL = [   # Midhun only: the free female voice (Sobhana) sounded robotic
    {"name": "Midhun", "id": "ml-IN-MidhunNeural|+0%|+0Hz", "style": "male"},
]
OPENAI_TTS_MODEL = os.getenv("OPENAI_TTS_MODEL", "gpt-4o-mini-tts")
OPENAI_TTS_VOICE = os.getenv("OPENAI_TTS_VOICE", "onyx")

IG_USER_ID = os.getenv("IG_USER_ID")
IG_ACCESS_TOKEN = os.getenv("IG_ACCESS_TOKEN")
IG_GRAPH_HOST = os.getenv("IG_GRAPH_HOST", "graph.facebook.com")
GRAPH_API_VERSION = os.getenv("GRAPH_API_VERSION", "v23.0")

# ---------------- Your brand ----------------
# Voiceover language. On-screen text stays in English (like the reference page).
VOICE_LANGUAGE = os.getenv("VOICE_LANGUAGE", "Malayalam")

BRAND = {
    "name": "UNEXPLORED TRUTHS",
    "handle": "@unexplored.truths",
    "niche": (
        "A Malayalam Instagram page of short, surprising explainers: hidden history, "
        "science, nature, space and real mysteries, ideally with a Kerala or India angle, "
        "told as a story with a twist (audience: Malayalis aged 18-40)"
    ),
    # Category -> accent colour used for the tag and the highlighted words
    "categories": {
        "MONEY": "#F2B632",
        "HISTORY": "#F59E3B",
        "SCIENCE": "#34D399",
        "CLIMATE": "#FF4D5E",
        "NATURE": "#84CC16",
        "WORLD": "#FACC15",
        "TECH": "#38BDF8",
        "MYSTERY": "#FF4D5E",
        "SPACE": "#A78BFA",
        "CULTURE": "#F472B6",
    },
    "text_color": "#FFFFFF",
    # Added to every image prompt so all reels share one look
    "image_style": (
        "cinematic photorealistic 3D render, dramatic moody lighting, dark "
        "background, single clear subject in the upper-middle of the frame, "
        "lower third of the image dark and empty, vertical 9:16, no text, "
        "no letters, no logos, no watermarks"
    ),
    "music_volume": 0.12,
    "template": "explainer",    # reel look: "explainer" (full-screen, pop-in headlines, subtitles), "archive" or "classic"
    # added to every caption when posting (on top of each reel's topic tags)
    "end_card": {
        "ask": "ഇഷ്ടപ്പെട്ടോ?",
        "main_html": "കൂടുതൽ കഥകൾക്ക് <b>ഫോളോ</b> ചെയ്യൂ",
        "share": "ഒരു സുഹൃത്തിന് അയച്ചുകൊടുക്കൂ 📩",
    },
    "broad_hashtags": ["#explorepage", "#reelstagram", "#viral", "#reelitfeelit"],  # 0.0-1.0, background music under the voice
}

# ---------------- Video ----------------
WIDTH, HEIGHT, FPS = 1080, 1920, 24  # 24 fps: looks the same on Reels, ~20% less rendering
COVER_MIN_SECONDS = 1.2  # the headline cover is shown at least this long
SCENE_PADDING = 0.18     # small pause after each voice line
END_CARD_SECONDS = 2.0  # 'follow us' card at the end of every reel
TARGET_SECONDS = 44     # aim for reels about this long; longer narration is gently sped up
MAX_SPEEDUP = 1.12      # never speed the voice up more than this (done by the voice engine itself)
RENDER_WORKERS = int(os.getenv("RENDER_WORKERS", "3"))  # animations rendered in parallel


# Posting table (IST). The post workflow checks every hour and posts whenever a slot
# has passed that hasn't been used yet, so a late or skipped GitHub run is caught up.
POST_SLOTS = {   # 3 posts a day (IST). Set at :06 so the hourly :07 check posts them at about :07-:10
    "Mon": ["06:06", "12:06", "16:06"], "Tue": ["07:06", "13:06", "17:06"],
    "Wed": ["08:06", "14:06", "19:06"], "Thu": ["07:06", "13:06", "17:06"],
    "Fri": ["06:06", "12:06", "16:06"], "Sat": ["10:06", "14:06", "20:06"],
    "Sun": ["10:06", "14:06", "20:06"],
}
# One-off changes to a specific day's slots (IST), e.g. moving tonight's post earlier
SLOT_OVERRIDES = {
    "2026-10-26": ["04:54", "09:06", "18:06"],   # Thalassery cake at the 6:07 PM check
}
MIN_GAP_MINUTES = 40   # never post two reels closer together than this
