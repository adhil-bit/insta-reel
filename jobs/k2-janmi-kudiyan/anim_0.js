function paddy(g, top, t) { g.fillStyle = '#4a6a2a'; g.fillRect(0, top, W, H - top); g.strokeStyle = '#7aa04a'; g.lineWidth = 4;
  for (let r = 0; r < 18; r++) for (let i = 0; i < 24; i++) { const x = (i * 47 + r * 19) % (W + 40) - 20, y = top + 20 + r * 34; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 5 + Math.sin(t * 1.5 + i + r) * 3, y - 22); g.stroke(); } }
function deed(g, x, y, s, title, sub) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#efe4c8'; g.fillRect(-220, -280, 440, 560); g.fillStyle = '#3a2a1a'; g.font = '800 34px Inter, Baloo, Noto'; g.textAlign = 'center'; g.fillText(title, 0, -200); g.font = '700 26px Inter, Baloo, Noto'; g.fillText(sub, 0, -158);
  g.fillStyle = '#7a6a54'; for (let i = 0; i < 9; i++) g.fillRect(-170, -100 + i * 36, 340 - (i * 37) % 90, 8); g.fillStyle = '#9a1a1a'; g.beginPath(); g.arc(130, 220, 42, 0, 6.283); g.fill(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'dusk', 0.46); SK.sun(g, W * 0.22, H * 0.14, 46, '#f4e0c0', 0.4);
  g.fillStyle = '#1a1416'; g.beginPath(); g.moveTo(W * 0.4, H * 0.42); g.quadraticCurveTo(W * 0.72, H * 0.24, W, H * 0.3); g.lineTo(W, H * 0.46); g.lineTo(W * 0.4, H * 0.46); g.fill();
  SK.house(g, W * 0.78, H * 0.3, 0.75, '#0e0a0c', 0.9, t); SK.palm(g, W * 0.08, H * 0.47, 420, 40, '#0a080c', t);
  paddy(g, H * 0.46, t); g.fillStyle = 'rgba(10,8,12,0.35)'; g.fillRect(0, H * 0.46, W, H);
  SK.person(g, W * 0.32 + Math.sin(t) * 6, H * 0.5, 280, 'stand', '#08060a', t * 2); g.strokeStyle = '#08060a'; g.lineWidth = 8; g.beginPath(); g.moveTo(W * 0.32 + 20, H * 0.5 - 150); g.lineTo(W * 0.32 + 90, H * 0.5 - 30); g.stroke();
  SK.grain(g, t, 0.07); };
