const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), n = Math.floor(ease.out(clamp((k - 0.1) / 0.75)) * 64);
  g.fillStyle = '#120c08'; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(240,226,196,0.8)'; g.fillRect(W * 0.62, H * 0.24, W * 0.3, H * 0.36);
  for (let i = 0; i < 4; i++) SK.person(g, W * (0.1 + i * 0.12), H * 0.62, 260, 'stand', '#06040a', t + i);
  g.fillStyle = '#3a2416'; g.fillRect(0, H * 0.62, W, H);
  g.fillStyle = '#FACC15'; g.font = '800 260px Inter'; g.textAlign = 'center'; g.shadowColor = '#FACC15'; g.shadowBlur = 30; g.fillText(String(n), W * 0.42, H * 0.36); g.shadowBlur = 0;
  SK.lamp(g, W * 0.56, H * 0.66, 0.6, t); SK.grain(g, t, 0.08); };
