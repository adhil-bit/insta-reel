// Design templates (docs/design-methods.md -> "Design rotation"). Prepended by cine.wrap when script.design is set.
// Every template turns the same G-kit drawings into a different medium: newsprint halftone, case-file polaroids,
// sepia album photos, VHS night vision, forensic x-ray HUD, Kerala mural paint.
const FX = (() => {
  const cache = {};
  function buf(key, w, h) {
    let k = cache[key]; if (!k || k.width !== w || k.height !== h) { k = cache[key] = document.createElement('canvas'); k.width = w; k.height = h; }
    const x = k.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none'; x.clearRect(0, 0, w, h); return [k, x];
  }
  // draw fn (scene coords) for region r=[x,y,w,h] into an offscreen at scale s
  function shot(key, fn, r = [0, 0, W, H], s = 0.6) {
    const [k, x] = buf(key, Math.max(2, Math.round(r[2] * s)), Math.max(2, Math.round(r[3] * s)));
    x.save(); x.scale(s, s); x.translate(-r[0], -r[1]); fn(x); x.restore(); return k;
  }
  function tint(k, col, mode = 'source-in') { const x = k.getContext('2d'); x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = mode; x.fillStyle = col; x.fillRect(0, 0, k.width, k.height); x.restore(); return k; }
  // newsprint halftone of fn inside r, drawn onto g at r (ink dots, optional spot colour layer)
  function halftone(g, key, fn, r, dot = 11, ink = '#1b1a17', ang = 0.26) {
    const cw = Math.ceil(r[2] / dot), ch = Math.ceil(r[3] / dot);
    const [k, x] = buf(key + '_ht', cw, ch); x.save(); x.scale(1 / dot, 1 / dot); x.translate(-r[0], -r[1]); fn(x); x.restore();
    const d = x.getImageData(0, 0, cw, ch).data; g.save(); g.fillStyle = ink; g.beginPath();
    for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
      const o = (j * cw + i) * 4, a = d[o + 3] / 255, L = (0.3 * d[o] + 0.59 * d[o + 1] + 0.11 * d[o + 2]) / 255;
      const dark = a * Math.pow(1 - L, 1.35); if (dark < 0.10) continue;
      const rr = dot * 0.62 * Math.sqrt(dark), cx = r[0] + (i + 0.5 + (j % 2) * 0.25) * dot, cy = r[1] + (j + 0.5) * dot;
      g.moveTo(cx + rr, cy); g.arc(cx, cy, rr, 0, 6.283);
    }
    g.fill(); g.restore();
  }
  // filtered photo: fn inside r -> drawn at r with a CSS filter (sepia, night vision, x-ray ...)
  function photo(g, key, fn, r, filter, s = 0.6, over) {
    const k = shot(key, fn, r, s); g.save(); g.filter = filter || 'none'; g.drawImage(k, r[0], r[1], r[2], r[3]); g.restore();
    if (over) { g.save(); g.globalCompositeOperation = over[1] || 'multiply'; g.fillStyle = over[0]; g.fillRect(r[0], r[1], r[2], r[3]); g.restore(); }
  }
  // flat paint with a thick outline (mural / cut-paper): everything fn draws becomes `fill`, outlined in `line`
  function paint(g, key, fn, fill, line = '#120c08', lw = 6, s = 0.5) {
    const k = shot(key, fn, [0, 0, W, H], s), o = shot(key + '_o', fn, [0, 0, W, H], s);
    tint(o, line); tint(k, fill);
    const d = lw * s; g.save();
    for (const [dx, dy] of [[-d, 0], [d, 0], [0, -d], [0, d], [-d * .7, -d * .7], [d * .7, d * .7], [-d * .7, d * .7], [d * .7, -d * .7]]) g.drawImage(o, dx / s, dy / s, W, H);
    g.drawImage(k, 0, 0, W, H); g.restore();
  }
  let sd = 4242; const R = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const NOISE = Array.from({ length: 900 }, () => [R(), R(), R()]);
  function grainDots(g, col, a, n = 900, sz = 2) { g.save(); g.fillStyle = col; for (let i = 0; i < n; i++) { const q = NOISE[i % 900]; g.globalAlpha = a * q[2]; g.fillRect(q[0] * W, q[1] * H, sz, sz); } g.restore(); }
  function fit(g, s, max, font) { let f = font; g.font = f; let size = parseInt(f.match(/(\d+)px/)[1]); while (g.measureText(s).width > max && size > 14) { size -= 2; g.font = f.replace(/\d+px/, size + 'px'); } }
  return { buf, shot, tint, halftone, photo, paint, grainDots, R, NOISE, fit };
})();

