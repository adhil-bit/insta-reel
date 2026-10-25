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
const c = makeCanvas(), g = c.getContext('2d'); const wy = H * 0.5;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, wy); s.addColorStop(0, '#2a3a6a'); s.addColorStop(1, '#f2b26a'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
const crowd = Array.from({length: 40}, (_, i) => ({x: i * 28 + 10, h: 60 + (i * 37) % 40, p: i * 0.7}));
const conf = Array.from({length: 70}, () => ({x: rand() * W, y: rand() * H * 0.5, c: ['#F472B6', '#FFD27A', '#7AD3FF', '#9AE6B4'][Math.floor(rand() * 4)], s: 0.5 + rand()}));
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.fillStyle = '#0c0a08'; for (const p of crowd) { const arm = Math.abs(Math.sin(t * 5 + p.p)); g.beginPath(); g.arc(p.x, wy - 30 - p.h, 12, 0, 6.283); g.fill(); g.fillRect(p.x - 10, wy - 20 - p.h, 20, p.h);
    g.strokeStyle = '#0c0a08'; g.lineWidth = 5; g.beginPath(); g.moveTo(p.x, wy - 15 - p.h); g.lineTo(p.x + 14, wy - 40 - p.h - arm * 30); g.stroke(); }
  water(g, wy, t, '#2a4a6a'); boat(g, lerp(-400, W + 400, k), wy + 60, 0.9, t, 24);
  for (const c2 of conf) { g.fillStyle = c2.c; g.fillRect((c2.x + Math.sin(t + c2.y) * 30) % W, (c2.y + t * 120 * c2.s) % (H * 0.5), 10, 6); } };
