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


def _temporary_url(video: Path, kind: str = "video/mp4") -> str:
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
            head = r.content[:16]
            if b"ftyp" in head or head[:3] == b"\xff\xd8\xff" or ctype.split("/")[0] in ("video", "image"):
                print(f"  {name}: link serves {ctype or 'the file'}")
                return url
            errors.append(f"{name}: link serves {ctype or 'unknown'}, not video")
        except Exception as e:
            errors.append(f"{name}: {str(e)[:150]}")
        return None

    def tmpfiles():      # deleted after 60 minutes
        with open(video, "rb") as f:
            r = requests.post("https://tmpfiles.org/api/v1/upload", files={"file": (video.name, f, kind)},
                              headers=UA, timeout=300)
        r.raise_for_status()
        page = r.json()["data"]["url"]                     # https://tmpfiles.org/123/reel.mp4
        return page.replace("://tmpfiles.org/", "://tmpfiles.org/dl/").replace("http://", "https://")

    def uguu():          # deleted after 3 hours
        with open(video, "rb") as f:
            r = requests.post("https://uguu.se/upload", files={"files[]": (video.name, f, kind)},
                              headers=UA, timeout=300)
        r.raise_for_status()
        return r.json()["files"][0]["url"]

    def litterbox():     # deleted after 1 hour
        with open(video, "rb") as f:
            r = requests.post("https://litterbox.catbox.moe/resources/internals/api.php",
                              data={"reqtype": "fileupload", "time": "1h"},
                              files={"fileToUpload": (video.name, f, kind)}, headers=UA, timeout=300)
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


def publish_reel(video: Path, caption: str, cover: Path | None = None, location_id: str | None = None) -> str:
    if not (config.IG_USER_ID and config.IG_ACCESS_TOKEN):
        raise RuntimeError("Set IG_USER_ID and IG_ACCESS_TOKEN in .env first.")

    video = _instagram_safe(video)
    url = _temporary_url(video)
    print(f"  temporary video link ready ({url.split('/')[2]})")
    cover_url = None
    if cover:
        try:
            cover_url = _temporary_url(cover, kind="image/jpeg")
            print("  thumbnail link ready")
        except Exception as e:
            print(f"  thumbnail upload failed ({e}); using the first frame")

    # 1) Create the Reels container from the public link
    data = {
        "media_type": "REELS",
        "video_url": url,
        "caption": caption,
        "share_to_feed": "true",
        **({"cover_url": cover_url} if cover_url else {"thumb_offset": "0"}),
        "access_token": config.IG_ACCESS_TOKEN,
    }
    if location_id:
        data["location_id"] = str(location_id)
    try:
        container = _check(requests.post(f"{GRAPH}/{config.IG_USER_ID}/media", data=data, timeout=120))
        if location_id:
            print(f"  location tag added ({location_id})")
    except Exception as e:
        if not location_id:
            raise
        print(f"  location tag not accepted ({str(e)[:160]}); posting without it")
        data.pop("location_id", None)
        container = _check(requests.post(f"{GRAPH}/{config.IG_USER_ID}/media", data=data, timeout=120))
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


def _wait_finished(container_id: str, what: str) -> None:
    for _ in range(60):
        st = _check(requests.get(f"{GRAPH}/{container_id}", params={
            "fields": "status_code,status", "access_token": config.IG_ACCESS_TOKEN}, timeout=60))
        if st.get("status_code") == "FINISHED":
            return
        if st.get("status_code") in {"ERROR", "EXPIRED"}:
            raise RuntimeError(f"{what} processing failed: {st}")
        time.sleep(5)
    raise TimeoutError(f"{what}: Instagram took too long")


def publish_carousel(images: list[Path], caption: str, location_id: str | None = None) -> str:
    """Post a carousel (2-10 JPEG images, 4:5) and return the media id."""
    if not 2 <= len(images) <= 10:
        raise ValueError("A carousel needs 2-10 images")
    children = []
    for i, img in enumerate(images, 1):
        url = _temporary_url(img, kind="image/jpeg")
        item = _check(requests.post(f"{GRAPH}/{config.IG_USER_ID}/media", data={
            "image_url": url, "is_carousel_item": "true", "access_token": config.IG_ACCESS_TOKEN}, timeout=120))
        _wait_finished(item["id"], f"slide {i}")
        children.append(item["id"]); print(f"  slide {i}/{len(images)} ready")
    data = {"media_type": "CAROUSEL", "children": ",".join(children), "caption": caption,
            "access_token": config.IG_ACCESS_TOKEN}
    if location_id:
        data["location_id"] = str(location_id)
    try:
        box = _check(requests.post(f"{GRAPH}/{config.IG_USER_ID}/media", data=data, timeout=120))
    except Exception as e:
        if not location_id:
            raise
        print(f"  location tag not accepted ({str(e)[:160]}); posting without it")
        data.pop("location_id"); box = _check(requests.post(f"{GRAPH}/{config.IG_USER_ID}/media", data=data, timeout=120))
    _wait_finished(box["id"], "carousel")
    media_id = _check(requests.post(f"{GRAPH}/{config.IG_USER_ID}/media_publish", data={
        "creation_id": box["id"], "access_token": config.IG_ACCESS_TOKEN}, timeout=120))["id"]
    try:
        link = _check(requests.get(f"{GRAPH}/{media_id}", params={"fields": "permalink", "access_token": config.IG_ACCESS_TOKEN}, timeout=60)).get("permalink", "")
        print(f"  live: {link}")
    except Exception:
        pass
    return media_id


def recently_posted(caption: str, hours: int = 12) -> bool:
    """True if a post with the same opening caption line went out in the last `hours` (guards against duplicate triggers)."""
    from datetime import datetime, timedelta, timezone
    key = caption.strip().split("\n")[0][:60]
    try:
        r = requests.get(f"{GRAPH}/{config.IG_USER_ID}/media", params={"fields": "caption,timestamp", "limit": 8,
                                                                      "access_token": config.IG_ACCESS_TOKEN}, timeout=60).json()
    except Exception:
        return False
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    for m in r.get("data", []):
        ts = datetime.strptime(m["timestamp"], "%Y-%m-%dT%H:%M:%S%z")
        if ts > cutoff and (m.get("caption") or "").strip().split("\n")[0][:60] == key:
            return True
    return False


def already_on_instagram(caption: str, hours: int = 48) -> str | None:
    """Last line of defence against double posts: is a post with this caption already live?"""
    from datetime import datetime, timedelta, timezone
    key = next((l.strip() for l in caption.splitlines() if l.strip()), "")[:60]
    try:
        r = requests.get(f"{GRAPH}/{config.IG_USER_ID}/media", params={
            "fields": "id,caption,timestamp,permalink", "limit": 12, "access_token": config.IG_ACCESS_TOKEN}, timeout=60).json()
    except Exception:
        return None
    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    for m in r.get("data", []):
        ts = datetime.strptime(m["timestamp"], "%Y-%m-%dT%H:%M:%S%z")
        if ts >= since and key and (m.get("caption") or "").strip().startswith(key):
            return m.get("permalink") or m["id"]
    return None
