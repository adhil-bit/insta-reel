"""Step 6: publish a Reel through the official Instagram API.

The Instagram-login API needs the video at a public URL, so the file is put on a
short-lived anonymous host (deleted automatically after an hour) just long enough
for Instagram to fetch it."""
import time
from pathlib import Path

import requests

import config

GRAPH = f"https://{config.IG_GRAPH_HOST}/{config.GRAPH_API_VERSION}"


def _check(resp: requests.Response) -> dict:
    data = resp.json()
    if resp.status_code >= 400 or "error" in data:
        raise RuntimeError(f"Instagram API error: {data}")
    return data


def _temporary_url(video: Path) -> str:
    """Upload to a temporary file host and return a direct link."""
    errors = []
    try:   # Litterbox: files auto-delete after 1 hour
        with open(video, "rb") as f:
            r = requests.post("https://litterbox.catbox.moe/resources/internals/api.php",
                              data={"reqtype": "fileupload", "time": "1h"},
                              files={"fileToUpload": (video.name, f, "video/mp4")}, timeout=300)
        if r.ok and r.text.startswith("https://"):
            return r.text.strip()
        errors.append(f"litterbox: {r.status_code} {r.text[:200]}")
    except Exception as e:
        errors.append(f"litterbox: {e}")
    try:   # 0x0.st fallback, expires after 1 hour
        with open(video, "rb") as f:
            r = requests.post("https://0x0.st", files={"file": (video.name, f, "video/mp4")},
                              data={"expires": "1"}, headers={"User-Agent": "autoreel/1.0"}, timeout=300)
        if r.ok and r.text.startswith("https://"):
            return r.text.strip()
        errors.append(f"0x0.st: {r.status_code} {r.text[:200]}")
    except Exception as e:
        errors.append(f"0x0.st: {e}")
    raise RuntimeError("Could not upload the video to a temporary host: " + " | ".join(errors))


def publish_reel(video: Path, caption: str) -> str:
    if not (config.IG_USER_ID and config.IG_ACCESS_TOKEN):
        raise RuntimeError("Set IG_USER_ID and IG_ACCESS_TOKEN in .env first.")

    url = _temporary_url(video)
    print(f"  temporary video link ready ({url.split('/')[2]})")

    # 1) Create the Reels container from the public link
    container = _check(requests.post(f"{GRAPH}/{config.IG_USER_ID}/media", data={
        "media_type": "REELS",
        "video_url": url,
        "caption": caption,
        "share_to_feed": "true",
        "thumb_offset": "0",  # first frame = your headline cover
        "access_token": config.IG_ACCESS_TOKEN,
    }, timeout=120))
    container_id = container["id"]
    print(f"  container: {container_id}, waiting for Instagram to process...")

    # 2) Wait until processing finishes
    for _ in range(60):
        status = _check(requests.get(f"{GRAPH}/{container_id}", params={
            "fields": "status_code,status", "access_token": config.IG_ACCESS_TOKEN,
        }, timeout=60))
        code = status.get("status_code")
        if code == "FINISHED":
            break
        if code in {"ERROR", "EXPIRED"}:
            raise RuntimeError(f"Processing failed: {status}")
        time.sleep(10)
    else:
        raise TimeoutError("Instagram took too long to process the video.")

    # 3) Publish
    published = _check(requests.post(f"{GRAPH}/{config.IG_USER_ID}/media_publish", data={
        "creation_id": container_id, "access_token": config.IG_ACCESS_TOKEN,
    }, timeout=120))
    media_id = published["id"]
    try:
        link = _check(requests.get(f"{GRAPH}/{media_id}", params={
            "fields": "permalink", "access_token": config.IG_ACCESS_TOKEN,
        }, timeout=60)).get("permalink", "")
        print(f"  live: {link}")
    except Exception:
        pass
    return media_id
