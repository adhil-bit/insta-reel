const PL = [['#c8b8a0', 70, 2.2, 9], ['#f0d8a0', 110, 1.5, 12], ['#d86a4a', 160, 1.0, 11], ['#e8c890', 220, 0.6, 18], ['#d8c088', 280, 0.4, 15]];
function stars(g, n = 120) { for (let i = 0; i < n; i++) { g.fillStyle = `rgba(255,255,255,${0.25 + 0.5 * ((i * 37) % 10) / 10})`; g.fillRect((i * 173) % W, (i * 97) % (H * 0.7), 2, 2); } }
function tycho(g, cx, cy, t, scale = 1, showSun = 1, k = 1) {   // Earth centre; Sun orbits Earth; planets orbit the Sun
  g.save(); g.translate(cx, cy); g.scale(scale, scale);
  const sa = t * 0.35, sx = Math.cos(sa) * 330, sy = Math.sin(sa) * 330;
  g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 330, 0, 6.283); g.stroke();
  PL.forEach(([col, r, sp, sz], i) => { if (k < i * 0.15) return; g.strokeStyle = rgba(col, 0.35); g.beginPath(); g.arc(sx, sy, r, 0, 6.283); g.stroke();
    const a = t * sp + i; g.fillStyle = col; g.beginPath(); g.arc(sx + Math.cos(a) * r, sy + Math.sin(a) * r, sz, 0, 6.283); g.fill(); });
  if (showSun) SK.sun(g, sx, sy, 34, '#ffd27a', 0.6);
  g.fillStyle = '#3a8ad8'; g.beginPath(); g.arc(0, 0, 26, 0, 6.283); g.fill(); g.fillStyle = '#4aa84a'; g.beginPath(); g.arc(-6, -4, 12, 0, 6.283); g.fill(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION); g.fillStyle = '#070a14'; g.fillRect(0, 0, W, H); stars(g, 160);
  tycho(g, W / 2, H * 0.44, t * 1.4, 1.1, 1, ease.out(clamp(k * 1.3))); SK.grain(g, t, 0.05); };
