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
  // genre styles (pick one per reel with NB.use('inkwash') before building sketches)
  const STYLES = {
    notebook:   { bg: '#f3ead6', speck: 'rgba(120,90,50,', vig: 'rgba(80,50,20,0.28)', ink: '#2b2420', accent: '#c2412d', ghost: '#6b5d52', tool: 'pen' },
    inkwash:    { bg: '#ece5d6', speck: 'rgba(90,80,70,', vig: 'rgba(60,50,40,0.30)', ink: '#1b1b1b', accent: '#b5281f', ghost: '#8a8378', tool: 'brush', brush: true },
    whiteboard: { bg: '#f7f7f4', speck: 'rgba(140,150,160,', vig: 'rgba(60,70,80,0.12)', ink: '#1f2a44', accent: '#2a6fdb', ghost: '#9aa3b2', tool: 'hand' },
    manim:      { bg: '#0e0f12', speck: 'rgba(255,255,255,', vig: 'rgba(0,0,0,0.5)', ink: '#ececec', accent: '#58c4dd', ghost: '#3a3d45', tool: 'none', glow: true },
    retro:      { bg: '#c8452f', speck: 'rgba(40,10,5,', vig: 'rgba(40,5,0,0.45)', ink: '#141414', accent: '#f2e6c9', ghost: '#7a2a1c', tool: 'none' },
  };
  let ST = STYLES.notebook; const paperC = {};
  function use(name) { ST = STYLES[name] || STYLES.notebook; return ST; }
  function paper(g) {
    const key = Object.keys(STYLES).find(k => STYLES[k] === ST);
    if (!paperC[key]) { const pc = document.createElement('canvas'); pc.width = W; pc.height = H; const p = pc.getContext('2d'); let s = 11;
      const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      p.fillStyle = ST.bg; p.fillRect(0, 0, W, H);
      for (let i = 0; i < 9000; i++) { p.fillStyle = ST.speck + (r() * (ST.glow ? 0.025 : 0.05)) + ')'; p.fillRect(r() * W, r() * H, 2, 2); }
      if (ST.brush) for (let i = 0; i < 260; i++) { p.strokeStyle = 'rgba(120,105,85,0.07)'; p.lineWidth = 1; p.beginPath(); const x = r() * W, y = r() * H; p.moveTo(x, y); p.lineTo(x + (r() - .5) * 60, y + (r() - .5) * 60); p.stroke(); }
      const v = p.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, ST.vig); p.fillStyle = v; p.fillRect(0, 0, W, H);
      paperC[key] = pc; }
    g.drawImage(paperC[key], 0, 0);
  }
  function sketch(seed = 7) {
    let s = seed; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const strokes = []; let ox = 0, oy = 0;
    function add(p, o = {}) { const amp = o.amp ?? 2.2; const pts = p.map(([x, y]) => [x + ox + (rnd() - .5) * amp, y + oy + (rnd() - .5) * amp]);
      let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      strokes.push({ pts, L: Math.max(L, 1), w: o.w ?? 5, col: o.col ?? ST.ink, dash: o.dash }); return api; }
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
      text(t, x, y, o = {}) { strokes.push({ txt: t, x: x + ox, y: y + oy, size: o.size ?? 52, col: o.col ?? ST.ink, font: o.font ?? 'Chilanka, Hand', L: 140, align: o.align ?? 'center' }); return api; },
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
        if (opt.ghost !== false) { g.save(); g.globalAlpha = ST.glow ? 0.35 : 0.15; strokes.forEach(st => paint(g, st, st.L, ST.ghost, 2)); g.restore(); }
        let tip = null;
        for (const [a, b, t0, t1] of parts) { const seg = strokes.slice(a, b), tot = seg.reduce((s, st) => s + st.L, 0), drawn = tot * ease(cl((t - t0) / Math.max(.01, t1 - t0)));
          let acc = 0; for (const st of seg) { const tp = paint(g, st, Math.min(st.L, drawn - acc)); if (tp && drawn < tot && drawn - acc < st.L) tip = tp; acc += st.L; } }
        if (tip && opt.pen !== false) tool(g, tip[0], tip[1]);
      },
    };
    return api;
  }
  function paint(g, st, len, ghostCol, thin) {
    if (len <= 0) return null;
    if (st.txt) { const a = cl(len / st.L); g.save(); g.globalAlpha *= ghostCol ? 1 : a; g.fillStyle = ghostCol ?? st.col; g.font = `${st.size}px ${st.font}`; g.textAlign = st.align; g.fillText(st.txt, st.x, st.y); g.restore(); return a < 1 ? [st.x, st.y] : null; }
    if (ST.brush && !ghostCol && !st.dash) return brushPaint(g, st, len);
    g.strokeStyle = ghostCol ?? st.col; g.lineWidth = thin ? Math.max(2, st.w - thin) : st.w; g.lineCap = 'round'; g.lineJoin = 'round'; g.setLineDash(st.dash ? [4, 18] : []);
    if (ST.glow && !ghostCol) { g.shadowColor = st.col; g.shadowBlur = 14; }
    g.beginPath(); g.moveTo(...st.pts[0]); let d = 0, tip = st.pts[0];
    for (let i = 1; i < st.pts.length; i++) { const a = st.pts[i - 1], b = st.pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d + l > len) { const f = (len - d) / l; tip = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; g.lineTo(...tip); break; } g.lineTo(...b); d += l; tip = b; }
    g.stroke(); g.setLineDash([]); g.shadowBlur = 0; return tip;
  }
  function brushPaint(g, st, len) {               // tapered wet-ink stroke: thick in the middle, thin at the ends
    const n = st.pts.length; let d = 0, tip = st.pts[0]; g.strokeStyle = st.col; g.lineCap = 'round';
    for (let i = 1; i < n; i++) { const a = st.pts[i - 1], b = st.pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); let e = b;
      if (d + l > len) { const f = (len - d) / l; e = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; }
      const u = i / n; g.globalAlpha = 0.92; g.lineWidth = st.w * (0.35 + 1.25 * Math.sin(Math.PI * Math.min(1, u * 1.05)));
      g.beginPath(); g.moveTo(...a); g.lineTo(...e); g.stroke(); tip = e; if (d + l > len) break; d += l; }
    g.globalAlpha = 1; return tip;
  }
  function tool(g, x, y) {
    if (ST.tool === 'none') return; if (ST.tool === 'pen') return pen(g, x, y);
    g.save(); g.translate(x, y);
    if (ST.tool === 'brush') { g.rotate(-0.35); g.fillStyle = '#1b1b1b'; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-12, 30, -9, 60); g.lineTo(9, 60); g.quadraticCurveTo(12, 30, 0, 0); g.fill();
      g.fillStyle = '#8a5a2a'; g.fillRect(-7, 60, 14, 260); g.fillStyle = '#b5281f'; g.fillRect(-8, 300, 16, 14); }
    else {                                         // whiteboard: a hand holding a marker
      g.rotate(-0.5); g.fillStyle = '#2a6fdb'; g.fillRect(-10, 10, 20, 150); g.fillStyle = '#1f2a44'; g.beginPath(); g.moveTo(-10, 10); g.lineTo(10, 10); g.lineTo(0, -6); g.fill();
      g.fillStyle = '#f1c7a5'; g.strokeStyle = '#7a5a48'; g.lineWidth = 3; g.beginPath(); g.ellipse(4, 120, 58, 72, 0.15, 0, 6.283); g.fill(); g.stroke();
      g.beginPath(); g.ellipse(-46, 96, 22, 40, -0.4, 0, 6.283); g.fill(); g.stroke(); g.fillRect(-30, 170, 70, 160); g.strokeRect(-30, 170, 70, 160);
      g.fillStyle = '#3d5a80'; g.fillRect(-36, 260, 82, 90); }
    g.restore();
  }
  // retro collage pieces
  function cutout(g, img, x, y, w, h, rot = 0, a = 1, o = {}) {   // B/W photo with a white torn border and shadow
    if (a <= 0 || !img || !img.complete || !img.naturalWidth) return; g.save(); g.globalAlpha = a; g.translate(x + w / 2, y + h / 2); g.rotate(rot); const s = o.pop ? 0.85 + 0.15 * a : 1; g.scale(s, s);
    g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 24; g.shadowOffsetY = 10; g.fillStyle = '#f4efe4'; torn(g, -w / 2 - 16, -h / 2 - 16, w + 32, h + 32, 7); g.fill(); g.shadowBlur = 0; g.shadowOffsetY = 0;
    g.save(); g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip(); g.filter = o.color ? 'contrast(1.1)' : 'grayscale(1) contrast(1.25) brightness(1.05)';
    const r = Math.max(w / img.naturalWidth, h / img.naturalHeight), iw = img.naturalWidth * r, ih = img.naturalHeight * r; g.drawImage(img, -iw / 2, -ih / 2, iw, ih); g.filter = 'none'; g.restore(); g.restore();
  }
  function torn(g, x, y, w, h, seed) { let s = seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; g.beginPath(); g.moveTo(x, y);
    for (let i = 0; i <= 20; i++) g.lineTo(x + w * i / 20, y + (r() - .5) * 8); for (let i = 0; i <= 20; i++) g.lineTo(x + w + (r() - .5) * 8, y + h * i / 20);
    for (let i = 20; i >= 0; i--) g.lineTo(x + w * i / 20, y + h + (r() - .5) * 8); for (let i = 20; i >= 0; i--) g.lineTo(x + (r() - .5) * 8, y + h * i / 20); g.closePath(); }
  function label(g, t, x, y, a = 1, o = {}) {      // black text on a torn cream paper strip
    if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(o.rot ?? -0.03); g.font = `${o.weight ?? 800} ${o.size ?? 70}px ${o.font ?? 'Baloo, Inter'}`; const w = g.measureText(t).width + 50, h = (o.size ?? 70) * 1.25;
    g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 14; g.shadowOffsetY = 6; g.fillStyle = o.bg ?? '#f2e6c9'; torn(g, -w / 2, -h / 2, w, h, 5); g.fill(); g.shadowBlur = 0; g.shadowOffsetY = 0;
    g.fillStyle = o.col ?? '#141414'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
  function clipping(g, title, lines, x, y, w, a = 1, rot = 0.04) {  // newspaper clipping
    if (a <= 0) return; const h = 110 + lines * 34; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(rot); g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 16; g.shadowOffsetY = 8;
    g.fillStyle = '#efe7d3'; torn(g, -w / 2, -h / 2, w, h, 9); g.fill(); g.shadowBlur = 0; g.shadowOffsetY = 0; g.fillStyle = '#141414'; g.textAlign = 'center';
    g.font = '800 46px Baloo, Inter'; g.fillText(title, 0, -h / 2 + 62); g.fillStyle = 'rgba(20,20,20,0.55)'; for (let i = 0; i < lines; i++) g.fillRect(-w / 2 + 30, -h / 2 + 96 + i * 34, w - 60 - (i * 47) % 80, 9); g.restore(); }
  function halftone(g, x, y, w, h, col = 'rgba(20,10,5,0.55)', step = 22) { g.save(); g.fillStyle = col; for (let yy = 0; yy < h; yy += step) for (let xx = 0; xx < w; xx += step) { const r = 3 + 6 * (xx / w); g.beginPath(); g.arc(x + xx + (yy / step % 2) * step / 2, y + yy, r, 0, 6.283); g.fill(); } g.restore(); }
  function zigzag(g, x, y, n, a = 1, col = '#141414') { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = 10; g.lineJoin = 'miter'; g.beginPath(); for (let i = 0; i <= n; i++) g.lineTo(x + i * 34, y + (i % 2 ? -24 : 0)); g.stroke(); g.restore(); }
  function mist(g, y, h, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, 'rgba(236,229,214,0)'); gr.addColorStop(.5, 'rgba(236,229,214,0.85)'); gr.addColorStop(1, 'rgba(236,229,214,0)'); g.fillStyle = gr; g.fillRect(0, y, W, h); g.restore(); }
  function ridge(g, y0, amp, col, a = 1, seed = 3, depth = 160) {  // ink-wash mountain layer that fades into mist below
    if (a <= 0) return; let s = seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; g.save(); g.globalAlpha = a;
    const gr = g.createLinearGradient(0, y0 - amp, 0, y0 + depth); gr.addColorStop(0, col); gr.addColorStop(0.55, col); gr.addColorStop(1, 'rgba(236,229,214,0)'); g.fillStyle = gr;
    g.beginPath(); g.moveTo(0, y0 + depth); let y = y0; for (let x = 0; x <= W; x += 30) { y = y0 - amp * (0.5 + 0.5 * Math.sin(x / 170 + seed)) - r() * amp * 0.25; g.lineTo(x, y); }
    g.lineTo(W, y0 + depth); g.closePath(); g.fill(); g.restore(); }
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
  return { INK, RED, GOLD, BLUE, GREEN, BROWN, PAPER, STYLES, use, get style() { return ST; }, ease, cl, paper, sketch, pen, tool, wash, blob, glow, note, stamp, cutout, label, clipping, halftone, zigzag, mist, ridge };
})();

