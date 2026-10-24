"""Original background sound design, generated from scratch (no copyright issues):
a soft ambient pad whose mood follows the category, a low impact hit at the start,
and a whoosh on every scene change."""
from pathlib import Path

from .utils import run

SR = 48000
CHORDS = {   # (frequencies, pulse speed)
    "MYSTERY": ([110.0, 130.81, 164.81, 220.0], 0.07),     # A minor, slow and tense
    "HISTORY": ([98.0, 146.83, 196.0, 246.94], 0.06),      # G, warm and open
    "SCIENCE": ([130.81, 196.0, 261.63, 329.63], 0.10),    # C major, bright
    "NATURE":  ([116.54, 174.61, 233.08, 293.66], 0.08),   # Bb, calm
    "CLIMATE": ([103.83, 155.56, 207.65, 246.94], 0.09),
}


def make_bed(durations: list[float], category: str, out: Path) -> Path:
    total = sum(durations)
    freqs, pulse = CHORDS.get(category, CHORDS["HISTORY"])
    amps = [0.050, 0.035, 0.028, 0.018]
    tone = "+".join(f"{a}*sin(2*PI*{f}*t)" for a, f in zip(amps, freqs))
    pad = (f"aevalsrc=exprs='({tone})*(0.75+0.25*sin(2*PI*{pulse}*t))':s={SR}:d={total:.3f}")
    inputs = ["-f", "lavfi", "-i", pad,
              "-f", "lavfi", "-i", f"aevalsrc=exprs='0.55*sin(2*PI*52*t)*exp(-3.5*t)':s={SR}:d=1.6"]
    starts, acc = [], 0.0
    for d in durations[:-1]:
        acc += d
        starts.append(acc)
    for _ in starts:
        inputs += ["-f", "lavfi", "-i", f"anoisesrc=d=0.9:c=pink:r={SR}:a=0.6"]
    parts = [f"[0:a]lowpass=f=900,afade=t=in:d=2,afade=t=out:st={max(total - 2.5, 0):.2f}:d=2.5[pad]",
             "[1:a]volume=1.0[hit]"]
    mix = ["[pad]", "[hit]"]
    for i, st in enumerate(starts):
        ms = max(int((st - 0.45) * 1000), 0)          # peak lands right on the cut
        parts.append(f"[{i + 2}:a]highpass=f=500,lowpass=f=5000,afade=t=in:d=0.45,"
                     f"afade=t=out:st=0.45:d=0.45,volume=0.22,adelay={ms}|{ms}[w{i}]")
        mix.append(f"[w{i}]")
    parts.append(f"{''.join(mix)}amix=inputs={len(mix)}:duration=first:dropout_transition=0:normalize=0,"
                 f"aformat=channel_layouts=stereo,apad,atrim=0:{total:.3f}[out]")
    run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(parts),
         "-map", "[out]", "-ar", str(SR), str(out)])
    return out
