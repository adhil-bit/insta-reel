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
window.renderFrame = function (t) { const k = clamp(t / DURATION), shine = ease.out(clamp((k - 0.3) / 0.4));
  SK.sky(g, 'day', 0.66); palace(g, W * 0.42, H * 0.64, 0.9, '#3a2418', t, 0);
  g.fillStyle = '#6a5a3a'; g.fillRect(0, H * 0.64, W, H); g.fillStyle = '#4a3a24'; g.fillRect(W * 0.32, H * 0.64, W * 0.2, H);
  for (let i = 0; i < 3; i++) SK.person(g, W * (0.66 + i * 0.1), H * 0.74, 240, i === 1 ? 'arm_up' : 'stand', '#2a1a10', t + i);
  g.save(); g.globalAlpha = shine; g.fillStyle = '#efe4c8'; g.beginPath(); g.roundRect(W * 0.08, H * 0.7, 360, 120, 16); g.fill(); g.fillStyle = '#7a1a1a'; g.fillRect(W * 0.08, H * 0.7, 360, 30); g.fillStyle = '#3a2a1a'; for (let i = 0; i < 3; i++) g.fillRect(W * 0.08 + 30, H * 0.7 + 50 + i * 20, 300 - i * 60, 8); g.restore();
  SK.grain(g, t, 0.05); };
