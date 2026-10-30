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
window.renderFrame = function (t) { const k = clamp(t / DURATION), a = ease.inOut(clamp((k - 0.15) / 0.5));
  const P = mapView(g, 73.6, 78.6, 12.9, H * 0.2);
  const [mx, my] = P(11.4, 75.9), [kx, ky] = P(10.2, 76.4), [sx, sy] = P(8.25, 77.4), [tx, ty] = P(8.9, 77.9);
  glow(g, lerp(mx, kx, a * 0.3), lerp(my, ky, a * 0.3), 200, '#34D399', 1); glow(g, kx, ky, 220, '#34D399', 0.6 + 0.4 * a);
  glow(g, lerp(sx, tx, a), lerp(sy, ty, a), 120, '#F59E3B', 1);
  g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 4; g.setLineDash([14, 10]); const [ax, ay] = P(8.6, 77.0), [bx, by] = P(8.1, 77.25); g.beginPath(); g.moveTo(ax, ay); g.lineTo(lerp(ax, bx, a), lerp(ay, by, a)); g.stroke(); g.setLineDash([]);
  if (a > 0.6) { chip(g, kx + 230, ky - 30, 'KERALA', '#34D399', (a - 0.6) * 2.5); chip(g, sx + 60, sy + 90, '→ MADRAS STATE', '#F59E3B', (a - 0.6) * 2.5); }
  SK.grain(g, t, 0.05); };
