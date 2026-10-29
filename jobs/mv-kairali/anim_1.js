function bulk(g, x, y, s, t, a = 1, tilt = 0) {   // bulk carrier silhouette, (x,y) = waterline centre
  g.save(); g.globalAlpha *= a; g.translate(x, y + Math.sin(t * 1.1) * 6 * s); g.rotate(tilt + Math.sin(t * 0.9) * 0.015); g.scale(s, s); g.fillStyle = '#0e1016';
  g.beginPath(); g.moveTo(-330, -20); g.lineTo(320, -20); g.lineTo(350, -70); g.lineTo(300, 40); g.lineTo(-300, 40); g.closePath(); g.fill();
  g.fillRect(-300, -60, 70, 40); g.fillRect(-290, -130, 50, 70); g.fillRect(-275, -170, 20, 40); for (let i = 0; i < 5; i++) g.fillRect(-200 + i * 100, -44, 70, 24);
  for (const cx of [-150, 50, 220]) { g.fillRect(cx - 4, -150, 8, 130); g.save(); g.translate(cx, -150); g.rotate(0.6); g.fillRect(0, -3, 90, 6); g.restore(); }
  g.fillStyle = 'rgba(255,214,140,0.85)'; g.fillRect(-282, -112, 10, 10); g.fillRect(-262, -112, 10, 10); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), go = ease.inOut(clamp((k - 0.5) / 0.5));
  SK.sky(g, 'dawn', 0.6); SK.sun(g, W * 0.3, H * 0.56, 90, '#ffd8a0', 0.5); SK.sea(g, H * 0.6, t, ['#6a7aa8', '#4a5a8a', '#2a3a6a', '#1a2448'], false);
  g.fillStyle = '#3a2a24'; g.fillRect(0, H * 0.68, W * 0.34, H); g.fillStyle = '#8a3a22'; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(W * (0.02 + i * 0.1), H * 0.68); g.lineTo(W * (0.07 + i * 0.1), H * 0.6); g.lineTo(W * (0.12 + i * 0.1), H * 0.68); g.fill(); }
  g.fillStyle = '#1a1416'; g.fillRect(W * 0.26, H * 0.4, 16, H * 0.28); g.fillRect(W * 0.26, H * 0.4, 240 * (1 - go), 14);
  bulk(g, lerp(W * 0.62, W * 1.3, go), H * 0.66, 0.9, t); SK.birds(g, t, 3, 0.25); SK.grain(g, t, 0.06); };
