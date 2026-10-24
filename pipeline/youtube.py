"""Upload a reel to YouTube as a Short (YouTube Data API v3, resumable upload)."""
import json
import os
from pathlib import Path

import requests

TOKEN_URL = "https://oauth2.googleapis.com/token"
UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos"


def configured() -> bool:
    return all(os.getenv(k) for k in ("YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"))


def _access_token() -> str:
    r = requests.post(TOKEN_URL, data={
        "client_id": os.environ["YT_CLIENT_ID"], "client_secret": os.environ["YT_CLIENT_SECRET"],
        "refresh_token": os.environ["YT_REFRESH_TOKEN"], "grant_type": "refresh_token"}, timeout=60)
    if r.status_code >= 400:
        raise RuntimeError(f"YouTube token refresh failed: {r.text[:300]}")
    return r.json()["access_token"]


def build_metadata(script: dict, caption: str) -> dict:
    hook = script.get("thumbnail_ml") or " ".join(script.get("headline", []))
    english = " ".join(w.capitalize() for w in " ".join(script.get("headline", [])).split())
    title = f"{hook} | {english} #Shorts"
    if len(title) > 100:
        title = f"{hook[:80]} #Shorts"
    tags = [t.strip("#") for t in caption.split() if t.startswith("#")][:15]
    tags += ["Malayalam", "Shorts", "Kerala", "facts"]
    return {
        "snippet": {"title": title, "description": caption + "\n\n#Shorts #Malayalam",
                    "tags": list(dict.fromkeys(tags)), "categoryId": "27",       # Education
                    "defaultLanguage": "ml", "defaultAudioLanguage": "ml"},
        "status": {"privacyStatus": os.getenv("YT_PRIVACY", "public"), "selfDeclaredMadeForKids": False},
    }


def upload_short(video: Path, script: dict, caption: str) -> str:
    token = _access_token()
    meta = build_metadata(script, caption)
    init = requests.post(UPLOAD_URL, params={"uploadType": "resumable", "part": "snippet,status"},
                         headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json; charset=UTF-8",
                                  "X-Upload-Content-Type": "video/mp4", "X-Upload-Content-Length": str(video.stat().st_size)},
                         data=json.dumps(meta), timeout=60)
    if init.status_code >= 400:
        raise RuntimeError(f"YouTube upload init failed: {init.text[:500]}")
    with open(video, "rb") as f:
        up = requests.put(init.headers["Location"], headers={"Authorization": f"Bearer {token}", "Content-Type": "video/mp4"},
                          data=f, timeout=900)
    if up.status_code >= 400:
        raise RuntimeError(f"YouTube upload failed: {up.text[:500]}")
    data = up.json()
    vid = data["id"]
    print(f"  YouTube: https://youtube.com/shorts/{vid} ({data.get('status', {}).get('privacyStatus')})")
    return vid
