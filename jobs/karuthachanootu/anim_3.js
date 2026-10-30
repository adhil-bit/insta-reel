const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), rise = ease.out(clamp(k / 0.4));
  SK.sky(g, 'dusk', 0.62); g.fillStyle = '#140e12'; g.fillRect(0, H * 0.62, W, H);
  SK.house(g, W * 0.16, H * 0.62, 0.45, '#100a0e', 0.3, t); SK.house(g, W * 0.84, H * 0.62, 0.45, '#100a0e', 0.3, t);
  g.save(); g.translate(W * 0.5, H * 0.62); g.scale(1, rise); g.fillStyle = '#1e161c'; g.fillRect(-240, -360, 480, 360); g.beginPath(); g.moveTo(-280, -350); g.lineTo(0, -480); g.lineTo(280, -350); g.fill(); g.fillStyle = 'rgba(255,214,120,0.85)'; for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) g.fillRect(-190 + i * 110, -300 + r * 140, 60, 80); g.restore();
  for (let i = 0; i < 4; i++) { const a = ease.out(clamp((k - 0.35 - i * 0.1) / 0.15)); if (a <= 0) continue; const x = W * (i < 2 ? 0.12 + i * 0.1 : 0.78 + (i - 2) * 0.1), y = H * 0.7; SK.person(g, x, y, 200, 'stand', '#06040a', t + i);
    g.save(); g.globalAlpha = a; g.fillStyle = '#efe4c8'; g.beginPath(); g.roundRect(x - 60, y - 300, 120, 60, 24); g.fill(); g.fillStyle = '#2a1a1a'; for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(x - 30 + j * 30, y - 270, 7, 0, 6.283); g.fill(); } g.restore(); }
  SK.grain(g, t, 0.07); };
