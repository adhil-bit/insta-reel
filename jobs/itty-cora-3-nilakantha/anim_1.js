function palmLeaf(g, x, y, w, h, t, glow = 0) { g.fillStyle = '#c9a25a'; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, h / 2); g.fill(); g.fillStyle = '#8a6a34'; g.beginPath(); g.arc(x - w * 0.3, y, 6, 0, 6.283); g.arc(x + w * 0.3, y, 6, 0, 6.283); g.fill();
  if (glow > 0) { g.fillStyle = `rgba(255,236,180,${glow})`; for (let i = 0; i < 3; i++) g.fillRect(x - w * 0.42, y - h * 0.28 + i * h * 0.24, w * (0.84 - i * 0.1), 4); } }
function scholar(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = SK.ink; g.beginPath(); g.arc(0, -210, 30, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(-60, -180); g.quadraticCurveTo(0, -200, 60, -180); g.lineTo(110, 0); g.lineTo(-110, 0); g.fill(); g.strokeStyle = SK.ink; g.lineWidth = 14; g.beginPath(); g.moveTo(30, -150); g.lineTo(110, -90 + Math.sin(t * 3) * 6); g.stroke(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'dusk', 0.64); SK.sun(g, W * 0.3, H * 0.55, 90, '#ffd8a0', 0.5); g.fillStyle = '#1a1018'; g.fillRect(0, H * 0.64, W, H);
  SK.gopuram(g, W * 0.78, H * 0.65, 0.7, '#120a10', 0.35); SK.palm(g, W * 0.12, H * 0.66, 420, 40, SK.ink, t);
  scholar(g, W * 0.42, H * 0.67, 1.2, t); palmLeaf(g, W * 0.56, H * 0.63, 220, 32, t, 0.7 * clamp(k * 2)); SK.lamp(g, W * 0.62, H * 0.66, 0.7, t);
  SK.grain(g, t, 0.07); };
