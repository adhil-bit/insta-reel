// scenes.js: "story scene" kit for warm, flat, silhouette-style Kerala illustrations.
// Loaded into every animation page. All functions draw on a 2D context g at 1080x1920.
const SK = (() => {
  const P = {
    sunset: ['#2a1640', '#7a3a6a', '#e8805a', '#f6c27a'], dusk: ['#141a3a', '#3a3a6a', '#a05a7a', '#f0a070'],
    day: ['#5aa8d8', '#8cc8e8', '#cfe8f2', '#f2f0e0'], night: ['#05070f', '#0c1430', '#1c2a50', '#2a3a60'],
    temple: ['#120a06', '#2a1a10', '#4a2e18', '#6a4222'], dawn: ['#1a2440', '#4a5a8a', '#e8a07a', '#f8d8a0'] };
  const ink = '#120c10';
  function sky(g, preset = 'sunset', horizon = 0.62) {
    const c = P[preset] || P.sunset, gr = g.createLinearGradient(0, 0, 0, H * horizon);
    gr.addColorStop(0, c[0]); gr.addColorStop(0.45, c[1]); gr.addColorStop(0.8, c[2]); gr.addColorStop(1, c[3]);
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }
  function sun(g, x, y, r, col = '#ffe0a0', glow = 0.5) {
    const gl = g.createRadialGradient(x, y, r * 0.3, x, y, r * 4); gl.addColorStop(0, `rgba(255,220,160,${glow})`); gl.addColorStop(1, 'rgba(255,220,160,0)');
    g.fillStyle = gl; g.fillRect(x - r * 4, y - r * 4, r * 8, r * 8); g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
  }
  function birds(g, t, n = 4, y = 0.2, col = ink) {
    g.strokeStyle = col; g.lineWidth = 3; for (let i = 0; i < n; i++) { const x = ((i * 230 + t * 40) % (W + 200)) - 100, yy = H * y + Math.sin(i * 2 + t) * 20, f = Math.sin(t * 6 + i) * 6;
      g.beginPath(); g.moveTo(x - 16, yy - f); g.quadraticCurveTo(x - 6, yy - 8, x, yy); g.quadraticCurveTo(x + 6, yy - 8, x + 16, yy - f); g.stroke(); }
  }
  function palm(g, x, base, h, lean = 30, col = ink, t = 0) {
    g.strokeStyle = col; g.fillStyle = col; g.lineCap = 'round'; g.lineWidth = Math.max(6, h * 0.035);
    const tx = x + lean, ty = base - h; g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x + lean * 0.15, base - h * 0.5, tx, ty); g.stroke();
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.38 + Math.sin(t * 1.5 + i) * 0.04, L = h * (0.42 + (i % 2) * 0.08);
      g.lineWidth = Math.max(3, h * 0.018); g.beginPath(); g.moveTo(tx, ty); const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L + L * 0.5;
      g.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 14, ex, ey); g.stroke(); }
  }
  function house(g, x, y, s = 1, col = ink, lit = 1, t = 0) {   // Kerala sloped-roof house, (x,y) = bottom centre
    g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col;
    g.beginPath(); g.moveTo(-150, -110); g.lineTo(-60, -190); g.lineTo(60, -190); g.lineTo(150, -110); g.closePath(); g.fill();
    g.fillRect(-120, -112, 240, 112); g.fillRect(-150, -112, 300, 10);
    if (lit > 0) { g.fillStyle = `rgba(255,200,110,${0.85 * lit * (0.92 + 0.08 * Math.sin(t * 3))})`; for (const wx of [-80, 30]) g.fillRect(wx, -80, 44, 40); g.fillRect(-18, -70, 30, 70); }
    g.restore();
  }
  function boat(g, x, y, s = 1, col = '#1e4a8a', t = 0) {
    g.save(); g.translate(x, y + Math.sin(t * 2 + x) * 4); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.moveTo(-150, -10); g.quadraticCurveTo(0, 30, 150, -10); g.lineTo(130, 10); g.quadraticCurveTo(0, 40, -130, 10); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(-120, -6, 240, 4); g.restore();
  }
  function sea(g, top, t, cols = ['#3aa8c8', '#2a88b0', '#1e6a98', '#164e78'], foam = true, bottom = H) {   // water band from top to bottom
    const step = (bottom - top) / cols.length; cols.forEach((c, i) => { const y = top + i * step; g.fillStyle = c; g.beginPath(); g.moveTo(0, bottom); g.lineTo(0, y);
      for (let x = 0; x <= W; x += 20) g.lineTo(x, y + Math.sin(x / 90 + t * 1.6 + i) * 6); g.lineTo(W, bottom); g.fill(); });
    if (foam) { g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 4; g.beginPath(); for (let x = 0; x <= W; x += 20) { const y = top + Math.sin(x / 70 + t * 2.4) * 8; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  }
  function ground(g, top, col = '#e8c890', col2 = '#c8a06a') { const gr = g.createLinearGradient(0, top, 0, H); gr.addColorStop(0, col); gr.addColorStop(1, col2); g.fillStyle = gr; g.fillRect(0, top, W, H - top); }
  function person(g, x, y, h = 300, pose = 'stand', col = ink, t = 0) {   // (x,y) = feet
    g.save(); g.translate(x, y); const s = h / 300; g.scale(s, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round';
    const head = pose === 'child' ? 0.75 : 1; g.beginPath(); g.arc(0, -270 * head, 26 * head, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(-34 * head, -240 * head); g.lineTo(34 * head, -240 * head); g.lineTo(28 * head, -120 * head); g.lineTo(40 * head, 0); g.lineTo(-40 * head, 0); g.lineTo(-28 * head, -120 * head); g.closePath(); g.fill();
    g.lineWidth = 16 * head; const sw = Math.sin(t * 2) * 0.1;
    if (pose === 'arm_up') { g.beginPath(); g.moveTo(26 * head, -230 * head); g.lineTo(60 * head, -330 * head); g.stroke(); }
    else if (pose === 'pray') { g.beginPath(); g.moveTo(-24, -220); g.lineTo(0, -180); g.lineTo(24, -220); g.stroke(); }
    else { g.beginPath(); g.moveTo(-30 * head, -230 * head); g.lineTo(-44 * head, -120 * head + sw * 40); g.moveTo(30 * head, -230 * head); g.lineTo(44 * head, -120 * head - sw * 40); g.stroke(); }
    g.restore();
  }
  function crowd(g, x0, x1, y, n, h = 260, t = 0, col = ink) { for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (i + 0.5) / n; person(g, x, y + (i % 2) * 6, h * (0.9 + (i * 37 % 20) / 100), i % 4 === 1 ? 'arm_up' : 'stand', col, t + i); } }
  function lamp(g, x, y, s = 1, t = 0) {   // neutral light: kerosene hurricane lantern (no religious meaning). (x,y) = base centre
    g.save(); g.translate(x, y); g.scale(s, s);
    const f = 1 + 0.12 * Math.sin(t * 11) + 0.06 * Math.sin(t * 17);
    const gl = g.createRadialGradient(0, -80, 4, 0, -80, 170 * f); gl.addColorStop(0, 'rgba(255,190,100,0.55)'); gl.addColorStop(1, 'rgba(255,190,100,0)'); g.fillStyle = gl; g.fillRect(-170, -250, 340, 340);
    g.fillStyle = '#5a4a3a'; g.beginPath(); g.ellipse(0, -8, 52, 12, 0, 0, 6.283); g.fill(); g.fillRect(-48, -38, 96, 30);
    g.fillStyle = 'rgba(255,236,190,0.35)'; g.beginPath(); g.moveTo(-34, -40); g.quadraticCurveTo(-52, -95, -30, -140); g.lineTo(30, -140); g.quadraticCurveTo(52, -95, 34, -40); g.closePath(); g.fill();
    g.fillStyle = '#ffd27a'; g.beginPath(); g.ellipse(0, -82, 7, 20 * f, 0, 0, 6.283); g.fill();
    g.strokeStyle = '#5a4a3a'; g.lineWidth = 5; for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 44, -38); g.lineTo(sx * 34, -146); g.stroke(); }
    g.fillStyle = '#5a4a3a'; g.fillRect(-36, -152, 72, 14); g.beginPath(); g.moveTo(-22, -152); g.lineTo(0, -172); g.lineTo(22, -152); g.fill();
    g.lineWidth = 4; g.beginPath(); g.arc(0, -172, 26, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); g.restore();
  }
  function nilavilakku(g, x, y, s = 1, t = 0) {   // brass oil lamp: ONLY for stories that are specifically about a Hindu ritual
    g.save(); g.translate(x, y); g.scale(s, s); const br = g.createLinearGradient(-50, 0, 50, 0); br.addColorStop(0, '#8a5a1a'); br.addColorStop(0.5, '#f0c050'); br.addColorStop(1, '#8a5a1a');
    g.fillStyle = br; g.beginPath(); g.ellipse(0, 0, 70, 16, 0, 0, 6.283); g.fill(); g.fillRect(-8, -150, 16, 150); g.beginPath(); g.ellipse(0, -150, 50, 12, 0, 0, 6.283); g.fill();
    const f = 1 + 0.18 * Math.sin(t * 11) + 0.08 * Math.sin(t * 17); g.fillStyle = '#ffd27a'; g.beginPath(); g.ellipse(0, -176, 8, 22 * f, 0, 0, 6.283); g.fill();
    const gl = g.createRadialGradient(0, -176, 4, 0, -176, 140); gl.addColorStop(0, 'rgba(255,190,100,0.55)'); gl.addColorStop(1, 'rgba(255,190,100,0)'); g.fillStyle = gl; g.fillRect(-140, -316, 280, 280); g.restore();
  }
  function gopuram(g, x, y, s = 1, col = ink, lit = 0.6) {   // stepped temple tower, (x,y) = base centre
    g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col;
    for (let i = 0; i < 7; i++) { const w = 360 - i * 44, h = 70; g.fillRect(-w / 2, -h * (i + 1), w, h - 6); if (lit) { g.fillStyle = `rgba(255,214,140,${lit})`; for (let k = -2; k <= 2; k++) g.fillRect(k * (w / 6) - 6, -h * (i + 1) + 22, 12, 22); g.fillStyle = col; } }
    g.beginPath(); g.moveTo(-40, -490); g.lineTo(0, -560); g.lineTo(40, -490); g.fill(); g.restore();
  }
  function rays(g, x, y, spread = 0.6, len = 1400, a = 0.25, col = '255,220,150') {
    for (let i = -4; i <= 4; i++) { const an = Math.PI / 2 + i * spread / 8; g.fillStyle = `rgba(${col},${a * (1 - Math.abs(i) / 5)})`; g.beginPath(); g.moveTo(x, y);
      g.lineTo(x + Math.cos(an - 0.03) * len, y + Math.sin(an - 0.03) * len); g.lineTo(x + Math.cos(an + 0.03) * len, y + Math.sin(an + 0.03) * len); g.fill(); }
  }
  function door(g, x, y, w, h, open = 0, glow = '255,214,140') {   // double door opening onto light; (x,y) = bottom centre
    g.fillStyle = `rgba(${glow},${0.9 * open})`; g.fillRect(x - w / 2, y - h, w, h); if (open > 0) rays(g, x, y - h * 0.4, 1.2, 900, 0.3 * open, glow);
    g.fillStyle = '#2a1a10'; const pw = (w / 2) * (1 - open * 0.92); g.fillRect(x - w / 2, y - h, pw, h); g.fillRect(x + w / 2 - pw, y - h, pw, h);
    g.strokeStyle = '#5a3a1a'; g.lineWidth = 10; g.strokeRect(x - w / 2 - 10, y - h - 10, w + 20, h + 10);
  }
  let grainTile = null;
  function grain(g, t, amount = 0.07) {   // film grain + vignette
    if (!grainTile) { grainTile = document.createElement('canvas'); grainTile.width = 256; grainTile.height = 256; const c = grainTile.getContext('2d'), d = c.createImageData(256, 256);
      let s = 7; for (let i = 0; i < d.data.length; i += 4) { s = (s * 16807) % 2147483647; const v = s % 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } c.putImageData(d, 0, 0); }
    g.save(); g.globalAlpha = amount * 0.35; g.globalCompositeOperation = 'overlay'; const ox = (Math.floor(t * 4) * 37) % 256, oy = (Math.floor(t * 4) * 91) % 256;   // light, slow grain: survives Instagram's re-compression
    for (let x = -ox; x < W; x += 256) for (let y = -oy; y < H; y += 256) g.drawImage(grainTile, x, y); g.restore();
    const v = g.createRadialGradient(W / 2, H * 0.42, H * 0.25, W / 2, H * 0.45, H * 0.8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  }
  function filmFrame(g, t, a = 1) {   // film-strip border for flashbacks
    g.save(); g.globalAlpha = a; g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, 70, H); g.fillRect(W - 70, 0, 70, H); g.fillStyle = '#e8e0d0';
    const off = (t * 120) % 90; for (let y = -90 + off; y < H; y += 90) { g.fillRect(22, y, 26, 44); g.fillRect(W - 48, y, 26, 44); } g.restore();
  }
  function stage(g, t, x = 60, y = 360, w = W - 120, h = 760) {   // lit cloth screen with a row of oil lamps (shadow-puppet theatre)
    g.fillStyle = '#0a0604'; g.fillRect(0, 0, W, H);
    const gl = g.createRadialGradient(x + w / 2, y + h * 0.55, 40, x + w / 2, y + h / 2, w * 0.75); gl.addColorStop(0, '#ffd28a'); gl.addColorStop(0.55, '#e0902e'); gl.addColorStop(1, '#5a2a0a');
    g.fillStyle = gl; g.fillRect(x, y, w, h); g.strokeStyle = '#2a1608'; g.lineWidth = 14; g.strokeRect(x, y, w, h);
    g.fillStyle = '#1a0e06'; for (let i = 0; i < 26; i++) { g.beginPath(); g.moveTo(x + i * w / 26, y); g.lineTo(x + (i + 0.5) * w / 26, y + 18); g.lineTo(x + (i + 1) * w / 26, y); g.fill(); }
    for (let i = 0; i < 9; i++) { const lx = x + 40 + i * (w - 80) / 8, f = 1 + 0.2 * Math.sin(t * 9 + i * 1.7); g.fillStyle = '#c08a2a'; g.fillRect(lx - 10, y + h - 14, 20, 10);
      g.fillStyle = '#ffe2a0'; g.beginPath(); g.ellipse(lx, y + h - 24, 5, 12 * f, 0, 0, 6.283); g.fill(); }
  }
  function puppet(g, x, y, h = 380, t = 0, armUp = true, col = '#120a04') {   // flat shadow-puppet figure with crown, (x,y) = feet
    g.save(); g.translate(x, y); const s = h / 380; g.scale(s, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round';
    g.beginPath(); g.arc(0, -330, 30, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(-14, -356); g.lineTo(0, -400 - Math.sin(t * 3) * 6); g.lineTo(14, -356); g.fill();
    g.beginPath(); g.moveTo(-40, -296); g.lineTo(40, -296); g.lineTo(60, -120); g.lineTo(-60, -120); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,214,140,0.6)'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(-36 + i * 14, -140, 4, 0, 6.283); g.fill(); } g.fillStyle = col;
    g.lineWidth = 14; g.beginPath(); g.moveTo(-20, -120); g.lineTo(-24, 0); g.moveTo(20, -120); g.lineTo(24, 0); g.stroke();
    g.lineWidth = 12; g.beginPath(); g.moveTo(-36, -280); g.lineTo(-70, -200); g.stroke(); g.beginPath(); g.moveTo(36, -280);
    if (armUp) { g.lineTo(80, -380 + Math.sin(t * 2) * 10); } else { g.lineTo(70, -200); } g.stroke(); g.restore();
  }
  return { P, ink, stage, puppet, sky, sun, birds, palm, house, boat, sea, ground, person, crowd, lamp, nilavilakku, gopuram, rays, door, grain, filmFrame };
})();

