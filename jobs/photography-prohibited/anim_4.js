const c = makeCanvas(), g = c.getContext('2d'); const N = 12, pieces = Array.from({length: N}, (_, i) => [i % 4, Math.floor(i / 4), rand() * 6.283, 300 + rand() * 300]);
window.renderFrame = function (t) { const k = clamp(t / DURATION), p = ease.inOut(clamp((k - 0.05) / 0.55));
  g.fillStyle = '#0e1016'; g.fillRect(0, 0, W, H); const cw = 200, ch = 160, ox = W / 2 - 2 * cw, oy = H * 0.24;
  pieces.forEach(([cx, cy, ang, dist]) => { const tx = ox + cx * cw, ty = oy + cy * ch, x = lerp(tx + Math.cos(ang) * dist, tx, p), y = lerp(ty + Math.sin(ang) * dist, ty, p);
    g.save(); g.translate(x + cw / 2, y + ch / 2); g.rotate((1 - p) * (ang - 3)); g.fillStyle = '#f2f0e8'; g.fillRect(-cw / 2 + 6, -ch / 2 + 6, cw - 12, ch - 12);
    g.fillStyle = '#3a4a5a'; g.fillRect(-cw / 2 + 14, -ch / 2 + 14, cw - 28, ch - 40); g.restore(); });
  if (p > 0.98) { g.strokeStyle = '#c0392b'; g.lineWidth = 6; g.strokeRect(ox + 40, oy + 40, cw * 4 - 80, ch * 3 - 80); g.fillStyle = 'rgba(192,57,43,0.8)'; g.font = '800 46px Inter'; g.textAlign = 'center'; g.fillText('A WHOLE BASE', W / 2, oy + ch * 3 + 70); }
  if (k > 0.7) { const a = clamp((k - 0.7) / 0.15); g.fillStyle = `rgba(250,204,21,${a})`; g.beginPath(); g.roundRect(W / 2 - 230, H * 0.74, 460, 70, 35); g.fill(); g.fillStyle = '#0e1016'; g.font = '800 32px Inter'; g.fillText('2019 · SPY RING CAUGHT', W / 2, H * 0.74 + 46); }
  SK.grain(g, t, 0.05); };
