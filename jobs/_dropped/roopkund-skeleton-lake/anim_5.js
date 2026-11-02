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
const ly = H * 0.36, x0 = W * 0.12, x1 = W * 0.88;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#05080f'); s.addColorStop(0.5, '#0e1626'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  peaks(x, H * 0.62, RIDGE.map(([a, b]) => [a, b * 0.4]), '#0f1726', '#5f6b84'); });
const flakes = Array.from({length: 260}, () => ({x: rand() * W, y: rand() * H, s: 0.3 + rand() * 0.7, r: 1 + rand() * 3}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const draw = ease.inOut(clamp((k - 0.1) / 0.55)), xe = lerp(x0, x1, draw);
  g.strokeStyle = 'rgba(200,210,230,0.6)'; g.lineWidth = 9; g.beginPath(); g.moveTo(x0, ly); g.lineTo(xe, ly); g.stroke();
  for (let i = 0; i <= 20; i++) { const x = lerp(x0, x1, i / 20); if (x > xe) break; g.fillRect(x - 1.5, ly - (i % 5 ? 10 : 22), 3, i % 5 ? 20 : 44); }
  const m = (x, col, a, n) => { if (a <= 0) return; const p = (t * 0.8 + n) % 1;
    g.fillStyle = rgba(col, a); g.beginPath(); g.arc(x, ly, 30, 0, 6.283); g.fill();
    g.strokeStyle = rgba(col, a * (1 - p)); g.lineWidth = 4; g.beginPath(); g.arc(x, ly, 22 + p * 80, 0, 6.283); g.stroke();
    skull(g, x, ly - 150, 2.2, a); };
  m(x0 + 30, ACCENT, ease.out(clamp(k * 5)), 0);
  m(x1 - 30, '#5AC8FA', ease.out(clamp((k - 0.62) * 5)), 0.5);
  if (draw >= 1) { const a = clamp((k - 0.7) * 4); g.strokeStyle = rgba(ACCENT, 0.8 * a); g.lineWidth = 4;
    g.beginPath(); g.moveTo(x0 + 30, ly + 70); g.lineTo(x1 - 30, ly + 70); g.stroke();
    for (const [x, d] of [[x0 + 30, 1], [x1 - 30, -1]]) { g.beginPath(); g.moveTo(x + d * 20, ly + 56); g.lineTo(x, ly + 70); g.lineTo(x + d * 20, ly + 84); g.stroke(); } }
  g.fillStyle = '#fff';
  for (const f of flakes) { g.globalAlpha = 0.55; g.beginPath(); g.arc((f.x + Math.sin(t + f.y) * 20 + W) % W, (f.y + t * 50 * f.s) % H, f.r, 0, 6.283); g.fill(); }
  g.globalAlpha = 1;
};