// ---------- NEWSPRINT: cream paper, column texture, halftone clippings, red marker, spot colour ----------
const NEWS = (() => {
  const P = '#ECE4CF', INK = '#1b1a17', RED = '#C8302B', SPOT = '#E3A21A';
  function paper(g, t) {
    g.fillStyle = P; g.fillRect(-200, -200, W + 400, H + 400);
    g.save(); g.globalAlpha = 0.10; g.fillStyle = INK;                       // ghost columns of body text
    for (let c = 0; c < 4; c++) for (let y = 140; y < H - 80; y += 26) { const w = 200 + ((c * 37 + y) % 50); if ((y + c * 13) % 230 < 20) continue; g.fillRect(60 + c * 250, y, w, 9); }
    g.restore();
    const vg = g.createRadialGradient(540, 960, 500, 540, 960, 1200); vg.addColorStop(0, 'rgba(120,90,40,0)'); vg.addColorStop(1, 'rgba(120,90,40,0.28)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(0,0,0,0.06)'; g.fillRect(0, 958, W, 3);                // fold
    FX.grainDots(g, '#5a4a30', 0.22, 900, 2);
  }
  function clip(g, x, y, w, h, rot, inner, head) {                           // torn clipping with shadow, content via inner(g)
    g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.translate(-w / 2, -h / 2);
    g.shadowColor = 'rgba(40,30,10,0.35)'; g.shadowBlur = 24; g.shadowOffsetY = 10;
    g.fillStyle = '#F4EEDD'; g.beginPath(); g.moveTo(0, 0);
    for (let i = 0; i <= 20; i++) g.lineTo(w * i / 20, (i % 2) * 6); for (let i = 0; i <= 20; i++) g.lineTo(w - (i % 2) * 6, h * i / 20);
    for (let i = 20; i >= 0; i--) g.lineTo(w * i / 20, h - (i % 2) * 6); g.closePath(); g.fill(); g.shadowColor = 'transparent';
    let top = 18;
    if (head) { g.fillStyle = INK; g.textAlign = 'left'; FX.fit(g, head, w - 48, '800 58px Baloo'); g.fillText(head, 24, 74); g.fillRect(24, 96, w - 48, 4); top = 116; }
    g.save(); g.beginPath(); g.rect(20, top, w - 40, h - top - 20); g.clip(); inner(g, 20, top, w - 40, h - top - 20); g.restore();
    g.restore();
  }
  function marker(g, x, y, rx, ry, p, col = RED) {                         // hand-drawn circle, p 0..1
    if (p <= 0) return; g.save(); g.strokeStyle = col; g.lineWidth = 9; g.lineCap = 'round'; g.globalAlpha = 0.9; g.beginPath();
    const n = 60, m = Math.floor(n * 1.15 * clamp(p)); for (let i = 0; i <= m; i++) { const a = -1.9 + i / n * 6.6, w = 1 + 0.06 * Math.sin(i * 0.7); const px = x + Math.cos(a) * rx * w, py = y + Math.sin(a) * ry * w; i ? g.lineTo(px, py) : g.moveTo(px, py); }
    g.stroke(); g.restore();
  }
  function scrawl(g, s, x, y, size, p, col = RED, rot = -0.06) { if (p <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = clamp(p * 2); g.fillStyle = col; g.font = `700 ${size}px Hand, Chilanka`; g.textAlign = 'center'; g.fillText(s, 0, 0); g.restore(); }
  function tab(g, s, x, y) { g.save(); g.font = '800 30px Inter'; const w = g.measureText(s).width + 40; g.fillStyle = RED; g.fillRect(x, y, w, 52); g.fillStyle = '#fff'; g.textAlign = 'left'; g.fillText(s, x + 20, y + 37); g.restore(); }
  return { P, INK, RED, SPOT, paper, clip, marker, scrawl, tab };
})();

// ---------- CASE FILE: dark desk, manila folder, polaroids, red string, typewriter, stamps ----------
const CASE = (() => {
  const RED = '#B3261E', MANILA = '#C9A66B', PAPER = '#F2EBDD', TYPE = '#2a2622';
  function desk(g, t) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#2b1d14'); gr.addColorStop(1, '#170f0a'); g.fillStyle = gr; g.fillRect(-200, -200, W + 400, H + 400);
    g.save(); g.globalAlpha = 0.10; g.strokeStyle = '#7a5537'; g.lineWidth = 3; for (let i = 0; i < 26; i++) { g.beginPath(); const y = i * 80 + 20; g.moveTo(-50, y); for (let x = 0; x <= W + 50; x += 60) g.lineTo(x, y + Math.sin(x * 0.01 + i) * 14); g.stroke(); } g.restore();
    const lg = g.createRadialGradient(560, 900, 100, 560, 900, 1100); lg.addColorStop(0, 'rgba(255,220,160,0.16)'); lg.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = lg; g.fillRect(0, 0, W, H);
  }
  function folder(g, x, y, w, h, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = '#a8844f'; g.fillRect(-10, -14, w * 0.36, 40); g.fillStyle = MANILA; g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 30; g.fillRect(0, 0, w, h); g.shadowColor = 'transparent'; g.fillStyle = 'rgba(0,0,0,0.06)'; g.fillRect(0, 0, w, 6); g.restore(); }
  function sheet(g, x, y, w, h, rot = 0, grid = false) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = PAPER; g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 16; g.fillRect(0, 0, w, h); g.shadowColor = 'transparent';
    if (grid) { g.strokeStyle = 'rgba(60,110,170,0.18)'; g.lineWidth = 1; for (let i = 0; i < w; i += 30) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); } for (let j = 0; j < h; j += 30) { g.beginPath(); g.moveTo(0, j); g.lineTo(w, j); g.stroke(); } } g.restore(); }
  function polaroid(g, key, fn, x, y, w, h, rot, label, filter = 'contrast(1.08) saturate(0.75) sepia(0.25)', r) {
    g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.translate(-w / 2, -h / 2);
    g.fillStyle = '#f7f4ec'; g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 22; g.shadowOffsetY = 8; g.fillRect(0, 0, w, h); g.shadowColor = 'transparent';
    const iw = w - 36, ih = h - 110; const rr = r || [0, (H - W * ih / iw) / 2, W, W * ih / iw]; const k = FX.shot(key, fn, rr, 0.4); g.filter = filter; g.drawImage(k, 18, 18, iw, ih); g.filter = 'none';
    if (label) { g.fillStyle = '#222'; g.textAlign = 'center'; FX.fit(g, label, w - 40, '700 44px Hand, Chilanka'); g.fillText(label, w / 2, h - 34); }
    g.restore();
  }
  function pin(g, x, y) { g.save(); g.fillStyle = RED; g.beginPath(); g.arc(x, y, 13, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.arc(x - 4, y - 4, 4, 0, 6.283); g.fill(); g.restore(); }
  function string(g, pts, p) { if (p <= 0) return; g.save(); g.strokeStyle = RED; g.lineWidth = 4; g.beginPath(); let tot = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
    let rem = tot * clamp(p); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length && rem > 0; i++) { const f = Math.min(1, rem / seg[i - 1]); g.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); rem -= seg[i - 1]; } g.stroke(); g.restore(); pts.forEach(q => pin(g, q[0], q[1])); }
  function typed(g, s, x, y, p, size = 34, col = TYPE, align = 'left') { const n = Math.floor(s.length * clamp(p)); if (n <= 0) return; g.save(); g.fillStyle = col; g.font = `700 ${size}px "DejaVu Sans Mono", monospace`; g.textAlign = align; g.fillText(s.slice(0, n), x, y); g.restore(); }
  function stamp(g, s, x, y, rot, tt, size = 96, col = RED) {                // slams in over 0.18 s at local time tt>=0
    if (tt < 0) return; const k = clamp(tt / 0.18), sc = 1.6 - 0.6 * ease.out(k); g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha = 0.85 * k;
    g.font = `800 ${size}px Baloo, Inter`; const w = g.measureText(s).width + 60; g.strokeStyle = col; g.lineWidth = 8; g.strokeRect(-w / 2, -size * 0.75, w, size * 1.3); g.fillStyle = col; g.textAlign = 'center'; g.fillText(s, 0, size * 0.32);
    g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 40; i++) { const q = FX.NOISE[i * 7]; g.globalAlpha = 0.5; g.fillRect(-w / 2 + q[0] * w, -size * 0.75 + q[1] * size * 1.3, 10, 4); } g.restore(); }
  function redact(g, x, y, w, h, p) { g.save(); g.fillStyle = '#111'; g.fillRect(x, y, w * clamp(p), h); g.restore(); }
  function note(g, s, x, y, rot, w = 380) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = '#F6D743'; g.shadowColor = 'rgba(0,0,0,0.4)'; g.shadowBlur = 14; g.fillRect(0, 0, w, w * 0.8); g.shadowColor = 'transparent';
    g.fillStyle = '#2a2520'; g.textAlign = 'center'; const lines = s.split('\n'); lines.forEach((l, i) => { FX.fit(g, l, w - 40, '700 54px Hand, Chilanka'); g.fillText(l, w / 2, w * 0.8 / 2 - (lines.length - 1) * 34 + i * 68 + 16); }); g.restore(); }
  return { RED, MANILA, PAPER, desk, folder, sheet, polaroid, pin, string, typed, stamp, redact, note };
})();

