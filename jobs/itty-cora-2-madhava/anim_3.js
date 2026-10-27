function palmLeaf(g, x, y, w, h, t, glow = 0) { g.fillStyle = '#c9a25a'; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, h / 2); g.fill(); g.fillStyle = '#8a6a34'; g.beginPath(); g.arc(x - w * 0.3, y, 6, 0, 6.283); g.arc(x + w * 0.3, y, 6, 0, 6.283); g.fill();
  if (glow > 0) { g.fillStyle = `rgba(255,236,180,${glow})`; for (let i = 0; i < 3; i++) g.fillRect(x - w * 0.42, y - h * 0.28 + i * h * 0.24, w * (0.84 - i * 0.1), 4); } }
function scholar(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = SK.ink; g.beginPath(); g.arc(0, -210, 30, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(-60, -180); g.quadraticCurveTo(0, -200, 60, -180); g.lineTo(110, 0); g.lineTo(-110, 0); g.fill(); g.strokeStyle = SK.ink; g.lineWidth = 14; g.beginPath(); g.moveTo(30, -150); g.lineTo(110, -90 + Math.sin(t * 3) * 6); g.stroke(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), p = ease.inOut(clamp((k - 0.05) / 0.7)), y = H * 0.45, x0 = W * 0.1, x1 = W * 0.9, xe = lerp(x0, x1, p);
  g.fillStyle = '#100c0a'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#e8dcc0'; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, y); g.lineTo(xe, y); g.stroke();
  const at = yr => lerp(x0, x1, (yr - 1350) / 350);
  for (let yr = 1350; yr <= 1700; yr += 50) { const x = at(yr); if (x > xe) break; g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x - 2, y - 16, 4, 32); g.font = '600 30px Inter'; g.textAlign = 'center'; g.fillText(yr, x, y + 60); }
  if (xe > at(1400)) { g.fillStyle = ACCENT; g.beginPath(); g.arc(at(1400), y, 22, 0, 6.283); g.fill(); g.font = '800 34px Inter'; g.fillText('MADHAVA', at(1400), y - 50); }
  if (xe > at(1670)) { g.fillStyle = '#9aa8ff'; g.beginPath(); g.arc(at(1670), y, 22, 0, 6.283); g.fill(); g.font = '800 34px Inter'; g.fillText('NEWTON', at(1670), y - 50); }
  if (k > 0.8) { const a = clamp((k - 0.8) / 0.12); g.strokeStyle = rgba(ACCENT, a); g.lineWidth = 6; g.beginPath(); g.moveTo(at(1400), y + 110); g.lineTo(at(1400), y + 140); g.lineTo(at(1670), y + 140); g.lineTo(at(1670), y + 110); g.stroke();
    g.font = '800 64px Inter'; g.fillStyle = rgba(ACCENT, a); g.fillText('~250 YEARS', (at(1400) + at(1670)) / 2, y + 220); }
  SK.grain(g, t, 0.05); };
