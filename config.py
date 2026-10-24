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

# "code": Claude writes a fresh code animation per scene (no image API needed)
# "image": AI images / stock photos with a slow zoom
VISUAL_MODE = os.getenv("VISUAL_MODE", "code").lower()
IMAGE_PROVIDER = os.getenv("IMAGE_PROVIDER", "openai").lower()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_IMAGE_MODEL = os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-1")
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")

VOICE_PROVIDER = os.getenv("VOICE_PROVIDER", "elevenlabs").lower()
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")
ELEVENLABS_MODEL = os.getenv("ELEVENLABS_MODEL", "eleven_v3")  # v3 supports Malayalam
# Different narrator for each reel, rotating through this list. These are ElevenLabs'
# built-in voices; replace or add IDs from your Voice Library (e.g. native Malayalam voices).
VOICE_POOL = [
    {"name": "Brian", "id": "nPczCjzI2devNBz1zQrb", "style": "deep male storyteller"},
    {"name": "Sarah", "id": "EXAVITQu4vr4xnAQ5r1R", "style": "soft female"},
    {"name": "Adam", "id": "pNInz6obpgDQGcFmaJgB", "style": "deep male"},
    {"name": "Charlotte", "id": "XB0fDUnXU5powFXDhCwa", "style": "warm female"},
    {"name": "Daniel", "id": "onwK4e9ZLuTAKqWW03F9", "style": "authoritative male"},
    {"name": "Lily", "id": "pFZP5JQG7iQjIQuC4Bku", "style": "gentle female"},
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
        "Short, surprising explainers about money, history, science, "
        "climate, nature and world affairs for a general audience"
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
    },
    "text_color": "#FFFFFF",
    # Added to every image prompt so all reels share one look
    "image_style": (
        "cinematic photorealistic 3D render, dramatic moody lighting, dark "
        "background, single clear subject in the upper-middle of the frame, "
        "lower third of the image dark and empty, vertical 9:16, no text, "
        "no letters, no logos, no watermarks"
    ),
    "music_volume": 0.12,  # 0.0-1.0, background music under the voice
}

# ---------------- Video ----------------
WIDTH, HEIGHT, FPS = 1080, 1920, 30
COVER_MIN_SECONDS = 2.2  # the headline cover is shown at least this long
SCENE_PADDING = 0.35     # small pause after each voice line
RENDER_WORKERS = int(os.getenv("RENDER_WORKERS", "3"))  # animations rendered in parallel
