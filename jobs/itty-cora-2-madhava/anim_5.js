function palmLeaf(g, x, y, w, h, t, glow = 0) { g.fillStyle = '#c9a25a'; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, h / 2); g.fill(); g.fillStyle = '#8a6a34'; g.beginPath(); g.arc(x - w * 0.3, y, 6, 0, 6.283); g.arc(x + w * 0.3, y, 6, 0, 6.283); g.fill();
  if (glow > 0) { g.fillStyle = `rgba(255,236,180,${glow})`; for (let i = 0; i < 3; i++) g.fillRect(x - w * 0.42, y - h * 0.28 + i * h * 0.24, w * (0.84 - i * 0.1), 4); } }
function scholar(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = SK.ink; g.beginPath(); g.arc(0, -210, 30, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(-60, -180); g.quadraticCurveTo(0, -200, 60, -180); g.lineTo(110, 0); g.lineTo(-110, 0); g.fill(); g.strokeStyle = SK.ink; g.lineWidth = 14; g.beginPath(); g.moveTo(30, -150); g.lineTo(110, -90 + Math.sin(t * 3) * 6); g.stroke(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d'); const stars = Array.from({length: 120}, () => [rand(), rand() * 0.6, rand()]);
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'night', 0.68); for (const [x, y, z] of stars) { g.fillStyle = `rgba(255,255,255,${0.3 + 0.5 * z})`; g.fillRect(x * W, y * H, 2, 2); }
  const cx = W / 2, cy = H * 0.3; g.strokeStyle = 'rgba(255,255,255,0.15)'; g.lineWidth = 2; for (const r of [120, 190, 260]) { g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.stroke(); }
  SK.sun(g, cx, cy, 34, '#ffd27a', 0.6); [[120, '#c8a070', 1.2], [190, '#d86a4a', 0.8], [260, '#e8c890', 0.5]].forEach(([r, col, sp]) => { const a = t * sp; g.fillStyle = col; g.beginPath(); g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 14, 0, 6.283); g.fill(); });
  g.fillStyle = '#0a0806'; g.fillRect(0, H * 0.68, W, H); for (let i = 0; i < 3; i++) { const x = W * (0.3 + i * 0.2); SK.person(g, x, H * 0.7, 300, i === 1 ? 'arm_up' : 'stand', '#0a0806', t + i); }
  SK.grain(g, t, 0.07); };
