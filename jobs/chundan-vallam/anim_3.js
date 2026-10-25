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
const c = makeCanvas(), g = c.getContext('2d'); const wy = H * 0.46;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, wy); s.addColorStop(0, '#3a3020'); s.addColorStop(1, '#a8906a'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
function trophy(x, y, s, a) { g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = a; const gr = g.createLinearGradient(-120, 0, 120, 0); gr.addColorStop(0, '#9aa0aa'); gr.addColorStop(0.5, '#f4f6fa'); gr.addColorStop(1, '#9aa0aa');
  g.fillStyle = gr; g.fillRect(-90, 60, 180, 40); g.fillRect(-20, -10, 40, 80);
  g.beginPath(); g.moveTo(-150, -20); g.quadraticCurveTo(0, 10, 120, -24); g.quadraticCurveTo(150, -40, 160, -110); g.lineTo(170, -112); g.quadraticCurveTo(170, -20, 120, -4); g.quadraticCurveTo(0, 26, -150, -10); g.fill(); g.restore(); g.globalAlpha = 1; }
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.88)), tr = ease.out(clamp((k - 0.45) * 2.5));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0); water(g, wy, t * 0.5, '#6a6050');
  boat(g, lerp(-300, W * 0.4, ease.out(clamp(k * 1.4))), wy + 60, 0.8, t, 22, '#2a2018');
  g.fillStyle = '#e8e0d0'; g.fillRect(W * 0.62, wy - 20, 220, 50); g.fillStyle = '#d8d0c0'; g.fillRect(W * 0.66, wy - 70, 120, 50);
  g.fillStyle = 'rgba(80,60,30,0.25)'; g.fillRect(0, 0, W, H);
  if (tr > 0) { const gl = g.createRadialGradient(W / 2, H * 0.18, 20, W / 2, H * 0.18, 300); gl.addColorStop(0, rgba(ACCENT, 0.45 * tr)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H * 0.4); trophy(W / 2, H * 0.2, 1.3, tr); } };
