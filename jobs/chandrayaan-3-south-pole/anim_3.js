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
const mx = W / 2, my = H * 0.62, mr = 520;
const bg = layer(x => { x.fillStyle = '#020208'; x.fillRect(0, 0, W, H); stars(x);
  const mg = x.createRadialGradient(mx - 120, my - 160, 50, mx, my, mr); mg.addColorStop(0, '#c8c8d0'); mg.addColorStop(1, '#3a3a42'); x.fillStyle = mg; x.beginPath(); x.arc(mx, my, mr, 0, 6.283); x.fill();
  for (let i = 0; i < 20; i++) { const a = rand() * 6.283, r = rand() * mr * 0.8; x.fillStyle = 'rgba(0,0,0,0.18)'; x.beginPath(); x.arc(mx + Math.cos(a) * r, my + Math.sin(a) * r, 20 + rand() * 50, 0, 6.283); x.fill(); } });
const debris = Array.from({length: 40}, () => ({a: -Math.PI * rand(), v: 80 + rand() * 260}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9)), hit = 0.55, ix = mx + 180, iy = my - mr + 60;
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  if (k < hit) { const u = k / hit, a = -2.4 + u * 2.6, r = lerp(mr + 260, mr - 20, ease.in(u)); const x = mx + Math.cos(a) * r, y = my + Math.sin(a) * r;
    g.save(); g.translate(x, y); g.rotate(t * 6); g.fillStyle = '#d8d8dc'; g.fillRect(-20, -14, 40, 28); g.fillStyle = '#4a6ab8'; g.fillRect(-56, -6, 30, 12); g.fillRect(26, -6, 30, 12); g.restore();
    g.strokeStyle = 'rgba(255,90,90,0.6)'; g.setLineDash([8, 8]); g.lineWidth = 3; g.beginPath(); g.arc(mx, my, r, a - 0.6, a); g.stroke(); g.setLineDash([]); }
  else { const b = (k - hit) / (1 - hit);
    if (b < 0.4) { const f = b / 0.4, fl = g.createRadialGradient(ix, iy, 0, ix, iy, 60 + f * 300); fl.addColorStop(0, `rgba(255,220,180,${1 - f})`); fl.addColorStop(1, 'rgba(255,80,80,0)');
      g.fillStyle = fl; g.beginPath(); g.arc(ix, iy, 60 + f * 300, 0, 6.283); g.fill();
      for (const d of debris) { g.fillStyle = `rgba(200,200,210,${1 - f})`; g.fillRect(ix + Math.cos(d.a) * d.v * f, iy + Math.sin(d.a) * d.v * f, 6, 6); } }
    g.fillStyle = 'rgba(20,20,24,0.8)'; g.beginPath(); g.ellipse(ix, iy + 6, 40, 14, 0.3, 0, 6.283); g.fill();
    const p = (t * 0.8) % 1; g.strokeStyle = `rgba(255,77,94,${1 - p})`; g.lineWidth = 4; g.beginPath(); g.arc(ix, iy, 30 + p * 80, 0, 6.283); g.stroke(); }
  fadeBottom(g);
};
