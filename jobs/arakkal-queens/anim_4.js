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
window.renderFrame = function (t) { const k = clamp(t / DURATION), gone = ease.inOut(clamp((k - 0.2) / 0.4)), st = ease.out(clamp((k - 0.45) / 0.15));
  g.fillStyle = '#06080c'; g.fillRect(0, 0, W, H); const top = H * 0.2, hgt = H * 0.6; const P = mapCrop(g, 71.4, 76.4, 12.6, top, hgt, 'saturate(0.5) brightness(0.75)'); fadeEdges(g, top, hgt);
  ISL.forEach(([n, la, lo]) => { const [x, y] = P(la, lo); g.fillStyle = gone > 0.5 ? '#c0392b' : '#34D399'; g.globalAlpha = 1 - 0.5 * gone; g.beginPath(); g.arc(x, y, 12, 0, 6.283); g.fill(); g.globalAlpha = 1; });
  if (st > 0) { g.save(); g.translate(W * 0.46, H * 0.46); g.rotate(-0.15); g.scale(1.4 - 0.4 * st, 1.4 - 0.4 * st); g.globalAlpha = st; g.strokeStyle = '#c0392b'; g.lineWidth = 10; g.strokeRect(-230, -60, 460, 120); g.fillStyle = '#c0392b'; g.font = '800 56px Inter'; g.textAlign = 'center'; g.fillText('1905 · CEDED', 0, 20); g.restore(); }
  SK.grain(g, t, 0.04); };