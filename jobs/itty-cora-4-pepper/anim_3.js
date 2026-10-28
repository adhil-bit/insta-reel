// Real map: Vasco da Gama's route, Lisbon -> around Africa -> Kozhikode (1497-98)
const c = makeCanvas(), g = c.getContext('2d'); const img = document.getElementById('earthTex');
const LON0 = -25, LON1 = 85, LAT1 = 45, LAT0 = -40, PX = W / (LON1 - LON0), TOP = H * 0.22, MAPH = (LAT1 - LAT0) * PX;
const P = (lat, lon) => [(lon - LON0) * PX, TOP + (LAT1 - lat) * PX];
const route = [[38.7, -9.1], [30, -15], [14, -20], [0, -12], [-15, 2], [-34.6, 18.5], [-34, 26], [-25, 36], [-10, 42], [-3.2, 40.1], [5, 55], [11.25, 75.8]].map(([a, b]) => P(a, b));
const seg = []; let tot = 0; for (let i = 1; i < route.length; i++) { const d = Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]); seg.push(d); tot += d; }
function at(u) { let d = u * tot; for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const f = d / seg[i]; return [lerp(route[i][0], route[i + 1][0], f), lerp(route[i][1], route[i + 1][1], f), i]; } d -= seg[i]; } return [...route[route.length - 1], seg.length - 1]; }
window.renderFrame = function (t) { const k = clamp(t / DURATION), p = ease.inOut(clamp((k - 0.08) / 0.75));
  g.fillStyle = '#05080e'; g.fillRect(0, 0, W, H);
  const sx = (LON0 + 180) / 360 * img.width, sw = (LON1 - LON0) / 360 * img.width, sy = (90 - LAT1) / 180 * img.height, sh = (LAT1 - LAT0) / 180 * img.height;
  g.filter = 'saturate(1.15) contrast(1.08) brightness(0.9)'; g.drawImage(img, sx, sy, sw, sh, 0, TOP, W, MAPH); g.filter = 'none';
  const [ex, ey, si] = at(p); g.strokeStyle = ACCENT; g.lineWidth = 5; g.setLineDash([16, 10]); g.shadowColor = ACCENT; g.shadowBlur = 12; g.beginPath(); g.moveTo(route[0][0], route[0][1]);
  for (let i = 1; i <= si; i++) g.lineTo(route[i][0], route[i][1]); g.lineTo(ex, ey); g.stroke(); g.setLineDash([]); g.shadowBlur = 0;
  g.fillStyle = '#efe4c8'; g.beginPath(); g.moveTo(ex, ey - 34); g.lineTo(ex + 24, ey - 4); g.lineTo(ex, ey - 4); g.fill(); g.fillStyle = '#2a1a10'; g.fillRect(ex - 22, ey - 4, 44, 10);
  for (const [i, on] of [[0, true], [route.length - 1, p > 0.97]]) { if (!on) continue; const [x, y] = route[i], q = (t * 1.2) % 1; g.strokeStyle = rgba(ACCENT, 1 - q); g.lineWidth = 4; g.beginPath(); g.arc(x, y, 10 + q * 40, 0, 6.283); g.stroke(); g.fillStyle = ACCENT; g.beginPath(); g.arc(x, y, 9, 0, 6.283); g.fill(); }
  const fade = (y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); };
  fade(TOP - 30, TOP + 50, 'rgba(5,8,14,1)', 'rgba(5,8,14,0)'); fade(TOP + MAPH - 60, TOP + MAPH + 30, 'rgba(5,8,14,0)', 'rgba(5,8,14,1)'); SK.grain(g, t, 0.05); };
