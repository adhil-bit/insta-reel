function chest(g, x, y, s, glow, t) { g.save(); g.translate(x, y); g.scale(s, s);
  if (glow > 0) { const gl = g.createRadialGradient(0, -20, 10, 0, -20, 260); gl.addColorStop(0, `rgba(255,200,80,${0.6 * glow * (0.85 + 0.15 * Math.sin(t * 4))})`); gl.addColorStop(1, 'rgba(255,200,80,0)'); g.fillStyle = gl; g.fillRect(-260, -280, 520, 520); }
  g.fillStyle = '#5a3416'; g.fillRect(-90, -50, 180, 90); g.fillStyle = '#7a4a22'; g.beginPath(); g.moveTo(-90, -50); g.quadraticCurveTo(0, -110, 90, -50); g.fill();
  g.fillStyle = '#d8a83a'; g.fillRect(-94, -54, 188, 10); g.fillRect(-10, -60, 20, 40); g.fillRect(-94, 30, 188, 10);
  for (let i = 0; i < 6; i++) { g.fillStyle = '#ffd34a'; g.beginPath(); g.ellipse(-60 + i * 24, -58 - (i % 2) * 8, 12, 6, 0, 0, 6.283); g.fill(); } g.restore(); }
function streetlight(g, x, base, t) { g.fillStyle = '#2a2a30'; g.fillRect(x - 6, base - 520, 12, 520); g.fillRect(x - 6, base - 520, 120, 10); const f = 0.85 + 0.15 * Math.sin(t * 13);
  const gl = g.createRadialGradient(x + 110, base - 500, 5, x + 110, base - 300, 420); gl.addColorStop(0, `rgba(255,214,140,${0.45 * f})`); gl.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gl; g.beginPath(); g.moveTo(x + 110, base - 505); g.lineTo(x - 160, base); g.lineTo(x + 380, base); g.fill(); g.fillStyle = '#ffe2a0'; g.fillRect(x + 92, base - 512, 36, 10); }
function road(g, top, t) { g.fillStyle = '#16161c'; g.fillRect(0, top, W, H - top); g.fillStyle = '#2a2a32'; g.beginPath(); g.moveTo(W * 0.3, top); g.lineTo(W * 0.7, top); g.lineTo(W, H); g.lineTo(0, H); g.fill(); g.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 6; i++) { const y = top + 40 + i * i * 22; g.fillRect(W / 2 - 4 - i * 3, y, 8 + i * 6, 16 + i * 6); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), q = ease.out(clamp((k - 0.65) / 0.2));
  SK.sky(g, 'night', 0.55); SK.house(g, W * 0.5, H * 0.56, 0.9, '#0c0a10', 1, t); g.fillStyle = '#0c0a10'; g.fillRect(0, H * 0.56, W, H);
  SK.lamp(g, W * 0.24, H * 0.66, 0.6, t); SK.person(g, W * 0.38, H * 0.72, 260, 'stand', '#06040a', t); for (let i = 0; i < 2; i++) SK.person(g, W * (0.58 + i * 0.1), H * 0.74, 150, 'stand', '#06040a', t + i);
  chest(g, W * 0.8, H * 0.7, 0.4, 0.8, t);
  if (q > 0) { g.fillStyle = `rgba(250,204,21,${q})`; g.beginPath(); g.roundRect(W / 2 - 150, H * 0.08, 300, 110, 30); g.fill(); g.fillStyle = '#0c0a10'; for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(W / 2 - 70 + j * 70, H * 0.08 + 55, 14, 0, 6.283); g.fill(); } }
  SK.grain(g, t, 0.06); };
