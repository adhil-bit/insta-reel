function bulk(g, x, y, s, t, a = 1, tilt = 0) {   // bulk carrier silhouette, (x,y) = waterline centre
  g.save(); g.globalAlpha *= a; g.translate(x, y + Math.sin(t * 1.1) * 6 * s); g.rotate(tilt + Math.sin(t * 0.9) * 0.015); g.scale(s, s); g.fillStyle = '#0e1016';
  g.beginPath(); g.moveTo(-330, -20); g.lineTo(320, -20); g.lineTo(350, -70); g.lineTo(300, 40); g.lineTo(-300, 40); g.closePath(); g.fill();
  g.fillRect(-300, -60, 70, 40); g.fillRect(-290, -130, 50, 70); g.fillRect(-275, -170, 20, 40); for (let i = 0; i < 5; i++) g.fillRect(-200 + i * 100, -44, 70, 24);
  for (const cx of [-150, 50, 220]) { g.fillRect(cx - 4, -150, 8, 130); g.save(); g.translate(cx, -150); g.rotate(0.6); g.fillRect(0, -3, 90, 6); g.restore(); }
  g.fillStyle = 'rgba(255,214,140,0.85)'; g.fillRect(-282, -112, 10, 10); g.fillRect(-262, -112, 10, 10); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d'); const noise = Array.from({length: 120}, () => (rand() - 0.5) * 6);
window.renderFrame = function (t) { const k = clamp(t / DURATION), dead = k > 0.45;
  g.fillStyle = '#0c0e12'; g.fillRect(0, 0, W, H); const cx = W / 2, cy = H * 0.44;
  g.fillStyle = '#2a2e36'; g.beginPath(); g.roundRect(cx - 360, cy - 220, 720, 440, 30); g.fill(); g.fillStyle = '#0a1a10'; g.beginPath(); g.roundRect(cx - 300, cy - 170, 600, 260, 16); g.fill();
  g.strokeStyle = dead ? 'rgba(255,77,94,0.9)' : '#5aff8a'; g.lineWidth = 5; g.beginPath(); for (let x = 0; x <= 560; x += 6) { const amp = dead ? noise[(x / 6 + Math.floor(t * 24)) % 120] : Math.sin(x / 18 + t * 10) * 70 * Math.abs(Math.sin(x / 90 + t)); x ? g.lineTo(cx - 280 + x, cy - 40 + amp) : g.moveTo(cx - 280 + x, cy - 40 + amp); } g.stroke();
  for (let i = 0; i < 4; i++) { g.fillStyle = '#4a4e56'; g.beginPath(); g.arc(cx - 220 + i * 140, cy + 150, 30, 0, 6.283); g.fill(); }
  g.fillStyle = dead ? '#3a1a1a' : '#5aff8a'; g.beginPath(); g.arc(cx + 300, cy - 190, 14, 0, 6.283); g.fill();
  if (!dead) for (let r = 0; r < 3; r++) { const q = (t * 1.5 + r / 3) % 1; g.strokeStyle = `rgba(90,255,138,${1 - q})`; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy - 300, 30 + q * 200, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); }
  SK.grain(g, t, 0.07); };
