const c = makeCanvas(), g = c.getContext('2d'); const sparks = Array.from({length: 60}, () => [rand(), rand(), rand()]);
window.renderFrame = function (t) { const k = clamp(t / DURATION), q = ease.out(clamp((k - 0.65) / 0.2));
  SK.sky(g, 'night', 0.66); for (const [x, y, z] of sparks) { const u = (t * 0.4 + z) % 1; g.fillStyle = `rgba(255,${180 + z * 60},${90 + z * 80},${1 - u})`; g.beginPath(); g.arc(W * x, H * (0.1 + y * 0.4) - u * 60, 3 + z * 3, 0, 6.283); g.fill(); }
  SK.palm(g, W * 0.06, H * 0.68, 520, 40, SK.ink, t); SK.palm(g, W * 0.94, H * 0.68, 480, -40, SK.ink, t); SK.house(g, W * 0.5, H * 0.66, 0.9, '#0c0a10', 1, t);
  g.fillStyle = '#0c0a10'; g.fillRect(0, H * 0.66, W, H); for (let i = 0; i < 7; i++) SK.lamp(g, W * (0.12 + i * 0.127), H * 0.74, 0.55, t + i);
  if (q > 0) { g.fillStyle = `rgba(52,211,153,${q})`; g.beginPath(); g.roundRect(W / 2 - 150, H * 0.1, 300, 120, 30); g.fill(); g.fillStyle = '#0c0a10'; for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(W / 2 - 70 + j * 70, H * 0.1 + 60, 14, 0, 6.283); g.fill(); } }
  SK.grain(g, t, 0.07); };
