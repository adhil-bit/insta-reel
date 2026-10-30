const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), st = ease.out(clamp((k - 0.45) / 0.15));
  g.fillStyle = '#16100a'; g.fillRect(0, 0, W, H); SK.lamp(g, W * 0.85, H * 0.6, 0.8, t);
  g.save(); g.translate(W * 0.46, H * 0.44); g.rotate(-0.04); g.fillStyle = '#e8dcc0'; g.fillRect(-260, -300, 520, 600); g.fillStyle = '#c9b48a'; g.fillRect(-260, -300, 520, 30); g.fillRect(-260, 270, 520, 30);
  g.fillStyle = '#3a2a1a'; g.font = '800 40px Inter, serif'; g.textAlign = 'center'; g.fillText('THE OFFICIAL', 0, -200); g.fillText('SECRETS ACT', 0, -150); g.font = '700 34px Inter, serif'; g.fillText('1923', 0, -95);
  g.fillStyle = '#7a6a54'; for (let i = 0; i < 8; i++) g.fillRect(-200, -40 + i * 34, 400 - (i * 37) % 90, 8);
  g.fillStyle = '#9a1a1a'; g.beginPath(); g.arc(150, 220, 46, 0, 6.283); g.fill(); g.restore();
  if (st > 0) { g.save(); g.translate(W * 0.47, H * 0.58); g.rotate(-0.15); g.scale(1.3 - 0.4 * st, 1.3 - 0.4 * st); g.globalAlpha = st; g.strokeStyle = '#c0392b'; g.lineWidth = 10; g.strokeRect(-230, -55, 460, 110); g.fillStyle = '#c0392b'; g.font = '800 60px Inter'; g.textAlign = 'center'; g.fillText('STILL IN FORCE', 0, 22); g.restore(); }
  SK.grain(g, t, 0.07); };
