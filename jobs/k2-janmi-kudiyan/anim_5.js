function paddy(g, top, t) { g.fillStyle = '#4a6a2a'; g.fillRect(0, top, W, H - top); g.strokeStyle = '#7aa04a'; g.lineWidth = 4;
  for (let r = 0; r < 18; r++) for (let i = 0; i < 24; i++) { const x = (i * 47 + r * 19) % (W + 40) - 20, y = top + 20 + r * 34; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 5 + Math.sin(t * 1.5 + i + r) * 3, y - 22); g.stroke(); } }
function deed(g, x, y, s, title, sub) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#efe4c8'; g.fillRect(-220, -280, 440, 560); g.fillStyle = '#3a2a1a'; g.font = '800 34px Inter'; g.textAlign = 'center'; g.fillText(title, 0, -200); g.font = '700 26px Inter'; g.fillText(sub, 0, -158);
  g.fillStyle = '#7a6a54'; for (let i = 0; i < 9; i++) g.fillRect(-170, -100 + i * 36, 340 - (i * 37) % 90, 8); g.fillStyle = '#9a1a1a'; g.beginPath(); g.arc(130, 220, 42, 0, 6.283); g.fill(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), a = ease.out(clamp((k - 0.1) / 0.3)), q = ease.out(clamp((k - 0.72) / 0.15));
  g.fillStyle = '#121014'; g.fillRect(0, 0, W, H); g.fillStyle = '#efe4c8'; g.fillRect(W / 2 - 3, H * 0.2, 6, H * 0.6);
  g.fillStyle = `rgba(106,138,58,${a})`; g.fillRect(W * 0.06, H * 0.5 - 280 * a, W * 0.38, 280 * a); SK.person(g, W * 0.25, H * 0.66, 240, 'arm_up', '#efe4c8', t);
  g.fillStyle = 'rgba(255,255,255,0.85)'; g.font = '800 36px Inter'; g.textAlign = 'center'; g.fillText('TENANT', W * 0.25, H * 0.74);
  g.fillStyle = `rgba(201,162,90,${a})`; g.fillRect(W * 0.7, H * 0.5 - 60 * a, W * 0.1, 60 * a); SK.person(g, W * 0.75, H * 0.66, 240, 'stand', '#efe4c8', t);
  g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillText('LABOURER', W * 0.75, H * 0.74); g.fillStyle = '#FACC15'; g.font = '800 44px Inter'; g.fillText('10 CENTS', W * 0.75, H * 0.38);
  if (q > 0) { g.fillStyle = `rgba(250,204,21,${q})`; g.beginPath(); g.roundRect(W / 2 - 150, H * 0.08, 300, 120, 30); g.fill(); g.fillStyle = '#121014'; for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(W / 2 - 70 + j * 70, H * 0.08 + 60, 14, 0, 6.283); g.fill(); } }
  SK.grain(g, t, 0.05); };
