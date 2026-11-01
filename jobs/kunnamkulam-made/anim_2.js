const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), press = Math.max(0, Math.sin(t * 3)), sheets = Math.floor(t * 1.5) % 12;
  g.fillStyle = '#16100c'; g.fillRect(0, 0, W, H); SK.lamp(g, W * 0.86, H * 0.62, 0.8, t);
  const cx = W * 0.42, cy = H * 0.5; g.fillStyle = '#3a3a40'; g.fillRect(cx - 220, cy, 440, 40); g.fillRect(cx - 200, cy + 40, 40, 220); g.fillRect(cx + 160, cy + 40, 40, 220);
  g.fillRect(cx - 30, cy - 360, 60, 260); g.fillRect(cx - 160, cy - 110 + press * 70, 320, 50); g.beginPath(); g.arc(cx, cy - 380, 90, 0, 6.283); g.lineWidth = 16; g.strokeStyle = '#4a4a52'; g.stroke();
  g.fillStyle = '#efe4c8'; g.fillRect(cx - 150, cy - 14, 300, 14);
  for (let i = 0; i < sheets; i++) { g.fillStyle = '#efe4c8'; g.fillRect(W * 0.7 - i, H * 0.6 - i * 8, 220, 300); g.fillStyle = '#6a5a44'; for (let j = 0; j < 6; j++) g.fillRect(W * 0.7 + 20 - i, H * 0.6 + 30 + j * 40 - i * 8, 180 - (j * 23) % 60, 8); }
  SK.grain(g, t, 0.07); };
