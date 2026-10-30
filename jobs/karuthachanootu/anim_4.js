const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), st = ease.out(clamp((k - 0.55) / 0.15));
  SK.sky(g, 'night', 0.62); g.fillStyle = '#0c0a10'; g.fillRect(0, H * 0.62, W, H);
  g.fillStyle = '#18141e'; g.fillRect(W * 0.2, H * 0.3, W * 0.6, H * 0.32); g.beginPath(); g.moveTo(W * 0.16, H * 0.31); g.lineTo(W * 0.5, H * 0.22); g.lineTo(W * 0.84, H * 0.31); g.fill();
  g.fillStyle = '#0a080c'; for (let i = 0; i < 4; i++) { g.fillRect(W * (0.25 + i * 0.13), H * 0.38, 70, 110); g.strokeStyle = '#2a2430'; g.lineWidth = 4; for (let s = 0; s < 5; s++) { g.beginPath(); g.moveTo(W * (0.25 + i * 0.13), H * 0.38 + s * 22); g.lineTo(W * (0.25 + i * 0.13) + 70, H * 0.38 + s * 22); g.stroke(); } }
  g.fillStyle = '#0a080c'; g.fillRect(W * 0.45, H * 0.5, 100, H * 0.12);
  for (let i = 0; i < 5; i++) { const u = (t * 0.25 + i / 5) % 1; g.fillStyle = `rgba(239,228,200,${0.5 * (1 - u)})`; g.font = '800 70px Inter'; g.textAlign = 'center'; g.fillText('?', W * (0.15 + i * 0.18), H * (0.25 - u * 0.1)); }
  if (st > 0) { g.save(); g.translate(W / 2, H * 0.72); g.rotate(-0.1); g.scale(1.4 - 0.4 * st, 1.4 - 0.4 * st); g.globalAlpha = st; g.strokeStyle = '#FF4D5E'; g.lineWidth = 10; g.strokeRect(-220, -55, 440, 110); g.fillStyle = '#FF4D5E'; g.font = '800 56px Inter'; g.fillText('NO EVIDENCE', 0, 20); g.restore(); }
  SK.grain(g, t, 0.08); };
