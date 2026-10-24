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
const bg = layer(x => { const b = x.createRadialGradient(W / 2, H * 0.4, 40, W / 2, H * 0.4, H * 0.8); b.addColorStop(0, '#3a2414'); b.addColorStop(1, '#070404'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
window.renderFrame = function (t) {
  const k = clamp(t / DURATION);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0); bokeh(g, t, 26, ['#FFC86B', '#F59E3B', '#ff6a6a', '#fff2c8']);
  const gl = g.createRadialGradient(W / 2, H * 0.4, 40, W / 2, H * 0.4, 460); gl.addColorStop(0, rgba(ACCENT, 0.35)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  cake(g, W / 2, H * 0.42, 2.0 + 0.04 * Math.sin(t), 0);
  g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 6; for (let i = 0; i < 3; i++) { const y0 = H * 0.3 - ((t * 60 + i * 50) % 150); g.beginPath(); g.moveTo(W / 2 - 60 + i * 60, y0 + 60); g.quadraticCurveTo(W / 2 - 30 + i * 60, y0 + 20, W / 2 - 60 + i * 60, y0 - 20); g.stroke(); }
  fadeBottom(g);
};
