function tharavad(g, x, base, s, col, lit, t) { g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = col; g.fillRect(-320, -230, 640, 230);
  g.beginPath(); g.moveTo(-390, -220); g.lineTo(-280, -380); g.lineTo(280, -380); g.lineTo(390, -220); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-180, -380); g.lineTo(0, -480); g.lineTo(180, -380); g.fill();
  for (let i = 0; i < 6; i++) { g.fillStyle = col; g.fillRect(-300 + i * 120, -230, 22, 230); }
  if (lit) for (let i = 0; i < 4; i++) { const f = 0.75 + 0.25 * Math.sin(t * 3 + i); g.fillStyle = `rgba(255,190,100,${0.8 * f * lit})`; g.fillRect(-250 + i * 140, -170, 50, 70); }
  g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), win = Math.sin(t * 3) > 0.2 ? 1 : 0.15;
  SK.sky(g, 'night', 0.62); SK.sun(g, W * 0.78, H * 0.16, 50, '#f4f0e0', 0.3); tharavad(g, W * 0.5, H * 0.6, 1.1, '#08080c', 0, t);
  g.fillStyle = `rgba(255,190,100,${0.85 * win})`; g.fillRect(W * 0.5 + 3, H * 0.6 - 190, 55, 77);
  g.fillStyle = '#050508'; g.fillRect(0, H * 0.6, W, H);
  for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(190,200,230,0.12)'; g.beginPath(); g.ellipse(W * (i % 3) * 0.45 + Math.sin(t * 0.3 + i) * 60, H * (0.56 + (i % 4) * 0.02), 520, 70, 0, 0, 6.283); g.fill(); }
  for (let r = 0; r < 3; r++) { const q = (t * 0.7 + r / 3) % 1; g.strokeStyle = `rgba(255,90,80,${0.5 * (1 - q)})`; g.lineWidth = 4; g.beginPath(); g.arc(W * 0.53, H * 0.6 - 150, 40 + q * 260, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
  SK.person(g, lerp(W * 0.2, W * 0.05, ease.inOut(k)), H * 0.72, 300, 'stand', '#020204', t * 3); SK.grain(g, t, 0.08); };
