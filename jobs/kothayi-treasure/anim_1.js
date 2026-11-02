const c = makeCanvas(), g = c.getContext('2d'); const IMG = document.getElementById('earthTex');
window.renderFrame = function (t) { const k = clamp(t / DURATION), dig = ease.out(clamp((k - 0.45) / 0.3));
  g.fillStyle = '#06080c'; g.fillRect(0, 0, W, H); const lon0 = 73.6, lon1 = 77.1, lat1 = 13.4, top = H * 0.2, hgt = H * 0.6, PX = W / (lon1 - lon0), lat0 = lat1 - hgt / PX;
  const sx = (lon0 + 180) / 360 * IMG.width, sw = (lon1 - lon0) / 360 * IMG.width, sy = (90 - lat1) / 180 * IMG.height, sh = (lat1 - lat0) / 180 * IMG.height;
  g.filter = 'saturate(1.15) brightness(0.8)'; g.drawImage(IMG, sx, sy, sw, sh, 0, top, W, hgt); g.filter = 'none';
  const x = (75.2 - lon0) * PX, y = top + (lat1 - 12.1) * PX; const q = (t * 1.2) % 1; g.strokeStyle = `rgba(250,204,21,${1 - q})`; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 12 + q * 50, 0, 6.283); g.stroke(); g.fillStyle = '#FACC15'; g.beginPath(); g.arc(x, y, 12, 0, 6.283); g.fill();
  const f = (y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }; f(top - 10, top + 60, 'rgba(6,8,12,1)', 'rgba(6,8,12,0)'); f(top + hgt - 70, top + hgt + 5, 'rgba(6,8,12,0)', 'rgba(6,8,12,1)'); g.fillStyle = '#06080c'; g.fillRect(0, top + hgt, W, H);
  if (dig > 0) { g.save(); g.globalAlpha = dig; g.fillStyle = 'rgba(8,8,12,0.85)'; g.beginPath(); g.roundRect(W * 0.1, H * 0.58, W * 0.5, H * 0.18, 24); g.fill(); g.restore(); SK.person(g, W * 0.3, H * 0.74, 200, 'arm_up', `rgba(10,8,6,${dig})`, t * 3); g.save(); g.globalAlpha = dig; g.translate(W * 0.45, H * 0.74); g.scale(0.5, 0.5); g.fillStyle = '#5a3416'; g.fillRect(-90, -50, 180, 90); g.restore(); }
  SK.grain(g, t, 0.04); };
