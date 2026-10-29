"""Transcribe the first seconds of released reels (Whisper) to check the opening words are really spoken."""
import json, os, subprocess, sys
from faster_whisper import WhisperModel
tags = sys.argv[1].split("|"); out = {}
model = WhisperModel("small", device="cpu", compute_type="int8")
for tag in tags:
    subprocess.run(["gh", "release", "download", tag, "-p", "reel.mp4", "-p", "script.json", "-D", f"/tmp/{tag}", "--clobber"], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f"/tmp/{tag}/reel.mp4", "-t", "9", "-ac", "1", "-ar", "16000", f"/tmp/{tag}.wav"], check=True)
    segs, _ = model.transcribe(f"/tmp/{tag}.wav", language="ml", word_timestamps=True, vad_filter=False)
    words = [(round(w.start, 2), round(w.end, 2), w.word) for s in segs for w in (s.words or [])]
    hook = json.load(open(f"/tmp/{tag}/script.json")).get("hook_voiceover", "")
    out[tag] = {"hook": hook, "first_words": words[:14]}
    print(tag, "| hook:", hook[:60]); print("   heard:", [(a, w) for a, b, w in words[:12]])
os.makedirs("logs", exist_ok=True); json.dump(out, open("logs/audio-check.json", "w"), indent=2, ensure_ascii=False)
