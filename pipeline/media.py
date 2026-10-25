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
def _edge_voice(text: str, out_path: Path, voice_id: str) -> Path:
    import asyncio
    import edge_tts
    voice, rate, pitch = (voice_id.split("|") + ["+0%", "+0Hz"])[:3]
    for attempt in range(3):
        try:
            asyncio.run(edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(str(out_path)))
            if out_path.exists() and out_path.stat().st_size > 1000:
                return out_path
        except Exception as e:
            err = e
    raise RuntimeError(f"Edge voice failed: {err if 'err' in dir() else 'empty audio'}")


def _gemini_voice(text: str, out_path: Path, voice_name: str) -> Path:
    import base64, subprocess, time
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{config.GEMINI_TTS_MODEL}:generateContent"
    body = {"contents": [{"parts": [{"text": f"{config.GEMINI_STYLE}:\n{text}"}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice_name}}}}}
    for attempt in range(4):
        r = requests.post(url, params={"key": config.GEMINI_API_KEY}, json=body, timeout=180)
        if r.status_code == 429 or r.status_code >= 500:          # rate limit / busy: wait and retry
            time.sleep(15 * (attempt + 1)); continue
        if r.status_code >= 400:
            raise RuntimeError(f"Gemini TTS error {r.status_code}: {r.text[:300]}")
        part = r.json()["candidates"][0]["content"]["parts"][0]["inlineData"]
        pcm = out_path.with_suffix(".pcm"); pcm.write_bytes(base64.b64decode(part["data"]))
        rate = "24000"
        if "rate=" in part.get("mimeType", ""):
            rate = part["mimeType"].split("rate=")[1].split(";")[0]
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", rate, "-ac", "1", "-i", str(pcm),
                        "-af", "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse",
                        "-c:a", "libmp3lame", "-b:a", "128k", str(out_path)], check=True)
        time.sleep(2)                                              # gentle on the free-tier rate limit
        return out_path
    raise RuntimeError("Gemini TTS kept hitting its rate limit")


def generate_voice(text: str, out_path: Path, voice_id: str | None = None, provider: str | None = None) -> Path:
    provider = provider or config.VOICE_PROVIDER
    if provider == "gemini":
        return _gemini_voice(text, out_path, voice_id or config.GEMINI_VOICE_POOL[0]["id"])
    if provider == "edge":
        return _edge_voice(text, out_path, voice_id or config.EDGE_VOICE_POOL[0]["id"])
    if provider == "openai":
        resp = requests.post(
            "https://api.openai.com/v1/audio/speech",
            headers={"Authorization": f"Bearer {config.OPENAI_API_KEY}"},
            json={"model": config.OPENAI_TTS_MODEL, "voice": config.OPENAI_TTS_VOICE,
                  "input": text, "response_format": "mp3"},
            timeout=120,
        )
    else:
        resp = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id or config.ELEVENLABS_VOICE_ID}",
            headers={"xi-api-key": config.ELEVENLABS_API_KEY},
            params={"output_format": "mp3_44100_128"},
            json={"text": text, "model_id": config.ELEVENLABS_MODEL},
            timeout=120,
        )
    if resp.status_code >= 400:
        raise RuntimeError(f"Voice API error {resp.status_code}: {resp.text[:500]}")
    out_path.write_bytes(resp.content)
    return out_path
