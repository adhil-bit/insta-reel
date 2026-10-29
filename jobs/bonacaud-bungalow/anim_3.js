const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), shake = Math.sin(t * 5);
  SK.sky(g, 'day', 0.6); SK.ground(g, H * 0.62, '#5a6a4a', '#2a3424');
  for (let i = 0; i < 5; i++) { const x = W * (0.14 + i * 0.18); g.save(); g.translate(x, H * 0.66); SK.person(g, 0, 0, 260, 'stand', '#14140e', t + i); g.restore();
    const hx = x + Math.sin(t * 5 + i) * 8, hy = H * 0.66 - 250; g.fillStyle = '#14140e'; g.beginPath(); g.arc(hx, hy + 20, 0, 0, 6.283); g.fill(); }
  g.save(); g.translate(W * 0.5, H * 0.32); g.rotate(-0.06); g.fillStyle = '#f2ede0'; g.fillRect(-220, -160, 440, 300); g.fillStyle = '#2a2a3a'; g.font = '800 34px Inter'; g.textAlign = 'center'; g.fillText('FACT CHECK', 0, -100);
  for (let i = 0; i < 3; i++) { g.fillStyle = '#8a8a9a'; g.fillRect(-170, -60 + i * 60, 260, 12); if (k > 0.25 + i * 0.15) { g.strokeStyle = '#c0392b'; g.lineWidth = 10; g.beginPath(); g.moveTo(120, -70 + i * 60); g.lineTo(170, -30 + i * 60); g.moveTo(170, -70 + i * 60); g.lineTo(120, -30 + i * 60); g.stroke(); } } g.restore();
  SK.grain(g, t, 0.05); };
