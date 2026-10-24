"""Step 6: publish a Reel through the official Instagram API.

The Instagram-login API needs the video at a public URL, so the file is put on a
short-lived anonymous host (deleted automatically after an hour) just long enough
for Instagram to fetch it."""
import subprocess
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


UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"}


def _temporary_url(video: Path) -> str:
    """Upload to a short-lived anonymous file host and return a direct link.
    Several hosts are tried in turn because any one of them can be down or blocked."""
    errors = []

    size = video.stat().st_size

    def attempt(name, fn):
        try:
            url = fn()
            if not (url and url.startswith("https://")):
                errors.append(f"{name}: unexpected reply"); return None
            # make sure the link serves the actual video, not a web page
            r = requests.get(url, headers={**UA, "Range": "bytes=0-15"}, timeout=60)
            ctype = r.headers.get("Content-Type", "")
            if b"ftyp" in r.content[:16] or ctype.startswith("video/"):
                print(f"  {name}: link serves video ({ctype or 'no content-type'})")
                return url
            errors.append(f"{name}: link serves {ctype or 'unknown'}, not video")
        except Exception as e:
            errors.append(f"{name}: {str(e)[:150]}")
        return None

    def tmpfiles():      # deleted after 60 minutes
        with open(video, "rb") as f:
            r = requests.post("https://tmpfiles.org/api/v1/upload", files={"file": (video.name, f, "video/mp4")},
                              headers=UA, timeout=300)
        r.raise_for_status()
        page = r.json()["data"]["url"]                     # https://tmpfiles.org/123/reel.mp4
        return page.replace("://tmpfiles.org/", "://tmpfiles.org/dl/").replace("http://", "https://")

    def uguu():          # deleted after 3 hours
        with open(video, "rb") as f:
            r = requests.post("https://uguu.se/upload", files={"files[]": (video.name, f, "video/mp4")},
                              headers=UA, timeout=300)
        r.raise_for_status()
        return r.json()["files"][0]["url"]

    def litterbox():     # deleted after 1 hour
        with open(video, "rb") as f:
            r = requests.post("https://litterbox.catbox.moe/resources/internals/api.php",
                              data={"reqtype": "fileupload", "time": "1h"},
                              files={"fileToUpload": (video.name, f, "video/mp4")}, headers=UA, timeout=300)
        r.raise_for_status()
        return r.text.strip()

    for name, fn in (("uguu", uguu), ("litterbox", litterbox), ("tmpfiles", tmpfiles)):
        url = attempt(name, fn)
        if url:
            return url
    raise RuntimeError("Could not upload the video to a temporary host: " + " | ".join(errors))


def _instagram_safe(video: Path) -> Path:
    """Re-encode only the audio to 48 kHz AAC (Instagram rejects higher rates)."""
    out = video.with_name(video.stem + "_ig.mp4")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(video), "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
                    "-movflags", "+faststart", str(out)], check=True)
    return out


def publish_reel(video: Path, caption: str) -> str:
    if not (config.IG_USER_ID and config.IG_ACCESS_TOKEN):
        raise RuntimeError("Set IG_USER_ID and IG_ACCESS_TOKEN in .env first.")

    video = _instagram_safe(video)
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
            "fields": "status_code,status,error_message", "access_token": config.IG_ACCESS_TOKEN,
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
