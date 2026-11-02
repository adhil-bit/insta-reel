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
const lx = W / 2, ly = H * 0.47, lw = 380, lh = 110;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#040713'); s.addColorStop(0.45, '#14223a'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#e8eefc'; x.beginPath(); x.arc(W * 0.78, H * 0.1, 46, 0, 6.283); x.fill();
  peaks(x, H * 0.4, RIDGE, '#1b2740', '#cfd9ee');
  peaks(x, H * 0.47, RIDGE.map(([a, b]) => [a, b * 0.45]), '#121a2c', null);
  const sn = x.createLinearGradient(0, H * 0.42, 0, H * 0.75); sn.addColorStop(0, '#9aa8c0'); sn.addColorStop(1, '#05070c'); x.fillStyle = sn; x.fillRect(0, H * 0.44, W, H); });
const flakes = Array.from({length: 180}, () => ({x: rand() * W, y: rand() * H, s: 0.3 + rand() * 0.7, r: 1 + rand() * 3}));
const remains = Array.from({length: 14}, (_, i) => ({a: i / 14 * 6.283 + rand() * 0.3, d: 0.55 + rand() * 0.4, sk: i % 3 === 0, r: rand() * 3}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), thaw = ease.inOut(clamp(k * 1.3 - 0.1));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const lg = g.createRadialGradient(lx, ly, 10, lx, ly, lw); lg.addColorStop(0, '#2b5f7a'); lg.addColorStop(1, '#0e2232');
  g.fillStyle = lg; g.beginPath(); g.ellipse(lx, ly, lw, lh, 0, 0, 6.283); g.fill();
  for (const r of remains) { const x = lx + Math.cos(r.a) * lw * r.d, y = ly + Math.sin(r.a) * lh * r.d;
    r.sk ? skull(g, x, y, 0.8, thaw * 0.9) : bone(g, x, y, 60, r.r, thaw * 0.85); }
  g.fillStyle = `rgba(220,232,245,${0.85 * (1 - thaw)})`; g.beginPath(); g.ellipse(lx, ly, lw, lh, 0, 0, 6.283); g.fill();   // ice
  g.strokeStyle = rgba(ACCENT, 0.4 + 0.4 * thaw); g.lineWidth = 4; g.beginPath(); g.ellipse(lx, ly, lw + 10, lh + 6, 0, 0, 6.283); g.stroke();
  g.fillStyle = '#fff';
  for (const f of flakes) { g.globalAlpha = 0.6; g.beginPath(); g.arc((f.x + Math.sin(t + f.y) * 20) % W, (f.y + t * 60 * f.s) % H, f.r, 0, 6.283); g.fill(); }
};
