function chest(g, x, y, s, glow, t) { g.save(); g.translate(x, y); g.scale(s, s);
  if (glow > 0) { const gl = g.createRadialGradient(0, -20, 10, 0, -20, 260); gl.addColorStop(0, `rgba(255,200,80,${0.6 * glow * (0.85 + 0.15 * Math.sin(t * 4))})`); gl.addColorStop(1, 'rgba(255,200,80,0)'); g.fillStyle = gl; g.fillRect(-260, -280, 520, 520); }
  g.fillStyle = '#5a3416'; g.fillRect(-90, -50, 180, 90); g.fillStyle = '#7a4a22'; g.beginPath(); g.moveTo(-90, -50); g.quadraticCurveTo(0, -110, 90, -50); g.fill();
  g.fillStyle = '#d8a83a'; g.fillRect(-94, -54, 188, 10); g.fillRect(-10, -60, 20, 40); g.fillRect(-94, 30, 188, 10);
  for (let i = 0; i < 6; i++) { g.fillStyle = '#ffd34a'; g.beginPath(); g.ellipse(-60 + i * 24, -58 - (i % 2) * 8, 12, 6, 0, 0, 6.283); g.fill(); } g.restore(); }
function streetlight(g, x, base, t) { g.fillStyle = '#2a2a30'; g.fillRect(x - 6, base - 520, 12, 520); g.fillRect(x - 6, base - 520, 120, 10); const f = 0.85 + 0.15 * Math.sin(t * 13);
  const gl = g.createRadialGradient(x + 110, base - 500, 5, x + 110, base - 300, 420); gl.addColorStop(0, `rgba(255,214,140,${0.45 * f})`); gl.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gl; g.beginPath(); g.moveTo(x + 110, base - 505); g.lineTo(x - 160, base); g.lineTo(x + 380, base); g.fill(); g.fillStyle = '#ffe2a0'; g.fillRect(x + 92, base - 512, 36, 10); }
function road(g, top, t) { g.fillStyle = '#16161c'; g.fillRect(0, top, W, H - top); g.fillStyle = '#2a2a32'; g.beginPath(); g.moveTo(W * 0.3, top); g.lineTo(W * 0.7, top); g.lineTo(W, H); g.lineTo(0, H); g.fill(); g.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 6; i++) { const y = top + 40 + i * i * 22; g.fillRect(W / 2 - 4 - i * 3, y, 8 + i * 6, 16 + i * 6); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), st = ease.out(clamp((k - 0.5) / 0.15));
  g.fillStyle = '#120c08'; g.fillRect(0, 0, W, H); const gl = g.createRadialGradient(W * 0.3, H * 0.6, 10, W * 0.3, H * 0.6, 520); gl.addColorStop(0, 'rgba(255,180,90,0.35)'); gl.addColorStop(1, 'rgba(255,180,90,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  SK.lamp(g, W * 0.12, H * 0.72, 0.7, t); SK.person(g, W * 0.32, H * 0.76, 300, 'stand', '#08060a', t); g.fillStyle = '#08060a'; g.beginPath(); g.ellipse(W * 0.32, H * 0.76 - 330, 46, 30, 0, Math.PI, 0); g.fill();
  for (let i = 0; i < 3; i++) SK.person(g, W * (0.6 + i * 0.12), H * 0.8, 170, 'stand', '#08060a', t + i);
  g.save(); g.globalAlpha = 0.85; g.fillStyle = '#efe4c8'; g.beginPath(); g.roundRect(W * 0.46, H * 0.3, 420, 110, 30); g.fill(); g.fillStyle = '#2a1a10'; g.font = '800 40px Inter'; g.textAlign = 'center'; g.fillText('"KALLA KOTHAYI!"', W * 0.46 + 210, H * 0.3 + 70); g.restore();
  if (st > 0) { g.save(); g.translate(W / 2, H * 0.2); g.rotate(-0.12); g.scale(1.4 - 0.4 * st, 1.4 - 0.4 * st); g.globalAlpha = st; g.strokeStyle = '#FF4D5E'; g.lineWidth = 10; g.strokeRect(-230, -55, 460, 110); g.fillStyle = '#FF4D5E'; g.font = '800 54px Inter'; g.textAlign = 'center'; g.fillText('NO PROOF', 0, 20); g.restore(); }
  SK.grain(g, t, 0.06); };
