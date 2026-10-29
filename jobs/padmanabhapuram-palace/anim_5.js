function palace(g, x, base, s, col, t, lit = 0.6) {   // Kerala wooden palace: tiered sloped roofs + clock tower
  g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = col;
  g.fillRect(-380, -200, 760, 200); for (let i = 0; i < 9; i++) g.fillRect(-370 + i * 92, -200, 18, 200);
  g.beginPath(); g.moveTo(-440, -190); g.lineTo(-330, -320); g.lineTo(330, -320); g.lineTo(440, -190); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(-260, -320); g.lineTo(-180, -410); g.lineTo(180, -410); g.lineTo(260, -320); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(-120, -410); g.lineTo(0, -480); g.lineTo(120, -410); g.fill();
  g.fillRect(470, -380, 110, 380); g.beginPath(); g.moveTo(450, -380); g.lineTo(525, -470); g.lineTo(600, -380); g.fill();
  g.fillStyle = '#efe4c8'; g.beginPath(); g.arc(525, -320, 34, 0, 6.283); g.fill(); g.strokeStyle = '#2a1a10'; g.lineWidth = 5; g.beginPath(); g.moveTo(525, -320); g.lineTo(525, -342); g.moveTo(525, -320); g.lineTo(541, -312); g.stroke();
  if (lit) { for (let i = 0; i < 6; i++) { const f = 0.8 + 0.2 * Math.sin(t * 3 + i); g.fillStyle = `rgba(255,190,100,${lit * f})`; g.fillRect(-300 + i * 110, -150, 44, 60); } }
  g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), q = ease.out(clamp((k - 0.7) / 0.2));
  SK.sky(g, 'night', 0.66); palace(g, W * 0.46, H * 0.64, 0.9, '#0c0a10', t, 0.9); g.fillStyle = '#0c0a10'; g.fillRect(0, H * 0.64, W, H);
  for (let i = 0; i < 7; i++) SK.lamp(g, W * (0.1 + i * 0.13), H * 0.74, 0.6, t + i);
  for (let i = 0; i < 18; i++) { const u = (t * 0.25 + i / 18) % 1; g.fillStyle = `rgba(255,214,120,${0.8 * (1 - u)})`; g.beginPath(); g.arc(W * ((i * 0.37) % 1), H * 0.7 - u * 700, 4, 0, 6.283); g.fill(); }
  if (q > 0) { g.fillStyle = `rgba(250,204,21,${q})`; g.beginPath(); g.roundRect(W / 2 - 150, H * 0.1, 300, 120, 30); g.fill(); g.fillStyle = '#0c0a10'; for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(W / 2 - 70 + j * 70, H * 0.1 + 60, 14, 0, 6.283); g.fill(); } }
  SK.grain(g, t, 0.07); };
