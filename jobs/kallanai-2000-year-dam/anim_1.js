const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function palm(g2, x, base, h, lean, color) { g2.strokeStyle = color; g2.lineWidth = 10; g2.lineCap = 'round'; const tx = x + lean, ty = base - h;
  g2.beginPath(); g2.moveTo(x, base); g2.quadraticCurveTo(x + lean * 0.2, base - h * 0.5, tx, ty); g2.stroke(); g2.lineWidth = 6;
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42, L = 100 + (i % 2) * 24; g2.beginPath(); g2.moveTo(tx, ty); g2.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 16, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 40); g2.stroke(); } }
function stonesRow(g, x0, x1, y, h, t, col) { for (let x = x0, i = 0; x < x1; x += 44, i++) { g.fillStyle = i % 2 ? col : '#6a6458'; g.beginPath(); g.roundRect(x, y - h + (i % 3) * 4, 46, h, 10); g.fill(); } }
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { x.fillStyle = '#5a6a3a'; x.fillRect(0, 0, W, H); for (let i = 0; i < 200; i++) { x.fillStyle = `rgba(${60 + rand() * 40},${90 + rand() * 40},50,0.5)`; x.fillRect(rand() * W, rand() * H, 60, 40); } });
const river = u => [lerp(-60, W + 60, u), H * 0.34 + Math.sin(u * 5) * 80];
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.strokeStyle = '#3a7ab8'; g.lineWidth = 70; g.lineCap = 'round'; g.beginPath(); for (let u = 0; u <= 1; u += 0.02) { const [x, y] = river(u); u ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  g.strokeStyle = 'rgba(230,245,255,0.5)'; g.lineWidth = 4; for (let i = 0; i < 20; i++) { const u = ((t * 0.08 + i / 20) % 1), [x, y] = river(u); g.beginPath(); g.moveTo(x - 20, y); g.lineTo(x + 20, y); g.stroke(); }
  const [dx, dy] = river(0.45); g.fillStyle = '#8a8070'; g.save(); g.translate(dx, dy); g.rotate(0.3); g.fillRect(-12, -50, 24, 100); g.restore();
  const pin = ease.out(clamp(k * 2)), py = lerp(H * 0.05, dy - 50, pin);
  g.fillStyle = ACCENT; g.beginPath(); g.arc(dx, py - 50, 38, Math.PI, 0); g.lineTo(dx, py); g.closePath(); g.fill(); g.fillStyle = '#0c1a2a'; g.beginPath(); g.arc(dx, py - 50, 14, 0, 6.283); g.fill();
  if (pin >= 1) { const p = (t * 0.8) % 1; g.strokeStyle = rgba(ACCENT, 1 - p); g.lineWidth = 5; g.beginPath(); g.arc(dx, dy, 40 + p * 160, 0, 6.283); g.stroke(); }
  fadeBottom(g);
};
