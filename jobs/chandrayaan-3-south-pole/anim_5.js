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
const gy = H * 0.46;
const bg = layer(x => { x.fillStyle = '#020208'; x.fillRect(0, 0, W, H); stars(x); moonGround(x, gy); });
function rover(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#d9a23a'; g.fillRect(-60, -50, 120, 40); g.fillStyle = '#2a3a6a'; g.fillRect(-70, -70, 140, 16);
  g.fillStyle = '#ccc'; g.fillRect(30, -100, 6, 34); g.fillRect(24, -110, 30, 14);
  for (const d of [-50, -10, 30, 50]) { g.fillStyle = '#222'; g.beginPath(); g.arc(d, -2, 14, 0, 6.283); g.fill(); g.strokeStyle = '#666'; g.lineWidth = 3; g.beginPath(); g.moveTo(d, -2); g.lineTo(d + Math.cos(t * 4) * 12, -2 + Math.sin(t * 4) * 12); g.stroke(); }
  g.restore(); }
window.renderFrame = function (t) {
  const k = clamp(t / DURATION), rx = lerp(W * 0.2, W * 0.78, ease.inOut(k)), ry = gy + 90;
  g.globalAlpha = 1; g.drawImage(bg, 0, 0); earth(g, W * 0.72, H * 0.12, 80);
  g.fillStyle = 'rgba(40,40,46,0.6)'; for (let x = W * 0.2; x < rx - 60; x += 22) { g.fillRect(x, ry + 8, 12, 5); g.fillRect(x, ry - 4, 12, 5); }
  lander(g, W * 0.18, gy + 20, 1.5, 0);
  rover(rx, ry, 1.6, t);
  const gl = g.createRadialGradient(W * 0.72, H * 0.12, 60, W * 0.72, H * 0.12, 260); gl.addColorStop(0, rgba(ACCENT, 0.3)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H * 0.4);
  fadeBottom(g);
};
