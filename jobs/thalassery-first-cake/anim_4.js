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
const ox = W / 2, oy = H * 0.38;
const bg = layer(x => { const b = x.createRadialGradient(ox, oy, 40, ox, oy, H * 0.8); b.addColorStop(0, '#2a1a10'); b.addColorStop(1, '#050303'); x.fillStyle = b; x.fillRect(0, 0, W, H);
  x.fillStyle = '#3a3a40'; x.fillRect(ox - 380, oy - 300, 760, 600); x.fillStyle = '#2a2a30'; x.fillRect(ox - 340, oy - 260, 680, 520); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), rise = ease.out(clamp(k / 0.6)), open = ease.inOut(clamp((k - 0.6) / 0.3));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const heat = g.createRadialGradient(ox, oy + 100, 20, ox, oy + 100, 400); heat.addColorStop(0, `rgba(255,140,60,${0.5 + 0.2 * Math.sin(t * 5)})`); heat.addColorStop(1, 'rgba(255,140,60,0)');
  g.fillStyle = heat; g.fillRect(ox - 340, oy - 260, 680, 520);
  g.save(); g.translate(ox, oy + 120); g.scale(1, 0.5 + 0.5 * rise); cake(g, 0, -40, 1.4, 0); g.restore();
  g.fillStyle = '#5a5a62'; g.fillRect(ox - 300, oy + 170, 600, 10);
  if (open < 1) { g.save(); g.translate(ox - 340, oy - 260); g.scale(1 - open * 0.9, 1); g.fillStyle = 'rgba(40,40,46,0.75)'; g.fillRect(0, 0, 680, 520);
    g.fillStyle = 'rgba(255,170,90,0.25)'; g.fillRect(80, 80, 520, 300); g.fillStyle = '#8a8a92'; g.fillRect(560, 220, 30, 80); g.restore(); }
  if (open > 0) { const b = g.createRadialGradient(ox, oy, 20, ox, oy, 600); b.addColorStop(0, `rgba(255,230,170,${0.5 * open})`); b.addColorStop(1, 'rgba(255,230,170,0)'); g.fillStyle = b; g.fillRect(0, 0, W, H);
    g.strokeStyle = rgba(ACCENT, open); g.lineWidth = 6; g.strokeRect(ox - 350, oy - 270, 700, 540); }
  fadeBottom(g);
};