// ---------------------------------------------------------------------------------------------
// CT: "animation base" cartoon kit: flat painted characters on a jointed rig, keyframed poses.
//   CT.fighter(g, x, groundY, scale, CT.at(keys, t), { dir: 1, weapon: 'sword', shield: true })
//   keys = [[time, 'stance'], [time, 'strike'], ...] (poses interpolate with easing)
// ---------------------------------------------------------------------------------------------
const CT = (() => {
  const D = Math.PI / 180, SKIN = '#c98a5a', SKIN2 = '#a8693f', RED = '#b52a2a', BLADE = '#dfe3ea', GOLDC = '#d9a23a', HAIR = '#1c1410';
  const POSES = {
    stance:   { torso: 12, rsh: 110, rel: 40, lsh: 35, lel: 70, lhip: 35, lknee: -35, rhip: -30, rknee: 5, lift: 0 },
    elephant: { torso: 40, rsh: 90, rel: 60, lsh: 60, lel: 80, lhip: 55, lknee: -75, rhip: -40, rknee: 20, lift: 0 },
    raise:    { torso: -5, rsh: 200, rel: 20, lsh: 80, lel: 30, lhip: 30, lknee: -30, rhip: -30, rknee: 0, lift: 0 },
    strike:   { torso: 28, rsh: 110, rel: -5, lsh: 80, lel: 20, lhip: 55, lknee: -55, rhip: -45, rknee: 5, lift: 0 },
    block:    { torso: -8, rsh: -20, rel: 60, lsh: 130, lel: 20, lhip: 28, lknee: -28, rhip: -28, rknee: 8, lift: 0 },
    leap:     { torso: 30, rsh: 160, rel: 10, lsh: -40, lel: -20, lhip: 105, lknee: -120, rhip: 30, rknee: -110, lift: 150 },
    salute:   { torso: 0, rsh: 150, rel: -125, lsh: 150, lel: -125, lhip: 8, lknee: 0, rhip: -8, rknee: 0, lift: 0 },
    bow:      { torso: 78, rsh: 15, rel: 0, lsh: 5, lel: 0, lhip: 30, lknee: -45, rhip: -15, rknee: 10, lift: 0 },
    stand:    { torso: 0, rsh: 10, rel: 10, lsh: -10, lel: 10, lhip: 6, lknee: 0, rhip: -6, rknee: 0, lift: 0 },
  };
  const ease = u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  function mix(a, b, u) { const o = {}; for (const k in a) o[k] = a[k] + (b[k] - a[k]) * u; return o; }
  function at(keys, t) {                                   // keys: [[time, poseName or pose], ...]
    const P = k => typeof k === 'string' ? POSES[k] : k;
    if (t <= keys[0][0]) return P(keys[0][1]); for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, a] = keys[i - 1], [t1, b] = keys[i]; return mix(P(a), P(b), ease((t - t0) / (t1 - t0))); }
    return P(keys[keys.length - 1][1]);
  }
  function loop(keys, t) { const T = keys[keys.length - 1][0]; return at(keys, ((t % T) + T) % T); }
  function fighter(g, x, groundY, s, P, o = {}) {
    const dir = o.dir ?? 1, v = (a, L) => [Math.sin(a * D) * L * dir, Math.cos(a * D) * L];
    const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
    const neck = [Math.sin(P.torso * D) * 115 * s * dir, -Math.cos(P.torso * D) * 115 * s], head = add(neck, [Math.sin(P.torso * D) * 34 * s * dir, -Math.cos(P.torso * D) * 34 * s]);
    const L = { kn: v(P.lhip, 92 * s) }; L.ft = add(L.kn, v(P.lhip + P.lknee, 92 * s));
    const R = { kn: v(P.rhip, 92 * s) }; R.ft = add(R.kn, v(P.rhip + P.rknee, 92 * s));
    const sh = add(neck, [0, 10 * s]), rel = add(sh, v(P.rsh, 68 * s)), rh = add(rel, v(P.rsh + P.rel, 62 * s)), lel = add(sh, v(P.lsh, 68 * s)), lh = add(lel, v(P.lsh + P.lel, 62 * s));
    const hipY = groundY - Math.max(L.ft[1], R.ft[1], 0) - (P.lift || 0) * s, T = p => [x + p[0], hipY + p[1]];
    const lift = (P.lift || 0) / 150; g.save();
    g.fillStyle = `rgba(0,0,0,${0.28 * (1 - 0.6 * lift)})`; g.beginPath(); g.ellipse(x, groundY + 6, 80 * s * (1 - 0.4 * lift), 14 * s, 0, 0, 6.283); g.fill();
    const limb = (pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(...T(pts[0])); pts.slice(1).forEach(p => g.lineTo(...T(p))); g.stroke(); };
    limb([[0, 0], R.kn, R.ft], 26 * s, SKIN2); limb([sh, lel, lh], 21 * s, SKIN2);                              // far limbs
    if (o.shield !== false && o.weapon !== 'none') { const [px, py] = T(lh); g.fillStyle = '#7a4a22'; g.beginPath(); g.arc(px, py, 38 * s, 0, 6.283); g.fill(); g.strokeStyle = GOLDC; g.lineWidth = 6 * s; g.stroke(); g.fillStyle = GOLDC; g.beginPath(); g.arc(px, py, 8 * s, 0, 6.283); g.fill(); }
    limb([[0, 0], neck], 50 * s, SKIN);                                                                           // torso
    g.fillStyle = RED; g.save(); g.translate(...T([0, 0])); g.rotate(P.torso * D * dir * 0.3); g.beginPath(); g.ellipse(0, 4 * s, 34 * s, 22 * s, 0, 0, 6.283); g.fill(); g.restore();   // kacha
    const [hx, hy] = T(head); g.fillStyle = HAIR; g.beginPath(); g.arc(hx - 18 * s * dir, hy - 8 * s, 15 * s, 0, 6.283); g.fill();
    g.fillStyle = SKIN; g.beginPath(); g.arc(hx, hy, 29 * s, 0, 6.283); g.fill(); g.fillStyle = HAIR; g.beginPath(); g.arc(hx, hy - 6 * s, 29 * s, Math.PI * 1.05, Math.PI * 1.95); g.fill();
    g.strokeStyle = RED; g.lineWidth = 7 * s; g.beginPath(); g.arc(hx, hy - 4 * s, 29 * s, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    g.fillStyle = HAIR; g.beginPath(); g.arc(hx + 13 * s * dir, hy + 2 * s, 3.5 * s, 0, 6.283); g.fill();          // eye
    limb([[0, 0], L.kn, L.ft], 27 * s, SKIN); limb([sh, rel, rh], 22 * s, SKIN);                                  // near limbs
    const wpn = o.weapon ?? 'sword', [rx, ry] = T(rh), fa = (P.rsh + P.rel) * D;
    if (wpn === 'sword') { const d = [Math.sin(fa) * dir, Math.cos(fa)]; g.strokeStyle = BLADE; g.lineWidth = 8 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx + d[0] * 140 * s, ry + d[1] * 140 * s); g.stroke();
      g.strokeStyle = GOLDC; g.lineWidth = 9 * s; g.beginPath(); g.moveTo(rx - d[1] * 16 * s, ry + d[0] * 16 * s); g.lineTo(rx + d[1] * 16 * s, ry - d[0] * 16 * s); g.stroke(); }
    else if (wpn === 'stick') { const d = [Math.sin(fa) * dir, Math.cos(fa)]; g.strokeStyle = '#8a5a2a'; g.lineWidth = 10 * s; g.beginPath(); g.moveTo(rx - d[0] * 90 * s, ry - d[1] * 90 * s); g.lineTo(rx + d[0] * 130 * s, ry + d[1] * 130 * s); g.stroke(); }
    else if (wpn === 'urumi') { const d = [Math.sin(fa) * dir, Math.cos(fa)], n = [-d[1], d[0]]; g.strokeStyle = BLADE; g.lineWidth = 4 * s; g.beginPath(); g.moveTo(rx, ry);
      for (let i = 1; i <= 30; i++) { const u = i / 30, w = Math.sin(u * 12 + (o.t || 0) * 9) * 26 * s * u; g.lineTo(rx + d[0] * 230 * s * u + n[0] * w, ry + d[1] * 230 * s * u + n[1] * w); } g.stroke(); }
    else if (wpn === 'torch') { const d = [Math.sin(fa) * dir, Math.cos(fa)]; g.strokeStyle = '#6a4220'; g.lineWidth = 9 * s; g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx + d[0] * 110 * s, ry + d[1] * 110 * s); g.stroke(); flame(g, rx + d[0] * 120 * s, ry + d[1] * 120 * s, 22 * s, o.t || 0, 1); }
    g.restore(); return { hip: T([0, 0]), head: T(head), hand: T(rh), shieldHand: T(lh) };
  }
  function flame(g, x, y, r, t, a = 1, seed = 0) { if (a <= 0) return; g.save(); g.globalAlpha = a;
    const f = 0.85 + 0.15 * Math.sin(t * 17 + seed * 3.1) + 0.08 * Math.sin(t * 29 + seed);
    const gl = g.createRadialGradient(x, y, 2, x, y, r * 3); gl.addColorStop(0, 'rgba(255,190,80,0.45)'); gl.addColorStop(1, 'rgba(255,120,30,0)'); g.fillStyle = gl; g.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
    for (const [col, k] of [['#e8541e', 1], ['#ffb02e', 0.68], ['#fff1b0', 0.36]]) { const h = r * 2.6 * k * f, w = r * k; g.fillStyle = col; g.beginPath(); g.moveTo(x - w, y); g.quadraticCurveTo(x - w, y - h * 0.5, x + Math.sin(t * 7 + seed) * w * 0.3, y - h); g.quadraticCurveTo(x + w, y - h * 0.5, x + w, y); g.arc(x, y, w, 0, Math.PI); g.fill(); }
    g.restore(); }
  function fireRing(g, cx, cy, rx, ry, t, half, a = 1) {  // half: 'back' | 'front' | 'all'
    if (a <= 0) return; g.save(); g.strokeStyle = '#3a2a20'; g.lineWidth = 12; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, half === 'front' ? 0 : Math.PI, half === 'back' ? 2 * Math.PI : Math.PI * (half === 'front' ? 1 : 3)); g.stroke(); g.restore();
    for (let i = 0; i < 28; i++) { const ang = i / 28 * 2 * Math.PI, front = Math.sin(ang) > 0; if ((half === 'back' && front) || (half === 'front' && !front)) continue;
      flame(g, cx + Math.cos(ang) * rx, cy + Math.sin(ang) * ry, 20 + 6 * Math.sin(i * 1.7), t, a, i); } }
  function sky(g, top, mid, bottom, y1 = H) { const gr = g.createLinearGradient(0, 0, 0, y1); gr.addColorStop(0, top); gr.addColorStop(0.6, mid); gr.addColorStop(1, bottom); g.fillStyle = gr; g.fillRect(0, 0, W, y1); }
  function spark(g, x, y, t, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = '#fff3c0'; g.lineWidth = 5; for (let i = 0; i < 10; i++) { const ang = i * 0.63 + t * 4, r1 = 14, r2 = 46 + 18 * Math.sin(i * 2.3 + t * 30);
      g.beginPath(); g.moveTo(x + Math.cos(ang) * r1, y + Math.sin(ang) * r1); g.lineTo(x + Math.cos(ang) * r2, y + Math.sin(ang) * r2); g.stroke(); } g.restore(); }
  return { POSES, at, loop, mix, fighter, flame, fireRing, sky, spark };
})();
