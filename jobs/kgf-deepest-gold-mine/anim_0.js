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
const gy = H * 0.22;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, gy); s.addColorStop(0, '#1a1a30'); s.addColorStop(1, '#c87a4a'); x.fillStyle = s; x.fillRect(0, 0, W, gy);
  const e = x.createLinearGradient(0, gy, 0, H * 0.75); e.addColorStop(0, '#5a3a24'); e.addColorStop(0.5, '#2a1a10'); e.addColorStop(1, '#050303'); x.fillStyle = e; x.fillRect(0, gy, W, H);
  for (let i = 0; i < 9; i++) { x.strokeStyle = 'rgba(0,0,0,0.25)'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, gy + 60 + i * 90); x.bezierCurveTo(W * 0.3, gy + 40 + i * 90, W * 0.7, gy + 100 + i * 90, W, gy + 70 + i * 90); x.stroke(); }
  headframe(x, W / 2, gy, 0.55, '#1a1210');
  x.fillStyle = '#0a0604'; x.fillRect(W / 2 - 26, gy, 52, H); });
const veins = Array.from({length: 7}, () => { const y = gy + 120 + rand() * 900, pts = []; let x = rand() < 0.5 ? 0 : W, d = x ? -1 : 1; for (let i = 0; i < 12; i++) { pts.push([x, y + Math.sin(i) * 20 + (rand() - 0.5) * 30]); x += d * 40; } return pts; });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), cage = lerp(gy + 20, gy + 1050, ease.inOut(k));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const v of veins) { g.strokeStyle = rgba(ACCENT, 0.6 + 0.3 * Math.sin(t * 3 + v[0][1])); g.lineWidth = 8; g.shadowColor = ACCENT; g.shadowBlur = 20;
    g.beginPath(); g.moveTo(...v[0]); for (const p of v) g.lineTo(...p); g.stroke(); g.shadowBlur = 0; }
  g.strokeStyle = '#888'; g.lineWidth = 2; g.beginPath(); g.moveTo(W / 2, gy); g.lineTo(W / 2, cage); g.stroke();
  g.fillStyle = '#c8a050'; g.fillRect(W / 2 - 22, cage, 44, 50); g.fillStyle = '#ffe9a8'; g.beginPath(); g.arc(W / 2, cage + 25, 8, 0, 6.283); g.fill();
  const lg = g.createRadialGradient(W / 2, cage + 25, 4, W / 2, cage + 25, 140); lg.addColorStop(0, 'rgba(255,230,160,0.4)'); lg.addColorStop(1, 'rgba(255,230,160,0)'); g.fillStyle = lg; g.fillRect(W / 2 - 140, cage - 115, 280, 280);
  fadeBottom(g);
};
