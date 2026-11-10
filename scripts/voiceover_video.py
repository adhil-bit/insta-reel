"""Add narration + story sound to a finished silent video (the user's own edit).
Usage: python scripts/voiceover_video.py jobs-voiceover/<slug>
The job folder has script.json with: source_video (file name in the folder), lines [{text, start}],
optional voice_lock, sound_plan, cover_at, instagram_caption. Writes output/<slug>/ like a render."""
import json, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import config
from pipeline import media, story_sound


def dur(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True).stdout
    return float(out.strip())


def main(job: Path):
    s = json.loads((job / "script.json").read_text(encoding="utf-8"))
    slug = job.name; out = config.OUTPUT_DIR / slug; work = out / "work"; work.mkdir(parents=True, exist_ok=True)
    src = job / s["source_video"]; vdur = dur(src)
    lines = s["lines"]; clips = [work / f"l{i}.mp3" for i in range(len(lines))]
    voice = s.get("voice_lock", "Despina")
    print(f"voice: {voice}; video {vdur:.1f}s; {len(lines)} lines")
    media.gemini_narration([l["text"] for l in lines], clips, voice)
    t, place = 0.0, []
    for l, c in zip(lines, clips):
        st = max(float(l["start"]), t + 0.15); d = dur(c); place.append((st, d)); t = st + d
        print(f"  line at {st:5.2f}s  len {d:4.2f}s  (window start {l['start']})")
    total = max(vdur, t + 0.8)
    bounds = [float(l["start"]) for l in lines] + [total]
    seg = [max(0.5, bounds[i + 1] - bounds[i]) for i in range(len(lines))]
    seg[0] += bounds[0]
    bed = story_sound.make(seg, s.get("sound_plan", {"drone": "A", "layers": []}), work / "bed.wav")
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(src)]
    for c in clips: cmd += ["-i", str(c)]
    cmd += ["-i", str(bed)]
    n = len(clips); f = []
    for i, (st, _) in enumerate(place):
        ms = int(st * 1000); f.append(f"[{i + 1}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{i}]")
    f.append("".join(f"[v{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0[vo]")
    f.append(f"[{n + 1}:a]volume=0.55[bd]")
    f.append("[vo][bd]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]")
    pad = total - vdur
    f.append(f"[0:v]tpad=stop_mode=clone:stop_duration={pad:.2f}[v]" if pad > 0.05 else "[0:v]null[v]")
    cmd += ["-filter_complex", ";".join(f), "-map", "[v]", "-map", "[a]", "-t", f"{total:.2f}",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
            "-movflags", "+faststart", str(out / "reel.mp4")]
    subprocess.run(cmd, check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(s.get("cover_at", 2.5)), "-i", str(src), "-frames:v", "1", "-q:v", "2", str(out / "cover.jpg")], check=True)
    import shutil; shutil.copy(out / "cover.jpg", out / "thumbnail.jpg")   # the poster sends thumbnail.jpg as the Reel cover
    (out / "caption.txt").write_text(s["instagram_caption"], encoding="utf-8")
    (out / "script.json").write_text(json.dumps(s, ensure_ascii=False, indent=2), encoding="utf-8")
    (out / "review.md").write_text(f"## {slug} (voice-over on the user's video)\n\nNarrator: {voice}. Length {total:.1f}s.\n\n### Caption\n{s['instagram_caption']}\n", encoding="utf-8")
    print(f"done: {out / 'reel.mp4'} ({total:.1f}s)")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
