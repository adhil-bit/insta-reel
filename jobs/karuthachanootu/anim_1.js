const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), fl = 0.8 + 0.2 * Math.sin(t * 7);
  g.fillStyle = '#06050a'; g.fillRect(0, 0, W, H);
  const sx = W * 0.1, sy = H * 0.2, sw = W * 0.8, sh = H * 0.3; const gl = g.createLinearGradient(0, sy, 0, H * 0.8); gl.addColorStop(0, `rgba(200,60,50,${0.35 * fl})`); gl.addColorStop(1, 'rgba(200,60,50,0)'); g.fillStyle = gl; g.beginPath(); g.moveTo(sx, sy + sh); g.lineTo(sx + sw, sy + sh); g.lineTo(W, H * 0.85); g.lineTo(0, H * 0.85); g.fill();
  g.fillStyle = `rgba(60,16,20,${fl})`; g.fillRect(sx, sy, sw, sh); g.save(); g.beginPath(); g.rect(sx, sy, sw, sh); g.clip();
  for (let i = 0; i < 3; i++) { g.fillStyle = '#0a0406'; const x = sx + sw * (0.3 + i * 0.2); g.beginPath(); g.moveTo(x - 50, sy + sh); g.quadraticCurveTo(x - 40, sy + sh * 0.3, x, sy + sh * 0.2); g.quadraticCurveTo(x + 40, sy + sh * 0.3, x + 50, sy + sh); g.fill(); } g.restore();
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { g.fillStyle = '#020204'; const x = W * (0.07 + i * 0.108) + (r % 2) * 30, y = H * (0.62 + r * 0.08); g.beginPath(); g.arc(x, y, 34, 0, 6.283); g.fill(); g.fillRect(x - 46, y + 20, 92, 120); }
  SK.grain(g, t, 0.09); };
