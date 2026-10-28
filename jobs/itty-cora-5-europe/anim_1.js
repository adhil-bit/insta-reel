const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION); SK.sky(g, 'sunset', 0.64); SK.sea(g, H * 0.6, t, ['#8a4a5a', '#5a2a4a', '#2a1430'], false, H * 0.66); g.fillStyle = '#140a10'; g.fillRect(0, H * 0.64, W, H);
  const fy = H * 0.64; g.fillStyle = SK.ink; g.fillRect(W * 0.55, fy - 240, 180, 240); g.beginPath(); g.moveTo(W * 0.55 - 14, fy - 240); g.lineTo(W * 0.55 + 90, fy - 330); g.lineTo(W * 0.55 + 194, fy - 240); g.fill(); g.fillRect(W * 0.55 + 84, fy - 400, 12, 70); g.fillRect(W * 0.55 + 70, fy - 378, 40, 10);
  SK.palm(g, W * 0.12, fy + 10, 440, 40, SK.ink, t);
  for (let i = 0; i < 3; i++) { const pr = ease.out(clamp((k - i * 0.12) / 0.3)); if (pr <= 0) continue; const x = lerp(W * 0.05, W * (0.28 + i * 0.08), pr); g.fillStyle = '#0a0608'; g.beginPath(); g.moveTo(x - 40, fy + 6); g.lineTo(x - 26, fy - 200); g.lineTo(x + 26, fy - 200); g.lineTo(x + 40, fy + 6); g.fill(); g.beginPath(); g.arc(x, fy - 226, 26, 0, 6.283); g.fill(); }
  const lf = ease.out(clamp((k - 0.5) / 0.3)); if (lf > 0) { g.save(); g.globalAlpha = lf; g.fillStyle = '#c9a25a'; g.beginPath(); g.roundRect(W * 0.32 - 110, fy - 140, 220, 34, 17); g.fill(); g.restore(); }
  SK.grain(g, t, 0.06); };
