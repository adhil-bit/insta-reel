"""
AutoReel: Claude-powered Instagram Reels pipeline.

  python main.py preview          test fonts, templates and FFmpeg (no API keys needed)
  python main.py make             create one reel and save it for review
  python main.py make --topic "Why Venice is sinking"
  python main.py render jobs/<name>   render a pre-written job (no Anthropic API needed)
  python main.py render-pending   render every new folder in jobs/
  python main.py skip [folder]    reject a reel so it is never posted
  python main.py list             show reels waiting for review
  python main.py post [folder]    publish a reviewed reel (default: newest pending)
  python main.py auto             make + post with no review (not recommended)
"""
import argparse
import sys
from datetime import datetime
from pathlib import Path

import config
from pipeline import design, video
from pipeline.utils import load_json, run, save_json, slugify


def history() -> list:
    return load_json(config.HISTORY_FILE, [])


def make(manual_topic: str | None = None) -> Path:
    from pipeline import claude, media

    hist = history()
    print("1/6 Finding a topic...")
    topic = claude.find_topic([h["title"] for h in hist], focus=manual_topic)
    print(f"    -> {topic['title']} [{topic['category']}]")

    print("2/6 Writing the script...")
    script = claude.write_script(topic)

    folder = config.OUTPUT_DIR / f"{datetime.now():%Y%m%d-%H%M}-{slugify(topic['title'])}"
    return build_reel(topic, script, folder)


def build_reel(topic: dict, script: dict, folder: Path, codes: list[str] | None = None) -> Path:
    """Voice, visuals, assembly and export. `codes` = ready-made animation code per scene."""
    from pipeline import media

    hist = history()
    work = folder / "work"
    work.mkdir(parents=True, exist_ok=True)
    save_json(folder / "topic.json", topic)
    save_json(folder / "script.json", script)

    scenes = [{"voiceover": script["hook_voiceover"],
               "visual": script["cover_visual"],
               "search_query": script["scenes"][0].get("search_query", topic["title"]),
               "cover": True}] + script["scenes"]

    print("3/6 Recording the voiceover...")
    durations = []
    for i, s in enumerate(scenes):
        media.generate_voice(s["voiceover"], work / f"voice_{i}.mp3")
        durations.append(video.scene_duration(
            work / f"voice_{i}.mp3", config.COVER_MIN_SECONDS if s.get("cover") else 0))

    visuals = []
    if config.VISUAL_MODE == "code":
        from pipeline import animate
        from concurrent.futures import ThreadPoolExecutor
        print(f"4/6 Writing and rendering {len(scenes)} code animations "
              f"({config.RENDER_WORKERS} at a time)...")
        with ThreadPoolExecutor(max_workers=config.RENDER_WORKERS) as pool:
            if codes:
                jobs = [pool.submit(animate.render_or_fallback, codes[i] if i < len(codes) else None,
                                    script["category"], durations[i], i, work)
                        for i in range(len(scenes))]
            else:
                jobs = [pool.submit(animate.build, s, script["category"], durations[i], i, work)
                        for i, s in enumerate(scenes)]
            visuals = [job.result() for job in jobs]
    else:
        print(f"4/6 Creating {len(scenes)} images...")
        for i, s in enumerate(scenes):
            raw = media.generate_image(s["visual"], s.get("search_query", ""), work / f"raw_{i}.png")
            visuals.append(design.prepare_background(raw, work / f"bg_{i}.jpg"))
            print(f"    image {i + 1}/{len(scenes)}")

    print("5/6 Assembling the video...")
    clips = []
    for i, s in enumerate(scenes):
        overlay = work / f"overlay_{i}.png"
        if s.get("cover"):
            design.make_cover_overlay(script, overlay)
            design.compose_preview(_first_frame(visuals[i], work), overlay, folder / "cover.jpg")
        else:
            design.make_scene_overlay(s, script["category"], overlay)
        clips.append(video.render_scene(
            visuals[i], overlay, work / f"voice_{i}.mp3", work / f"clip_{i}.mp4",
            min_seconds=config.COVER_MIN_SECONDS if s.get("cover") else 0,
            zoom_in=(i % 2 == 0),
        ))
    joined = video.concat(clips, work / "joined.mp4")

    print("6/6 Adding music and exporting...")
    final = video.add_music(joined, folder / "reel.mp4")
    (folder / "caption.txt").write_text(script["instagram_caption"], encoding="utf-8")
    review = [f"## {topic['title']}  [{topic['category']}]", "",
              f"**Angle:** {topic.get('angle', '')}", "", "### Check these claims"]
    review += [f"- {c}" for c in script.get("fact_check", [])]
    review += ["", "### Sources"] + [f"- {u}" for u in topic.get("sources", [])]
    review += ["", "### Caption", script["instagram_caption"]]
    (folder / "review.md").write_text("\n".join(review), encoding="utf-8")

    hist.append({"title": topic["title"], "category": topic["category"],
                 "folder": folder.name, "status": "pending",
                 "created": datetime.now().isoformat(timespec="minutes")})
    save_json(config.HISTORY_FILE, hist)

    print(f"\nDone: {final}")
    print("\nCheck these claims before posting:")
    for claim in script.get("fact_check", []):
        print(f"  - {claim}")
    print(f"\nSources: {', '.join(topic.get('sources', []))}")
    print(f"\nWhen happy: python main.py post {folder.name}")
    return folder


