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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, gy); s.addColorStop(0, '#1a1428'); s.addColorStop(0.6, '#b8603a'); s.addColorStop(1, '#f2a85a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#3a2a20'; x.beginPath(); x.moveTo(0, H); for (let X = 0; X <= W; X += 12) x.lineTo(X, gy - 60 - 40 * Math.sin(X * 0.004 + 1) - 20 * Math.sin(X * 0.011)); x.lineTo(W, H); x.fill();
  x.fillStyle = '#1a120c'; x.fillRect(0, gy, W, H); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  [[W * 0.22, 0.7, 0.0], [W * 0.55, 1.0, 0.15], [W * 0.84, 0.6, 0.3]].forEach(([x, s, at]) => { const a = ease.out(clamp((k - at) * 4)); if (a <= 0) return; g.globalAlpha = a; headframe(g, x, gy + (1 - a) * 80, s, '#120c08'); });
  g.globalAlpha = 1; const gl = g.createRadialGradient(W * 0.55, gy - 200, 20, W * 0.55, gy - 200, 420); gl.addColorStop(0, rgba(ACCENT, 0.25)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  fadeBottom(g);
};
