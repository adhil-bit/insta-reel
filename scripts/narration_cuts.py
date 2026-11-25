"""Find where each line starts in a narration recorded elsewhere (e.g. ElevenLabs), and save the cuts.

  python3 scripts/narration_cuts.py jobs/<slug>            # needs jobs/<slug>/narration.mp3
  python3 scripts/narration_cuts.py jobs/<slug> --write    # also writes "narration_cuts" into script.json

Lines = hook + scene voiceovers. Each boundary is placed in the pause (silence) nearest to where the
line should end if the voice spoke at an even pace (by character count).
"""
import json, re, subprocess, sys
from pathlib import Path


def silences(mp3: Path, noise="-38dB", dur=0.25):
    err = subprocess.run(["ffmpeg", "-i", str(mp3), "-af", f"silencedetect=noise={noise}:d={dur}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    s = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    e = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err)
    total = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    return list(zip(s, e)), total


def cuts_for(job: Path):
    script = json.loads((job / "script.json").read_text(encoding="utf-8"))
    lines = [script["hook_voiceover"]] + [s["voiceover"] for s in script["scenes"]]
    gaps, total = silences(job / "narration.mp3")
    chars = [len(l) for l in lines]; tot = sum(chars)
    cuts, used, acc = [], set(), 0
    for c in chars[:-1]:
        acc += c; want = total * acc / tot
        best = min((g for g in gaps if g not in used and (not cuts or (g[0] + g[1]) / 2 > cuts[-1] + 0.8)),
                   key=lambda g: abs((g[0] + g[1]) / 2 - want) - 0.4 * (g[1] - g[0]), default=None)
        if best is None:
            raise SystemExit(f"no pause found near {want:.1f}s")
        used.add(best); cuts.append(round((best[0] + best[1]) / 2, 2))
    return script, cuts, total


if __name__ == "__main__":
    job = Path(sys.argv[1])
    script, cuts, total = cuts_for(job)
    print(f"{job.name}: {total:.1f}s, cuts {cuts}")
    if "--write" in sys.argv:
        script["narration_cuts"] = cuts
        script.pop("voice_status", None)
        (job / "script.json").write_text(json.dumps(script, ensure_ascii=False, indent=2), encoding="utf-8")
        print("written")
