const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), q = ease.out(clamp((k - 0.2) / 0.3));
  SK.sky(g, 'dusk', 0.66); g.fillStyle = '#140c14'; g.fillRect(0, H * 0.66, W, H);
  for (let i = 0; i < 6; i++) { const x = W * (0.12 + i * 0.15); SK.person(g, x, H * 0.68, 280 + (i % 2) * 30, 'stand', '#0a0608', t + i); g.fillStyle = '#efe4c8'; g.fillRect(x - 30, H * 0.68 - 200, 60, 44); }
  g.save(); g.globalAlpha = q; g.translate(W / 2, H * 0.36); g.scale(q, q); g.strokeStyle = ACCENT; g.lineWidth = 34; g.lineCap = 'round'; g.shadowColor = ACCENT; g.shadowBlur = 30;
  g.beginPath(); g.arc(0, -60, 90, Math.PI * 1.1, Math.PI * 0.35); g.lineTo(0, 60); g.stroke(); g.beginPath(); g.arc(0, 140, 16, 0, 6.283); g.fillStyle = ACCENT; g.fill(); g.restore();
  SK.grain(g, t, 0.07); };
