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
const base = H * 0.62;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, base); s.addColorStop(0, '#2a3a5a'); s.addColorStop(1, '#d8b88a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#6a4a3a'; x.beginPath(); x.moveTo(W * 0.78, base); x.lineTo(W * 0.8, H * 0.08); x.lineTo(W * 0.86, H * 0.08); x.lineTo(W * 0.88, base); x.fill();
  for (let i = 1; i < 6; i++) { x.fillStyle = '#5a3a2a'; x.fillRect(W * 0.79, base - i * (base - H * 0.08) / 6, W * 0.08, 10); }
  x.fillStyle = '#3a2e24'; x.fillRect(0, base, W, H); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), h = 820 * ease.out(k);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  if (h > 20) pillar(g, W * 0.45, base, h * 0.86, 1.3);
  g.strokeStyle = ACCENT; g.lineWidth = 5; g.beginPath(); g.moveTo(W * 0.2, base); g.lineTo(W * 0.2, base - h); g.stroke();
  for (let i = 0; i <= 7; i++) { const y = base - i * 820 / 7; if (base - y > h) break; g.beginPath(); g.moveTo(W * 0.2, y); g.lineTo(W * 0.2 + (i % 7 ? 20 : 40), y); g.stroke(); }
  g.fillStyle = ACCENT; g.beginPath(); g.arc(W * 0.2, base - h, 10, 0, 6.283); g.fill();
  fadeBottom(g);
};
