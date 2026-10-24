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
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), depth = ease.inOut(k) * 3000, pxPerM = 1.2, off = depth * pxPerM;
  const heat = clamp(depth / 3000);
  g.globalAlpha = 1; const bgc = g.createLinearGradient(0, 0, 0, H); bgc.addColorStop(0, `rgb(${40 + 60 * heat},${26 + 10 * heat},${16})`); bgc.addColorStop(1, '#050303'); g.fillStyle = bgc; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) { const y = ((i * 97 - off * 0.6) % (H + 200) + H + 200) % (H + 200) - 100; g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y + 30); g.stroke(); }
  g.fillStyle = '#0a0604'; g.fillRect(W / 2 - 60, 0, 120, H);
  for (let m = 0; m <= 3000; m += 250) { const y = H * 0.3 + (m - depth) * pxPerM * 1.2; if (y < -40 || y > H) continue;
    g.strokeStyle = m % 1000 ? 'rgba(220,200,160,0.5)' : ACCENT; g.lineWidth = m % 1000 ? 3 : 6; g.beginPath(); g.moveTo(W / 2 + 70, y); g.lineTo(W / 2 + (m % 1000 ? 140 : 220), y); g.stroke();
    if (m % 1000 === 0) { g.fillStyle = ACCENT; for (let j = 0; j < m / 1000; j++) { g.beginPath(); g.arc(W / 2 + 250 + j * 34, y, 11, 0, 6.283); g.fill(); } } }
  g.fillStyle = '#c8a050'; g.fillRect(W / 2 - 30, H * 0.3 - 30, 60, 60); g.fillStyle = '#ffe9a8'; g.beginPath(); g.arc(W / 2, H * 0.3, 10, 0, 6.283); g.fill();
  const hg = g.createRadialGradient(W / 2, H * 0.55, 20, W / 2, H * 0.55, 600); hg.addColorStop(0, `rgba(255,90,40,${0.35 * heat})`); hg.addColorStop(1, 'rgba(255,90,40,0)'); g.fillStyle = hg; g.fillRect(0, 0, W, H);
  fadeBottom(g);
};
