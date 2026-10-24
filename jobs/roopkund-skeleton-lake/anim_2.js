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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#0a0f1a'); s.addColorStop(0.6, '#2a2c30'); s.addColorStop(1, '#050608'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) { x.fillStyle = `rgba(70,70,75,${0.4 + Math.sin(i) * 0.2})`; x.beginPath(); x.ellipse((i * 137) % W, H * 0.1 + (i * 61) % (H * 0.55), 20 + (i % 5) * 10, 12 + (i % 3) * 6, 0, 0, 6.283); x.fill(); } });
const remains = Array.from({length: 38}, () => ({x: 60 + rand() * (W - 120), y: H * 0.1 + rand() * H * 0.52, sk: rand() < 0.3, r: rand() * 3, l: 50 + rand() * 50}));
const blobs = Array.from({length: 40}, () => ({x: rand() * W, y: H * 0.05 + rand() * H * 0.62, r: 90 + rand() * 120, at: rand()}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const r of remains) r.sk ? skull(g, r.x, r.y, 1.1, 1) : bone(g, r.x, r.y, r.l, r.r, 1);
  // snow patches shrink away
  for (const b of blobs) { const m = 1 - ease.inOut(clamp((k - b.at * 0.5) * 1.8)); if (m <= 0) continue;
    const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * m); gr.addColorStop(0, 'rgba(236,240,248,1)'); gr.addColorStop(0.75, 'rgba(225,232,244,0.95)'); gr.addColorStop(1, 'rgba(225,232,244,0)');
    g.fillStyle = gr; g.beginPath(); g.ellipse(b.x, b.y, b.r * m, b.r * m * 0.55, 0, 0, 6.283); g.fill(); }
  // drip of meltwater glints
  const sweep = (t * 0.3) % 1; g.fillStyle = rgba(ACCENT, 0.12 * k); g.fillRect(0, H * (0.05 + sweep * 0.6), W, 18);
};
