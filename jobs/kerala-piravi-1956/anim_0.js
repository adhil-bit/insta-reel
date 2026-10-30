const IMG = document.getElementById('earthTex');
function mapView(g, lon0, lon1, lat1, top) {   // draw a satellite crop; returns projector
  const PX = W / (lon1 - lon0), lat0 = lat1 - (H * 0.62) / PX; const MAPH = (lat1 - lat0) * PX;
  const sx = (lon0 + 180) / 360 * IMG.width, sw = (lon1 - lon0) / 360 * IMG.width, sy = (90 - lat1) / 180 * IMG.height, sh = (lat1 - lat0) / 180 * IMG.height;
  g.fillStyle = '#05080e'; g.fillRect(0, 0, W, H); g.filter = 'saturate(1.15) contrast(1.08) brightness(0.85)'; g.drawImage(IMG, sx, sy, sw, sh, 0, top, W, MAPH); g.filter = 'none';
  const fade = (y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); };
  fade(top - 20, top + 60, 'rgba(5,8,14,1)', 'rgba(5,8,14,0)'); fade(top + MAPH - 80, top + MAPH + 10, 'rgba(5,8,14,0)', 'rgba(5,8,14,1)'); g.fillStyle = '#05080e'; g.fillRect(0, top + MAPH + 10, W, H);
  return (lat, lon) => [(lon - lon0) * PX, top + (lat1 - lat) * PX];
}
function glow(g, x, y, r, col, a) { const gr = g.createRadialGradient(x, y, 4, x, y, r); gr.addColorStop(0, rgba(col, 0.75 * a)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); }
function chip(g, x, y, text, col, a = 1) { g.save(); g.globalAlpha = a; g.font = '800 30px Inter'; const w = g.measureText(text).width + 40; g.fillStyle = 'rgba(8,10,16,0.75)'; g.beginPath(); g.roundRect(x - w / 2, y - 26, w, 52, 26); g.fill(); g.strokeStyle = col; g.lineWidth = 3; g.stroke(); g.fillStyle = col; g.textAlign = 'center'; g.fillText(text, x, y + 10); g.restore(); }
function dot(g, x, y, col, t) { const q = (t * 1.2) % 1; g.strokeStyle = rgba(col, 1 - q); g.lineWidth = 4; g.beginPath(); g.arc(x, y, 10 + q * 40, 0, 6.283); g.stroke(); g.fillStyle = col; g.beginPath(); g.arc(x, y, 10, 0, 6.283); g.fill(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), p = ease.inOut(clamp((k - 0.2) / 0.5));
  const P = mapView(g, 72.5, 82.5, 16.2, H * 0.2); const [kx, ky] = P(11.25, 75.78), [mx, my] = P(13.08, 80.27);
  g.strokeStyle = '#FACC15'; g.lineWidth = 6; g.setLineDash([16, 12]); g.beginPath(); g.moveTo(kx, ky); g.lineTo(lerp(kx, mx, p), lerp(ky, my, p)); g.stroke(); g.setLineDash([]);
  dot(g, kx, ky, '#38BDF8', t); if (p > 0.95) dot(g, mx, my, '#FACC15', t);
  chip(g, kx, ky + 70, 'KOZHIKODE', '#38BDF8'); if (p > 0.95) chip(g, mx - 40, my - 70, 'MADRAS?', '#FACC15');
  SK.grain(g, t, 0.05); };
