"""Step 5: assemble scenes, concatenate, add music, export."""
import random
from pathlib import Path

import config
from .utils import media_duration, run

W, H, FPS = config.WIDTH, config.HEIGHT, config.FPS


def scene_duration(audio: Path, min_seconds: float = 0.0) -> float:
    return max(media_duration(audio) + config.SCENE_PADDING, min_seconds)


def render_scene(visual: Path, overlay: Path, audio: Path, out: Path,
                 min_seconds: float = 0.0, zoom_in: bool = True) -> Path:
    """Visual (an animation .mp4, or a still image that gets a slow zoom),
    brand overlay on top, voice line as audio."""
    duration = scene_duration(audio, min_seconds)
    is_video = visual.suffix.lower() in {".mp4", ".mov", ".webm"}
    if is_video:
        video_in = ["-i", str(visual)]
        vf = f"[0:v]scale={W}:{H},fps={FPS},tpad=stop_mode=clone:stop_duration=2[bg];"
    else:
        frames = int(duration * FPS)
        if zoom_in:
            z = f"min(1+0.10*on/{frames},1.10)"
        else:
            z = f"max(1.10-0.10*on/{frames},1.0)"
        video_in = ["-i", str(visual)]
        vf = (f"[0:v]scale={W * 2}:{H * 2},"
              f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
              f":d={frames}:s={W}x{H}:fps={FPS}[bg];")
    if overlay is None:
        vf += "[bg]format=yuv420p[v];[1:a]aresample=44100,apad[a]"
        over_in = []
    else:
        vf += "[bg][1:v]overlay=0:0:shortest=1,format=yuv420p[v];[2:a]aresample=44100,apad[a]"
        over_in = ["-loop", "1", "-i", str(overlay)]
    run([
        "ffmpeg", "-y", *video_in, *over_in, "-i", str(audio),
        "-filter_complex", vf, "-map", "[v]", "-map", "[a]",
        "-t", f"{duration:.3f}", "-r", str(FPS),
        "-c:v", "libx264", "-preset", "faster", "-crf", "19",
        "-c:a", "aac", "-b:a", "192k", "-ac", "2", str(out),
    ])
    return out


def concat(clips: list[Path], out: Path) -> Path:
    list_file = out.with_suffix(".txt")
    list_file.write_text("".join(f"file '{c.resolve()}'\n" for c in clips))
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file),
         "-c", "copy", str(out)])
    return out


LOUDNORM = "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000"  # Reels loudness, 48 kHz max for Instagram


def add_music(video: Path, out: Path, bed: Path | None = None) -> Path:
    """Mix a random track from /music under the voice; otherwise the generated sound bed."""
    tracks = [p for p in config.MUSIC_DIR.glob("*") if p.suffix.lower() in {".mp3", ".wav", ".m4a"}]
    if not tracks and bed:
        run(["ffmpeg", "-y", "-i", str(video), "-i", str(bed), "-filter_complex",
             f"[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,{LOUDNORM}[a]",
             "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
             "-movflags", "+faststart", str(out)])
        print("  sound: generated pad + transitions")
        return out
    if not tracks:
        print("  (no music in /music, exporting voice only)")
        run(["ffmpeg", "-y", "-i", str(video), "-af", LOUDNORM, "-c:v", "copy", "-c:a", "aac",
             "-b:a", "192k", "-movflags", "+faststart", str(out)])
        return out
    track = random.choice(tracks)
    dur = media_duration(video)
    vol = config.BRAND["music_volume"]
    fa = (
        f"[1:a]volume={vol},afade=t=in:d=1,afade=t=out:st={max(dur - 2, 0):.2f}:d=2[m];"
        f"[0:a][m]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,{LOUDNORM}[a]"
    )
    run([
        "ffmpeg", "-y", "-i", str(video), "-stream_loop", "-1", "-i", str(track),
        "-filter_complex", fa, "-map", "0:v", "-map", "[a]",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
        "-t", f"{dur:.3f}", str(out),
    ])
    print(f"  music: {track.name}")
    return out
