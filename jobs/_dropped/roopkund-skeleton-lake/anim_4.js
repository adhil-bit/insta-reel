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
const cx = W / 2, cy = H * 0.36;
const bg = layer(x => { const b = x.createRadialGradient(cx, cy, 30, cx, cy, H * 0.8); b.addColorStop(0, '#132238'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const groups = [{col: ACCENT, tx: W * 0.2, ty: H * 0.52}, {col: '#5AC8FA', tx: W * 0.8, ty: H * 0.14}];
const dots = Array.from({length: 48}, (_, i) => ({gr: i % 3 === 2 ? 1 : 0, i, ox: (rand() - 0.5) * 140, oy: (rand() - 0.5) * 100}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), split = ease.inOut(clamp((k - 0.35) / 0.5));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  // target regions: soft rings
  for (const gp of groups) { g.strokeStyle = rgba(gp.col, 0.6 * split); g.lineWidth = 4; g.beginPath(); g.arc(gp.tx, gp.ty, 110 + Math.sin(t * 2) * 6, 0, 6.283); g.stroke();
    const gl = g.createRadialGradient(gp.tx, gp.ty, 0, gp.tx, gp.ty, 140); gl.addColorStop(0, rgba(gp.col, 0.25 * split)); gl.addColorStop(1, rgba(gp.col, 0)); g.fillStyle = gl; g.fillRect(gp.tx - 150, gp.ty - 150, 300, 300); }
  g.setLineDash([12, 12]); g.strokeStyle = `rgba(220,225,240,${0.35 * split})`; g.lineWidth = 3;
  g.beginPath(); g.moveTo(groups[0].tx, groups[0].ty); g.quadraticCurveTo(cx, cy - 240, groups[1].tx, groups[1].ty); g.stroke(); g.setLineDash([]);
  // helix base pairs become dots that fly to their region
  const n = dots.length;
  for (const d of dots) {
    const f = d.i / (n - 1), y0 = lerp(cy - 330, cy + 330, f), a = t * 1.6 + d.i * 0.42, side = d.i % 2 ? 1 : -1;
    const hx = cx + side * Math.sin(a) * 120, hy = y0;
    const gp = groups[d.gr], x = lerp(hx, gp.tx + d.ox, split), y = lerp(hy, gp.ty + d.oy, split);
    g.fillStyle = gp.col; g.globalAlpha = 0.6 + 0.4 * Math.abs(Math.cos(a)); g.beginPath(); g.arc(x, y, 11, 0, 6.283); g.fill();
    if (split < 0.05 && side > 0) { const o = dots[d.i - 1]; if (o) { g.strokeStyle = 'rgba(200,210,230,0.3)'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(hx, hy); g.lineTo(cx - Math.sin(a) * 120, hy); g.stroke(); } }
  }
  g.globalAlpha = 1;
};
