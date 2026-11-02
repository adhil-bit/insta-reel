const c = makeCanvas(), g = c.getContext('2d');
const IMG = document.getElementById('earthTex');
function mapCrop(g, lon0, lon1, lat1, top, hgt, filt) { const PX = W / (lon1 - lon0), lat0 = lat1 - hgt / PX;
  const sx = (lon0 + 180) / 360 * IMG.width, sw = (lon1 - lon0) / 360 * IMG.width, sy = (90 - lat1) / 180 * IMG.height, sh = (lat1 - lat0) / 180 * IMG.height;
  g.filter = filt || 'saturate(1.15) contrast(1.05) brightness(0.9)'; g.drawImage(IMG, sx, sy, sw, sh, 0, top, W, hgt); g.filter = 'none';
  return (la, lo) => [(lo - lon0) * PX, top + (lat1 - la) * PX]; }
function pin(g, x, y, col, t, lbl) { const q = (t * 1.2) % 1; g.strokeStyle = rgba(col, 1 - q); g.lineWidth = 4; g.beginPath(); g.arc(x, y, 10 + q * 40, 0, 6.283); g.stroke(); g.fillStyle = col; g.beginPath(); g.arc(x, y, 10, 0, 6.283); g.fill();
  if (lbl) { g.font = '800 28px Inter'; const w = g.measureText(lbl).width + 32; g.fillStyle = 'rgba(8,10,16,0.8)'; g.beginPath(); g.roundRect(x + 18, y - 22, w, 44, 22); g.fill(); g.fillStyle = col; g.textAlign = 'left'; g.fillText(lbl, x + 34, y + 10); } }
function fadeEdges(g, top, hgt) { const f = (y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); };
  f(top - 10, top + 60, 'rgba(6,8,12,1)', 'rgba(6,8,12,0)'); f(top + hgt - 70, top + hgt + 5, 'rgba(6,8,12,0)', 'rgba(6,8,12,1)'); g.fillStyle = '#06080c'; g.fillRect(0, top + hgt, W, H); }
const ISL = [['AGATTI', 10.86, 72.19], ['KAVARATTI', 10.57, 72.64], ['ANDROTH', 10.81, 73.68], ['KALPENI', 10.07, 73.65], ['MINICOY', 8.28, 73.05]];
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#06080c'; g.fillRect(0, 0, W, H); const top = H * 0.2, hgt = H * 0.6; const P = mapCrop(g, 71.4, 76.4, 12.6, top, hgt); fadeEdges(g, top, hgt);
  const [kx, ky] = P(11.87, 75.37); pin(g, kx, ky, '#F59E3B', t, 'KANNUR');
  ISL.forEach(([n, la, lo], i) => { const a = ease.out(clamp((k - 0.15 - i * 0.1) / 0.15)); if (a <= 0) return; const [x, y] = P(la, lo);
    g.strokeStyle = `rgba(245,158,59,${0.6 * a})`; g.lineWidth = 3; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(kx, ky); g.lineTo(lerp(kx, x, a), lerp(ky, y, a)); g.stroke(); g.setLineDash([]);
    g.save(); g.globalAlpha = a; pin(g, x, y, '#34D399', t + i, n); g.restore(); });
  SK.grain(g, t, 0.04); };