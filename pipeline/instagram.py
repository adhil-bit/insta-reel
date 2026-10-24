"""Step 6: publish a Reel through the official Instagram API (resumable upload,
so you don't need to host the video anywhere)."""
import os
import time
from pathlib import Path

import requests

import config

GRAPH = f"https://{config.IG_GRAPH_HOST}/{config.GRAPH_API_VERSION}"
UPLOAD = f"https://rupload.facebook.com/ig-api-upload/{config.GRAPH_API_VERSION}"


def _check(resp: requests.Response) -> dict:
    data = resp.json()
    if resp.status_code >= 400 or "error" in data:
        raise RuntimeError(f"Instagram API error: {data}")
    return data


def publish_reel(video: Path, caption: str) -> str:
    if not (config.IG_USER_ID and config.IG_ACCESS_TOKEN):
        raise RuntimeError("Set IG_USER_ID and IG_ACCESS_TOKEN in .env first.")

    # 1) Create an empty Reels container
    container = _check(requests.post(f"{GRAPH}/{config.IG_USER_ID}/media", data={
        "media_type": "REELS",
        "upload_type": "resumable",
        "caption": caption,
        "share_to_feed": "true",
        "thumb_offset": "0",  # first frame = your headline cover
        "access_token": config.IG_ACCESS_TOKEN,
    }))
    container_id = container["id"]
    print(f"  container: {container_id}")

    # 2) Upload the video file
    with open(video, "rb") as f:
        _check(requests.post(
            f"{UPLOAD}/{container_id}",
            headers={
                "Authorization": f"OAuth {config.IG_ACCESS_TOKEN}",
                "offset": "0",
                "file_size": str(os.path.getsize(video)),
            },
            data=f,
            timeout=600,
        ))
    print("  uploaded, waiting for Instagram to process...")

    # 3) Wait until processing finishes
    for _ in range(60):
        status = _check(requests.get(f"{GRAPH}/{container_id}", params={
            "fields": "status_code,status", "access_token": config.IG_ACCESS_TOKEN,
        }))
        code = status.get("status_code")
        if code == "FINISHED":
            break
        if code in {"ERROR", "EXPIRED"}:
            raise RuntimeError(f"Processing failed: {status}")
        time.sleep(10)
    else:
        raise TimeoutError("Instagram took too long to process the video.")

    # 4) Publish
    published = _check(requests.post(f"{GRAPH}/{config.IG_USER_ID}/media_publish", data={
        "creation_id": container_id, "access_token": config.IG_ACCESS_TOKEN,
    }))
    media_id = published["id"]
    try:
        link = _check(requests.get(f"{GRAPH}/{media_id}", params={
            "fields": "permalink", "access_token": config.IG_ACCESS_TOKEN,
        })).get("permalink", "")
        print(f"  live: {link}")
    except Exception:
        pass
    return media_id
