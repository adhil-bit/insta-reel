function paddy(g, top, t) { g.fillStyle = '#4a6a2a'; g.fillRect(0, top, W, H - top); g.strokeStyle = '#7aa04a'; g.lineWidth = 4;
  for (let r = 0; r < 18; r++) for (let i = 0; i < 24; i++) { const x = (i * 47 + r * 19) % (W + 40) - 20, y = top + 20 + r * 34; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 5 + Math.sin(t * 1.5 + i + r) * 3, y - 22); g.stroke(); } }
function deed(g, x, y, s, title, sub) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#efe4c8'; g.fillRect(-220, -280, 440, 560); g.fillStyle = '#3a2a1a'; g.font = '800 34px Inter, Baloo, Noto'; g.textAlign = 'center'; g.fillText(title, 0, -200); g.font = '700 26px Inter, Baloo, Noto'; g.fillText(sub, 0, -158);
  g.fillStyle = '#7a6a54'; for (let i = 0; i < 9; i++) g.fillRect(-170, -100 + i * 36, 340 - (i * 37) % 90, 8); g.fillStyle = '#9a1a1a'; g.beginPath(); g.arc(130, 220, 42, 0, 6.283); g.fill(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), st = ease.out(clamp((k - 0.5) / 0.15));
  SK.sky(g, 'dawn', 0.62); SK.sun(g, W * 0.5, H * 0.5, 120, '#ffd8a0', 0.5); paddy(g, H * 0.62, t);
  deed(g, W * 0.5, H * 0.36, 0.75, 'ഭൂപരിഷ്കരണം', 'കേരളം · 1970');
  if (st > 0) { g.save(); g.translate(W * 0.5, H * 0.43); g.rotate(-0.12); g.scale(1.4 - 0.4 * st, 1.4 - 0.4 * st); g.globalAlpha = st; g.strokeStyle = '#2a8a3a'; g.lineWidth = 10; g.strokeRect(-260, -55, 520, 110); g.fillStyle = '#2a8a3a'; g.font = '800 46px Inter, Baloo, Noto'; g.textAlign = 'center'; g.fillText('കൃഷിഭൂമി കർഷകന്', 0, 16); g.restore(); }
  SK.person(g, W * 0.24, H * 0.72, 300, 'arm_up', '#0a0806', t); SK.grain(g, t, 0.05); };
