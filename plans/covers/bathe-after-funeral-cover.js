const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) {
  SK.sky(g, 'dusk', 0.36); SK.sun(g, W * 0.78, H * 0.13, 44, '#f4e8d0', 0.35);
  SK.palm(g, W * 0.06, H * 0.38, 440, 40, '#0a0810', t); SK.palm(g, W * 0.94, H * 0.37, 400, -40, '#0a0810', t);
  SK.house(g, W * 0.5, H * 0.36, 0.85, '#100c12', 0.8, t);
  g.fillStyle = '#1a1418'; g.fillRect(0, H * 0.36, W, H);
  SK.lamp(g, W * 0.3, H * 0.365, 0.55, t); SK.lamp(g, W * 0.7, H * 0.365, 0.55, t + 1);
  const top = H * 0.385; for (let i = 0; i < 5; i++) { const y = top + i * 20, inset = i * 40; g.fillStyle = i % 2 ? '#4a3e44' : '#3a3036'; g.fillRect(W * 0.1 + inset, y, W * 0.8 - inset * 2, 20); }
  const py = top + 100, x0 = W * 0.1 + 200, pw = W * 0.8 - 400; const wg = g.createLinearGradient(0, py, 0, H * 0.5); wg.addColorStop(0, '#3a6a8a'); wg.addColorStop(1, '#14283a'); g.fillStyle = wg; g.fillRect(x0, py, pw, H * 0.5 - py);
  g.save(); g.beginPath(); g.rect(x0, py, pw, H * 0.5 - py); g.clip();
  g.strokeStyle = 'rgba(210,235,255,0.5)'; g.lineWidth = 3; for (let r = 0; r < 4; r++) { const q = (t * 0.35 + r / 4) % 1; g.beginPath(); g.ellipse(W / 2, py + 50, 20 + q * 200, 5 + q * 26, 0, 0, 6.283); g.stroke(); }
  g.fillStyle = 'rgba(255,200,110,0.35)'; g.beginPath(); g.ellipse(W * 0.5, py + 20, 120, 10, 0, 0, 6.283); g.fill(); g.restore();
  for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(200,210,230,0.10)'; g.beginPath(); g.ellipse(W * (i % 4) * 0.33, H * (0.33 + (i % 3) * 0.02), 520, 44, 0, 0, 6.283); g.fill(); }
  SK.grain(g, t, 0.08); };
