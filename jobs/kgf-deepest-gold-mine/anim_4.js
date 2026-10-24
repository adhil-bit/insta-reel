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
const cx = W / 2, cy = H * 0.36;
const bg = layer(x => { x.fillStyle = '#050302'; x.fillRect(0, 0, W, H);
  for (let i = 12; i > 0; i--) { const s = i / 12; x.fillStyle = `rgb(${30 + 30 * s},${18 + 14 * s},${10 + 6 * s})`; x.beginPath(); x.ellipse(cx, cy, 520 * s, 420 * s, 0, 0, 6.283); x.fill(); }
  x.fillStyle = '#050302'; x.beginPath(); x.ellipse(cx, cy, 60, 48, 0, 0, 6.283); x.fill(); });
const miners = Array.from({length: 5}, (_, i) => ({d: i / 5, side: (i % 2 ? 1 : -1) * (0.3 + 0.1 * i)}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const heat = g.createRadialGradient(cx, cy, 10, cx, cy, 420); heat.addColorStop(0, `rgba(255,80,30,${0.25 + 0.1 * Math.sin(t * 3)})`); heat.addColorStop(1, 'rgba(255,80,30,0)'); g.fillStyle = heat; g.fillRect(0, 0, W, H);
  for (const m of miners) { const z = (m.d + t * 0.08) % 1, s = lerp(0.1, 1.3, z), x = cx + m.side * 420 * z, y = cy + 260 * z + Math.sin(t * 6 + m.d * 9) * 6 * s;
    const lg = g.createRadialGradient(x, y - 60 * s, 2, x, y - 60 * s, 160 * s); lg.addColorStop(0, 'rgba(255,240,190,0.75)'); lg.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = lg; g.beginPath(); g.arc(x, y - 60 * s, 160 * s, 0, 6.283); g.fill();
    g.fillStyle = '#0c0806'; g.beginPath(); g.arc(x, y - 60 * s, 26 * s, 0, 6.283); g.fill(); g.fillRect(x - 30 * s, y - 34 * s, 60 * s, 100 * s);
    g.fillStyle = '#fff4c8'; g.beginPath(); g.arc(x, y - 72 * s, 7 * s, 0, 6.283); g.fill(); }
  for (let i = 0; i < 30; i++) { const ph = (t * 0.4 + i * 0.033) % 1; g.fillStyle = `rgba(255,160,90,${0.5 * (1 - ph)})`; g.fillRect(cx + Math.sin(i * 7) * 400, cy + 300 - ph * 500, 3, 3); }
  fadeBottom(g);
};
