const PL = [['#c8b8a0', 70, 2.2, 9], ['#f0d8a0', 110, 1.5, 12], ['#d86a4a', 160, 1.0, 11], ['#e8c890', 220, 0.6, 18], ['#d8c088', 280, 0.4, 15]];
function stars(g, n = 120) { for (let i = 0; i < n; i++) { g.fillStyle = `rgba(255,255,255,${0.25 + 0.5 * ((i * 37) % 10) / 10})`; g.fillRect((i * 173) % W, (i * 97) % (H * 0.7), 2, 2); } }
function tycho(g, cx, cy, t, scale = 1, showSun = 1, k = 1) {   // Earth centre; Sun orbits Earth; planets orbit the Sun
  g.save(); g.translate(cx, cy); g.scale(scale, scale);
  const sa = t * 0.35, sx = Math.cos(sa) * 330, sy = Math.sin(sa) * 330;
  g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 330, 0, 6.283); g.stroke();
  PL.forEach(([col, r, sp, sz], i) => { if (k < i * 0.15) return; g.strokeStyle = rgba(col, 0.35); g.beginPath(); g.arc(sx, sy, r, 0, 6.283); g.stroke();
    const a = t * sp + i; g.fillStyle = col; g.beginPath(); g.arc(sx + Math.cos(a) * r, sy + Math.sin(a) * r, sz, 0, 6.283); g.fill(); });
  if (showSun) SK.sun(g, sx, sy, 34, '#ffd27a', 0.6);
  g.fillStyle = '#3a8ad8'; g.beginPath(); g.arc(0, 0, 26, 0, 6.283); g.fill(); g.fillStyle = '#4aa84a'; g.beginPath(); g.arc(-6, -4, 12, 0, 6.283); g.fill(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), p = ease.inOut(clamp((k - 0.05) / 0.7)), y = H * 0.45, x0 = W * 0.1, x1 = W * 0.9, xe = lerp(x0, x1, p), at = yr => lerp(x0, x1, (yr - 1480) / 130);
  g.fillStyle = '#0c0a10'; g.fillRect(0, 0, W, H); g.strokeStyle = '#e8dcc0'; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, y); g.lineTo(xe, y); g.stroke();
  g.textAlign = 'center'; for (let yr = 1480; yr <= 1610; yr += 20) { const x = at(yr); if (x > xe) break; g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x - 2, y - 14, 4, 28); g.font = '600 30px Inter'; g.fillText(yr, x, y + 58); }
  if (xe > at(1500)) { g.fillStyle = ACCENT; g.beginPath(); g.arc(at(1500), y, 22, 0, 6.283); g.fill(); g.font = '800 34px Inter'; g.fillText('NILAKANTHA', at(1500), y - 50); }
  if (xe > at(1588)) { g.fillStyle = '#9aa8ff'; g.beginPath(); g.arc(at(1588), y, 22, 0, 6.283); g.fill(); g.font = '800 34px Inter'; g.fillText('TYCHO', at(1588), y - 50); }
  if (k > 0.8) { const a = clamp((k - 0.8) / 0.12); g.strokeStyle = rgba(ACCENT, a); g.lineWidth = 6; g.beginPath(); g.moveTo(at(1500), y + 100); g.lineTo(at(1500), y + 130); g.lineTo(at(1588), y + 130); g.lineTo(at(1588), y + 100); g.stroke(); g.font = '800 64px Inter'; g.fillStyle = rgba(ACCENT, a); g.fillText('~90 YEARS', (at(1500) + at(1588)) / 2, y + 210); }
  SK.grain(g, t, 0.05); };