// ---------- ALBUM: black album page, sepia photos with deckled borders + corners, white-ink handwriting ----------
const ALBUM = (() => {
  const INKW = '#EFE6D2';
  function page(g, t) { g.fillStyle = '#141110'; g.fillRect(-200, -200, W + 400, H + 400); FX.grainDots(g, '#6b5c4a', 0.35, 900, 2);
    g.save(); g.globalAlpha = 0.07; g.strokeStyle = '#c8b89a'; for (let y = 60; y < H; y += 120) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y + 4); g.stroke(); } g.restore(); }
  function photo(g, key, fn, x, y, w, h, rot, warm = 0, a = 1) {
    g.save(); g.globalAlpha = a; g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.translate(-w / 2, -h / 2);
    g.fillStyle = '#efe7d6'; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 26; g.shadowOffsetY = 10;
    g.beginPath(); for (let i = 0; i <= 40; i++) { const px = w * i / 40; g.lineTo(px, (i % 2) * 5); } for (let i = 0; i <= 40; i++) g.lineTo(w - (i % 2) * 5, h * i / 40); for (let i = 40; i >= 0; i--) g.lineTo(w * i / 40, h - (i % 2) * 5); for (let i = 40; i >= 0; i--) g.lineTo((i % 2) * 5, h * i / 40); g.fill(); g.shadowColor = 'transparent';
    const k = FX.shot(key, fn, [0, 0, W, H], 0.45); g.filter = `sepia(${1 - warm * 0.85}) contrast(1.1) brightness(${0.92 + warm * 0.08}) saturate(${0.8 + warm * 0.6})`; g.drawImage(k, 26, 26, w - 52, h - 52); g.filter = 'none';
    g.fillStyle = '#0d0b0a'; for (const [cx, cy, sx, sy] of [[0, 0, 1, 1], [w, 0, -1, 1], [0, h, 1, -1], [w, h, -1, -1]]) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + 70 * sx, cy); g.lineTo(cx, cy + 70 * sy); g.fill(); }
    g.restore();
  }
  function write(g, s, x, y, size, p, col = INKW, align = 'center', rot = -0.03) { const n = Math.ceil(s.length * clamp(p)); if (n <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.font = `700 ${size}px Chilanka, Hand`; g.textAlign = align; g.fillText(s.slice(0, n), 0, 0); g.restore(); }
  return { INKW, page, photo, write };
})();

// ---------- VHS: night-vision camcorder footage ----------
const VHS = (() => {
  const GRN = '#8CFF9E';
  function cam(g, key, fn, t, mode = 'night') {                          // full-frame footage of fn
    const k = FX.shot(key, fn, [-40, -40, W + 80, H + 80], 0.5);
    g.save(); g.fillStyle = '#000'; g.fillRect(-200, -200, W + 400, H + 400);
    if (mode === 'night') { g.filter = 'grayscale(1) brightness(1.55) contrast(1.5)'; g.drawImage(k, -40, -40, W + 80, H + 80); g.filter = 'none'; g.globalCompositeOperation = 'multiply'; g.fillStyle = '#5dff7a'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; }
    else { g.filter = 'saturate(1.25) contrast(1.05)'; g.drawImage(k, -40, -40, W + 80, H + 80); g.filter = 'none'; }
    g.restore();
  }
  function torch(g, x, y, r) { g.save(); const rg = g.createRadialGradient(x, y, r * 0.2, x, y, r); rg.addColorStop(0, 'rgba(0,0,0,0)'); rg.addColorStop(1, 'rgba(0,0,0,0.85)'); g.fillStyle = rg; g.fillRect(-100, -100, W + 200, H + 200); g.restore(); }
  function hud(g, t, label = 'CAM 2', stamp = 'NOV 13 2026', mode = 'night') {
    const col = mode === 'night' ? GRN : '#ffffff';
    g.save(); g.fillStyle = col; g.font = '700 34px "DejaVu Sans Mono", monospace'; g.textAlign = 'left';
    if (Math.floor(t * 1.6) % 2 === 0) { g.fillStyle = '#ff3b30'; g.beginPath(); g.arc(80, 1580, 14, 0, 6.283); g.fill(); }
    g.fillStyle = col; g.fillText('REC', 104, 1592); g.fillText(label, 80, 1640);
    const s = Math.floor(t), ts = '00:00:' + String(13 + s).padStart(2, '0'); g.textAlign = 'right'; g.fillText(ts, 1000, 1592); g.fillText(stamp, 1000, 1640);
    g.strokeStyle = col; g.lineWidth = 4; for (const [x, y, sx, sy] of [[60, 680, 1, 1], [1020, 680, -1, 1], [60, 1700, 1, -1], [1020, 1700, -1, -1]]) { g.beginPath(); g.moveTo(x, y + 50 * sy); g.lineTo(x, y); g.lineTo(x + 50 * sx, y); g.stroke(); }
    g.restore();
  }
  function post(g, t, glitch = 0) {                                       // scanlines, noise, tracking band
    g.save(); g.globalAlpha = 0.16; g.fillStyle = '#000'; for (let y = 0; y < H; y += 6) g.fillRect(0, y, W, 2); g.restore();
    FX.grainDots(g, '#ffffff', 0.18, 700, 3);
    const by = ((t * 260) % (H + 300)) - 150; g.save(); g.globalAlpha = 0.10 + glitch * 0.3; g.fillStyle = '#fff'; g.fillRect(0, by, W, 26 + glitch * 60); g.restore();
    if (glitch > 0) { g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = glitch * 0.6; g.drawImage(g.canvas, 18 * glitch, 0, W, H, 0, 0, W, H); g.restore(); }
  }
  return { GRN, cam, torch, hud, post };
})();

