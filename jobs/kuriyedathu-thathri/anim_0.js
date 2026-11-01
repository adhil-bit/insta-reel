const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#120c08'; g.fillRect(0, 0, W, H); const gl = g.createRadialGradient(W / 2, H * 0.33, 20, W / 2, H * 0.33, 520); gl.addColorStop(0, 'rgba(255,200,120,0.4)'); gl.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.fillStyle = '#2a1a10'; g.fillRect(W * 0.18, H * 0.12, 16, H * 0.4); g.fillRect(W * 0.82 - 16, H * 0.12, 16, H * 0.4); g.fillRect(W * 0.16, H * 0.12, W * 0.68, 18);
  g.fillStyle = 'rgba(240,226,196,0.85)'; g.fillRect(W * 0.2, H * 0.14, W * 0.6, H * 0.36);
  g.fillStyle = 'rgba(30,18,12,0.85)'; const x = W / 2 + Math.sin(t * 0.8) * 6, y = H * 0.5; g.beginPath(); g.arc(x, y - 330, 46, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(x - 70, y); g.quadraticCurveTo(x - 80, y - 200, x - 40, y - 280); g.lineTo(x + 40, y - 280); g.quadraticCurveTo(x + 80, y - 200, x + 70, y); g.fill(); g.beginPath(); g.ellipse(x + 28, y - 360, 26, 22, 0, 0, 6.283); g.fill();
  const n = Math.floor(clamp(k / 0.7) * 64); g.strokeStyle = 'rgba(255,214,140,0.9)'; g.lineWidth = 5;
  for (let i = 0; i < n; i++) { const grp = Math.floor(i / 5), j = i % 5, gx = W * 0.08 + (grp % 13) * 74, gy = H * 0.565 + Math.floor(grp / 13) * 40; if (j < 4) { g.beginPath(); g.moveTo(gx + j * 12, gy); g.lineTo(gx + j * 12, gy + 30); g.stroke(); } else { g.beginPath(); g.moveTo(gx - 6, gy + 26); g.lineTo(gx + 44, gy + 4); g.stroke(); } }
  SK.lamp(g, W * 0.12, H * 0.56, 0.7, t); SK.grain(g, t, 0.09); };
