// Real map: southern Kerala; the four taluks that went to Madras State in 1956
const c = makeCanvas(), g = c.getContext('2d'); const img = document.getElementById('earthTex');
const LON0 = 74.2, LON1 = 79.2, LAT1 = 12.9, LAT0 = 7.6, PX = W / (LON1 - LON0), TOP = H * 0.2, MAPH = (LAT1 - LAT0) * PX;
const P = (lat, lon) => [(lon - LON0) * PX, TOP + (LAT1 - lat) * PX];
const kk = [[8.6, 77.0], [8.55, 77.25], [8.45, 77.5], [8.25, 77.62], [8.07, 77.56], [8.1, 77.3], [8.25, 77.15], [8.4, 77.05]].map(([a, b]) => P(a, b));
window.renderFrame = function (t) { const k = clamp(t / DURATION), fill = ease.out(clamp((k - 0.3) / 0.3)), zoom = 1 + 0.35 * ease.inOut(clamp((k - 0.1) / 0.6));
  g.fillStyle = '#05080e'; g.fillRect(0, 0, W, H);
  const [fx, fy] = P(8.3, 77.3); g.save(); g.translate(fx, fy); g.scale(zoom, zoom); g.translate(-fx, -fy);
  const sx = (LON0 + 180) / 360 * img.width, sw = (LON1 - LON0) / 360 * img.width, sy = (90 - LAT1) / 180 * img.height, sh = (LAT1 - LAT0) / 180 * img.height;
  g.filter = 'saturate(1.2) contrast(1.1) brightness(0.95)'; g.drawImage(img, sx, sy, sw, sh, 0, TOP, W, MAPH); g.filter = 'none';
  g.fillStyle = `rgba(250,204,21,${0.45 * fill})`; g.strokeStyle = `rgba(250,204,21,${fill})`; g.lineWidth = 4 / zoom; g.beginPath(); kk.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); g.stroke();
  const [px, py] = P(8.25, 77.32); const q = (t * 1.2) % 1; g.strokeStyle = `rgba(255,77,94,${1 - q})`; g.lineWidth = 4 / zoom; g.beginPath(); g.arc(px, py, (10 + q * 30) / zoom * 1.5, 0, 6.283); g.stroke(); g.fillStyle = '#FF4D5E'; g.beginPath(); g.arc(px, py, 8 / zoom * 1.5, 0, 6.283); g.fill();
  g.restore();
  const fade = (y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); };
  fade(TOP - 30, TOP + 60, 'rgba(5,8,14,1)', 'rgba(5,8,14,0)'); fade(TOP + MAPH - 80, TOP + MAPH + 30, 'rgba(5,8,14,0)', 'rgba(5,8,14,1)'); g.fillStyle = '#05080e'; g.fillRect(0, TOP + MAPH + 30, W, H);
  SK.grain(g, t, 0.05); };
