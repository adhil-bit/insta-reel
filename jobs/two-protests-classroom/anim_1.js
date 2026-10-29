function sepia(g) { g.fillStyle = 'rgba(112,66,20,0.28)'; g.fillRect(0, 0, W, H); }
function desk(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#5a3a22'; g.fillRect(-160, -20, 320, 24); g.fillRect(-150, 4, 14, 120); g.fillRect(136, 4, 14, 120); g.fillStyle = '#efe4c8'; g.save(); g.rotate(-0.06); g.fillRect(-70, -60, 140, 40); g.restore(); g.fillStyle = '#2a2a30'; g.fillRect(-120, -48, 40, 28); g.restore(); }
function roach(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#6a3a1a'; g.beginPath(); g.ellipse(0, 0, 60, 34, 0, 0, 6.283); g.fill(); g.fillStyle = '#3a1e0c'; g.beginPath(); g.arc(64, 0, 20, 0, 6.283); g.fill();
  g.strokeStyle = '#3a1e0c'; g.lineWidth = 5; for (const sd of [-1, 1]) { for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-30 + i * 30, sd * 26); g.lineTo(-44 + i * 30 + Math.sin(t * 8 + i) * 6, sd * 62); g.stroke(); } g.beginPath(); g.moveTo(76, sd * 8); g.quadraticCurveTo(120, sd * 30, 150, sd * 70); g.stroke(); } g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), crowd = ease.out(clamp((k - 0.35) / 0.4));
  SK.sky(g, 'day', 0.62); SK.ground(g, H * 0.62, '#a08a5a', '#6a5638');
  g.fillStyle = '#d8c8a0'; g.fillRect(W * 0.18, H * 0.44, W * 0.4, H * 0.18); g.fillStyle = '#8a3a2a'; g.beginPath(); g.moveTo(W * 0.15, H * 0.44); g.lineTo(W * 0.38, H * 0.36); g.lineTo(W * 0.61, H * 0.44); g.fill(); g.fillStyle = '#5a4630'; for (let i = 0; i < 4; i++) g.fillRect(W * (0.22 + i * 0.09), H * 0.5, 40, 56);
  const sc = ease.out(clamp(k / 0.3)); g.save(); g.translate(W * 0.78, H * 0.42); g.scale(sc, sc); g.fillStyle = '#efe4c8'; g.fillRect(-90, -120, 180, 240); g.fillStyle = '#6a5a44'; for (let i = 0; i < 8; i++) g.fillRect(-70, -96 + i * 26, 140 - (i * 23) % 50, 8); g.fillStyle = '#b02a2a'; g.beginPath(); g.arc(50, 90, 22, 0, 6.283); g.fill(); g.restore();
  if (crowd > 0) { g.save(); g.globalAlpha = crowd; SK.crowd(g, W * 0.05, W * 0.95, H * 0.7, 9, 240 * crowd, t, '#2a1a10'); g.restore(); }
  sepia(g); SK.grain(g, t, 0.08); };
