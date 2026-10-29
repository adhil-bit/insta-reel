function tharavad(g, x, base, s, col, lit, t) { g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = col; g.fillRect(-320, -230, 640, 230);
  g.beginPath(); g.moveTo(-390, -220); g.lineTo(-280, -380); g.lineTo(280, -380); g.lineTo(390, -220); g.closePath(); g.fill(); g.beginPath(); g.moveTo(-180, -380); g.lineTo(0, -480); g.lineTo(180, -380); g.fill();
  for (let i = 0; i < 6; i++) { g.fillStyle = col; g.fillRect(-300 + i * 120, -230, 22, 230); }
  if (lit) for (let i = 0; i < 4; i++) { const f = 0.75 + 0.25 * Math.sin(t * 3 + i); g.fillStyle = `rgba(255,190,100,${0.8 * f * lit})`; g.fillRect(-250 + i * 140, -170, 50, 70); }
  g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), lines = Math.floor(clamp((k - 0.1) / 0.7) * 9);
  g.fillStyle = '#120c08'; g.fillRect(0, 0, W, H); SK.lamp(g, W * 0.82, H * 0.6, 1, t);
  g.fillStyle = '#3a2416'; g.fillRect(0, H * 0.6, W, H * 0.4);
  g.save(); g.translate(W * 0.42, H * 0.5); g.rotate(-0.05); g.fillStyle = '#efe4c8'; g.fillRect(-230, -300, 460, 560); g.fillStyle = '#3a2a1a'; g.font = '700 26px Inter'; g.textAlign = 'center'; g.fillText('SCENE 1 · THARAVAD · NIGHT', 0, -240);
  g.fillStyle = '#6a5a44'; for (let i = 0; i < lines; i++) g.fillRect(-190, -190 + i * 46, 380 - (i * 47) % 120, 9); g.restore();
  g.save(); g.translate(W * 0.2, H * 0.3); g.rotate(-0.2); g.fillStyle = '#1a1a1e'; g.fillRect(-90, 0, 180, 110); g.fillStyle = '#e8e8e8'; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(-90 + i * 40, 0); g.lineTo(-70 + i * 40, 0); g.lineTo(-90 + i * 40, 26); g.lineTo(-110 + i * 40, 26); g.fill(); }
  g.rotate(-0.3 * (0.5 + 0.5 * Math.sin(t * 2))); g.fillStyle = '#1a1a1e'; g.fillRect(-90, -30, 180, 28); g.restore();
  SK.grain(g, t, 0.07); };
