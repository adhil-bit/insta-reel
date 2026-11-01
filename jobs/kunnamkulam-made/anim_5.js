const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), tilt = Math.sin(t * 1.3) * 0.12, q = ease.out(clamp((k - 0.5) / 0.2));
  g.fillStyle = '#120e10'; g.fillRect(0, 0, W, H);
  g.save(); g.translate(W / 2, H * 0.46); g.strokeStyle = '#e8c070'; g.fillStyle = '#e8c070'; g.lineWidth = 8; g.beginPath(); g.moveTo(0, -200); g.lineTo(0, 200); g.stroke(); g.fillRect(-100, 200, 200, 16); g.rotate(tilt);
  g.beginPath(); g.moveTo(-300, -190); g.lineTo(300, -190); g.stroke(); for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 300, -190); g.lineTo(sx * 250, -80); g.moveTo(sx * 300, -190); g.lineTo(sx * 350, -80); g.stroke(); g.beginPath(); g.ellipse(sx * 300, -80, 75, 16, 0, 0, Math.PI); g.fill(); } g.restore();
  if (q > 0) { g.save(); g.globalAlpha = q; g.font = '800 42px Inter'; g.textAlign = 'center'; for (const [x, txt, col] of [[W * 0.27, 'DUPLICATE?', '#FF4D5E'], [W * 0.73, 'GENIUS?', '#34D399']]) { g.fillStyle = 'rgba(8,6,10,0.8)'; g.beginPath(); g.roundRect(x - 170, H * 0.66, 340, 84, 42); g.fill(); g.strokeStyle = col; g.lineWidth = 4; g.stroke(); g.fillStyle = col; g.fillText(txt, x, H * 0.66 + 58); } g.restore(); }
  SK.grain(g, t, 0.06); };
