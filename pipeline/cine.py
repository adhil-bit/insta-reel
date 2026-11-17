"""Cinematic pass applied to every scene animation (owner's motion-flow rules, docs/design-refs,
docs/design-system.md - upgraded 16 Nov 2026 after the design review).

Wraps a scene's window.renderFrame so that, without touching the scene code:
  * camera: never still. Hook = fast ease-out push-in (0.12); other scenes = slow eased push / pull
    with a pan, alternating direction. A small punch-in at each cut (0.04), bigger on the twist (0.10).
  * parallax: scenes may draw in depth layers with  CINE.layer(depth, () => { ...draw... })
    (sky 0.1, far 0.25, mid 0.5, hero 1.0, foreground 1.8). Then the global camera move is skipped
    and each layer moves at its own speed.
  * ONE overlay layer across all scenes (dust / embers / rain / fog / stars / ink), driven by reel time.
  * look: film grain, a colour grade per act (cool -> warm arc), a drifting light leak on dark themes,
    vignette.
  * punctuation: a white flash on the twist scene, letterbox bars on the payoff scene, optional whip-pan
    into a scene.
  * share devices: a series badge on every scene ("കണ്ണൂർ രഹസ്യങ്ങൾ #1") and a map-pin drop with the
    town name.
  * text safety: any fillText wider than 900 px is shrunk, and text is nudged inside x 60-1020.

script.json (all optional):
  "cine": {"overlay": "dust", "color": "#ffd59a", "vignette": 0.45, "push": 0.07, "pan": 60,
           "kick": 0.04, "grain": 0.07, "grade": ["#1d4e6b", "#6b5a8c", "#ff9a3c"], "leak": true,
           "twist": 3, "flash": [3], "letterbox": [4], "whip": [2]},
  "series": "കണ്ണൂർ രഹസ്യങ്ങൾ #1",
  "pin": {"scene": 1, "town": "പയ്യന്നൂർ", "x": 540, "y": 980},
  "cine": false  -> switch the whole pass off.
"""
import json

LIGHT_THEMES = {"inkwash", "whiteboard", "notebook", "retro"}