// ---------- LAB: forensic HUD, x-ray scans, bounding boxes, evidence markers ----------
const LAB = (() => {
  const CY = '#35E0FF', BG = '#07121C', OK = '#4CFF8F', WARN = '#FF4D4D', TENT = '#FFC400';
  function bg(g, t) { g.fillStyle = BG; g.fillRect(-200, -200, W + 400, H + 400); g.save(); g.strokeStyle = 'rgba(53,224,255,0.08)'; g.lineWidth = 1; for (let x = 0; x <= W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.restore(); }
  function xray(g, key, fn, r) { const k = FX.shot(key, fn, r, 0.5); const [b, x] = FX.buf(key + '_x', k.width, k.height); x.filter = 'grayscale(1) invert(1) contrast(1.7) brightness(0.9)'; x.drawImage(k, 0, 0); x.filter = 'none';
    x.globalCompositeOperation = 'multiply'; x.fillStyle = '#35E0FF'; x.fillRect(0, 0, b.width, b.height); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 0.18; x.fillStyle = '#000'; for (let y = 0; y < b.height; y += 4) x.fillRect(0, y, b.width, 2);
    g.save(); g.globalCompositeOperation = 'screen'; g.drawImage(b, r[0], r[1], r[2], r[3]); g.restore(); }
  function box(g, x, y, w, h, p, label, col = CY) { if (p <= 0) return; g.save(); g.strokeStyle = col; g.lineWidth = 4; const L = Math.min(w, h) * 0.22 * clamp(p * 2);
    for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { g.beginPath(); g.moveTo(cx, cy + L * sy); g.lineTo(cx, cy); g.lineTo(cx + L * sx, cy); g.stroke(); }
    if (label && p > 0.5) { g.font = '700 28px "DejaVu Sans Mono", monospace'; const tw = g.measureText(label).width + 24; g.fillStyle = col; g.fillRect(x, y - 44, tw, 40); g.fillStyle = BG; g.textAlign = 'left'; g.fillText(label, x + 12, y - 14); } g.restore(); }
  function scan(g, x, y, w, h, p, col = CY) { if (p <= 0 || p >= 1) return; const sy = y + h * p; g.save(); const gr = g.createLinearGradient(0, sy - 80, 0, sy); gr.addColorStop(0, 'rgba(53,224,255,0)'); gr.addColorStop(1, 'rgba(53,224,255,0.35)'); g.fillStyle = gr; g.fillRect(x, sy - 80, w, 80); g.fillStyle = col; g.fillRect(x, sy - 2, w, 4); g.restore(); }
  function readout(g, lines, x, y, p, col = CY, size = 30) { g.save(); g.font = `700 ${size}px "DejaVu Sans Mono", monospace`; g.textAlign = 'left'; let budget = p * lines.reduce((a, l) => a + l.length, 0);
    lines.forEach((l, i) => { const n = Math.max(0, Math.min(l.length, Math.floor(budget))); budget -= l.length; if (n > 0) { g.fillStyle = Array.isArray(col) ? col[i] : col; g.fillText(l.slice(0, n), x, y + i * (size + 16)); } }); g.restore(); }
  function tent(g, n, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = TENT; g.beginPath(); g.moveTo(-40, 0); g.lineTo(-24, -80); g.lineTo(24, -80); g.lineTo(40, 0); g.fill(); g.fillStyle = '#111'; g.font = '800 46px Inter'; g.textAlign = 'center'; g.fillText(String(n), 0, -22); g.restore(); }
  function wave(g, x, y, w, t, amp, col = CY) { g.save(); g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= w; i += 6) { const k = i / w; const v = amp * Math.sin(k * 40 + t * 8) * Math.exp(-Math.pow((k - 0.5) * 3, 2)); i ? g.lineTo(x + i, y + v) : g.moveTo(x + i, y + v); } g.stroke(); g.restore(); }
  return { CY, BG, OK, WARN, TENT, bg, xray, box, scan, readout, tent, wave };
})();

// ---------- MURAL: Kerala mural wall paint (ochre, vermilion, leaf green, black outline) ----------
const MURAL = (() => {
  const OCH = '#D9A441', RED = '#B8341F', GRN = '#3E7D3A', CRM = '#F1DFB8', BLK = '#140d08', BLU = '#2C4A6B';
  function wall(g, t, base = OCH) {
    g.fillStyle = base; g.fillRect(-200, -200, W + 400, H + 400);
    FX.grainDots(g, '#7a4a1a', 0.28, 900, 3); FX.grainDots(g, '#fff3d0', 0.18, 600, 2);
    g.save(); g.strokeStyle = 'rgba(60,30,10,0.25)'; g.lineWidth = 2; for (let i = 0; i < 7; i++) { const q = FX.NOISE[i * 31]; g.beginPath(); let x = q[0] * W, y = q[1] * H; g.moveTo(x, y); for (let k = 0; k < 8; k++) { x += (FX.NOISE[(i * 31 + k) % 900][0] - 0.5) * 90; y += 40; g.lineTo(x, y); } g.stroke(); } g.restore();
  }
  function band(g, y, h = 70) {                                         // decorative border: red band + leaf/petal row
    g.save(); g.fillStyle = RED; g.fillRect(0, y, W, h); g.fillStyle = BLK; g.fillRect(0, y, W, 6); g.fillRect(0, y + h - 6, W, 6);
    for (let x = 30; x < W; x += 60) { g.fillStyle = CRM; g.beginPath(); g.ellipse(x, y + h / 2, 22, 12, 0, 0, 6.283); g.fill(); g.fillStyle = GRN; g.beginPath(); g.arc(x, y + h / 2, 7, 0, 6.283); g.fill(); }
    g.restore();
  }
  function panel(g, x, y, w, h, fill = CRM) { g.save(); g.fillStyle = fill; g.fillRect(x, y, w, h); g.strokeStyle = BLK; g.lineWidth = 8; g.strokeRect(x, y, w, h); g.strokeStyle = RED; g.lineWidth = 4; g.strokeRect(x + 14, y + 14, w - 28, h - 28); g.restore(); }
  return { OCH, RED, GRN, CRM, BLK, BLU, wall, band, panel };
})();

