const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function cake(g, x, y, s, slice) {                 // round plum cake with icing drip; optional cut slice
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(0, 70, 190, 34, 0, 0, 6.283); g.fill();
  g.fillStyle = '#e8e2d8'; g.beginPath(); g.ellipse(0, 66, 200, 36, 0, 0, 6.283); g.fill();
  g.fillStyle = '#5a2e1a'; g.fillRect(-150, -40, 300, 100); g.beginPath(); g.ellipse(0, 60, 150, 26, 0, 0, Math.PI); g.fill();
  for (let i = 0; i < 26; i++) { g.fillStyle = i % 3 ? '#2a1008' : '#8a3a1a'; g.beginPath(); g.arc(-130 + (i * 53) % 260, -20 + (i * 37) % 70, 5, 0, 6.283); g.fill(); }
  g.fillStyle = '#7a4024'; g.beginPath(); g.ellipse(0, -40, 150, 26, 0, 0, 6.283); g.fill();
  g.fillStyle = '#f2ece2'; g.beginPath(); g.ellipse(0, -44, 120, 18, 0, 0, 6.283); g.fill();
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI; g.beginPath(); g.ellipse(Math.cos(a) * 110, -40 + Math.sin(a) * 14 + 14, 10, 18, 0, 0, 6.283); g.fill(); }
  g.fillStyle = '#c8202e'; for (const [cx, cy] of [[-30, -48], [20, -46], [50, -50]]) { g.beginPath(); g.arc(cx, cy, 10, 0, 6.283); g.fill(); }
  g.fillStyle = '#2e7a3a'; g.beginPath(); g.ellipse(-4, -58, 16, 7, 0.5, 0, 6.283); g.fill();
  if (slice) { g.fillStyle = 'rgba(10,6,4,0.9)'; g.beginPath(); g.moveTo(0, -40); g.lineTo(150, -40); g.lineTo(150, 60); g.lineTo(0, 60); g.closePath(); g.fill();
    g.save(); g.translate(60 * slice, 10 * slice); g.fillStyle = '#5a2e1a'; g.fillRect(20, -40, 120, 100); for (let i = 0; i < 10; i++) { g.fillStyle = '#2a1008'; g.beginPath(); g.arc(30 + (i * 31) % 100, -25 + (i * 19) % 70, 5, 0, 6.283); g.fill(); }
    g.fillStyle = '#f2ece2'; g.fillRect(20, -48, 120, 10); g.restore(); }
  g.restore();
}
function bokeh(g, t, n, cols) { for (let i = 0; i < n; i++) { const x = (i * 197) % W, y = (i * 131) % (H * 0.55), r = 14 + (i % 5) * 8, a = 0.25 + 0.2 * Math.sin(t * 2 + i);
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(cols[i % cols.length], a)); gr.addColorStop(1, rgba(cols[i % cols.length], 0)); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); } }
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const bx = W / 2, by = H * 0.46;
const bg = layer(x => { const b = x.createRadialGradient(bx, by, 40, bx, by, H * 0.8); b.addColorStop(0, '#2e1e14'); b.addColorStop(1, '#060403'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const items = Array.from({length: 36}, (_, i) => ({type: i % 4, x: bx + (rand() - 0.5) * 600, d: rand(), r: rand() * 6}));
function item(tp, x, y, r) { g.save(); g.translate(x, y); g.rotate(r);
  if (tp === 0) { g.fillStyle = '#8a4a24'; g.fillRect(-40, -8, 80, 16); g.strokeStyle = '#5a2e14'; g.lineWidth = 3; g.strokeRect(-40, -8, 80, 16); }
  else if (tp === 1) { g.fillStyle = '#3a1410'; g.beginPath(); g.ellipse(0, 0, 14, 10, 0, 0, 6.283); g.fill(); }
  else if (tp === 2) { g.fillStyle = '#f0dcb0'; g.beginPath(); g.arc(0, 0, 18, 0.3, Math.PI * 1.4); g.arc(-4, 6, 8, Math.PI * 1.4, 0.3, true); g.fill(); }
  else { g.fillStyle = '#6a2e14'; g.fillRect(-3, -14, 6, 22); g.beginPath(); g.arc(0, -16, 8, 0, 6.283); g.fill(); }
  g.restore(); }
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.fillStyle = '#5a3a24'; g.beginPath(); g.ellipse(bx, by, 300, 70, 0, 0, 6.283); g.fill();
  g.fillStyle = '#7a4a2a'; g.beginPath(); g.ellipse(bx, by, 270, 56, 0, 0, 6.283); g.fill();
  const sw = g.createRadialGradient(bx, by, 10, bx, by, 260); sw.addColorStop(0, '#6a3218'); sw.addColorStop(1, '#4a2210'); g.fillStyle = sw;
  g.beginPath(); g.ellipse(bx, by + 6, 250, 48, 0, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(255,220,180,0.25)'; g.lineWidth = 4; for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(bx, by + 6, 80 + i * 60, 14 + i * 10, 0, t * 2 + i, t * 2 + i + 2); g.stroke(); }
  for (const it of items) { const u = ((t * 0.35 + it.d) % 1); const y = lerp(-60, by - 10, ease.in(u)), x = lerp(it.x, bx + (it.x - bx) * 0.3, u);
    if (u < 0.97) item(it.type, x, y, it.r + t * 2); }
  g.fillStyle = '#f2c14e'; g.beginPath(); g.moveTo(bx + 330, by - 300); g.lineTo(bx + 380, by - 300); g.lineTo(bx + 400, by - 200); g.lineTo(bx + 310, by - 200); g.fill();
  g.strokeStyle = rgba(ACCENT, 0.8); g.lineWidth = 6; const pour = 0.5 + 0.5 * Math.sin(t * 3); g.beginPath(); g.moveTo(bx + 315, by - 200); g.quadraticCurveTo(bx + 220, by - 120, bx + 120, by - 10 * pour); g.stroke();
  fadeBottom(g);
};
