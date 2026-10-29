const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), p = ease.inOut(clamp((k - 0.05) / 0.7)), y = H * 0.45, x0 = W * 0.1, x1 = W * 0.9, xe = lerp(x0, x1, p), at = yr => lerp(x0, x1, (yr - 400) / 1200);
  g.fillStyle = '#120c08'; g.fillRect(0, 0, W, H); g.strokeStyle = '#e8dcc0'; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, y); g.lineTo(xe, y); g.stroke();
  g.textAlign = 'center'; for (let yr = 400; yr <= 1600; yr += 200) { const x = at(yr); if (x > xe) break; g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x - 2, y - 14, 4, 28); g.font = '600 30px Inter'; g.fillText(yr + ' CE', x, y + 58); }
  if (xe > at(520)) { g.fillStyle = '#e8a040'; g.beginPath(); g.arc(at(520), y, 22, 0, 6.283); g.fill(); g.font = '800 32px Inter'; g.fillText('BODHIDHARMA', at(520), y - 50); }
  if (xe > at(1510)) { g.fillStyle = '#c0392b'; g.beginPath(); g.arc(at(1510), y, 22, 0, 6.283); g.fill(); g.font = '800 26px Inter'; g.textAlign = 'right'; g.fillText('KALARI IN RECORDS', at(1510) + 30, y - 50); g.textAlign = 'center'; }
  if (k > 0.8) { const a = clamp((k - 0.8) / 0.12); g.strokeStyle = `rgba(250,204,21,${a})`; g.lineWidth = 6; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(at(560), y + 100); g.lineTo(at(1470), y + 100); g.stroke(); g.setLineDash([]); g.font = '800 120px Inter'; g.fillStyle = `rgba(250,204,21,${a})`; g.fillText('?', (at(560) + at(1470)) / 2, y + 230); }
  SK.grain(g, t, 0.05); };