// ---------- SHADOW: Tholpavakoothu shadow-puppet screen (lamp-lit cloth, black cut-outs on sticks) ----------
const SHADOW = (() => {
  function screen(g, t) {
    const f = 1 + 0.03 * Math.sin(t * 9) + 0.02 * Math.sin(t * 23);
    const rg = g.createRadialGradient(540, 1100, 80, 540, 1000, 1150 * f); rg.addColorStop(0, '#fff6df'); rg.addColorStop(0.5, '#f1d3a0'); rg.addColorStop(1, '#3b1c0c');
    g.fillStyle = rg; g.fillRect(-200, -200, W + 400, H + 400); FX.grainDots(g, '#5a2508', 0.25, 900, 2);
    g.save(); g.globalAlpha = 0.12; g.strokeStyle = '#7a3a10'; g.lineWidth = 1; for (let x = 0; x < W; x += 9) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } g.restore();
  }
  function lamps(g, t, y = 1560) { for (let i = 0; i < 7; i++) { const x = 120 + i * 140, f = 1 + 0.15 * Math.sin(t * 12 + i * 2); g.save(); g.fillStyle = '#1a0a04'; g.fillRect(x - 34, y, 68, 22); const fg = g.createRadialGradient(x, y - 26, 2, x, y - 26, 60 * f); fg.addColorStop(0, 'rgba(255,240,180,0.95)'); fg.addColorStop(1, 'rgba(255,160,40,0)'); g.fillStyle = fg; g.beginPath(); g.arc(x, y - 26, 60 * f, 0, 6.283); g.fill(); g.fillStyle = '#fff4c8'; g.beginPath(); g.ellipse(x, y - 24, 9, 22 * f, 0, 0, 6.283); g.fill(); g.restore(); } }
  function puppet(g, key, fn, sway = 0, t = 0, sticks = []) {             // fn draws figure(s); becomes a black leather cut-out with punched dots
    const k = FX.shot(key, fn, [0, 0, W, H], 0.5); FX.tint(k, '#120804');
    const x = k.getContext('2d'); x.save(); x.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 260; i++) { const q = FX.NOISE[i * 3]; x.beginPath(); x.arc(q[0] * k.width, q[1] * k.height, 1.6 + q[2] * 2, 0, 6.283); x.fill(); } x.restore();
    g.save(); g.translate(540, 1500); g.rotate(sway * Math.sin(t * 1.4) * 0.02); g.translate(-540, -1500); g.filter = 'blur(1.2px)'; g.drawImage(k, 0, 0, W, H); g.filter = 'none';
    g.strokeStyle = '#120804'; g.lineWidth = 6; sticks.forEach(([sx, sy]) => { g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + 30, H + 50); g.stroke(); }); g.restore();
  }
  return { screen, lamps, puppet };
})();

// ---------- BLUEPRINT: architect's plan, white lines on blue, dimension arrows, title block ----------
const BP = (() => {
  const BL = '#0f3c72', LN = '#e8f1ff';
  function bg(g, t) { g.fillStyle = BL; g.fillRect(-200, -200, W + 400, H + 400); g.save(); g.strokeStyle = 'rgba(232,241,255,0.10)'; g.lineWidth = 1; for (let x = 0; x <= W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.strokeStyle = 'rgba(232,241,255,0.22)'; for (let x = 0; x <= W; x += 200) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } g.restore(); FX.grainDots(g, '#ffffff', 0.08, 600, 2); }
  function trace(g, pts, p, w = 5, close = true) { const n = pts.length + (close ? 1 : 0); const m = n * clamp(p); if (m <= 0) return; g.save(); g.strokeStyle = LN; g.lineWidth = w; g.lineJoin = 'round'; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < n && i <= m + 1; i++) { const a = pts[(i - 1) % pts.length], b = pts[i % pts.length], f = clamp(m - i + 1); g.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f)); } g.stroke(); g.restore(); }
  function dim(g, x1, y1, x2, y2, label, p) { if (p <= 0) return; g.save(); g.globalAlpha = clamp(p * 2); g.strokeStyle = LN; g.fillStyle = LN; g.lineWidth = 2; g.beginPath(); g.moveTo(x1, y1); g.lineTo(lerp(x1, x2, clamp(p)), lerp(y1, y2, clamp(p))); g.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1); for (const [x, y, s] of [[x1, y1, 1], [x2, y2, -1]]) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + s * 18 * Math.cos(a - 0.35), y + s * 18 * Math.sin(a - 0.35)); g.lineTo(x + s * 18 * Math.cos(a + 0.35), y + s * 18 * Math.sin(a + 0.35)); g.fill(); }
    if (p > 0.6) { g.save(); g.translate((x1 + x2) / 2, (y1 + y2) / 2); g.rotate(Math.abs(a) > 1.57 ? a + Math.PI : a); g.font = '700 30px "DejaVu Sans Mono", monospace'; g.textAlign = 'center'; const w = g.measureText(label).width + 20; g.fillStyle = BL; g.fillRect(-w / 2, -24, w, 34); g.fillStyle = LN; g.fillText(label, 0, 2); g.restore(); } g.restore(); }
  function note(g, s, x, y, p, size = 32, align = 'left') { const n = Math.ceil(s.length * clamp(p)); if (n <= 0) return; g.save(); g.fillStyle = LN; g.font = `700 ${size}px "DejaVu Sans Mono", Baloo, monospace`; g.textAlign = align; g.fillText(s.slice(0, n), x, y); g.restore(); }
  function block(g, lines, x, y, w) { g.save(); g.strokeStyle = LN; g.lineWidth = 3; g.strokeRect(x, y, w, 44 * lines.length + 16); lines.forEach((l, i) => { if (i) { g.beginPath(); g.moveTo(x, y + 8 + i * 44); g.lineTo(x + w, y + 8 + i * 44); g.stroke(); } g.fillStyle = LN; g.font = '700 26px "DejaVu Sans Mono", Baloo, monospace'; g.fillText(l, x + 16, y + 40 + i * 44); }); g.restore(); }
  return { BL, LN, bg, trace, dim, note, block };
})();

