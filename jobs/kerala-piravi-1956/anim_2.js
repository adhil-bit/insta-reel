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
const R = [["MALABAR", '#38BDF8', 11.4, 75.9, 'MADRAS PRESIDENCY'], ["COCHIN", '#FACC15', 10.1, 76.35, 'PRINCELY STATE'], ["TRAVANCORE", '#FF4D5E', 8.9, 76.8, 'PRINCELY STATE']];
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  const P = mapView(g, 73.6, 78.6, 12.9, H * 0.2);
  R.forEach(([name, col, la, lo, sub], i) => { const a = ease.out(clamp((k - 0.1 - i * 0.18) / 0.2)); const [x, y] = P(la, lo); glow(g, x, y, 190 * a, col, a); if (a > 0.5) { chip(g, x + 210, y - 10, name, col, a); g.save(); g.globalAlpha = a; g.font = '700 24px Inter'; g.fillStyle = 'rgba(255,255,255,0.8)'; g.textAlign = 'center'; g.fillText(sub, x + 210, y + 46); g.restore(); } });
  SK.grain(g, t, 0.05); };
