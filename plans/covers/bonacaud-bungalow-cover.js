const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) {
  const sky = g.createLinearGradient(0, 0, 0, H * 0.62); sky.addColorStop(0, '#0b1320'); sky.addColorStop(0.6, '#24364a'); sky.addColorStop(1, '#4a5e70'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  SK.sun(g, W * 0.78, H * 0.12, 56, '#e6ecf2', 0.3);
  const hill = (y, col, amp, f) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 20) g.lineTo(x, y + Math.sin(x / f) * amp + Math.sin(x / (f * 0.37)) * amp * 0.3); g.lineTo(W, H); g.fill(); };
  hill(H * 0.22, '#1a2836', 60, 210); hill(H * 0.29, '#142030', 50, 160);
  for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(210,220,230,0.10)'; g.beginPath(); g.ellipse(W * (i * 0.22), H * (0.28 + (i % 2) * 0.03), 420, 60, 0, 0, 6.283); g.fill(); }
  hill(H * 0.4, '#0e1a14', 30, 140);
  for (let r = 0; r < 10; r++) { g.fillStyle = r % 2 ? '#102418' : '#0c1c12'; const y = H * 0.47 + r * 34; g.beginPath(); for (let x = -40; x <= W + 40; x += 60) { g.moveTo(x, y); g.ellipse(x, y, 34, 14, 0, 0, 6.283); } g.fill(); }
  const bx = W * 0.5, by = H * 0.47;            // ruined colonial bungalow
  g.fillStyle = '#121418'; g.fillRect(bx - 330, by - 230, 660, 230);
  g.beginPath(); g.moveTo(bx - 370, by - 225); g.lineTo(bx - 120, by - 360); g.lineTo(bx + 60, by - 300); g.lineTo(bx + 120, by - 370); g.lineTo(bx + 370, by - 225); g.closePath(); g.fill();
  g.fillStyle = '#0b0c10'; g.beginPath(); g.moveTo(bx - 10, by - 310); g.lineTo(bx + 40, by - 250); g.lineTo(bx + 80, by - 330); g.lineTo(bx + 70, by - 230); g.lineTo(bx - 20, by - 240); g.fill();
  g.fillStyle = '#121418'; g.fillRect(bx + 210, by - 400, 50, 120); g.fillRect(bx - 300, by - 390, 44, 110);
  g.fillStyle = '#080a0c'; for (let i = 0; i < 6; i++) { const x = bx - 300 + i * 110; g.fillRect(x, by - 20, 18, 20); }
  for (let i = 0; i < 4; i++) { const x = bx - 250 + i * 150; g.fillStyle = '#05060a'; g.beginPath(); g.moveTo(x - 36, by - 60); g.lineTo(x - 36, by - 150); g.arc(x, by - 150, 36, Math.PI, 0); g.lineTo(x + 36, by - 60); g.fill(); }
  const wx = bx + 50, wy = by - 150; const glow = g.createRadialGradient(wx, wy, 5, wx, wy, 120); glow.addColorStop(0, 'rgba(190,220,255,0.55)'); glow.addColorStop(1, 'rgba(190,220,255,0)'); g.fillStyle = glow; g.fillRect(wx - 120, wy - 120, 240, 240);
  g.fillStyle = 'rgba(225,235,250,0.55)'; g.beginPath(); g.arc(wx, wy - 26, 11, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(wx - 14, wy - 14); g.lineTo(wx + 14, wy - 14); g.lineTo(wx + 20, wy + 30); g.lineTo(wx - 20, wy + 30); g.fill();
  g.strokeStyle = 'rgba(30,60,30,0.9)'; g.lineWidth = 6; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(bx - 330 + i * 18, by - 230 + i * 30); g.quadraticCurveTo(bx - 300 + i * 12, by - 120, bx - 340 + i * 20, by); g.stroke(); }
  for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(200,210,225,0.14)'; g.beginPath(); g.ellipse(W * (i % 4) * 0.33, H * (0.45 + (i % 3) * 0.025), 520, 55, 0, 0, 6.283); g.fill(); }
  SK.grain(g, t, 0.09); };
