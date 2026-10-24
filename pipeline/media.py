"""Step 3 + 4: images and voiceover."""
import base64
from pathlib import Path

import requests

import config


# ---------------- Images ----------------
def generate_image(prompt: str, search_query: str, out_path: Path) -> Path:
    if config.IMAGE_PROVIDER == "pexels":
        return _pexels(search_query or prompt, out_path)
    return _openai_image(prompt, out_path)


def _openai_image(prompt: str, out_path: Path) -> Path:
    resp = requests.post(
        "https://api.openai.com/v1/images/generations",
        headers={"Authorization": f"Bearer {config.OPENAI_API_KEY}"},
        json={
            "model": config.OPENAI_IMAGE_MODEL,
            "prompt": f"{prompt}. Style: {config.BRAND['image_style']}",
            "size": "1024x1536",
            "n": 1,
        },
        timeout=300,
    )
    resp.raise_for_status()
    item = resp.json()["data"][0]
    if item.get("b64_json"):
        out_path.write_bytes(base64.b64decode(item["b64_json"]))
    else:
        out_path.write_bytes(requests.get(item["url"], timeout=120).content)
    return out_path


def _pexels(query: str, out_path: Path) -> Path:
    resp = requests.get(
        "https://api.pexels.com/v1/search",
        headers={"Authorization": config.PEXELS_API_KEY},
        params={"query": query, "orientation": "portrait", "per_page": 5},
        timeout=60,
    )
    resp.raise_for_status()
    photos = resp.json().get("photos", [])
    if not photos:
        raise RuntimeError(f"No Pexels photo found for '{query}'")
    url = photos[0]["src"]["large2x"]
    out_path.write_bytes(requests.get(url, timeout=120).content)
    return out_path


# ---------------- Voice ----------------
def generate_voice(text: str, out_path: Path) -> Path:
    if config.VOICE_PROVIDER == "openai":
        resp = requests.post(
            "https://api.openai.com/v1/audio/speech",
            headers={"Authorization": f"Bearer {config.OPENAI_API_KEY}"},
            json={"model": config.OPENAI_TTS_MODEL, "voice": config.OPENAI_TTS_VOICE,
                  "input": text, "response_format": "mp3"},
            timeout=120,
        )
    else:
        resp = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{config.ELEVENLABS_VOICE_ID}",
            headers={"xi-api-key": config.ELEVENLABS_API_KEY},
            params={"output_format": "mp3_44100_128"},
            json={"text": text, "model_id": config.ELEVENLABS_MODEL},
            timeout=120,
        )
    if resp.status_code >= 400:
        raise RuntimeError(f"Voice API error {resp.status_code}: {resp.text[:500]}")
    out_path.write_bytes(resp.content)
    return out_path