// ---------- CHALK: classroom blackboard, chalk lines, hand-written labels ----------
const CHALK = (() => {
  const WH = '#f3f1e7', YL = '#ffe27a', PK = '#ff9db0', BLU = '#9fd3ff';
  function board(g, t) { const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#22402f'); gr.addColorStop(1, '#17301f'); g.fillStyle = gr; g.fillRect(-200, -200, W + 400, H + 400);
    g.save(); g.globalAlpha = 0.07; g.fillStyle = '#ffffff'; for (let i = 0; i < 14; i++) { const q = FX.NOISE[i * 17]; g.beginPath(); g.ellipse(q[0] * W, q[1] * H, 220, 60, q[2] * 3, 0, 6.283); g.fill(); } g.restore(); FX.grainDots(g, '#ffffff', 0.12, 900, 2);
    g.fillStyle = '#6b4a2a'; g.fillRect(-200, 1880, W + 400, 60); }
  function line(g, pts, p, col = WH, w = 7) { const n = pts.length - 1, m = n * clamp(p); if (m <= 0) return; g.save(); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.globalAlpha = 0.92;
    for (let pass = 0; pass < 2; pass++) { g.beginPath(); g.moveTo(pts[0][0] + pass, pts[0][1] - pass); for (let i = 1; i <= Math.ceil(m); i++) { const a = pts[i - 1], b = pts[i], f = clamp(m - i + 1); g.lineTo(lerp(a[0], b[0], f) + pass * 1.5, lerp(a[1], b[1], f) - pass); } g.stroke(); g.lineWidth = w * 0.4; g.globalAlpha = 0.5; } g.restore(); }
  function circle(g, x, y, r, p, col = WH, w = 7, fill) { const pts = []; for (let i = 0; i <= 48; i++) { const a = -1.57 + i / 48 * 6.283; pts.push([x + Math.cos(a) * r * (1 + 0.015 * Math.sin(i)), y + Math.sin(a) * r]); } if (fill && p >= 1) { g.save(); g.globalAlpha = 0.35; g.fillStyle = fill; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.restore(); } line(g, pts, p, col, w); }
  function write(g, s, x, y, size, p, col = WH, align = 'center') { const n = Math.ceil(s.length * clamp(p)); if (n <= 0) return; g.save(); g.fillStyle = col; g.globalAlpha = 0.95; g.font = `700 ${size}px Hand, Chilanka`; g.textAlign = align; g.fillText(s.slice(0, n), x, y); g.globalAlpha = 0.35; g.fillText(s.slice(0, n), x + 2, y + 1); g.restore(); }
  return { WH, YL, PK, BLU, board, line, circle, write };
})();

// ---------- WOODCUT: linocut print, black + red ink carved with white gouge lines, on cream paper ----------
const WOOD = (() => {
  const PAPER = '#efe5cf', INK = '#15110d', RED = '#b7281d';
  function paper(g, t) { g.fillStyle = PAPER; g.fillRect(-200, -200, W + 400, H + 400); FX.grainDots(g, '#8a7350', 0.28, 900, 2); }
  function ink(g, key, fn, col = INK, gouge = 0.55, ang = -0.5) {         // fn's shapes, flat ink with carved hatch lines
    const k = FX.shot(key, fn, [0, 0, W, H], 0.5); FX.tint(k, col); const x = k.getContext('2d');
    x.save(); x.globalCompositeOperation = 'destination-out'; x.strokeStyle = '#000'; x.lineWidth = 1.6; x.translate(k.width / 2, k.height / 2); x.rotate(ang);
    for (let i = -k.height; i < k.height; i += 9) { const q = FX.NOISE[(i + 2000) % 900]; if (q[0] > gouge) continue; x.beginPath(); x.moveTo(-k.width, i); for (let s = -k.width; s < k.width; s += 30) x.lineTo(s, i + Math.sin(s * 0.05 + i) * 2); x.stroke(); }
    x.restore(); g.save(); g.drawImage(k, 0, 0, W, H); g.restore();
  }
  function frame(g) { g.save(); g.strokeStyle = INK; g.lineWidth = 10; g.strokeRect(60, 620, 960, 900); g.lineWidth = 3; g.strokeRect(78, 638, 924, 864); g.restore(); }
  function title(g, s, x, y, size, col = INK) { g.save(); g.fillStyle = col; g.font = `900 ${size}px Baloo`; g.textAlign = 'center'; g.fillText(s, x, y); g.restore(); }
  return { PAPER, INK, RED, paper, ink, frame, title };
})();