JS = r"""
;(function () {
  if (typeof g === 'undefined' || !g || !g.canvas || typeof window.renderFrame !== 'function') return;
  const C = %(CFG)s, orig = window.renderFrame, ft = g.fillText.bind(g);
  let s = 104729 + C.i * 7919; const R = () => (s = (s * 16807) %% 2147483647) / 2147483647;
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  // ---- text safety: shrink over-wide text, keep it inside the frame ----
  g.fillText = function (str, x, y, mw) {          // measured in device pixels (respects every transform)
    const m = g.getTransform(), sx = Math.hypot(m.a, m.b) || 1;
    if (Math.abs(m.b) > 0.15) return ft(str, x, y, mw);  // rotated stamps etc.: leave alone
    const w = g.measureText(str).width, a = g.textAlign, dw = w * sx;
    const k = dw > 900 ? 900 / dw : 1, ww = w * k;
    const left = a === 'center' ? x - ww / 2 : (a === 'right' || a === 'end') ? x - ww : x;
    const L = m.a * left + m.c * y + m.e, Rr = L + ww * m.a;
    const ddx = L < 60 ? 60 - L : (Rr > 1020 ? 1020 - Rr : 0), dx = ddx / m.a;
    if (k === 1 && Math.abs(dx) < 0.5) return ft(str, x, y, mw);
    g.save(); g.translate(x + dx, y); g.scale(k, k); ft(str, 0, 0); g.restore();
  };
  // ---- overlay particles ----
  const N = {dust: 70, embers: 55, rain: 120, stars: 110, ink: 60, fog: 0}[C.overlay] || 0;
  const P = Array.from({length: N}, () => ({x: R() * W, y: R() * H, r: 0.8 + R() * 3.2, v: 0.3 + R() * 0.9, p: R() * 6.283}));
  const mk = (w, h) => { const c2 = document.createElement('canvas'); c2.width = w; c2.height = h; return c2; };
  const vig = mk(W, H);
  { const v = vig.getContext('2d'), rg = v.createRadialGradient(W / 2, H * 0.52, H * 0.22, W / 2, H * 0.52, H * 0.78);
    rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, C.vigCol); v.fillStyle = rg; v.fillRect(0, 0, W, H); }
  const fog = mk(W, 360);
  { const f = fog.getContext('2d'); for (let k = 0; k < 9; k++) { const cx = (k + 0.5) * W / 9, cy = 180 + 50 * Math.sin(k * 2.1); for (const dx of [-W, 0, W]) { const rg = f.createRadialGradient(cx + dx, cy, 0, cx + dx, cy, 170); rg.addColorStop(0, 'rgba(255,255,255,0.8)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); f.fillStyle = rg; f.fillRect(cx + dx - 170, cy - 170, 340, 340); } } }
  // ---- film grain: 4 noise tiles, swapped every 2 frames ----
  const grain = [0, 1, 2, 3].map(() => { const c2 = mk(256, 256), x = c2.getContext('2d'), im = x.createImageData(256, 256);
    for (let p = 0; p < im.data.length; p += 4) { const v = R() * 255; im.data[p] = im.data[p + 1] = im.data[p + 2] = v; im.data[p + 3] = 255; }
    x.putImageData(im, 0, 0); return c2; });
  const wrap = (x, m) => ((x %% m) + m) %% m;
  // ---- parallax API for scene code ----
  const CINE = window.CINE = { e: 0, layer(depth, fn) {
    g.save(); const z = 1.06 + C.push * CINE.e * depth * (C.dir > 0 ? 1 : -1) + (C.dir > 0 ? 0 : C.push * depth);
    g.translate(540 + C.pan * (CINE.e - 0.5) * depth * C.dir, 1000); g.scale(z, z); g.translate(-540, -1000); fn(); g.restore(); } };
  window.renderFrame = function (t) {
    const D = DURATION, k = cl(t / D);
    const e = C.i === 0 ? 1 - Math.pow(1 - k, 2) : (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
    CINE.e = e;
    const kick = C.kick * Math.pow(1 - cl(t / 0.4), 3);
    // whip-pan: out of this scene in its last 5 frames, into it in its first 5
    const wo = C.whipOut ? Math.pow(cl((t - (D - 5 / 30)) / (5 / 30)), 3) : 0, wi = C.whipIn ? Math.pow(1 - cl(t / (5 / 30)), 3) : 0;
    const wx = -W * 0.4 * wo + W * 0.4 * wi;
    g.save();
    if (C.layered) { g.translate(540 + wx, 1000); g.scale(1 + kick, 1 + kick); g.translate(-540, -1000); }
    else { const z = 1.06 + kick + C.push * (C.dir > 0 ? e : 1 - e), px = C.pan * (e - 0.5) * C.dir;
      g.translate(540 + px + wx, 1000); g.scale(z, z); g.translate(-540, -1000); }
    orig(t);
    g.restore();
    const T = t + C.t0;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    if (wo > 0 || wi > 0) { const a = 0.3 * Math.max(wo, wi); for (let j = 1; j <= 3; j++) { g.globalAlpha = a; g.drawImage(g.canvas, (wo > 0 ? 1 : -1) * j * 40, 0); } g.globalAlpha = 1; }
    // overlay layer
    if (C.overlay === 'fog') {
      for (let b = 0; b < 3; b++) { g.globalAlpha = 0.06 + 0.03 * b; const x0 = wrap(T * (14 + b * 9) + b * 400, W) - W, y0 = 520 + b * 330 + Math.sin(T * 0.3 + b) * 30; g.drawImage(fog, x0, y0, W, 360); g.drawImage(fog, x0 + W, y0, W, 360); }
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
    // colour grade for this act, light leak, grain, vignette
    if (C.grade) { g.globalCompositeOperation = 'soft-light'; g.globalAlpha = C.gradeA; g.fillStyle = C.grade; g.fillRect(0, 0, W, H); }
    if (C.leak) { g.globalCompositeOperation = 'screen'; g.globalAlpha = 0.10; const lx = W * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(T * 0.15))), rg = g.createRadialGradient(lx, 700, 0, lx, 700, 700);
      rg.addColorStop(0, '#ff8a3c'); rg.addColorStop(1, 'rgba(255,138,60,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H); }
    if (C.grain > 0) { g.globalCompositeOperation = 'overlay'; g.globalAlpha = C.grain; const tile = grain[Math.floor(T * 15) %% 4]; g.fillStyle = g.createPattern(tile, 'repeat'); g.fillRect(0, 0, W, H); }
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.drawImage(vig, 0, 0);
    // punctuation
    if (C.flash) { const a = 0.45 * (1 - cl(t / 0.13)); if (a > 0) { g.globalCompositeOperation = 'screen'; g.globalAlpha = a; g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; } }
    if (C.letterbox) { const b = 110 * (1 - Math.pow(1 - cl(t / 0.3), 3)); g.fillStyle = '#000'; g.fillRect(0, 0, W, b); g.fillRect(0, H - b, W, b); }
    // share devices
    if (C.pin) { const pt = t - 0.3; if (pt > 0) { const p = C.pin, drop = cl(pt / 0.35), bounce = drop < 1 ? -300 * Math.pow(1 - drop, 2) : -18 * Math.abs(Math.sin(Math.min(pt - 0.35, 0.5) * 9)) * Math.exp(-(pt - 0.35) * 5);
      for (let r = 0; r < 3; r++) { const ph = ((pt - 0.35) * 0.7 + r / 3) %% 1; if (pt < 0.35) break; g.globalAlpha = 0.6 * (1 - ph); g.strokeStyle = C.accent; g.lineWidth = 5; g.beginPath(); g.ellipse(p.x, p.y, 30 + ph * 150, (30 + ph * 150) * 0.35, 0, 0, 6.283); g.stroke(); }
      g.globalAlpha = 1; g.save(); g.translate(p.x, p.y + bounce); g.fillStyle = C.accent; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-46, -60, -46, -120, 0, -120); g.bezierCurveTo(46, -120, 46, -60, 0, 0); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, -82, 16, 0, 6.283); g.fill(); g.restore();
      const la = cl((pt - 0.3) / 0.25); if (la > 0) { g.globalAlpha = la; g.font = '800 90px Baloo, Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 10; g.strokeStyle = 'rgba(0,0,0,0.75)'; g.strokeText(p.town, p.x, p.y - 200); g.fillStyle = '#fff'; ft(p.town, p.x, p.y - 200); g.globalAlpha = 1; } } }
    if (C.loc) { const la = cl((t - 0.25) / 0.3); if (la > 0) { g.globalAlpha = la; g.font = '800 30px Inter'; const s = C.loc.toUpperCase().split('').join(String.fromCharCode(8202)), w = g.measureText(s).width + 70, y = 1170;
      g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(540 - w / 2, y, w, 56); g.fillStyle = '#F5C542'; g.fillRect(540 - w / 2, y, 6, 56); g.textAlign = 'center'; g.textBaseline = 'middle'; ft(s, 540, y + 30); g.globalAlpha = 1; } }
    if (C.hud) { const items = C.hud, cw = 260, x0 = 540 - (items.length * cw) / 2; items.forEach((it, j) => { const p = cl((t - 0.4 - j * 0.25) / 1.2), v = Math.round(it[1] * (1 - Math.pow(1 - p, 3))), x = x0 + j * cw + cw / 2;
      g.globalAlpha = cl(p * 4); g.fillStyle = 'rgba(0,0,0,0.45)'; g.beginPath(); g.roundRect(x - cw / 2 + 12, 470, cw - 24, 120, 18); g.fill(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#F5C542'; g.font = '800 24px Inter'; ft(String(it[0]).toUpperCase(), x, 500); g.fillStyle = '#fff'; g.font = '800 56px Inter'; ft(v.toLocaleString('en-IN') + (it[2] || ''), x, 552); }); g.globalAlpha = 1; }
    if (C.series && C.i > 0) {   // not on the hook: it would sit on the cover text
      g.font = '800 36px Baloo, Inter'; const w = g.measureText(C.series).width + 44, x = 1020 - w, y = 118; g.fillStyle = C.accent; g.beginPath(); g.roundRect(x, y, w, 58, 29); g.fill(); g.fillStyle = '#111'; g.textAlign = 'left'; g.textBaseline = 'middle'; ft(C.series, x + 22, y + 31); }
    g.restore();
  };
})();
"""


