const c = makeCanvas(), g = c.getContext('2d');
function caravel(x, y, s, t) { g.save(); g.translate(x, y + Math.sin(t * 1.2) * 6); g.scale(s, s); g.fillStyle = SK.ink; g.beginPath(); g.moveTo(-200, -20); g.quadraticCurveTo(0, 50, 220, -40); g.lineTo(180, 30); g.lineTo(-170, 30); g.fill();
  for (const mx of [-70, 50]) { g.fillRect(mx - 5, -260, 10, 240); g.fillStyle = '#e8dcc0'; g.beginPath(); g.moveTo(mx - 70, -230); g.quadraticCurveTo(mx, -200 + Math.sin(t) * 6, mx + 70, -230); g.lineTo(mx + 60, -90); g.quadraticCurveTo(mx, -70, mx - 60, -90); g.fill();
    g.fillStyle = '#b02a2a'; g.fillRect(mx - 14, -190, 28, 60); g.fillRect(mx - 30, -170, 60, 20); g.fillStyle = SK.ink; } g.restore(); }
window.renderFrame = function (t) { const k = clamp(t / DURATION); SK.sky(g, 'dawn', 0.6); SK.sun(g, W * 0.7, H * 0.55, 90, '#ffd8a0', 0.5); SK.birds(g, t, 3, 0.22);
  SK.sea(g, H * 0.58, t, ['#4a5a8a', '#2a3a6a', '#1a2448', '#101830'], false); caravel(lerp(W * 0.35, W * 0.6, k), H * 0.62, 1.1, t); SK.grain(g, t, 0.06); };