// ---------- PALM: palm-leaf manuscript (thaliyola) leaves, incised text and drawings, binding cord ----------
const PALM = (() => {
  const LEAF = '#d9b77c', EDGE = '#8a5a2b', INC = '#2a1a0e';
  function table(g, t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#3a2414'); gr.addColorStop(1, '#1d120a'); g.fillStyle = gr; g.fillRect(-200, -200, W + 400, H + 400); FX.grainDots(g, '#6b4526', 0.3, 900, 2); }
  function leaf(g, x, y, w, h, rot = 0, a = 1) { g.save(); g.globalAlpha = a; g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.translate(-w / 2, -h / 2);
    g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 18; g.shadowOffsetY = 8; const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#e6c88f'); gr.addColorStop(0.5, LEAF); gr.addColorStop(1, '#c79e5f'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(h / 2, 0); g.lineTo(w - h / 2, 0); g.quadraticCurveTo(w, h / 2, w - h / 2, h); g.lineTo(h / 2, h); g.quadraticCurveTo(0, h / 2, h / 2, 0); g.fill(); g.shadowColor = 'transparent';
    g.strokeStyle = 'rgba(120,80,40,0.35)'; g.lineWidth = 1.5; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(h / 2, h * i / 6); g.lineTo(w - h / 2, h * i / 6 + 2); g.stroke(); }
    g.fillStyle = '#2a1a0e'; for (const cx of [w * 0.28, w * 0.72]) { g.beginPath(); g.arc(cx, h / 2, 9, 0, 6.283); g.fill(); } g.restore(); }
  function cord(g, x, y1, y2) { g.save(); g.strokeStyle = '#7a1f12'; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y1); g.bezierCurveTo(x - 30, (y1 + y2) / 2, x + 30, (y1 + y2) / 2, x, y2); g.stroke(); g.restore(); }
  function incise(g, s, x, y, size, p, align = 'left') { const n = Math.ceil(s.length * clamp(p)); if (n <= 0) return; g.save(); g.fillStyle = INC; g.font = `700 ${size}px Chilanka, Baloo`; g.textAlign = align; g.fillText(s.slice(0, n), x, y); g.restore(); }
  function etch(g, key, fn) { const k = FX.shot(key, fn, [0, 0, W, H], 0.5); FX.tint(k, INC); g.save(); g.globalAlpha = 0.9; g.drawImage(k, 0, 0, W, H); g.restore(); }
  return { LEAF, EDGE, INC, table, leaf, cord, incise, etch };
})();

