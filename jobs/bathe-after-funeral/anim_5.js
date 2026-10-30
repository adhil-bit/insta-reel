const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), tilt = Math.sin(t * 1.2) * 0.06 * (1 - k), q = ease.out(clamp((k - 0.7) / 0.2));
  g.fillStyle = '#100c10'; g.fillRect(0, 0, W, H);
  g.save(); g.translate(W / 2, H * 0.5); g.strokeStyle = '#e8c070'; g.fillStyle = '#e8c070'; g.lineWidth = 8; g.beginPath(); g.moveTo(0, -200); g.lineTo(0, 180); g.stroke(); g.fillRect(-100, 180, 200, 16); g.rotate(tilt);
  g.beginPath(); g.moveTo(-300, -190); g.lineTo(300, -190); g.stroke(); for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 300, -190); g.lineTo(sx * 250, -80); g.moveTo(sx * 300, -190); g.lineTo(sx * 350, -80); g.stroke(); g.beginPath(); g.ellipse(sx * 300, -80, 75, 16, 0, 0, Math.PI); g.fill(); } g.restore();
  SK.lamp(g, W / 2 - 300, H * 0.5 - 100, 0.5, t);
  g.fillStyle = '#7ac8ff'; g.beginPath(); g.moveTo(W / 2 + 300, H * 0.5 - 190); g.quadraticCurveTo(W / 2 + 340, H * 0.5 - 120, W / 2 + 300, H * 0.5 - 100); g.quadraticCurveTo(W / 2 + 260, H * 0.5 - 120, W / 2 + 300, H * 0.5 - 190); g.fill();
  if (q > 0) { g.fillStyle = `rgba(244,114,182,${q})`; g.beginPath(); g.roundRect(W / 2 - 150, H * 0.14, 300, 120, 30); g.fill(); g.fillStyle = '#100c10'; for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(W / 2 - 70 + j * 70, H * 0.14 + 60, 14, 0, 6.283); g.fill(); } }
  SK.grain(g, t, 0.06); };
