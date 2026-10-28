const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), shut = ease.inOut(clamp((k - 0.6) / 0.3));
  SK.sky(g, 'dawn', 0.6); SK.sun(g, W * 0.5, H * 0.58, 100, '#ffd8a0', 0.55); SK.birds(g, t, 4, 0.2); SK.sea(g, H * 0.58, t, ['#6a7aa8', '#4a5a8a', '#2a3a6a'], false, H * 0.7);
  g.fillStyle = '#120c10'; g.fillRect(0, H * 0.7, W, H); SK.palm(g, W * 0.1, H * 0.72, 460, 40, SK.ink, t); SK.palm(g, W * 0.9, H * 0.72, 420, -40, SK.ink, t);
  g.save(); g.translate(W * lerp(0.6, 0.72, k), H * 0.6); g.scale(0.35, 0.35); g.fillStyle = SK.ink; g.beginPath(); g.moveTo(-180, -10); g.quadraticCurveTo(0, 40, 200, -30); g.lineTo(160, 30); g.lineTo(-150, 30); g.fill(); g.fillRect(-5, -250, 10, 240); g.beginPath(); g.moveTo(-70, -220); g.lineTo(70, -220); g.lineTo(60, -80); g.lineTo(-60, -80); g.fill(); g.restore();
  if (shut > 0) { g.fillStyle = `rgba(8,6,10,${0.75 * shut})`; g.fillRect(0, 0, W, H * 0.5 * shut); g.fillRect(0, H - H * 0.5 * shut, W, H * 0.5 * shut); }
  SK.grain(g, t, 0.07); };
