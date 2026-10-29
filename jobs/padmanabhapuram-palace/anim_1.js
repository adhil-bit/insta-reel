const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), flip = clamp((k - 0.35) / 0.15), glow = ease.out(clamp((k - 0.55) / 0.3));
  g.fillStyle = '#140c08'; g.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H * 0.42; g.fillStyle = '#efe4c8'; g.fillRect(cx - 240, cy - 260, 480, 520); g.fillStyle = '#c0392b'; g.fillRect(cx - 240, cy - 260, 480, 110);
  g.fillStyle = '#fff'; g.font = '800 58px Inter'; g.textAlign = 'center'; g.fillText('NOVEMBER', cx, cy - 185); g.fillStyle = '#2a1a10'; g.font = '800 300px Inter'; g.fillText('1', cx, cy + 150); g.font = '700 54px Inter'; g.fillText('1956', cx, cy + 230);
  if (flip > 0 && flip < 1) { g.save(); g.translate(cx, cy - 260); g.scale(1, 1 - flip); g.fillStyle = '#e8dcc0'; g.fillRect(-240, 0, 480, 520); g.restore(); }
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283 + t; const r = 320 * glow; SK.lamp(g, cx + Math.cos(a) * r, cy + 300 + Math.sin(a) * 40 * glow, 0.4 * glow, t + i); }
  SK.grain(g, t, 0.06); };
