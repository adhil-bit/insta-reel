function tharavad(g, x, base, s, col, lit, t) { g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = col; g.fillRect(-320, -230, 640, 230);
  g.beginPath(); g.moveTo(-390, -220); g.lineTo(-280, -380); g.lineTo(280, -380); g.lineTo(390, -220); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-180, -380); g.lineTo(0, -480); g.lineTo(180, -380); g.fill();
  for (let i = 0; i < 6; i++) { g.fillStyle = col; g.fillRect(-300 + i * 120, -230, 22, 230); }
  if (lit) for (let i = 0; i < 4; i++) { const f = 0.75 + 0.25 * Math.sin(t * 3 + i); g.fillStyle = `rgba(255,190,100,${0.8 * f * lit})`; g.fillRect(-250 + i * 140, -170, 50, 70); }
  g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), fall = ease.in(clamp((k - 0.55) / 0.2)), dark = clamp((k - 0.62) / 0.3);
  g.fillStyle = '#100a08'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#c9a25a'; g.beginPath(); g.roundRect(W * 0.18, H * 0.34, W * 0.64, 70, 35); g.fill(); g.fillStyle = '#5a3a1a'; for (let i = 0; i < 3; i++) g.fillRect(W * 0.24, H * 0.34 + 18 + i * 16, W * (0.5 - i * 0.08), 6);
  if (k > 0.25) { g.strokeStyle = '#b02a2a'; g.lineWidth = 6; g.beginPath(); g.moveTo(W * 0.62, H * 0.34 + 58); g.quadraticCurveTo(W * 0.68, H * 0.34 + 30, W * 0.74, H * 0.34 + 56); g.stroke(); }
  g.save(); g.translate(W * 0.5, H * 0.62); g.rotate(fall * 1.4); SK.lamp(g, 0, 0, 1.1, t); g.restore();
  g.fillStyle = `rgba(0,0,0,${0.85 * dark})`; g.fillRect(0, 0, W, H);
  if (k > 0.7) SK.person(g, W * 0.22, H * 0.7, 360, 'stand', `rgba(20,10,8,${dark})`, t);
  SK.grain(g, t, 0.08); };
