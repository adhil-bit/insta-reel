function palmLeaf(g, x, y, w, h, t, glow = 0) { g.fillStyle = '#c9a25a'; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, h / 2); g.fill(); g.fillStyle = '#8a6a34'; g.beginPath(); g.arc(x - w * 0.3, y, 6, 0, 6.283); g.arc(x + w * 0.3, y, 6, 0, 6.283); g.fill();
  if (glow > 0) { g.fillStyle = `rgba(255,236,180,${glow})`; for (let i = 0; i < 3; i++) g.fillRect(x - w * 0.42, y - h * 0.28 + i * h * 0.24, w * (0.84 - i * 0.1), 4); } }
function scholar(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = SK.ink; g.beginPath(); g.arc(0, -210, 30, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(-60, -180); g.quadraticCurveTo(0, -200, 60, -180); g.lineTo(110, 0); g.lineTo(-110, 0); g.fill(); g.strokeStyle = SK.ink; g.lineWidth = 14; g.beginPath(); g.moveTo(30, -150); g.lineTo(110, -90 + Math.sin(t * 3) * 6); g.stroke(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d'); const stars = Array.from({length: 90}, () => [rand(), rand() * 0.55, rand()]);
window.renderFrame = function (t) { const k = clamp(t / DURATION), inf = ease.inOut(clamp((k - 0.35) / 0.45));
  SK.sky(g, 'night', 0.66); for (const [x, y, z] of stars) { g.fillStyle = `rgba(255,255,255,${0.3 + 0.5 * z})`; g.fillRect(x * W, y * H, 2, 2); }
  g.save(); g.translate(W / 2, H * 0.3); g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 6; g.shadowColor = ACCENT; g.shadowBlur = 24; g.beginPath();
  for (let a = 0; a <= 6.283 * inf; a += 0.04) { const x = 260 * Math.cos(a) / (1 + Math.sin(a) ** 2), y = 260 * Math.sin(a) * Math.cos(a) / (1 + Math.sin(a) ** 2); a ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore();
  g.fillStyle = '#0c0a08'; g.fillRect(0, H * 0.66, W, H); SK.lamp(g, W * 0.72, H * 0.66, 0.9, t); scholar(g, W * 0.45, H * 0.67, 1.1, t); palmLeaf(g, W * 0.58, H * 0.63, 200, 30, t, 0.5 * inf);
  SK.grain(g, t, 0.07); };
