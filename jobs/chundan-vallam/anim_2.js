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
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { const b = x.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H * 0.36, H * 0.8); b.addColorStop(0, '#2a3a4a'); b.addColorStop(1, '#05080c'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
window.renderFrame = function (t) { g.globalAlpha = 1; g.drawImage(bg, 0, 0); water(g, H * 0.5, t, '#24445a');
  const beat = Math.max(0, Math.sin(t * 7)); 
  for (let i = 0; i < 6; i++) { const x = 140 + i * 160, y = H * 0.4, dip = Math.sin(t * 7);
    g.fillStyle = '#c8a46a'; g.beginPath(); g.arc(x + dip * 6, y - 110, 28, 0, 6.283); g.fill(); g.fillRect(x - 24 + dip * 4, y - 82, 48, 80);
    g.strokeStyle = '#e8d8b8'; g.lineWidth = 10; g.beginPath(); g.moveTo(x + 10, y - 60); g.lineTo(x - 60 - dip * 50, y + 120 + dip * 20); g.stroke();
    g.fillStyle = '#e8d8b8'; g.beginPath(); g.ellipse(x - 62 - dip * 50, y + 130 + dip * 20, 16, 40, 0.4, 0, 6.283); g.fill();
    if (dip < -0.8) { g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 3; g.beginPath(); g.ellipse(x - 60, H * 0.5 + 10, 40, 10, 0, 0, 6.283); g.stroke(); } }
  g.fillStyle = '#16110c'; g.fillRect(0, H * 0.43, W, 40);
  g.strokeStyle = rgba(ACCENT, beat); g.lineWidth = 6; g.beginPath(); g.arc(W / 2, H * 0.14, 40 + beat * 60, 0, 6.283); g.stroke(); };
