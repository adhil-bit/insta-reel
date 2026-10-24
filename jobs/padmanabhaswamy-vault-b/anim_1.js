const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function gopuram(x, cx, base, s, col) {           // stepped temple tower silhouette
  x.save(); x.translate(cx, base); x.scale(s, s); x.fillStyle = col;
  const tiers = 7; for (let i = 0; i < tiers; i++) { const w = 300 - i * 34, h = 50; x.fillRect(-w / 2, -(i + 1) * h, w, h + 1);
    x.fillRect(-w / 2 - 10, -(i + 1) * h, w + 20, 8); }
  x.beginPath(); x.moveTo(-70, -tiers * 50); x.quadraticCurveTo(0, -tiers * 50 - 90, 70, -tiers * 50); x.fill();
  for (let i = -2; i <= 2; i++) { x.beginPath(); x.arc(i * 28, -tiers * 50 - 40 - (2 - Math.abs(i)) * 12, 7, 0, 6.283); x.fill(); }
  x.restore();
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
function sparkle(g, x, y, r, a) { g.fillStyle = `rgba(255,240,200,${a})`; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r * 0.25, y - r * 0.25); g.lineTo(x + r, y); g.lineTo(x + r * 0.25, y + r * 0.25);
  g.lineTo(x, y + r); g.lineTo(x - r * 0.25, y + r * 0.25); g.lineTo(x - r, y); g.lineTo(x - r * 0.25, y - r * 0.25); g.fill(); }
const c = makeCanvas(), g = c.getContext('2d');
const ground = H * 0.3;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, ground); s.addColorStop(0, '#08080f'); s.addColorStop(1, '#1e1824'); x.fillStyle = s; x.fillRect(0, 0, W, ground);
  const bl = x.createRadialGradient(W / 2, ground - 250, 20, W / 2, ground - 250, 520); bl.addColorStop(0, 'rgba(255,170,110,0.45)'); bl.addColorStop(1, 'rgba(255,170,110,0)');
  x.fillStyle = bl; x.fillRect(0, 0, W, ground);
  gopuram(x, W / 2, ground, 0.72, '#0d0c12');
  const e = x.createLinearGradient(0, ground, 0, H * 0.75); e.addColorStop(0, '#2e2418'); e.addColorStop(1, '#05040a'); x.fillStyle = e; x.fillRect(0, ground, W, H); });
const rooms = [[W * 0.18, H * 0.38], [W * 0.4, H * 0.38], [W * 0.62, H * 0.38], [W * 0.84, H * 0.38], [W * 0.29, H * 0.5], [W * 0.73, H * 0.5]];
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  rooms.forEach(([x, y], i) => { const a = ease.out(clamp(k * 3 - i * 0.25)); if (a <= 0) return; const isB = i === 1;
    g.globalAlpha = a; g.fillStyle = isB ? '#3a2a1a' : '#1a1612'; g.fillRect(x - 90, y - 55, 180, 110);
    g.strokeStyle = isB ? ACCENT : 'rgba(200,180,140,0.5)'; g.lineWidth = isB ? 6 : 3; g.strokeRect(x - 90, y - 55, 180, 110);
    if (!isB) { g.fillStyle = 'rgba(255,200,110,0.35)'; g.fillRect(x - 70, y + 20, 140, 18); } });
  g.globalAlpha = 1;
  if (k > 0.55) { const [x, y] = rooms[1], p = (t * 0.8) % 1, a = clamp((k - 0.55) * 4);
    g.strokeStyle = rgba(ACCENT, a * (1 - p)); g.lineWidth = 5; g.strokeRect(x - 90 - p * 40, y - 55 - p * 30, 180 + p * 80, 110 + p * 60); }
  fadeBottom(g);
};
