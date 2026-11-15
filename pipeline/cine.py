"""Cinematic pass applied to every scene animation (owner's motion-flow rules, docs/design-refs).

Wraps a scene's window.renderFrame so that, without touching the scene code:
  * the camera never stands still: a slow eased push-in / pull-out with a small pan,
    alternating direction from scene to scene;
  * ONE overlay layer (dust, embers, rain, fog, stars, ink specks) runs across every scene,
    driven by reel time, so particles carry on through the cuts and hide them;
  * a soft vignette frames every shot.

Configure per reel in script.json (all optional):
  "cine": {"overlay": "dust", "color": "#ffd59a", "vignette": 0.45, "push": 0.07, "pan": 24}
  "cine": false   -> switch the pass off for that reel.
Defaults depend on the theme: light paper themes get faint ink specks, dark themes get warm dust.
"""
import json

LIGHT_THEMES = {"inkwash", "whiteboard", "notebook", "retro"}

JS = r"""
;(function () {
  if (typeof g === 'undefined' || !g || !g.canvas || typeof window.renderFrame !== 'function') return;
  const C = %(CFG)s, orig = window.renderFrame;
  let s = 104729 + C.i * 7919; const R = () => (s = (s * 16807) %% 2147483647) / 2147483647;
  const N = {dust: 70, embers: 55, rain: 120, stars: 110, ink: 60, fog: 0}[C.overlay] || 0;
  const P = Array.from({length: N}, () => ({x: R() * W, y: R() * H, r: 0.8 + R() * 3.2, v: 0.3 + R() * 0.9, p: R() * 6.283}));
  const vig = document.createElement('canvas'); vig.width = W; vig.height = H;
  { const v = vig.getContext('2d'), rg = v.createRadialGradient(W / 2, H * 0.52, H * 0.22, W / 2, H * 0.52, H * 0.78);
    rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, C.vigCol); v.fillStyle = rg; v.fillRect(0, 0, W, H); }
  const fog = document.createElement('canvas'); fog.width = W; fog.height = 360;
  { const f = fog.getContext('2d'), lg = f.createLinearGradient(0, 0, 0, 360); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, 'rgba(255,255,255,1)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); f.fillStyle = lg; f.fillRect(0, 0, W, 360); }
  const wrap = (x, m) => ((x %% m) + m) %% m;
  window.renderFrame = function (t) {
    const k = Math.min(1, Math.max(0, t / DURATION)), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const z = 1.03 + C.push * (C.dir > 0 ? e : 1 - e), px = C.pan * (e - 0.5) * C.dir;
    g.save(); g.translate(540 + px, 1000); g.scale(z, z); g.translate(-540, -1000);
    orig(t);
    g.restore();
    const T = t + C.t0;                       // reel time: the overlay continues across cuts
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    if (C.overlay === 'fog') {
      for (let b = 0; b < 3; b++) { g.globalAlpha = 0.07 + 0.03 * b; g.drawImage(fog, wrap(T * (14 + b * 9) + b * 400, W * 2) - W, 520 + b * 330, W * 2, 360); }
    } else if (C.overlay === 'rain') {
      g.strokeStyle = C.color; g.lineWidth = 2;
      for (const q of P) { const y = wrap(q.y + T * 900 * q.v, H + 80) - 40, x = wrap(q.x - T * 160 * q.v, W);
        g.globalAlpha = 0.18 + 0.25 * q.v; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 9, y + 34 + 20 * q.v); g.stroke(); }
    } else {
      g.fillStyle = C.color;
      for (const q of P) {
        let x, y, a;
        if (C.overlay === 'stars') { x = q.x; y = q.y * 0.55; a = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(q.p + T * 2.2 * q.v)); }
        else if (C.overlay === 'embers') { x = wrap(q.x + Math.sin(T * 0.9 + q.p) * 30, W); y = wrap(q.y - T * 70 * q.v, H); a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(q.p + T * 6)); }
        else { x = wrap(q.x + T * 12 * q.v + Math.sin(T * 0.5 + q.p) * 18, W); y = wrap(q.y - T * 18 * q.v, H); a = (C.overlay === 'ink' ? 0.16 : 0.3) + 0.35 * (0.5 + 0.5 * Math.sin(q.p + T * 1.3)); }
        g.globalAlpha = a; g.beginPath(); g.arc(x, y, q.r * (C.overlay === 'stars' ? 0.7 : 1), 0, 6.283); g.fill();
      }
    }
    g.globalAlpha = 1; g.drawImage(vig, 0, 0); g.restore();
  };
})();
"""


def config_for(script: dict, i: int, t0: float) -> dict | None:
    cfg = script.get("cine", {})
    if cfg is False:
        return None
    cfg = dict(cfg or {})
    light = (script.get("theme") or "") in LIGHT_THEMES
    overlay = cfg.get("overlay") or ("ink" if light else "dust")
    color = cfg.get("color") or {"ink": "#3a3029", "embers": "#ff9a3c", "rain": "#cfe3ff",
                                 "stars": "#ffffff", "fog": "#ffffff"}.get(overlay, "#ffd59a")
    vig = cfg.get("vignette", 0.18 if light else 0.45)
    return {"overlay": overlay, "color": color, "push": cfg.get("push", 0.07), "pan": cfg.get("pan", 24),
            "dir": 1 if i % 2 == 0 else -1, "i": i, "t0": round(t0, 3),
            "vigCol": f"rgba({'60,40,20' if light else '0,0,0'},{vig})"}


def wrap(code: str | None, script: dict, i: int, t0: float) -> str | None:
    """Return the scene code with the cinematic pass appended (or unchanged if switched off)."""
    if not code:
        return code
    cfg = config_for(script, i, t0)
    if cfg is None:
        return code
    return code + "\n" + JS % {"CFG": json.dumps(cfg)}
