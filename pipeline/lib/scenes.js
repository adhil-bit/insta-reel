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
  function lamp(g, x, y, s = 1, t = 0) {   // nilavilakku-style oil lamp, flickering
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
    g.save(); g.globalAlpha = amount; g.globalCompositeOperation = 'overlay'; const ox = (Math.floor(t * 24) * 37) % 256, oy = (Math.floor(t * 24) * 91) % 256;
    for (let x = -ox; x < W; x += 256) for (let y = -oy; y < H; y += 256) g.drawImage(grainTile, x, y); g.restore();
    const v = g.createRadialGradient(W / 2, H * 0.42, H * 0.25, W / 2, H * 0.45, H * 0.8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  }
  function filmFrame(g, t, a = 1) {   // film-strip border for flashbacks
    g.save(); g.globalAlpha = a; g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, 70, H); g.fillRect(W - 70, 0, 70, H); g.fillStyle = '#e8e0d0';
    const off = (t * 120) % 90; for (let y = -90 + off; y < H; y += 90) { g.fillRect(22, y, 26, 44); g.fillRect(W - 48, y, 26, 44); } g.restore();
  }
  return { P, ink, sky, sun, birds, palm, house, boat, sea, ground, person, crowd, lamp, gopuram, rays, door, grain, filmFrame };
})();
