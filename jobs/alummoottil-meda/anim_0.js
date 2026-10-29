const c = makeCanvas(), g = c.getContext('2d');
function roofHouse(x, base, w, h, col, lit, t) { g.fillStyle = col; g.fillRect(x - w / 2, base - h, w, h);
  g.beginPath(); g.moveTo(x - w / 2 - 70, base - h + 10); g.lineTo(x - w / 2 + 40, base - h - 150); g.lineTo(x + w / 2 - 40, base - h - 150); g.lineTo(x + w / 2 + 70, base - h + 10); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(x - w * 0.3, base - h - 150); g.lineTo(x, base - h - 250); g.lineTo(x + w * 0.3, base - h - 150); g.fill();
  if (lit) for (let i = 0; i < 4; i++) { const f = 0.75 + 0.25 * Math.sin(t * 3 + i); g.fillStyle = `rgba(255,190,100,${0.8 * f})`; g.fillRect(x - w / 2 + 40 + i * (w - 80) / 4, base - h + 50, 34, 46); g.fillStyle = col; } }
window.renderFrame = function (t) {
  SK.sky(g, 'night', 0.7); SK.sun(g, W * 0.76, H * 0.14, 70, '#f4f0e0', 0.35);
  for (let i = 0; i < 80; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + 0.4 * ((i * 37) % 10) / 10})`; g.fillRect((i * 173) % W, (i * 97) % (H * 0.4), 2, 2); }
  SK.palm(g, W * 0.06, H * 0.62, 520, 50, '#05060a', t); SK.palm(g, W * 0.94, H * 0.62, 480, -40, '#05060a', t);
  roofHouse(W * 0.5, H * 0.6, 640, 230, '#0a0a10', true, t);
  g.fillStyle = '#050508'; g.fillRect(0, H * 0.6, W, H);
  const dx = W * 0.5, dy = H * 0.6; g.fillStyle = '#3a2210'; g.fillRect(dx - 70, dy - 200, 140, 200); g.strokeStyle = '#d8a84a'; g.lineWidth = 6; g.strokeRect(dx - 70, dy - 200, 140, 200); g.beginPath(); g.moveTo(dx, dy - 200); g.lineTo(dx, dy); g.stroke();
  const gl = g.createRadialGradient(dx, dy - 100, 6, dx, dy - 100, 160); gl.addColorStop(0, 'rgba(255,200,90,0.9)'); gl.addColorStop(1, 'rgba(255,200,90,0)'); g.fillStyle = gl; g.fillRect(dx - 160, dy - 260, 320, 320);
  g.fillStyle = '#f2c860'; g.beginPath(); g.arc(dx, dy - 100, 22, Math.PI, 0); g.fill(); g.fillRect(dx - 26, dy - 100, 52, 40); g.fillStyle = '#3a2210'; g.beginPath(); g.arc(dx, dy - 84, 6, 0, 6.283); g.fill(); g.fillRect(dx - 3, dy - 84, 6, 14);
  for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(190,200,230,0.12)'; g.beginPath(); g.ellipse(W * (i % 3) * 0.45 + Math.sin(i) * 60, H * (0.56 + (i % 4) * 0.02), 520, 70, 0, 0, 6.283); g.fill(); }
  SK.grain(g, t, 0.08); };
