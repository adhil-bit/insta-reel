function sepia(g) { g.fillStyle = 'rgba(112,66,20,0.28)'; g.fillRect(0, 0, W, H); }
function desk(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#5a3a22'; g.fillRect(-160, -20, 320, 24); g.fillRect(-150, 4, 14, 120); g.fillRect(136, 4, 14, 120); g.fillStyle = '#efe4c8'; g.save(); g.rotate(-0.06); g.fillRect(-70, -60, 140, 40); g.restore(); g.fillStyle = '#2a2a30'; g.fillRect(-120, -48, 40, 28); g.restore(); }
function roach(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#6a3a1a'; g.beginPath(); g.ellipse(0, 0, 60, 34, 0, 0, 6.283); g.fill(); g.fillStyle = '#3a1e0c'; g.beginPath(); g.arc(64, 0, 20, 0, 6.283); g.fill();
  g.strokeStyle = '#3a1e0c'; g.lineWidth = 5; for (const sd of [-1, 1]) { for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-30 + i * 30, sd * 26); g.lineTo(-44 + i * 30 + Math.sin(t * 8 + i) * 6, sd * 62); g.stroke(); } g.beginPath(); g.moveTo(76, sd * 8); g.quadraticCurveTo(120, sd * 30, 150, sd * 70); g.stroke(); } g.restore(); }
const c = makeCanvas(), g = c.getContext('2d'); const drops = Array.from({length: 18}, () => [rand(), rand()]);
window.renderFrame = function (t) { const k = clamp(t / DURATION), leak = ease.out(clamp((k - 0.1) / 0.3)), bug = ease.out(clamp((k - 0.55) / 0.3));
  g.fillStyle = '#0e1024'; g.fillRect(0, 0, W, H);
  g.save(); g.translate(W / 2, H * 0.42); g.rotate(-0.05); g.fillStyle = '#f2ede0'; g.fillRect(-260, -300, 520, 600); g.fillStyle = '#2a2a3a'; g.font = '800 40px Inter'; g.textAlign = 'center'; g.fillText('NEET-UG 2026', 0, -230); g.fillStyle = '#8a8a9a'; for (let i = 0; i < 12; i++) g.fillRect(-210, -170 + i * 36, 420 - (i * 37) % 120, 10);
  g.fillStyle = `rgba(200,40,40,${0.85 * leak})`; g.beginPath(); g.moveTo(180, 300); g.lineTo(260, 300); g.lineTo(260, 120); g.lineTo(200, 200); g.closePath(); g.fill(); g.restore();
  for (const [x, y] of drops) { const u = (t * 0.6 + y) % 1; if (leak <= 0) continue; g.fillStyle = `rgba(120,200,255,${0.8 * leak * (1 - u)})`; g.fillRect(W * (0.62 + x * 0.3), H * 0.6 + u * 300, 18, 30); }
  if (bug > 0) { g.save(); g.globalAlpha = bug; roach(g, lerp(-200, W * 0.32, bug), H * 0.74, 1.3, t); g.restore(); }
  SK.grain(g, t, 0.06); };
