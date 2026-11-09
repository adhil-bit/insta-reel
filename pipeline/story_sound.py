"""Story-specific sound design, synthesised from scratch (no copyright): a drone that
sets the mood plus scene effects (river, crickets, heartbeat, rumble, gong, dawn shimmer)
placed by a 'sound_plan' in script.json. Times are fractions of each clip's duration."""
import wave
from pathlib import Path

import numpy as np

SR = 48000
ROOTS = {"A": 110.0, "G": 98.0, "D": 73.42, "E": 82.41, "C": 65.41}


def _lp(x, cut):
    a = np.exp(-2 * np.pi * cut / SR); y = np.empty_like(x); acc = 0.0
    for i in range(0, len(x), 4096):                       # block-wise one-pole low-pass
        seg = x[i:i + 4096]; out = np.empty_like(seg)
        for j, v in enumerate(seg):
            acc = (1 - a) * v + a * acc; out[j] = acc
        y[i:i + 4096] = out
    return y


def _env(n, att, rel):
    e = np.ones(n); a, r = int(att * SR), int(rel * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] *= np.linspace(1, 0, r)
    return e


def drone(n, root):
    t = np.arange(n) / SR; s = np.zeros(n)
    for f, a in ((root, 0.05), (root * 1.5, 0.03), (root * 2, 0.025), (root * 3, 0.01)):
        for k in range(1, 5):
            s += a / k * np.sin(2 * np.pi * f * k * t + k) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.11 * t * k))
    return s * _env(n, 2.5, 3.0)


def river(n, rng):
    x = np.cumsum(rng.standard_normal(n)) ; x -= np.convolve(x, np.ones(2400) / 2400, "same")
    x = x / (np.abs(x).max() + 1e-9)
    t = np.arange(n) / SR
    return 0.05 * x * (0.7 + 0.3 * np.sin(2 * np.pi * 0.2 * t)) * _env(n, 0.8, 0.8)


def crickets(n, rng):
    t = np.arange(n) / SR; s = np.zeros(n)
    for f, rate, ph in ((4400, 2.6, 0), (5200, 3.3, 0.4)):
        gate = (np.sin(2 * np.pi * rate * t + ph) > 0.55) * (np.sin(2 * np.pi * 30 * t) > 0)
        s += 0.012 * gate * np.sin(2 * np.pi * f * t)
    return s * _env(n, 0.6, 0.6)


def heartbeat(count, gap):
    n = int((count * gap + 0.6) * SR); s = np.zeros(n); t = np.arange(int(0.35 * SR)) / SR
    thump = np.sin(2 * np.pi * 50 * t) * np.exp(-14 * t)
    for i in range(count):
        for off, amp in ((0, 0.35), (0.22, 0.22)):
            k = int((i * gap + off) * SR); s[k:k + len(thump)] += amp * thump[:max(0, n - k)]
    return s


def rumble(rng):
    t = np.arange(int(1.4 * SR)) / SR
    sub = 0.4 * np.sin(2 * np.pi * (42 + 10 * np.exp(-3 * t)) * t) * np.exp(-3.2 * t)
    noise = _lp(rng.standard_normal(len(t)), 300) * 0.5 * np.exp(-4 * t)
    return sub + noise


def gong(f=174.0):
    t = np.arange(int(4.5 * SR)) / SR; s = np.zeros(len(t))
    for ratio, amp, dec in ((1, 0.18, 0.9), (2.76, 0.09, 1.4), (5.4, 0.05, 2.2), (8.93, 0.025, 3.0)):
        s += amp * np.sin(2 * np.pi * f * ratio * t + ratio) * np.exp(-dec * t)
    return s * np.minimum(1, t / 0.004)


def shimmer(n):
    t = np.arange(n) / SR; s = np.zeros(n)
    for f in (880, 1320, 1760, 2217):
        s += 0.008 * np.sin(2 * np.pi * f * t) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t + f))
    return s * _env(n, min(2.0, n / SR / 2), 1.0)


def whoosh(rng):
    n = int(0.9 * SR); x = rng.standard_normal(n); x = x - _lp(x, 500); x = _lp(x, 4500)
    return 0.12 * x * np.sin(np.linspace(0, np.pi, n)) ** 2


def make(durations, plan, out: Path) -> Path:
    rng = np.random.default_rng(7)
    total = sum(durations); N = int(total * SR) + SR; mix = np.zeros(N)
    starts = np.concatenate([[0], np.cumsum(durations)[:-1]])
    def put(sig, at):
        k = max(0, int(at * SR)); m = min(len(sig), N - k)
        if m > 0: mix[k:k + m] += sig[:m]
    put(drone(int(total * SR), ROOTS.get(plan.get("drone", "A"), 110.0)), 0)
    for st in starts[1:]:
        put(whoosh(rng), st - 0.45)
    for L in plan.get("layers", []):
        typ = L["type"]; clips = L.get("clips", [L.get("clip", 0)])
        ats = L.get("at", 0.0); ats = ats if isinstance(ats, list) else [ats]
        for c in clips:
            if c >= len(durations): continue
            s0, d = starts[c], durations[c]
            if typ == "river": put(river(int(d * SR), rng), s0)
            elif typ == "crickets": put(crickets(int(d * SR), rng), s0)
            elif typ == "shimmer": f = L.get("from", 0.0); put(shimmer(int(d * (1 - f) * SR)), s0 + d * f)
            elif typ == "heartbeat": put(heartbeat(L.get("count", 3), L.get("gap", 0.9)), s0 + d * ats[0])
            else:
                for a in ats:
                    put({"rumble": lambda: rumble(rng), "gong": lambda: gong(L.get("f", 174.0))}[typ](), s0 + d * a)
    mix = mix[:int(total * SR)]
    mix *= 0.32 / (np.abs(mix).max() + 1e-9)               # bed peak about -10 dBFS before the voice mix
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
    st = np.repeat(pcm[:, None], 2, axis=1)
    with wave.open(str(out), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
    return out