// ---------- MIND: @kathayum.sathyangalum signature (navy + electric blue, one amber accent; the knot that becomes a line) ----------
const MIND = (() => {
  const NIGHT = '#05070F', NAVY = '#0B1530', PANEL = '#142350', FIG = '#1B2F66', BLUE = '#2E7BFF', ICE = '#7FB2FF', AMBER = '#FFB23E', WHITE = '#F4F7FF', MUTE = '#8A97B8';
  function bg(g, t, focus = [540, 900], floor = 1210) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, NIGHT); gr.addColorStop(0.36, NAVY); gr.addColorStop(1, '#0A1228'); g.fillStyle = gr; g.fillRect(-200, -200, W + 400, H + 400);
    const rg = g.createRadialGradient(focus[0], focus[1], 20, focus[0], focus[1], 700); rg.addColorStop(0, 'rgba(46,123,255,0.16)'); rg.addColorStop(1, 'rgba(46,123,255,0)'); g.fillStyle = rg; g.fillRect(-200, -200, W + 400, H + 400);
    g.save(); const pts = []; for (let i = 0; i < 60; i++) { const q = FX.NOISE[i * 13 % FX.NOISE.length]; pts.push([q[0] * W + 4 * Math.sin(t * 0.4 + i), q[1] * H * 0.9 + 4 * Math.cos(t * 0.37 + i)]); }
    g.strokeStyle = 'rgba(127,178,255,0.10)'; g.lineWidth = 1; for (let i = 0; i < 8; i++) { const a = pts[i * 3], b = pts[i * 3 + 1]; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    pts.forEach((p, i) => { g.globalAlpha = 0.08 + 0.17 * ((i * 37) % 10) / 10; g.fillStyle = ICE; g.beginPath(); g.arc(p[0], p[1], 2 + (i % 2), 0, 6.283); g.fill(); }); g.restore();
    if (floor) { g.fillStyle = NIGHT; g.fillRect(-200, floor, W + 400, H); g.fillStyle = 'rgba(46,123,255,0.25)'; g.fillRect(0, floor, W, 2); }
  }
  function glow(g, path, truth, w = 1) { const core = truth ? '#FFD58A' : ICE, halo = truth ? AMBER : BLUE;
    for (const [lw, a, c] of [[18 * w, 0.12, halo], [8 * w, 0.35, halo], [4 * w, 1, core]]) { g.save(); g.globalAlpha = a; g.strokeStyle = c; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; path(); g.stroke(); g.restore(); } }
  function thread(g, pts, p, truth = false) { if (p <= 0 || pts.length < 2) return; let tot = 0; const seg = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
    glow(g, () => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); let rem = tot * clamp(p); for (let i = 1; i < pts.length && rem > 0; i++) { const f = Math.min(1, rem / seg[i - 1]); g.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); rem -= seg[i - 1]; } }, truth); }
  function knot(g, x, y, r, t, s = 0, truth = false) {           // s 0 = tangled knot, 1 = straight line (length 2.6r)
    glow(g, () => { g.beginPath(); for (let i = 0; i <= 120; i++) { const a = i / 120 * 6.283, rot = t * 0.6;
      const kx = Math.sin(2 * a + rot) * r, ky = Math.sin(3 * a) * r * 0.62, lx = (i / 120 - 0.5) * r * 2.6, ly = 0;
      const px = lerp(kx, lx, s), py = lerp(ky, ly, s); i ? g.lineTo(x + px, y + py) : g.moveTo(x + px, y + py); } }, truth || s > 0.9); }
  function node(g, x, y, p = 1, truth = false) { if (p <= 0) return; const c = truth ? AMBER : ICE; g.save(); g.fillStyle = c; g.beginPath(); g.arc(x, y, 10 * clamp(p * 2), 0, 6.283); g.fill();
    g.globalAlpha = 0.3 * (1 - clamp(p - 0.2)); g.strokeStyle = c; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 22 + 30 * clamp(p), 0, 6.283); g.stroke(); g.restore(); }
  function observer(g, x, y, s = 1, pose = 'stand', o = {}) {      // faceless Malayali everyman: half-sleeve shirt, mundu with amber kara
    const rim = o.truth ? AMBER : ICE, fill = o.fill || FIG; g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = fill; g.strokeStyle = fill; g.lineCap = 'round';
    if (pose === 'sit') { g.fillRect(-150, -250, 40, 250); g.fillRect(-150, -270, 230, 26); }   // chair
    const sitDy = pose === 'sit' ? 150 : 0; g.translate(0, sitDy);
    if (pose === 'sit') { g.beginPath(); g.moveTo(-60, -260); g.lineTo(90, -250); g.lineTo(110, -100 - sitDy + 150); g.lineTo(70, -110); g.lineTo(-60, -200); g.fill(); g.fillRect(70, -260, 40, 260 - sitDy + 0); }
    else { g.beginPath(); g.moveTo(-58, -300); g.lineTo(58, -300); g.lineTo(70, 0); g.lineTo(-70, 0); g.closePath(); g.fill();
      g.strokeStyle = AMBER; g.lineWidth = 6; g.beginPath(); g.moveTo(40, -296); g.lineTo(50, -4); g.lineTo(-68, -4); g.stroke(); g.strokeStyle = fill; }
    g.beginPath(); g.moveTo(-74, -520); g.lineTo(74, -520); g.lineTo(62, -300); g.lineTo(-62, -300); g.closePath(); g.fill();          // shirt
    g.beginPath(); g.moveTo(-74, -520); g.lineTo(-104, -470); g.lineTo(-84, -450); g.lineTo(-66, -480); g.fill(); g.beginPath(); g.moveTo(74, -520); g.lineTo(104, -470); g.lineTo(84, -450); g.lineTo(66, -480); g.fill();
    g.lineWidth = 22; if (pose === 'phone') { g.beginPath(); g.moveTo(90, -470); g.lineTo(70, -560); g.stroke(); } else if (pose === 'think') { g.beginPath(); g.moveTo(90, -470); g.lineTo(40, -560); g.stroke(); }
    else { g.beginPath(); g.moveTo(-94, -462); g.lineTo(-102, -320); g.moveTo(94, -462); g.lineTo(102, -320); g.stroke(); }
    g.fillRect(-16, -560, 32, 44); g.beginPath(); g.ellipse(0, -612, 46, 54, 0, 0, 6.283); g.fill();                                  // neck + head (no face)
    g.beginPath(); g.ellipse(8, -650, 48, 24, 0.15, Math.PI, 0); g.fill();                                                              // hair cap
    g.strokeStyle = rim; g.lineWidth = 3; g.globalAlpha = 0.9; g.beginPath(); g.ellipse(0, -612, 46, 54, 0, -1.2, 1.0); g.stroke(); g.beginPath(); g.moveTo(74, -520); g.lineTo(62, -300); g.stroke();
    g.restore(); return [x, y + (sitDy - 612) * s - 80 * s]; }                                                                          // point above the head
  function chip(g, label, x, y, kind = 'katha', a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; const truth = kind === 'sathyam';
    g.font = (kind === 'katha' ? '700 46px Chilanka, Baloo' : '800 42px Baloo'); const w = g.measureText(label).width + 56;
    g.fillStyle = truth ? 'rgba(255,178,62,0.16)' : 'rgba(20,35,80,0.92)'; g.strokeStyle = truth ? AMBER : BLUE; g.lineWidth = 3; g.beginPath(); g.roundRect(x, y - 44, w, 72, 36); g.fill(); g.stroke();
    g.fillStyle = truth ? AMBER : WHITE; g.textAlign = 'left'; g.fillText(label, x + 28, y + 8); g.restore(); return w; }
  function label(g, s, x, y, size = 36, col = ICE, align = 'center', font = 'Baloo') { g.save(); g.font = `700 ${size}px ${font}`; g.fillStyle = col; g.textAlign = align; g.fillText(s, x, y); g.restore(); }
  function hall(g, t, inner, screen = [120, 440, 840, 460]) {        // cinema hall from the back row; inner(g, x, y, w, h) draws on the screen
    const [sx, sy, sw, sh] = screen; g.save(); const cone = g.createLinearGradient(960, 300, 540, 900); cone.addColorStop(0, 'rgba(127,178,255,0.20)'); cone.addColorStop(1, 'rgba(127,178,255,0)');
    g.fillStyle = cone; g.beginPath(); g.moveTo(1000, 330); g.lineTo(sx, sy + sh); g.lineTo(sx + sw, sy); g.closePath(); g.fill();
    g.fillStyle = '#0F1C40'; g.fillRect(sx - 10, sy - 10, sw + 20, sh + 20); g.fillStyle = '#18306A'; g.fillRect(sx, sy, sw, sh);
    g.save(); g.beginPath(); g.rect(sx, sy, sw, sh); g.clip(); inner && inner(g, sx, sy, sw, sh); g.restore();
    for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) { const hx = 90 + i * 150 + (r % 2) * 60, hy = 1060 + r * 110; g.fillStyle = r ? NIGHT : '#0A1430';
      g.beginPath(); g.ellipse(hx, hy, 40, 48, 0, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(hx, hy + 120, 80, 70, 0, Math.PI, 0); g.fill(); g.fillRect(hx - 80, hy + 120, 160, 120); }
    g.restore(); }
  function cal(g, x, y, s, text, col = WHITE) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#E9EEF9'; g.fillRect(-90, -100, 180, 200); g.fillStyle = BLUE; g.fillRect(-90, -100, 180, 50);
    g.fillStyle = WHITE; g.fillRect(-60, -112, 10, 28); g.fillRect(50, -112, 10, 28); g.fillStyle = '#0B1530'; g.font = '800 92px Baloo'; g.textAlign = 'center'; g.fillText(text, 0, 70); g.restore(); }
  function bubble(g, x, y, r, inner, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = PANEL; g.strokeStyle = ICE; g.lineWidth = 3; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.stroke();
    for (const [dx, dy, rr] of [[-r * 0.4, r * 1.25, r * 0.16], [-r * 0.55, r * 1.6, r * 0.09]]) { g.beginPath(); g.arc(x + dx, y + dy, rr, 0, 6.283); g.fill(); g.stroke(); }
    inner && inner(); g.restore(); }
  function glyph(g, x, y, r = 44, p = 1, t = 0) { g.save(); g.strokeStyle = BLUE; g.lineWidth = 5; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.stroke(); g.restore();
    knot(g, x, y, r * 0.45, t, 0); thread(g, [[x + r, y], [x + r + 120, y]], p, true); node(g, x + r + 120, y, p, true); }
  return { NIGHT, NAVY, PANEL, FIG, BLUE, ICE, AMBER, WHITE, MUTE, bg, glow, thread, knot, node, observer, chip, label, hall, cal, bubble, glyph };
})();
