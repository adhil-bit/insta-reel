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
const gy = H * 0.58;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, gy); s.addColorStop(0, '#1a1a34'); s.addColorStop(1, '#a8584a'); x.fillStyle = s; x.fillRect(0, 0, W, H); x.fillStyle = '#1a1410'; x.fillRect(0, gy, W, H);
  x.fillStyle = '#6a4a34'; x.fillRect(W * 0.15, gy - 560, W * 0.7, 560); x.fillStyle = '#3a2418'; x.beginPath(); x.moveTo(W * 0.1, gy - 560); x.lineTo(W / 2, gy - 760); x.lineTo(W * 0.9, gy - 560); x.fill();
  for (let i = 0; i < 8; i++) { x.fillStyle = '#4a2a1a'; x.fillRect(W * 0.12, gy - 560 - i * 24, W * 0.76, 6); }
  x.fillStyle = '#e8dcc0'; x.fillRect(W * 0.28, gy - 520, W * 0.44, 70); x.fillStyle = '#7a5a3a'; for (let i = 0; i < 5; i++) x.fillRect(W * 0.32 + i * 70, gy - 500, 40, 8);
  x.fillStyle = '#2a1a10'; x.fillRect(W * 0.42, gy - 300, W * 0.16, 300); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), glow = 0.5 + 0.5 * ease.inOut(k) + 0.08 * Math.sin(t * 6);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const wx of [W * 0.2, W * 0.62]) { const gr = g.createRadialGradient(wx + 90, gy - 220, 10, wx + 90, gy - 220, 220); gr.addColorStop(0, `rgba(255,170,80,${0.6 * glow})`); gr.addColorStop(1, 'rgba(255,170,80,0)');
    g.fillStyle = gr; g.fillRect(wx - 140, gy - 440, 460, 440); g.fillStyle = `rgba(255,200,120,${0.85 * glow})`; g.fillRect(wx, gy - 320, 180, 160);
    g.strokeStyle = '#2a1a10'; g.lineWidth = 8; g.strokeRect(wx, gy - 320, 180, 160); g.beginPath(); g.moveTo(wx + 90, gy - 320); g.lineTo(wx + 90, gy - 160); g.stroke(); }
  g.strokeStyle = rgba(ACCENT, 0.6); g.lineWidth = 4; g.strokeRect(W * 0.28 - 8, gy - 528, W * 0.44 + 16, 86);
  fadeBottom(g);
};
