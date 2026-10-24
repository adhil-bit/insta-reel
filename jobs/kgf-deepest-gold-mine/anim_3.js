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
const gy = H * 0.5;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, gy); s.addColorStop(0, '#060814'); s.addColorStop(1, '#1e2436'); x.fillStyle = s; x.fillRect(0, 0, W, H); x.fillStyle = '#0e0c0a'; x.fillRect(0, gy, W, H);
  x.fillStyle = '#2a3a3a'; x.beginPath(); x.moveTo(0, gy); x.lineTo(0, gy - 360); x.lineTo(220, gy - 300); x.lineTo(260, gy); x.fill();
  x.fillStyle = '#3a3a44'; x.fillRect(240, gy - 110, 130, 110); });
const towers = [420, 600, 780];
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), on = ease.inOut(clamp((k - 0.3) / 0.5));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (let i = 0; i < 40; i++) { const ph = (t * 1.5 + i * 0.13) % 1; g.strokeStyle = `rgba(200,230,255,${0.6 * (1 - ph)})`; g.lineWidth = 4; g.beginPath(); g.moveTo(150 + (i % 8) * 10, gy - 330 + ph * 330); g.lineTo(150 + (i % 8) * 10, gy - 300 + ph * 330); g.stroke(); }
  for (const x of towers) { g.strokeStyle = '#4a4a54'; g.lineWidth = 6; g.beginPath(); g.moveTo(x - 30, gy); g.lineTo(x, gy - 240); g.lineTo(x + 30, gy); g.moveTo(x - 40, gy - 220); g.lineTo(x + 40, gy - 220); g.stroke(); }
  const pts = [[370, gy - 100], ...towers.map(x => [x, gy - 220]), [W - 60, gy - 160]];
  g.strokeStyle = '#6a6a74'; g.lineWidth = 3; g.beginPath(); g.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) g.quadraticCurveTo((pts[i - 1][0] + pts[i][0]) / 2, Math.max(pts[i - 1][1], pts[i][1]) + 40, ...pts[i]); g.stroke();
  for (let j = 0; j < 4; j++) { const u = ((t * 0.5 + j / 4) % 1) * clamp(k * 3); const seg = Math.min(pts.length - 2, Math.floor(u * (pts.length - 1))), f = u * (pts.length - 1) - seg;
    const x = lerp(pts[seg][0], pts[seg + 1][0], f), y = lerp(pts[seg][1], pts[seg + 1][1], f) + Math.sin(f * Math.PI) * 40; g.fillStyle = ACCENT; g.shadowColor = ACCENT; g.shadowBlur = 20; g.beginPath(); g.arc(x, y, 9, 0, 6.283); g.fill(); g.shadowBlur = 0; }
  for (let i = 0; i < 14; i++) { const x = 700 + (i % 7) * 50, y = gy - 40 - Math.floor(i / 7) * 46; g.fillStyle = '#16141a'; g.fillRect(x, y, 40, 40);
    if (i / 14 < on) { g.fillStyle = 'rgba(255,220,140,0.95)'; g.fillRect(x + 12, y + 10, 16, 16); const gl = g.createRadialGradient(x + 20, y + 18, 2, x + 20, y + 18, 50); gl.addColorStop(0, 'rgba(255,220,140,0.4)'); gl.addColorStop(1, 'rgba(255,220,140,0)'); g.fillStyle = gl; g.fillRect(x - 30, y - 32, 100, 100); } }
  fadeBottom(g);
};
