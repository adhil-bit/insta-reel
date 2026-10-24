const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function headframe(g2, x, base, s, col) {          // mine headframe tower with its winding wheel
  g2.save(); g2.translate(x, base); g2.scale(s, s); g2.strokeStyle = col; g2.lineWidth = 10;
  g2.beginPath(); g2.moveTo(-90, 0); g2.lineTo(-30, -300); g2.lineTo(30, -300); g2.lineTo(90, 0); g2.moveTo(-70, -100); g2.lineTo(70, -100); g2.moveTo(-50, -200); g2.lineTo(50, -200);
  g2.moveTo(-70, -100); g2.lineTo(50, -200); g2.moveTo(70, -100); g2.lineTo(-50, -200); g2.moveTo(30, -300); g2.lineTo(140, 0); g2.stroke();
  g2.lineWidth = 8; g2.beginPath(); g2.arc(0, -320, 36, 0, 6.283); g2.stroke(); g2.beginPath(); g2.moveTo(-36, -320); g2.lineTo(36, -320); g2.moveTo(0, -356); g2.lineTo(0, -284); g2.stroke();
  g2.restore();
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const gy = H * 0.52;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, gy); s.addColorStop(0, '#120e1c'); s.addColorStop(1, '#6a3a3a'); x.fillStyle = s; x.fillRect(0, 0, W, H); x.fillStyle = '#100c0a'; x.fillRect(0, gy, W, H);
  x.fillStyle = '#e6e2f0'; for (let i = 0; i < 100; i++) { x.globalAlpha = rand() * 0.5; x.fillRect(rand() * W, rand() * gy * 0.6, 2, 2); } x.globalAlpha = 1; });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9)), fade = 1 - ease.inOut(k) * 0.85;
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const gl = g.createRadialGradient(W / 2, gy - 200, 20, W / 2, gy - 200, 480); gl.addColorStop(0, rgba(ACCENT, 0.35 * fade)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  headframe(g, W / 2, gy, 1.2, '#0a0605');
  g.strokeStyle = '#0a0605'; g.lineWidth = 8; g.save(); g.translate(W / 2, gy - 384); g.rotate(t * 0.05 * fade); g.beginPath(); g.arc(0, 0, 43, 0, 6.283); g.stroke(); g.restore();
  g.strokeStyle = '#2a201a'; g.lineWidth = 4; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(80 + i * 200, gy); g.lineTo(100 + i * 200, gy - 40 - (i % 2) * 30); g.stroke(); }
  fadeBottom(g);
};
