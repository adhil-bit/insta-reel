const c = makeCanvas(), g = c.getContext('2d'); const snow = Array.from({length: 300}, () => [rand(), rand()]);
window.renderFrame = function (t) { const k = clamp(t / DURATION), many = Math.floor(ease.out(clamp((k - 0.45) / 0.4)) * 6);
  g.fillStyle = '#0c0a10'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#3a2e26'; g.beginPath(); g.roundRect(W * 0.18, H * 0.2, W * 0.64, H * 0.3, 40); g.fill(); g.fillStyle = '#0c0e12'; g.beginPath(); g.roundRect(W * 0.23, H * 0.23, W * 0.46, H * 0.24, 30); g.fill();
  g.save(); g.beginPath(); g.roundRect(W * 0.23, H * 0.23, W * 0.46, H * 0.24, 30); g.clip(); for (const [x, y] of snow) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`; g.fillRect(W * 0.23 + x * W * 0.46, H * 0.23 + y * H * 0.24, 4, 4); }
  g.fillStyle = 'rgba(20,22,28,0.85)'; g.fillRect(W * 0.32, H * 0.31, W * 0.28, H * 0.12); g.beginPath(); g.moveTo(W * 0.3, H * 0.31); g.lineTo(W * 0.46, H * 0.27); g.lineTo(W * 0.62, H * 0.31); g.fill(); g.restore();
  g.fillStyle = '#5a4a3e'; for (const kx of [0.74, 0.78]) { g.beginPath(); g.arc(W * kx, H * 0.3, 18, 0, 6.283); g.fill(); }
  for (let i = 0; i < many; i++) { const x = W * (0.15 + (i % 3) * 0.3), y = H * (0.6 + Math.floor(i / 3) * 0.13); g.fillStyle = '#1a1c24'; g.beginPath(); g.roundRect(x - 70, y - 110, 140, 220, 20); g.fill(); g.fillStyle = '#c0392b'; g.beginPath(); g.moveTo(x - 20, y - 26); g.lineTo(x + 26, y); g.lineTo(x - 20, y + 26); g.fill(); }
  SK.grain(g, t, 0.07); };