def render_job(job_dir: Path) -> Path:
    """Render a reel whose script and animations were written in advance
    (for example by Claude in a chat), with no Anthropic API calls."""
    script = load_json(job_dir / "script.json", None)
    topic = script.pop("topic")
    topic["category"] = script["category"] = script["category"].upper()
    script["headline"] = [l.upper() for l in script["headline"]]
    script["accent_words"] = [w.upper() for w in script.get("accent_words", [])]
    codes = [p.read_text(encoding="utf-8") if p.exists() else None
             for p in (job_dir / f"anim_{i}.js" for i in range(len(script["scenes"]) + 1))]
    print(f"Rendering job {job_dir.name}: {topic['title']}")
    return build_reel(topic, script, config.OUTPUT_DIR / job_dir.name, codes)


def render_pending() -> None:
    """Render every folder in jobs/ that hasn't been rendered yet."""
    done = {h["folder"] for h in history()}
    rendered = []
    for job in sorted((config.ROOT / "jobs").glob("*/script.json")):
        if job.parent.name in done:
            continue
        rendered.append(render_job(job.parent).name)
    config.OUTPUT_DIR.mkdir(exist_ok=True)
    (config.OUTPUT_DIR / "rendered.txt").write_text("\n".join(rendered), encoding="utf-8")
    print(f"Rendered {len(rendered)} job(s).")


def _first_frame(visual: Path, work: Path) -> Path:
    """Still image of a visual, for the cover preview."""
    if visual.suffix.lower() != ".mp4":
        return visual
    frame = work / f"{visual.stem}_frame.jpg"
    run(["ffmpeg", "-y", "-v", "error", "-ss", "0.5", "-i", str(visual), "-frames:v", "1", str(frame)])
    return frame


def post(folder_name: str) -> None:
    from pipeline import instagram

    folder = config.OUTPUT_DIR / folder_name
    reel, caption = folder / "reel.mp4", folder / "caption.txt"
    if not reel.exists():
        sys.exit(f"No reel found in {folder}")
    print(f"Publishing {folder_name}...")
    media_id = instagram.publish_reel(reel, caption.read_text(encoding="utf-8"))
    hist = history()
    for h in hist:
        if h["folder"] == folder_name:
            h.update(status="posted", media_id=media_id,
                     posted=datetime.now().isoformat(timespec="minutes"))
    save_json(config.HISTORY_FILE, hist)
    print("Posted.")


def skip(folder_name: str) -> None:
    hist = history()
    for h in hist:
        if h["folder"] == folder_name:
            h["status"] = "skipped"
    save_json(config.HISTORY_FILE, hist)
    print(f"Skipped {folder_name}")


def latest_pending() -> str | None:
    pending = [h for h in history() if h["status"] == "pending"]
    return pending[-1]["folder"] if pending else None


def list_pending() -> None:
    pending = [h for h in history() if h["status"] == "pending"]
    if not pending:
        print("Nothing waiting for review.")
    for h in pending:
        print(f"{h['folder']}   [{h['category']}] {h['title']}")


def preview() -> None:
    """Render the templates + the built-in code animation to test the setup."""
    from pipeline import animate

    out = config.OUTPUT_DIR / "_preview"
    out.mkdir(parents=True, exist_ok=True)
    accent = config.BRAND["categories"]["CLIMATE"]

    print("Rendering a 4-second code animation (tests Playwright + FFmpeg)...")
    anim = animate.render(animate.FALLBACK_JS, accent, 4.0, 7, out / "anim.html", out / "anim.mp4")
    frame = _first_frame(anim, out)

    sample = {"category": "CLIMATE", "headline": ["THE OCEAN", "IS RUNNING", "A FEVER"],
              "accent_words": ["FEVER"]}
    design.make_cover_overlay(sample, out / "cover_overlay.png")
    design.compose_preview(frame, out / "cover_overlay.png", out / "cover.jpg")
    scene = {"caption": "The Pacific holds the heat for months", "highlight": "heat"}
    design.make_scene_overlay(scene, "CLIMATE", out / "scene_overlay.png")
    design.compose_preview(frame, out / "scene_overlay.png", out / "scene.jpg")

    silent = out / "silent.mp3"
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-t", "1.5",
         "-c:a", "libmp3lame", str(silent)])
    c1 = video.render_scene(anim, out / "cover_overlay.png", silent, out / "c1.mp4", 2.0)
    c2 = video.render_scene(anim, out / "scene_overlay.png", silent, out / "c2.mp4", 2.0)
    video.add_music(video.concat([c1, c2], out / "joined.mp4"), out / "preview.mp4")
    print(f"Preview ready in {out} (cover.jpg, scene.jpg, preview.mp4)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("command", choices=["make", "render", "render-pending", "post", "skip", "list", "latest", "auto", "preview"])
    parser.add_argument("folder", nargs="?", help="output folder name (for post)")
    parser.add_argument("--topic", help="use your own topic instead of a trending one")
    args = parser.parse_args()

    if args.command == "preview":
        preview()
    elif args.command == "make":
        make(args.topic)
    elif args.command == "list":
        list_pending()
    elif args.command == "render":
        render_job(Path(args.folder))
    elif args.command == "render-pending":
        render_pending()
    elif args.command == "latest":
        print(latest_pending() or "")
    elif args.command in ("post", "skip"):
        folder = args.folder or latest_pending()
        if not folder:
            sys.exit("Nothing pending.")
        post(folder) if args.command == "post" else skip(folder)
    elif args.command == "auto":
        post(make(args.topic).name)
