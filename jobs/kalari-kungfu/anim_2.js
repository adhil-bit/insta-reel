const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), walk = ease.inOut(k);
  SK.sky(g, 'dawn', 0.6); const hill = (y, col, amp, f) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 20) g.lineTo(x, y + Math.sin(x / f) * amp); g.lineTo(W, H); g.fill(); };
  hill(H * 0.42, '#5a6a8a', 90, 180); hill(H * 0.52, '#3a4a6a', 60, 140); hill(H * 0.62, '#1a2234', 30, 120);
  for (let i = 0; i < 5; i++) { g.fillStyle = 'rgba(240,240,250,0.18)'; g.beginPath(); g.ellipse(W * (i * 0.25), H * (0.5 + (i % 2) * 0.04), 420, 50, 0, 0, 6.283); g.fill(); }
  const x = lerp(W * 0.25, W * 0.6, walk), y = H * 0.66; g.fillStyle = '#e8a040'; g.beginPath(); g.moveTo(x - 50, y); g.lineTo(x - 30, y - 220); g.lineTo(x + 30, y - 220); g.lineTo(x + 50, y); g.fill(); g.fillStyle = '#1a1014'; g.beginPath(); g.arc(x, y - 250, 30, 0, 6.283); g.fill();
  g.strokeStyle = '#d8c8a0'; g.lineWidth = 8; g.beginPath(); g.moveTo(x + 60, y - 300); g.lineTo(x + 60, y); g.stroke();
  g.fillStyle = '#efe4c8'; g.beginPath(); g.roundRect(x - 80, y - 150, 50, 24, 10); g.fill(); SK.grain(g, t, 0.06); };
