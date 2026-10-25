const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function boat(g, x, y, s, t, n = 26, col = '#16110c') {   // side view of a snake boat; rowers' oars move in sync
  g.save(); g.translate(x, y); g.scale(s, s);
  const ph = Math.sin(t * 7);
  g.strokeStyle = '#e8d8b8'; g.lineWidth = 3;
  for (let i = 0; i < n; i++) { const rx = -380 + i * (700 / n); g.beginPath(); g.moveTo(rx, -26); g.lineTo(rx - 30 - ph * 26, 40 + ph * 8); g.stroke(); }
  g.fillStyle = '#c8a46a'; for (let i = 0; i < n; i++) { const rx = -380 + i * (700 / n); g.beginPath(); g.arc(rx + ph * 4, -44, 8, 0, 6.283); g.fill(); g.fillRect(rx - 5 + ph * 3, -38, 10, 16); }
  g.fillStyle = col; g.beginPath(); g.moveTo(-460, -14); g.quadraticCurveTo(-200, 18, 300, 4); g.quadraticCurveTo(420, -10, 470, -170); g.lineTo(488, -176); g.quadraticCurveTo(460, 0, 320, 22); g.quadraticCurveTo(-200, 36, -460, -6); g.fill();
  g.strokeStyle = '#c8902e'; g.lineWidth = 4; g.beginPath(); g.moveTo(-450, -10); g.quadraticCurveTo(-200, 20, 310, 8); g.stroke();
  g.restore();
}
function water(g, y0, t, col) { const gr = g.createLinearGradient(0, y0, 0, H * 0.78); gr.addColorStop(0, col); gr.addColorStop(1, '#03060a'); g.fillStyle = gr; g.fillRect(0, y0, W, H);
  g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 3; for (let i = 0; i < 16; i++) { const x = ((i * 130 + t * 80) % (W + 200)) - 100, y = y0 + 20 + (i * 47) % 300; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 70, y); g.stroke(); } }
function palm(g2, x, base, h, lean, color) { g2.strokeStyle = color; g2.lineWidth = 10; g2.lineCap = 'round'; const tx = x + lean, ty = base - h; g2.beginPath(); g2.moveTo(x, base); g2.quadraticCurveTo(x + lean * 0.2, base - h * 0.5, tx, ty); g2.stroke(); g2.lineWidth = 6;
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42, L = 100 + (i % 2) * 24; g2.beginPath(); g2.moveTo(tx, ty); g2.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 16, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 40); g2.stroke(); } }
const c = makeCanvas(), g = c.getContext('2d'); const wy = H * 0.44;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, wy); s.addColorStop(0, '#0e1a2a'); s.addColorStop(1, '#3a5a6a'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.85)), m = ease.inOut(clamp(k * 1.4));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0); water(g, wy, t * 0.4, '#24445a');
  boat(g, W / 2, wy + 10, 1.05, t * 0.2, 26);
  g.strokeStyle = ACCENT; g.lineWidth = 5; const x0 = W / 2 - 480, x1 = lerp(x0, W / 2 + 500, m); g.beginPath(); g.moveTo(x0, wy - 260); g.lineTo(x1, wy - 260); g.stroke();
  for (const xx of [x0, x1]) { g.beginPath(); g.moveTo(xx, wy - 280); g.lineTo(xx, wy - 240); g.stroke(); }
  if (m >= 1) { const p = (t * 0.8) % 1; g.strokeStyle = rgba(ACCENT, 1 - p); g.beginPath(); g.arc(W / 2 + 480, wy - 150, 30 + p * 90, 0, 6.283); g.stroke(); } };
