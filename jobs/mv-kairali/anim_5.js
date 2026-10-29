function bulk(g, x, y, s, t, a = 1, tilt = 0) {   // bulk carrier silhouette, (x,y) = waterline centre
  g.save(); g.globalAlpha *= a; g.translate(x, y + Math.sin(t * 1.1) * 6 * s); g.rotate(tilt + Math.sin(t * 0.9) * 0.015); g.scale(s, s); g.fillStyle = '#0e1016';
  g.beginPath(); g.moveTo(-330, -20); g.lineTo(320, -20); g.lineTo(350, -70); g.lineTo(300, 40); g.lineTo(-300, 40); g.closePath(); g.fill();
  g.fillRect(-300, -60, 70, 40); g.fillRect(-290, -130, 50, 70); g.fillRect(-275, -170, 20, 40); for (let i = 0; i < 5; i++) g.fillRect(-200 + i * 100, -44, 70, 24);
  for (const cx of [-150, 50, 220]) { g.fillRect(cx - 4, -150, 8, 130); g.save(); g.translate(cx, -150); g.rotate(0.6); g.fillRect(0, -3, 90, 6); g.restore(); }
  g.fillStyle = 'rgba(255,214,140,0.85)'; g.fillRect(-282, -112, 10, 10); g.fillRect(-262, -112, 10, 10); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d'); const lights = Array.from({length: 51}, (_, i) => [rand(), rand(), i]);
window.renderFrame = function (t) { const k = clamp(t / DURATION), cross = ease.out(clamp((k - 0.1) / 0.2)), fade = clamp((k - 0.4) / 0.5);
  SK.sky(g, 'night', 0.5); SK.sea(g, H * 0.5, t, ['#101a36', '#0a1024', '#060a18'], false);
  g.save(); g.translate(W / 2, H * 0.32); g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, -110); g.lineTo(120, 90); g.lineTo(-120, 90); g.closePath(); g.stroke();
  g.strokeStyle = '#FF4D5E'; g.lineWidth = 12; g.beginPath(); g.moveTo(-150 * cross, -140 * cross); g.lineTo(150 * cross, 140 * cross); g.moveTo(150 * cross, -140 * cross); g.lineTo(-150 * cross, 140 * cross); g.stroke(); g.restore();
  for (const [x, y, i] of lights) { const a = clamp(1 - fade * 1.4 + (i % 7) * 0.05) * (0.6 + 0.4 * Math.sin(t * 3 + i)); g.fillStyle = `rgba(255,214,140,${a})`; g.beginPath(); g.arc(W * (0.12 + x * 0.76), H * (0.56 + y * 0.12), 6, 0, 6.283); g.fill(); }
  SK.grain(g, t, 0.07); };
