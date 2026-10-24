const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function stars(x, n = 260) { x.fillStyle = '#e6e8ff'; for (let i = 0; i < n; i++) { x.globalAlpha = rand() * 0.8; const s = rand() < 0.1 ? 3 : 2; x.fillRect(rand() * W, rand() * H * 0.7, s, s); } x.globalAlpha = 1; }
function moonGround(x, top) {                      // grey regolith horizon with craters
  const gr = x.createLinearGradient(0, top, 0, H * 0.8); gr.addColorStop(0, '#8a8a90'); gr.addColorStop(1, '#141418'); x.fillStyle = gr;
  x.beginPath(); x.moveTo(0, H); x.lineTo(0, top + 30); x.quadraticCurveTo(W / 2, top - 30, W, top + 30); x.lineTo(W, H); x.fill();
  for (let i = 0; i < 14; i++) { const cx = rand() * W, cy = top + 40 + rand() * 260, r = 20 + rand() * 60; x.fillStyle = 'rgba(0,0,0,0.25)'; x.beginPath(); x.ellipse(cx, cy, r, r * 0.3, 0, 0, 6.283); x.fill();
    x.strokeStyle = 'rgba(255,255,255,0.15)'; x.lineWidth = 3; x.beginPath(); x.ellipse(cx, cy - 2, r, r * 0.3, 0, Math.PI, 6.283); x.stroke(); }
}
function earth(g, x, y, r) { const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); gr.addColorStop(0, '#6ab0ff'); gr.addColorStop(1, '#123a7a');
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.fillStyle = 'rgba(80,170,90,0.8)';
  g.beginPath(); g.ellipse(x - r * 0.2, y - r * 0.1, r * 0.35, r * 0.25, 0.5, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(x + r * 0.3, y + r * 0.3, r * 0.2, r * 0.3, -0.3, 0, 6.283); g.fill(); }
function lander(g, x, y, s, thrust) {
  g.save(); g.translate(x, y); g.scale(s, s);
  if (thrust > 0) { const fl = g.createLinearGradient(0, 40, 0, 40 + 160 * thrust); fl.addColorStop(0, 'rgba(255,230,180,0.95)'); fl.addColorStop(1, 'rgba(255,140,60,0)');
    g.fillStyle = fl; g.beginPath(); g.moveTo(-18, 40); g.lineTo(18, 40); g.lineTo(0, 40 + 160 * thrust); g.fill(); }
  g.strokeStyle = '#b8bcc8'; g.lineWidth = 6; for (const d of [-1, 1]) { g.beginPath(); g.moveTo(d * 40, 10); g.lineTo(d * 80, 70); g.stroke(); g.fillRect(d * 80 - 14, 66, 28, 6); }
  const foil = g.createLinearGradient(-60, -50, 60, 40); foil.addColorStop(0, '#f2c14e'); foil.addColorStop(0.5, '#b8862a'); foil.addColorStop(1, '#f2d27a');
  g.fillStyle = foil; g.fillRect(-60, -50, 120, 90); g.fillStyle = '#2a3a6a'; g.fillRect(-50, -70, 100, 22);
  g.fillStyle = '#ddd'; g.fillRect(-4, -100, 8, 32); g.beginPath(); g.arc(0, -104, 10, 0, 6.283); g.fill();
  g.fillStyle = '#555'; g.fillRect(-14, 40, 28, 12); g.restore();
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const gy = H * 0.5;
const bg = layer(x => { x.fillStyle = '#020208'; x.fillRect(0, 0, W, H); stars(x); moonGround(x, gy); });
const dust = Array.from({length: 80}, () => ({d: rand() < 0.5 ? -1 : 1, v: 0.5 + rand(), y: rand() * 30, s: 4 + rand() * 10}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9)), land = 0.6, u = clamp(k / land), y = lerp(H * 0.08, gy - 40, ease.out(u)), thrust = k < land ? 1 : Math.max(0, 1 - (k - land) * 8);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0); earth(g, W * 0.18, H * 0.1, 56);
  if (u > 0.7) for (const d of dust) { const f = ((t * d.v * 0.8) % 1) * (thrust > 0 ? 1 : clamp(1 - (k - land) * 3)); g.fillStyle = `rgba(170,170,180,${0.5 * (1 - f)})`;
    g.beginPath(); g.arc(W / 2 + d.d * f * 520, gy - 10 - d.y - f * 40, d.s * (1 + f * 2), 0, 6.283); g.fill(); }
  lander(g, W / 2, y, 2.6, thrust * (0.8 + 0.2 * Math.sin(t * 25)));
  if (k > land) { const p = ((t - land * DURATION) * 0.7) % 1, a = clamp((k - land) * 5); g.strokeStyle = rgba(ACCENT, a * (1 - p)); g.lineWidth = 5; g.beginPath(); g.ellipse(W / 2, gy + 20, 120 + p * 380, 30 + p * 90, 0, 0, 6.283); g.stroke(); }
  fadeBottom(g);
};
