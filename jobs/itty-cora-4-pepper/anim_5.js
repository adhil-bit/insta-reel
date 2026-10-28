const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION); SK.sky(g, 'night', 0.6); for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + 0.4 * ((i * 37) % 10) / 10})`; g.fillRect((i * 173) % W, (i * 97) % (H * 0.55), 2, 2); }
  SK.sea(g, H * 0.6, t, ['#16244a', '#101a36', '#0a1024'], false, H * 0.74); g.fillStyle = '#05070c'; g.fillRect(0, H * 0.74, W, H);
  g.save(); g.translate(lerp(W * 0.65, W * 0.25, k), H * 0.62); g.fillStyle = SK.ink; g.beginPath(); g.moveTo(-180, -10); g.quadraticCurveTo(0, 40, 200, -30); g.lineTo(160, 30); g.lineTo(-150, 30); g.fill(); g.fillRect(-5, -250, 10, 240); g.fillStyle = '#e8dcc0'; g.beginPath(); g.moveTo(-70, -220); g.lineTo(70, -220); g.lineTo(60, -80); g.lineTo(-60, -80); g.fill(); g.restore();
  const q = ease.out(clamp((k - 0.4) / 0.3)); if (q > 0) { g.save(); g.translate(W * 0.5, H * 0.3); g.globalAlpha = q; g.fillStyle = '#e8dcc0'; g.beginPath(); g.roundRect(-110, -70, 220, 140, 12); g.fill(); g.strokeStyle = '#4a2e12'; g.lineWidth = 3;
    for (const r of [24, 44]) { g.beginPath(); g.arc(40, 0, r, 0, 6.283); g.stroke(); } for (let i = 0; i < 4; i++) g.fillRect(-90, -40 + i * 24, 80, 6); g.restore();
    g.strokeStyle = rgba(ACCENT, 0.6 * q); g.lineWidth = 3; g.setLineDash([10, 10]); g.beginPath(); g.moveTo(W * 0.5, H * 0.3 + 80); g.lineTo(lerp(W * 0.65, W * 0.25, k), H * 0.55); g.stroke(); g.setLineDash([]); }
  SK.grain(g, t, 0.07); };
