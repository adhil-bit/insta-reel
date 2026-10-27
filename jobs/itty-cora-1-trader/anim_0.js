const c = makeCanvas(), g = c.getContext('2d');
function ship(x, y, s, t) { g.save(); g.translate(x, y + Math.sin(t * 1.2) * 6 * s); g.scale(s, s); g.fillStyle = SK.ink;
  g.beginPath(); g.moveTo(-220, 0); g.lineTo(220, 0); g.lineTo(180, 50); g.lineTo(-190, 50); g.fill(); g.fillRect(-6, -300, 12, 300); g.fillRect(-120, -220, 8, 220);
  g.beginPath(); g.moveTo(-6, -290); g.quadraticCurveTo(110 + Math.sin(t) * 8, -190, -6, -40); g.fill(); g.beginPath(); g.moveTo(-116, -210); g.quadraticCurveTo(-30, -140, -116, -40); g.fill(); g.restore(); }
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'sunset', 0.56); SK.sun(g, W * 0.62, H * 0.5, 110, '#ffd8a0', 0.6); SK.birds(g, t, 4, 0.2);
  SK.sea(g, H * 0.54, t, ['#c86a5a', '#8a3e4e', '#4a2038', '#2a1226'], false, H * 0.66); ship(W * 0.62 + k * 40, H * 0.57, 0.9, t);
  g.fillStyle = '#1a0e10'; g.fillRect(0, H * 0.64, W, H); SK.palm(g, W * 0.08, H * 0.66, 460, 50, SK.ink, t);
  for (let i = 0; i < 4; i++) { g.fillStyle = '#2a1a12'; g.beginPath(); g.ellipse(W * (0.3 + i * 0.07), H * 0.655, 46, 30, 0, 0, 6.283); g.fill(); }
  SK.person(g, W * 0.22, H * 0.67, 360, 'stand', '#0a0608', t); SK.grain(g, t, 0.07); };
