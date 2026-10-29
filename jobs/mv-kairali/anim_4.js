function bulk(g, x, y, s, t, a = 1, tilt = 0) {   // bulk carrier silhouette, (x,y) = waterline centre
  g.save(); g.globalAlpha *= a; g.translate(x, y + Math.sin(t * 1.1) * 6 * s); g.rotate(tilt + Math.sin(t * 0.9) * 0.015); g.scale(s, s); g.fillStyle = '#0e1016';
  g.beginPath(); g.moveTo(-330, -20); g.lineTo(320, -20); g.lineTo(350, -70); g.lineTo(300, 40); g.lineTo(-300, 40); g.closePath(); g.fill();
  g.fillRect(-300, -60, 70, 40); g.fillRect(-290, -130, 50, 70); g.fillRect(-275, -170, 20, 40); for (let i = 0; i < 5; i++) g.fillRect(-200 + i * 100, -44, 70, 24);
  for (const cx of [-150, 50, 220]) { g.fillRect(cx - 4, -150, 8, 130); g.save(); g.translate(cx, -150); g.rotate(0.6); g.fillRect(0, -3, 90, 6); g.restore(); }
  g.fillStyle = 'rgba(255,214,140,0.85)'; g.fillRect(-282, -112, 10, 10); g.fillRect(-262, -112, 10, 10); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
function panel(x, y, draw, on) { g.save(); g.translate(x, y); g.globalAlpha = on; g.fillStyle = '#121a2a'; g.beginPath(); g.roundRect(-230, -210, 460, 420, 26); g.fill(); g.save(); g.beginPath(); g.roundRect(-230, -210, 460, 420, 26); g.clip(); draw(); g.restore(); g.restore(); }
window.renderFrame = function (t) { const k = clamp(t / DURATION); g.fillStyle = '#080a10'; g.fillRect(0, 0, W, H);
  const at = [0.0, 0.2, 0.4, 0.6], P = [[0.27, 0.36], [0.73, 0.36], [0.27, 0.6], [0.73, 0.6]];
  const D = [() => { g.save(); g.scale(0.55, 0.55); g.strokeStyle = '#5aff8a'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 260, 0, 6.283); g.stroke(); const a = t * 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 260, Math.sin(a) * 260); g.stroke(); g.strokeStyle = '#ff4d5e'; g.lineWidth = 8; g.beginPath(); g.moveTo(-120, -200); g.lineTo(-20, -40); g.lineTo(-90, 60); g.lineTo(40, 220); g.stroke(); g.restore(); },
    () => { g.fillStyle = '#16244a'; g.fillRect(-230, 40, 460, 200); bulk(g, 0, 50, 0.45, t, 1, 0.12); g.fillStyle = '#8a3a22'; g.beginPath(); g.moveTo(-80, 20); g.lineTo(60, 0); g.lineTo(100, 30); g.fill(); },
    () => { g.fillStyle = '#16244a'; g.fillRect(-230, 40, 460, 200); g.strokeStyle = 'rgba(220,230,240,0.6)'; g.lineWidth = 3; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(-230 + i * 40 + (t * 200) % 40, -210); g.lineTo(-250 + i * 40 + (t * 200) % 40, 40); g.stroke(); } bulk(g, 0, 60, 0.42, t * 2, 1, Math.sin(t * 2) * 0.2); },
    () => { g.fillStyle = '#16244a'; g.fillRect(-230, 40, 460, 200); bulk(g, 60, 50, 0.4, t); g.fillStyle = '#0e1016'; g.beginPath(); g.moveTo(-200, 60); g.lineTo(-80, 60); g.lineTo(-100, 85); g.lineTo(-190, 85); g.fill(); g.fillRect(-150, 30, 6, 30); }];
  D.forEach((d, i) => panel(W * P[i][0], H * P[i][1], d, ease.out(clamp((k - at[i]) / 0.12))));
  SK.grain(g, t, 0.05); };
