function paddy(g, top, t) { g.fillStyle = '#4a6a2a'; g.fillRect(0, top, W, H - top); g.strokeStyle = '#7aa04a'; g.lineWidth = 4;
  for (let r = 0; r < 18; r++) for (let i = 0; i < 24; i++) { const x = (i * 47 + r * 19) % (W + 40) - 20, y = top + 20 + r * 34; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 5 + Math.sin(t * 1.5 + i + r) * 3, y - 22); g.stroke(); } }
function deed(g, x, y, s, title, sub) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#efe4c8'; g.fillRect(-220, -280, 440, 560); g.fillStyle = '#3a2a1a'; g.font = '800 34px Inter, Baloo, Noto'; g.textAlign = 'center'; g.fillText(title, 0, -200); g.font = '700 26px Inter, Baloo, Noto'; g.fillText(sub, 0, -158);
  g.fillStyle = '#7a6a54'; for (let i = 0; i < 9; i++) g.fillRect(-170, -100 + i * 36, 340 - (i * 37) % 90, 8); g.fillStyle = '#9a1a1a'; g.beginPath(); g.arc(130, 220, 42, 0, 6.283); g.fill(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'day', 0.62); paddy(g, H * 0.62, t);
  const tiers = [['കുടിയാൻ', '#6a8a3a', 0.62, 760], ['കാണക്കാരൻ', '#c9a25a', 0.5, 560], ['ജന്മി', '#9a1a1a', 0.38, 360]];
  tiers.forEach(([name, col, y, w], i) => { const a = ease.out(clamp((k - 0.08 - i * 0.22) / 0.2)); if (a <= 0) return; g.save(); g.globalAlpha = a; const yy = H * y - (1 - a) * 60;
    g.fillStyle = col; g.beginPath(); g.moveTo(W / 2 - w / 2, yy); g.lineTo(W / 2 + w / 2, yy); g.lineTo(W / 2 + w / 2 - 70, yy - H * 0.11); g.lineTo(W / 2 - w / 2 + 70, yy - H * 0.11); g.closePath(); g.fill();
    g.fillStyle = '#fff'; g.font = '800 46px Inter, Baloo, Noto'; g.textAlign = 'center'; g.fillText(name, W / 2, yy - H * 0.045); g.restore(); });
  SK.grain(g, t, 0.05); };