// ---------------------------------------------------------------------------------------------
// NB: hand-drawn "Kerala Notebook" kit (theme: notebook). Lines draw themselves with a pen over a
// faint pencil ghost that is visible from frame 1; then watercolour washes and handwritten notes.
//   const s = NB.sketch(3); s.line(..).rect(..).circle(..).figure(x, y, h, 'dig'); const A = s.mark();
//   window.renderFrame = t => { NB.paper(g); NB.wash(g, [x,y,w,h], NB.GOLD, a); s.draw(g, t, {parts: [[0, A, 0, 3]]}); NB.note(g, 'text', x, y) }
// Keep drawings inside y 560..1380 (the headline sits above, the subtitles below).
// ---------------------------------------------------------------------------------------------
const NB = (() => {
  const INK = '#2b2420', RED = '#c2412d', GOLD = '#d9a23a', BLUE = '#3d6b8c', GREEN = '#6c8f4e', BROWN = '#b5835a', PAPER = '#f3ead6';
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  let paperC = null;
  function paper(g) {
    if (!paperC) { paperC = document.createElement('canvas'); paperC.width = W; paperC.height = H; const p = paperC.getContext('2d'); let s = 11;
      const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      p.fillStyle = PAPER; p.fillRect(0, 0, W, H);
      for (let i = 0; i < 9000; i++) { p.fillStyle = `rgba(120,90,50,${r() * 0.05})`; p.fillRect(r() * W, r() * H, 2, 2); }
      const v = p.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(80,50,20,0.28)'); p.fillStyle = v; p.fillRect(0, 0, W, H); }
    g.drawImage(paperC, 0, 0);
  }
  function sketch(seed = 7) {
    let s = seed; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const strokes = []; let ox = 0, oy = 0;
    function add(p, o = {}) { const amp = o.amp ?? 2.2; const pts = p.map(([x, y]) => [x + ox + (rnd() - .5) * amp, y + oy + (rnd() - .5) * amp]);
      let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      strokes.push({ pts, L: Math.max(L, 1), w: o.w ?? 5, col: o.col ?? INK, dash: o.dash }); return api; }
    function dens(pts) { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { const [a, b] = [pts[i - 1], pts[i]], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 18));
      for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); } return out; }
    function chaikin(pts, it = 3) { for (let k = 0; k < it; k++) { const o = [pts[0]]; for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]];
      o.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); } o.push(pts[pts.length - 1]); pts = o; } return pts; }
    const api = {
      at(x, y) { ox = x; oy = y; return api; },                                   // offset for the next strokes
      line(x1, y1, x2, y2, o) { return add(dens([[x1, y1], [x2, y2]]), o); },
      poly(pts, o) { return add(dens(pts), o); },
      curve(pts, o) { return add(dens(chaikin(pts)), o); },
      rect(x, y, w, h, o) { return add(dens([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y - 2]]), o); },
      arc(cx, cy, r, a0, a1, o, ry) { const p = []; for (let i = 0; i <= 28; i++) { const a = a0 + (a1 - a0) * i / 28; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * (ry ?? r)]); } return add(p, o); },
      circle(cx, cy, r, o, ry) { return api.arc(cx, cy, r, -1.6, 4.75, o, ry); },
      arrow(x1, y1, x2, y2, o = {}) { api.line(x1, y1, x2, y2, o); const a = Math.atan2(y2 - y1, x2 - x1), h = o.head ?? 30;
        api.line(x2, y2, x2 - h * Math.cos(a - .45), y2 - h * Math.sin(a - .45), o); return api.line(x2, y2, x2 - h * Math.cos(a + .45), y2 - h * Math.sin(a + .45), o); },
      hatch(x, y, w, h, n = 20, o = {}) { for (let i = 0; i < n; i++) { const px = x + rnd() * w, py = y + rnd() * h; api.line(px, py, px + 24, py + 14, { w: 3, amp: 1, ...o }); } return api; },
      text(t, x, y, o = {}) { strokes.push({ txt: t, x: x + ox, y: y + oy, size: o.size ?? 52, col: o.col ?? INK, font: o.font ?? 'Chilanka, Hand', L: 140, align: o.align ?? 'center' }); return api; },
      figure(x, y, h, pose = 'stand', o = {}) {             // simple notebook stick figure, feet at (x, y)
        const hr = h * .11, nk = y - h + hr * 2, hip = y - h * .45, sh = nk + h * .08;
        api.circle(x, y - h + hr, hr, o); api.line(x, nk, x, hip, o);
        api.line(x, hip, x - h * .14, y, o); api.line(x, hip, x + h * .14, y, o);
        if (pose === 'dig') { api.line(x, sh, x + h * .3, hip + h * .05, o); api.line(x, sh + 10, x + h * .2, hip + h * .1, o); api.line(x + h * .1, sh - h * .1, x + h * .45, y + 6, { ...o, w: (o.w ?? 5) + 1 }); }
        else if (pose === 'point') { api.line(x, sh, x - h * .2, hip, o); api.line(x, sh, x + h * .38, sh - h * .12, o); }
        else if (pose === 'shrug') { api.line(x, sh, x - h * .22, sh - h * .12, o); api.line(x, sh, x + h * .22, sh - h * .12, o); }
        else if (pose === 'sit') { strokes.splice(strokes.length - 2, 2); api.line(x, hip, x + h * .25, hip, o); api.line(x + h * .25, hip, x + h * .25, y, o); api.line(x, sh, x + h * .25, hip - h * .05, o); api.line(x, sh, x - h * .15, hip, o); }
        else { api.line(x, sh, x - h * .18, hip, o); api.line(x, sh, x + h * .18, hip, o); }
        return api; },
      mark() { return strokes.length; },
      draw(g, t, opt = {}) {
        const parts = opt.parts ?? [[0, strokes.length, opt.t0 ?? 0, opt.t1 ?? DURATION * 0.6]];
        if (opt.ghost !== false) { g.save(); g.globalAlpha = 0.15; strokes.forEach(st => paint(g, st, st.L, '#6b5d52', 2)); g.restore(); }
        let tip = null;
        for (const [a, b, t0, t1] of parts) { const seg = strokes.slice(a, b), tot = seg.reduce((s, st) => s + st.L, 0), drawn = tot * ease(cl((t - t0) / Math.max(.01, t1 - t0)));
          let acc = 0; for (const st of seg) { const tp = paint(g, st, Math.min(st.L, drawn - acc)); if (tp && drawn < tot && drawn - acc < st.L) tip = tp; acc += st.L; } }
        if (tip && opt.pen !== false) pen(g, tip[0], tip[1]);
      },
    };
    return api;
  }
  function paint(g, st, len, ghostCol, thin) {
    if (len <= 0) return null;
    if (st.txt) { const a = cl(len / st.L); g.save(); g.globalAlpha *= ghostCol ? 1 : a; g.fillStyle = ghostCol ?? st.col; g.font = `${st.size}px ${st.font}`; g.textAlign = st.align; g.fillText(st.txt, st.x, st.y); g.restore(); return a < 1 ? [st.x, st.y] : null; }
    g.strokeStyle = ghostCol ?? st.col; g.lineWidth = thin ? Math.max(2, st.w - thin) : st.w; g.lineCap = 'round'; g.lineJoin = 'round'; g.setLineDash(st.dash ? [4, 18] : []);
    g.beginPath(); g.moveTo(...st.pts[0]); let d = 0, tip = st.pts[0];
    for (let i = 1; i < st.pts.length; i++) { const a = st.pts[i - 1], b = st.pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d + l > len) { const f = (len - d) / l; tip = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; g.lineTo(...tip); break; } g.lineTo(...b); d += l; tip = b; }
    g.stroke(); g.setLineDash([]); return tip;
  }
  function pen(g, x, y) { g.save(); g.translate(x, y); g.rotate(-0.6); g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(14, 10, 30, 300); g.fillStyle = '#1d3557'; g.fillRect(-9, 40, 18, 260);
    g.fillStyle = '#c9a227'; g.fillRect(-9, 40, 18, 22); g.fillStyle = INK; g.beginPath(); g.moveTo(-9, 40); g.lineTo(9, 40); g.lineTo(0, 0); g.fill(); g.restore(); }
  function wash(g, r, col, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.55; g.fillStyle = col; g.beginPath();
    if (r.length === 4 && typeof r[0] === 'number') { const [x, y, w, h] = r; g.moveTo(x + 8, y + 4); g.lineTo(x + w - 6, y + 10); g.lineTo(x + w - 2, y + h - 6); g.lineTo(x + 4, y + h - 2); }
    else { r.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); } g.closePath(); g.fill(); g.restore(); }
  function blob(g, x, y, rx, ry, col, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.55; g.fillStyle = col; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 6.283); g.fill(); g.restore(); }
  function glow(g, x, y, r, col, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; const gr = g.createRadialGradient(x, y, 4, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.restore(); }
  function note(g, t, x, y, o = {}) { const a = o.a ?? 1; if (a <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = o.col ?? INK; g.font = `${o.size ?? 52}px ${o.font ?? 'Chilanka, Hand'}`; g.textAlign = o.align ?? 'center'; g.fillText(t, x, y); g.restore(); }
  function stamp(g, t, x, y, a, o = {}) { if (a <= 0) return; g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.12); const s = 1.4 - 0.4 * a; g.scale(s, s); g.globalAlpha = a;
    g.font = `800 ${o.size ?? 64}px Baloo, Inter`; const w = g.measureText(t).width + 60; g.strokeStyle = o.col ?? RED; g.lineWidth = 8; g.strokeRect(-w / 2, -55, w, 100); g.fillStyle = o.col ?? RED; g.textAlign = 'center'; g.fillText(t, 0, 22); g.restore(); }
  return { INK, RED, GOLD, BLUE, GREEN, BROWN, PAPER, ease, cl, paper, sketch, pen, wash, blob, glow, note, stamp };
})();
