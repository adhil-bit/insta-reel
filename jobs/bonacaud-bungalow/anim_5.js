const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), q = ease.out(clamp((k - 0.7) / 0.2));
  SK.sky(g, 'dusk', 0.6); SK.ground(g, H * 0.6, '#2a2620', '#120f0c');
  g.fillStyle = '#4a3a30'; g.fillRect(W * 0.12, H * 0.34, W * 0.5, H * 0.26); g.fillRect(W * 0.5, H * 0.18, 60, H * 0.16); g.fillStyle = '#6a3a24'; for (let i = 0; i < 12; i++) g.fillRect(W * 0.14 + (i * 41) % (W * 0.46), H * 0.36 + (i * 67) % (H * 0.2), 30, 18);
  g.strokeStyle = '#5a5248'; g.lineWidth = 10; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(W * 0.66 + i * 36, H * 0.4); g.lineTo(W * 0.66 + i * 36, H * 0.62); g.stroke(); } g.beginPath(); g.moveTo(W * 0.64, H * 0.42); g.lineTo(W * 0.98, H * 0.42); g.stroke();
  g.fillStyle = '#8a8070'; g.beginPath(); g.arc(W * 0.81, H * 0.5, 26, Math.PI, 0); g.fill(); g.fillRect(W * 0.81 - 30, H * 0.5, 60, 46);
  for (let i = 0; i < 3; i++) { SK.house(g, W * (0.2 + i * 0.25), H * 0.78, 0.5, '#1a1612', 0.3, t); }
  if (q > 0) { g.fillStyle = rgba(ACCENT, q); g.beginPath(); g.roundRect(W / 2 - 150, H * 0.08, 300, 120, 30); g.fill(); g.fillStyle = '#120f0c'; for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(W / 2 - 70 + j * 70, H * 0.08 + 60, 14, 0, 6.283); g.fill(); } }
  SK.grain(g, t, 0.07); };
