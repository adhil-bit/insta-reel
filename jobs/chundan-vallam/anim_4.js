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
const bg = layer(x => { x.fillStyle = '#1e3a4a'; x.fillRect(0, 0, W, H); x.fillStyle = '#2a5a2e'; x.fillRect(0, 0, 70, H); x.fillRect(W - 70, 0, 70, H);
  x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 3; x.setLineDash([20, 16]); for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(70 + i * (W - 140) / 4, 0); x.lineTo(70 + i * (W - 140) / 4, H); x.stroke(); } x.setLineDash([]); });
const lanes = [0.92, 1.0, 0.88, 0.96];
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.92)), fy = H * 0.1;
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.fillStyle = ACCENT; for (let i = 0; i < 20; i++) g.fillRect(70 + i * 47, fy, 24, 14);
  lanes.forEach((sp, i) => { const x = 70 + (i + 0.5) * (W - 140) / 4, y = lerp(H * 0.75, fy - 40, ease.inOut(clamp(k * sp * 1.1)));
    g.save(); g.translate(x, y); g.fillStyle = i === 1 ? '#f2c14e' : '#16110c'; g.beginPath(); g.ellipse(0, 0, 18, 150, 0, 0, 6.283); g.fill();
    g.strokeStyle = '#e8d8b8'; g.lineWidth = 3; for (let r = -120; r < 120; r += 22) { const o = Math.sin(t * 7) * 16; g.beginPath(); g.moveTo(-14, r); g.lineTo(-44, r + o); g.moveTo(14, r); g.lineTo(44, r + o); g.stroke(); } g.restore();
    g.fillStyle = 'rgba(255,255,255,0.35)'; for (let j = 0; j < 6; j++) g.fillRect(x - 20 + (j % 3) * 14, y + 160 + j * 20, 6, 6); }); };
