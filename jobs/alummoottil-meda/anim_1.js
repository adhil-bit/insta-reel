function tharavad(g, x, base, s, col, lit, t) { g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = col; g.fillRect(-320, -230, 640, 230);
  g.beginPath(); g.moveTo(-390, -220); g.lineTo(-280, -380); g.lineTo(280, -380); g.lineTo(390, -220); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-180, -380); g.lineTo(0, -480); g.lineTo(180, -380); g.fill();
  for (let i = 0; i < 6; i++) { g.fillStyle = col; g.fillRect(-300 + i * 120, -230, 22, 230); }
  if (lit) for (let i = 0; i < 4; i++) { const f = 0.75 + 0.25 * Math.sin(t * 3 + i); g.fillStyle = `rgba(255,190,100,${0.8 * f * lit})`; g.fillRect(-250 + i * 140, -170, 50, 70); }
  g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), push = 1 + 0.06 * k;
  SK.sky(g, 'sunset', 0.62); SK.sun(g, W * 0.7, H * 0.5, 90, '#ffd8a0', 0.5); SK.birds(g, t, 4, 0.2);
  g.save(); g.translate(W / 2, H * 0.6); g.scale(push, push); g.translate(-W / 2, -H * 0.6);
  SK.palm(g, W * 0.08, H * 0.64, 520, 50, SK.ink, t); SK.palm(g, W * 0.92, H * 0.64, 480, -40, SK.ink, t);
  tharavad(g, W * 0.5, H * 0.62, 1.15, '#140c10', 0.6, t); g.restore();
  g.fillStyle = '#120a0e'; g.fillRect(0, H * 0.62, W, H); g.fillStyle = 'rgba(80,120,160,0.35)'; g.beginPath(); g.ellipse(W * 0.5, H * 0.7, 300, 40, 0, 0, 6.283); g.fill();
  SK.grain(g, t, 0.07); };
