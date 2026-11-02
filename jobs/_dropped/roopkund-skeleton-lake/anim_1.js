const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function peaks(x, base, pts, fill, snow) {        // jagged Himalayan ridge with snow caps
  x.fillStyle = fill; x.beginPath(); x.moveTo(0, H);
  for (const [px, py] of pts) x.lineTo(px * W, base - py);
  x.lineTo(W, H); x.closePath(); x.fill();
  if (snow) { x.fillStyle = snow; for (let i = 1; i < pts.length - 1; i++) { const [px, py] = pts[i], [ax, ay] = pts[i - 1], [bx, by] = pts[i + 1];
    if (py < pts.reduce((m, p) => Math.max(m, p[1]), 0) * 0.6) continue;
    x.beginPath(); x.moveTo(px * W, base - py); x.lineTo(lerp(px, ax, 0.3) * W, base - lerp(py, ay, 0.3)); x.lineTo(px * W, base - py * 0.86); x.lineTo(lerp(px, bx, 0.3) * W, base - lerp(py, by, 0.3)); x.fill(); } }
}
function skull(g, x, y, s, a) {
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = a;
  g.fillStyle = '#e8e0cc'; g.beginPath(); g.arc(0, 0, 30, Math.PI * 0.95, Math.PI * 2.05); g.lineTo(18, 28); g.lineTo(-18, 28); g.closePath(); g.fill();
  g.fillStyle = '#1a1612'; g.beginPath(); g.arc(-11, 2, 8, 0, 6.283); g.arc(11, 2, 8, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(0, 10); g.lineTo(-4, 18); g.lineTo(4, 18); g.fill();
  g.restore(); g.globalAlpha = 1;
}
function bone(g, x, y, len, rot, a) {
  g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = a; g.fillStyle = '#e2d8c2';
  g.fillRect(-len / 2, -5, len, 10);
  for (const e of [-len / 2, len / 2]) { g.beginPath(); g.arc(e, -6, 8, 0, 6.283); g.arc(e, 6, 8, 0, 6.283); g.fill(); }
  g.restore(); g.globalAlpha = 1;
}
const RIDGE = [[0, 300], [0.08, 420], [0.18, 330], [0.3, 560], [0.4, 420], [0.52, 640], [0.63, 450], [0.74, 520], [0.86, 360], [0.95, 470], [1, 380]];
const c = makeCanvas(), g = c.getContext('2d');
const base = H * 0.68, peakX = W * 0.56, peakY = H * 0.1, lakeX = W * 0.6, lakeY = H * 0.2;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#060a16'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#1e2a44'; x.beginPath(); x.moveTo(-40, base); x.lineTo(W * 0.2, H * 0.4); x.lineTo(W * 0.38, H * 0.3); x.lineTo(peakX, peakY); x.lineTo(W * 0.74, H * 0.26); x.lineTo(W * 0.9, H * 0.38); x.lineTo(W + 40, base); x.fill();
  x.fillStyle = '#d6def0'; x.beginPath(); x.moveTo(W * 0.42, H * 0.25); x.lineTo(peakX, peakY); x.lineTo(W * 0.7, H * 0.24); x.lineTo(W * 0.6, H * 0.22); x.lineTo(W * 0.52, H * 0.24); x.fill();
  x.fillStyle = '#2f6a88'; x.beginPath(); x.ellipse(lakeX, lakeY, 46, 14, 0, 0, 6.283); x.fill(); });
const path = [[W * 0.1, base - 20], [W * 0.26, H * 0.42], [W * 0.36, H * 0.34], [W * 0.48, H * 0.28], [lakeX, lakeY + 4]];
const clouds = Array.from({length: 12}, () => ({x: rand() * W, y: base - 60 + rand() * 140, r: 120 + rand() * 120, s: 10 + rand() * 20}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), u = ease.inOut(k);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  // altitude scale on the left
  g.strokeStyle = 'rgba(200,210,230,0.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(80, base); g.lineTo(80, lakeY); g.stroke();
  for (let i = 0; i <= 10; i++) { const y = lerp(base, lakeY, i / 10); g.beginPath(); g.moveTo(80, y); g.lineTo(i % 5 ? 98 : 116, y); g.stroke(); }
  // trail drawn up to the current point
  const segs = path.length - 1, f = u * segs, n = Math.floor(f), fr = f - n;
  g.setLineDash([14, 10]); g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 5; g.beginPath(); g.moveTo(path[0][0], path[0][1]);
  for (let i = 1; i <= n; i++) g.lineTo(path[i][0], path[i][1]);
  let px = path[0][0], py = path[0][1];
  if (n < segs) { px = lerp(path[n][0], path[n + 1][0], fr); py = lerp(path[n][1], path[n + 1][1], fr); g.lineTo(px, py); } else { px = path[segs][0]; py = path[segs][1]; }
  g.stroke(); g.setLineDash([]);
  g.fillStyle = ACCENT; g.beginPath(); g.arc(px, py, 14, 0, 6.283); g.fill();
  const lvl = lerp(base, lakeY, (base - py) / (base - lakeY)); g.fillRect(70, py - 3, 60, 6);
  if (u > 0.98) { const p = (t * 0.9) % 1; g.strokeStyle = rgba(ACCENT, 1 - p); g.lineWidth = 4; g.beginPath(); g.arc(lakeX, lakeY, 20 + p * 90, 0, 6.283); g.stroke(); }
  for (const cl of clouds) { const x = (cl.x + t * cl.s) % (W + 300) - 150, gr = g.createRadialGradient(x, cl.y, 0, x, cl.y, cl.r);
    gr.addColorStop(0, 'rgba(200,210,230,0.35)'); gr.addColorStop(1, 'rgba(200,210,230,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, cl.y, cl.r, 0, 6.283); g.fill(); }
};
