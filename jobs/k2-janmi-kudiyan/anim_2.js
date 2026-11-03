const c = makeCanvas(), g = c.getContext('2d'); const IMG = document.getElementById('earthTex');
window.renderFrame = function (t) { const k = clamp(t / DURATION), st = ease.out(clamp((k - 0.2) / 0.12)), ch = ease.out(clamp((k - 0.55) / 0.2));
  g.fillStyle = '#1a120a'; g.fillRect(0, 0, W, H);
  const lon0 = 74.2, lon1 = 78.2, lat1 = 13.2, PX = W / (lon1 - lon0), lat0 = lat1 - (H * 0.5) / PX, top = H * 0.2;
  const sx = (lon0 + 180) / 360 * IMG.width, sw = (lon1 - lon0) / 360 * IMG.width, sy = (90 - lat1) / 180 * IMG.height, sh = (lat1 - lat0) / 180 * IMG.height;
  g.filter = 'sepia(0.85) contrast(1.05) brightness(0.9)'; g.drawImage(IMG, sx, sy, sw, sh, 0, top, W, H * 0.5); g.filter = 'none';
  const gr = g.createRadialGradient(W / 2, H * 0.45, 200, W / 2, H * 0.45, 800); gr.addColorStop(0, 'rgba(26,18,10,0)'); gr.addColorStop(1, 'rgba(26,18,10,0.9)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  if (st > 0) { g.save(); g.translate(W * 0.72, H * 0.28); g.rotate(-0.15); g.scale(1.4 - 0.4 * st, 1.4 - 0.4 * st); g.globalAlpha = st; g.strokeStyle = '#c0392b'; g.lineWidth = 10; g.strokeRect(-120, -55, 240, 110); g.fillStyle = '#c0392b'; g.font = '800 62px Inter, Baloo, Noto'; g.textAlign = 'center'; g.fillText('1766', 0, 22); g.restore(); }
  if (ch > 0) { g.save(); g.globalAlpha = ch; g.font = '800 40px Inter, Baloo, Noto'; g.textAlign = 'center'; for (const [x, txt, col] of [[W * 0.28, 'ആശ്വാസം?', '#34D399'], [W * 0.72, 'ഭീകരത?', '#FF4D5E']]) { g.fillStyle = 'rgba(10,8,6,0.85)'; g.beginPath(); g.roundRect(x - 150, H * 0.72, 300, 76, 38); g.fill(); g.strokeStyle = col; g.lineWidth = 4; g.stroke(); g.fillStyle = col; g.fillText(txt, x, H * 0.72 + 52); } g.restore(); }
  SK.grain(g, t, 0.06); };
