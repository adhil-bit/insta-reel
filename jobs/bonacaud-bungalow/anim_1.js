const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'day', 0.5); const hill = (y, col, amp, f) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 20) g.lineTo(x, y + Math.sin(x / f) * amp); g.lineTo(W, H); g.fill(); };
  hill(H * 0.3, '#6a8aa0', 70, 200); hill(H * 0.38, '#3a6a4a', 40, 150);
  for (let r = 0; r < 16; r++) { g.fillStyle = r % 2 ? '#2a5a2a' : '#3a7a3a'; const y = H * 0.42 + r * 34; g.beginPath(); for (let x = -40; x <= W + 40; x += 60) { g.moveTo(x + (r % 2) * 30, y); g.ellipse(x + (r % 2) * 30, y, 34, 14, 0, 0, 6.283); } g.fill(); }
  for (let i = 0; i < 4; i++) { const x = W * (0.15 + i * 0.22) + Math.sin(t + i) * 10, y = H * (0.62 + (i % 2) * 0.05); SK.person(g, x, y, 200, 'stand', '#1a1a14', t + i); g.fillStyle = '#8a6a3a'; g.beginPath(); g.ellipse(x, y - 190, 34, 22, 0, 0, Math.PI); g.fill(); }
  g.fillStyle = '#5a5a5a'; g.fillRect(W * 0.78, H * 0.22, 140, 120); g.fillRect(W * 0.86, H * 0.12, 26, 110); g.fillStyle = 'rgba(200,200,210,0.5)'; for (let i = 0; i < 4; i++) { const u = (t * 0.3 + i / 4) % 1; g.beginPath(); g.arc(W * 0.873 + u * 60, H * 0.12 - u * 160, 20 + u * 30, 0, 6.283); g.fill(); }
  SK.grain(g, t, 0.05); };
