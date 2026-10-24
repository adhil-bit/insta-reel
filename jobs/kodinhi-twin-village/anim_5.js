const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function kid(g, x, y, s, col) {                  // simple child figure, feet at (x, y)
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col;
  g.beginPath(); g.arc(0, -150, 30, 0, 6.283); g.fill();
  g.beginPath(); g.roundRect(-32, -114, 64, 78, 18); g.fill();
  g.fillRect(-26, -40, 20, 40); g.fillRect(6, -40, 20, 40);
  g.lineWidth = 16; g.lineCap = 'round'; g.strokeStyle = col;
  g.beginPath(); g.moveTo(-30, -100); g.lineTo(-52, -58); g.moveTo(30, -100); g.lineTo(52, -58); g.stroke();
  g.restore();
}
function twins(g, x, y, s, col, glow) {
  if (glow > 0) { const gr = g.createRadialGradient(x, y - 90 * s, 10, x, y - 90 * s, 190 * s);
    gr.addColorStop(0, rgba(ACCENT, 0.45 * glow)); gr.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gr;
    g.beginPath(); g.arc(x, y - 90 * s, 190 * s, 0, 6.283); g.fill(); }
  kid(g, x - 45 * s, y, s, col); kid(g, x + 45 * s, y, s, col);
}
const c = makeCanvas(), g = c.getContext('2d');
const cx = W / 2, cy = H * 0.36, R = W * 0.36, D = Math.PI / 180;
const bgL = layer(x => { const b = x.createRadialGradient(cx, cy, R * 0.3, cx, cy, H * 0.9); b.addColorStop(0, '#0f1a30'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const dots = Array.from({length: 1400}, () => ({lat: Math.asin(rand() * 2 - 1), lon: rand() * 6.283}));
const pts = [{lat: 11.0, lon: 75.9, col: ACCENT}, {lat: 7.4, lon: 3.3, col: '#FACC15'}, {lat: -27.6, lon: -54.8, col: '#F59E3B'}].map(p => ({...p, la: p.lat * D, lo: p.lon * D}));
function proj(la, lo, c0) { const x = Math.cos(la) * Math.sin(lo - c0), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo - c0); return [cx + x * R, cy - y * R, z]; }
window.renderFrame = function (t) {
  const k = clamp(t / DURATION), c0 = lerp(70, -30, ease.inOut(k)) * D;
  g.globalAlpha = 1; g.drawImage(bgL, 0, 0);
  const body = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R); body.addColorStop(0, '#24406f'); body.addColorStop(1, '#050a16');
  g.fillStyle = body; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.fill();
  for (const d of dots) { const [x, y, z] = proj(d.lat, d.lon, c0); if (z < 0) continue; g.fillStyle = `rgba(140,180,255,${0.1 + 0.45 * z})`; const s = 1.4 + 2.2 * z; g.fillRect(x - s / 2, y - s / 2, s, s); }
  const P = pts.map(p => proj(p.la, p.lo, c0));
  const link = ease.inOut(clamp((k - 0.2) / 0.6));
  for (const j of [1, 2]) { const [x1, y1, z1] = P[0], [x2, y2, z2] = P[j]; if (z1 < -0.2 && z2 < -0.2) continue;
    g.strokeStyle = rgba(ACCENT, 0.8); g.lineWidth = 4; g.setLineDash([12, 10]); g.beginPath();
    for (let u = 0; u <= link; u += 0.02) { const x = lerp(x1, x2, u), y = lerp(y1, y2, u) - Math.sin(u * Math.PI) * 140; u ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.setLineDash([]); }
  P.forEach(([x, y, z], i) => { if (z < 0) return; const p = (t * 0.9 + i * 0.3) % 1;
    g.strokeStyle = rgba(pts[i].col, (1 - p) * z); g.lineWidth = 4; g.beginPath(); g.arc(x, y, 14 + p * 60, 0, 6.283); g.stroke();
    g.fillStyle = pts[i].col; g.beginPath(); g.arc(x, y, 14, 0, 6.283); g.fill(); });
};
