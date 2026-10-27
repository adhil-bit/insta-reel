function palmLeaf(g, x, y, w, h, t, glow = 0) { g.fillStyle = '#c9a25a'; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, h / 2); g.fill(); g.fillStyle = '#8a6a34'; g.beginPath(); g.arc(x - w * 0.3, y, 6, 0, 6.283); g.arc(x + w * 0.3, y, 6, 0, 6.283); g.fill();
  if (glow > 0) { g.fillStyle = `rgba(255,236,180,${glow})`; for (let i = 0; i < 3; i++) g.fillRect(x - w * 0.42, y - h * 0.28 + i * h * 0.24, w * (0.84 - i * 0.1), 4); } }
function scholar(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = SK.ink; g.beginPath(); g.arc(0, -210, 30, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(-60, -180); g.quadraticCurveTo(0, -200, 60, -180); g.lineTo(110, 0); g.lineTo(-110, 0); g.fill(); g.strokeStyle = SK.ink; g.lineWidth = 14; g.beginPath(); g.moveTo(30, -150); g.lineTo(110, -90 + Math.sin(t * 3) * 6); g.stroke(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), n = Math.round(lerp(6, 96, ease.in(clamp(k / 0.85)))), cx = W / 2, cy = H * 0.42, R = 280;
  g.fillStyle = '#0e0c12'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.stroke();
  g.strokeStyle = ACCENT; g.lineWidth = 5; g.beginPath(); for (let i = 0; i <= n; i++) { const a = i / n * 6.283 - Math.PI / 2; const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  g.fillStyle = rgba(ACCENT, 0.08); g.fill();
  const piApprox = n * Math.sin(Math.PI / n); g.font = '800 92px Inter'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText(piApprox.toFixed(5), cx, cy + R + 140);
  g.font = '700 40px Inter'; g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillText(`${n} sides`, cx, cy + R + 200); SK.grain(g, t, 0.05); };
