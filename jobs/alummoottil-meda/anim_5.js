function tharavad(g, x, base, s, col, lit, t) { g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = col; g.fillRect(-320, -230, 640, 230);
  g.beginPath(); g.moveTo(-390, -220); g.lineTo(-280, -380); g.lineTo(280, -380); g.lineTo(390, -220); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-180, -380); g.lineTo(0, -480); g.lineTo(180, -380); g.fill();
  for (let i = 0; i < 6; i++) { g.fillStyle = col; g.fillRect(-300 + i * 120, -230, 22, 230); }
  if (lit) for (let i = 0; i < 4; i++) { const f = 0.75 + 0.25 * Math.sin(t * 3 + i); g.fillStyle = `rgba(255,190,100,${0.8 * f * lit})`; g.fillRect(-250 + i * 140, -170, 50, 70); }
  g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), q = ease.out(clamp((k - 0.7) / 0.2));
  SK.sky(g, 'dawn', 0.62); SK.sun(g, W * 0.3, H * 0.55, 80, '#ffd8a0', 0.5); tharavad(g, W * 0.5, H * 0.62, 1.1, '#1a1216', 0.3, t);
  g.strokeStyle = '#c8a46a'; g.lineWidth = 6; for (let i = 0; i < 6; i++) { const x = W * (0.16 + i * 0.136); g.beginPath(); g.moveTo(x, H * 0.62); g.lineTo(x, H * 0.62 - 520); g.stroke(); } for (let j = 0; j < 5; j++) { g.beginPath(); g.moveTo(W * 0.16, H * 0.62 - j * 110); g.lineTo(W * 0.84, H * 0.62 - j * 110); g.stroke(); }
  g.fillStyle = '#120a0e'; g.fillRect(0, H * 0.62, W, H); SK.palm(g, W * 0.06, H * 0.64, 480, 40, SK.ink, t);
  if (q > 0) { g.fillStyle = rgba(ACCENT, q); g.beginPath(); g.roundRect(W / 2 - 150, H * 0.16, 300, 120, 30); g.fill(); g.beginPath(); g.moveTo(W / 2 - 60, H * 0.16 + 116); g.lineTo(W / 2 - 90, H * 0.16 + 170); g.lineTo(W / 2 - 10, H * 0.16 + 116); g.fill(); g.fillStyle = '#120a0e'; for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(W / 2 - 70 + j * 70, H * 0.16 + 60, 14, 0, 6.283); g.fill(); } }
  SK.grain(g, t, 0.07); };
