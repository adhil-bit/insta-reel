const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), up = ease.out(clamp(k / 0.5));
  SK.sky(g, 'sunset', 0.64); SK.sea(g, H * 0.6, t, ['#8a4a5a', '#5a2a4a', '#2a1430'], false, H * 0.66); g.fillStyle = '#140a10'; g.fillRect(0, H * 0.64, W, H);
  g.fillStyle = SK.ink; const fy = H * 0.64; g.fillRect(W * 0.08, fy - 160 * up, W * 0.5, 160 * up); for (let i = 0; i < 8; i++) g.fillRect(W * 0.08 + i * W * 0.064, fy - 160 * up - 30, W * 0.035, 30);
  g.fillRect(W * 0.12, fy - 260 * up, 70, 260 * up); g.fillRect(W * 0.46, fy - 260 * up, 70, 260 * up);
  g.fillStyle = '#b02a2a'; g.fillRect(W * 0.12 + 30, fy - 260 * up - 90, 6, 90); g.beginPath(); g.moveTo(W * 0.12 + 36, fy - 260 * up - 90); g.lineTo(W * 0.12 + 96, fy - 260 * up - 72 + Math.sin(t * 3) * 6); g.lineTo(W * 0.12 + 36, fy - 260 * up - 54); g.fill();
  g.fillStyle = SK.ink; g.fillRect(W * 0.7, fy - 220, 140, 220); g.beginPath(); g.moveTo(W * 0.7 - 10, fy - 220); g.lineTo(W * 0.7 + 70, fy - 300); g.lineTo(W * 0.7 + 150, fy - 220); g.fill(); g.fillRect(W * 0.7 + 64, fy - 360, 12, 60); g.fillRect(W * 0.7 + 50, fy - 340, 40, 10);
  for (let i = 0; i < 3; i++) { const pr = ease.out(clamp((k - 0.4 - i * 0.1) / 0.3)); if (pr <= 0) continue; SK.person(g, lerp(W * 1.05, W * (0.6 + i * 0.06), pr), H * 0.66, 260, 'stand', '#0a0608', t + i); }
  SK.grain(g, t, 0.06); };
