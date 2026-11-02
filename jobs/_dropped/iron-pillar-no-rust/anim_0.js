const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function pillar(g, x, base, h, s) {                 // tapered iron shaft with a bell-shaped capital
  const gr = g.createLinearGradient(x - 40 * s, 0, x + 40 * s, 0); gr.addColorStop(0, '#1e1c1a'); gr.addColorStop(0.35, '#5a524a'); gr.addColorStop(0.6, '#3a3430'); gr.addColorStop(1, '#151412');
  g.fillStyle = gr; g.beginPath(); g.moveTo(x - 40 * s, base); g.lineTo(x - 30 * s, base - h); g.lineTo(x + 30 * s, base - h); g.lineTo(x + 40 * s, base); g.fill();
  const top = base - h;
  g.beginPath(); g.moveTo(x - 30 * s, top); g.bezierCurveTo(x - 70 * s, top - 30 * s, x - 70 * s, top - 70 * s, x - 40 * s, top - 90 * s); g.lineTo(x + 40 * s, top - 90 * s);
  g.bezierCurveTo(x + 70 * s, top - 70 * s, x + 70 * s, top - 30 * s, x + 30 * s, top); g.fill();
  g.fillRect(x - 46 * s, top - 110 * s, 92 * s, 20 * s); g.fillRect(x - 30 * s, top - 140 * s, 60 * s, 30 * s);
  g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 4 * s; g.beginPath(); g.moveTo(x - 12 * s, base - 10); g.lineTo(x - 9 * s, top + 10); g.stroke();
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const base = H * 0.6;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, base); s.addColorStop(0, '#05070e'); s.addColorStop(1, '#1e2430'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#0c0e12'; x.fillRect(0, base, W, H); });
const drops = Array.from({length: 360}, () => ({x: rand() * W, y: rand() * H, s: 0.8 + rand() * 0.5}));
window.renderFrame = function (t) {
  const k = clamp(t / DURATION);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const gl = g.createRadialGradient(W / 2, H * 0.3, 40, W / 2, H * 0.3, 520); gl.addColorStop(0, rgba(ACCENT, 0.22)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  pillar(g, W / 2, base, 760, 1.6);
  g.strokeStyle = 'rgba(170,190,220,0.4)'; g.lineWidth = 2; g.beginPath();
  for (const d of drops) { const y = (d.y + t * 1100 * d.s) % base; g.moveTo(d.x, y); g.lineTo(d.x - 3, y + 26); } g.stroke();
  for (let i = 0; i < 8; i++) { const y = ((t * 120 + i * 95) % 700) + base - 740; g.fillStyle = 'rgba(200,220,255,0.6)'; g.beginPath(); g.ellipse(W / 2 + 30 + (i % 2) * 10, y, 4, 8, 0, 0, 6.283); g.fill(); }
  g.strokeStyle = rgba(ACCENT, 0.5 + 0.3 * Math.sin(t * 2)); g.lineWidth = 3; g.strokeRect(W / 2 - 90, base - 1000, 180, 1000);
  fadeBottom(g);
};