def config_for(script: dict, i: int, t0: float, n: int = 6, code: str = "") -> dict | None:
    cfg = script.get("cine", {})
    if cfg is False:
        return None
    cfg = dict(cfg or {})
    light = (script.get("theme") or "") in LIGHT_THEMES
    overlay = cfg.get("overlay") or ("ink" if light else "dust")
    color = cfg.get("color") or {"ink": "#3a3029", "embers": "#ff9a3c", "rain": "#cfe3ff",
                                 "stars": "#ffffff", "fog": "#ffffff"}.get(overlay, "#ffd59a")
    vig = cfg.get("vignette", 0.18 if light else 0.45)
    grades = cfg.get("grade") or (["#c9b38a", "#d9a066", "#b5503c"] if light else ["#1d4e6b", "#6b5a8c", "#ff9a3c"])
    act = min(len(grades) - 1, int(i * len(grades) / max(1, n)))
    twist = cfg.get("twist", script.get("twist_scene"))
    flash = cfg.get("flash", [twist] if twist is not None else [])
    letterbox = cfg.get("letterbox", [n - 2] if n >= 4 else [])
    whip = cfg.get("whip", [])
    accent = cfg.get("accent") or ("#b5281f" if light else "#ffb547")
    pin = script.get("pin") if (script.get("pin") or {}).get("scene") == i else None
    return {"overlay": overlay, "color": color, "push": cfg.get("push", 0.12 if i == 0 else 0.07),
            "pan": cfg.get("pan", 60), "dir": 1 if i % 2 == 0 else -1,
            "kick": 0.10 if i == twist else cfg.get("kick", 0.04), "i": i, "t0": round(t0, 3),
            "vigCol": f"rgba({'60,40,20' if light else '0,0,0'},{vig})",
            "grade": grades[act] if cfg.get("grade", True) is not False else None,
            "gradeA": 0.10 if light else 0.15, "leak": cfg.get("leak", not light),
            "grain": cfg.get("grain", 0.05 if light else 0.07),
            "flash": i in flash, "letterbox": i in letterbox,
            "whipIn": i in whip, "whipOut": (i + 1) in whip,
            "layered": "CINE.layer" in (code or ""), "accent": accent,
            "series": script.get("series"), "pin": pin,
            "loc": ([script.get("hook_loc")] + [s.get("loc") for s in script.get("scenes", [])] + [None] * 20)[i],
            "hud": (script.get("hud") or {}).get(str(i))}


def wrap(code: str | None, script: dict, i: int, t0: float, n: int = 6) -> str | None:
    """Return the scene code with the cinematic pass appended (or unchanged if switched off)."""
    if not code:
        return code
    cfg = config_for(script, i, t0, n, code)
    if cfg is None:
        return code
    return code + "\n" + JS % {"CFG": json.dumps(cfg, ensure_ascii=False)}
