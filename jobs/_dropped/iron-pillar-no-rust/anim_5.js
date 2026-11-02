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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, base); s.addColorStop(0, '#03040c'); s.addColorStop(1, '#1a1a2c'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#e6e2ff'; for (let i = 0; i < 260; i++) { x.globalAlpha = rand() * 0.8; x.fillRect(rand() * W, rand() * base * 0.8, 2, 2); } x.globalAlpha = 1;
  x.fillStyle = '#0a0a0e'; x.fillRect(0, base, W, H); });
window.renderFrame = function (t) {
  const k = clamp(t / DURATION), z = lerp(1.25, 1.0, ease.out(k));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.save(); g.translate(W / 2, base); g.scale(z, z); g.translate(-W / 2, -base);
  const gl = g.createRadialGradient(W / 2, base, 20, W / 2, base, 600); gl.addColorStop(0, 'rgba(255,180,100,0.45)'); gl.addColorStop(1, 'rgba(255,180,100,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  pillar(g, W / 2, base, 700, 1.4);
  g.restore();
  const p = (t * 0.5) % 1; g.strokeStyle = rgba(ACCENT, 0.6 * (1 - p)); g.lineWidth = 4; g.beginPath(); g.ellipse(W / 2, base, 80 + p * 400, 20 + p * 90, 0, 0, 6.283); g.stroke();
  fadeBottom(g);
};
