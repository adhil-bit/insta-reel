function bulk(g, x, y, s, t, a = 1, tilt = 0) {   // bulk carrier silhouette, (x,y) = waterline centre
  g.save(); g.globalAlpha *= a; g.translate(x, y + Math.sin(t * 1.1) * 6 * s); g.rotate(tilt + Math.sin(t * 0.9) * 0.015); g.scale(s, s); g.fillStyle = '#0e1016';
  g.beginPath(); g.moveTo(-330, -20); g.lineTo(320, -20); g.lineTo(350, -70); g.lineTo(300, 40); g.lineTo(-300, 40); g.closePath(); g.fill();
  g.fillRect(-300, -60, 70, 40); g.fillRect(-290, -130, 50, 70); g.fillRect(-275, -170, 20, 40); for (let i = 0; i < 5; i++) g.fillRect(-200 + i * 100, -44, 70, 24);
  for (const cx of [-150, 50, 220]) { g.fillRect(cx - 4, -150, 8, 130); g.save(); g.translate(cx, -150); g.rotate(0.6); g.fillRect(0, -3, 90, 6); g.restore(); }
  g.fillStyle = 'rgba(255,214,140,0.85)'; g.fillRect(-282, -112, 10, 10); g.fillRect(-262, -112, 10, 10); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), fog = ease.inOut(clamp((k - 0.5) / 0.45));
  SK.sky(g, 'night', 0.6); for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + 0.4 * ((i * 37) % 10) / 10})`; g.fillRect((i * 173) % W, (i * 97) % (H * 0.5), 2, 2); }
  SK.sun(g, W * 0.78, H * 0.18, 40, '#e8ecf4', 0.25); SK.sea(g, H * 0.6, t, ['#16244a', '#101a36', '#0a1024', '#060a18'], false);
  bulk(g, W * 0.5 + k * 60, H * 0.62, 1.1, t, 1 - 0.85 * fog);
  for (let i = 0; i < 10; i++) { g.fillStyle = `rgba(200,210,230,${0.22 * fog})`; g.beginPath(); g.ellipse(W * (i % 5) * 0.25 + Math.sin(t * 0.3 + i) * 40, H * (0.5 + (i % 3) * 0.06), 420, 90, 0, 0, 6.283); g.fill(); }
  SK.grain(g, t, 0.07); };
