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
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'sunset', 0.62); SK.sun(g, W * 0.24, H * 0.42, 90, '#ffd8a0', 0.5); SK.birds(g, t, 4, 0.18);
  SK.palm(g, W * 0.06, H * 0.64, 500, 40, SK.ink, t); SK.palm(g, W * 0.95, H * 0.64, 460, -40, SK.ink, t);
  palace(g, W * 0.46, H * 0.62, 0.95, '#140c0c', t);
  g.fillStyle = '#120a0c'; g.fillRect(0, H * 0.62, W, H);
  g.strokeStyle = 'rgba(250,204,21,0.9)'; g.lineWidth = 6; g.setLineDash([18, 12]); g.beginPath(); g.moveTo(W * 0.92, H * 0.12); g.lineTo(W * 0.92, H * 0.66); g.stroke(); g.setLineDash([]);
  SK.grain(g, t, 0.07); };
