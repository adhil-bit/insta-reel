function drawBanana(g, x, y, s, rot, opts = {}) {
  const top = opts.top || '#FFE27A', bottom = opts.bottom || '#D9A11B';
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.globalAlpha = opts.alpha == null ? 1 : opts.alpha;
  if (opts.glow) { g.shadowColor = opts.glow; g.shadowBlur = 40 / s; }
  g.beginPath();
  g.moveTo(-104, -18);
  g.bezierCurveTo(-74, 84, 70, 88, 104, -30);
  g.bezierCurveTo(78, 6, -58, 12, -104, -18);
  g.closePath();
  const gr = g.createLinearGradient(0, -10, 0, 50);
  gr.addColorStop(0, top); gr.addColorStop(1, bottom);
  g.fillStyle = gr; g.fill();
  g.shadowBlur = 0;
  if (opts.outline) { g.strokeStyle = opts.outline; g.lineWidth = 4 / s; g.stroke(); }
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 3.5;
  g.beginPath(); g.moveTo(-84, 0); g.bezierCurveTo(-46, 46, 46, 48, 88, -14); g.stroke();
  g.fillStyle = '#6b5a22';                       // stem
  g.beginPath(); g.moveTo(98, -24); g.lineTo(122, -52); g.lineTo(130, -46); g.lineTo(106, -18); g.closePath(); g.fill();
  g.fillStyle = '#3b2c12';                       // tip
  g.beginPath(); g.arc(-103, -17, 6, 0, 6.283); g.fill();
  g.restore();
}
function backdrop(g, cx, cy, inner, outer) {
  const l = document.createElement('canvas'); l.width = W; l.height = H;
  const x = l.getContext('2d');
  const bg = x.createRadialGradient(cx, cy, 0, cx, cy, H * 0.85);
  bg.addColorStop(0, inner); bg.addColorStop(1, outer);
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
  return l;
}
const c = makeCanvas(), g = c.getContext('2d');
const bg = backdrop(g, W / 2, H * 0.35, '#1a2030', '#04060a');
const cols = 4, rows = 6, gx = W / (cols + 0.4), gy = 150, top = 210;
const cells = [];
for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++)
  cells.push({x: gx * (q + 0.7), y: top + r * gy, d: (r * cols + q) / (rows * cols)});
const special = 13;

window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.8));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const sway = Math.sin(t * 2.2) * 0.12;          // every clone moves exactly the same
  cells.forEach((cell, i) => {
    const a = ease.out(clamp((k - cell.d * 0.75) * 5));
    if (a <= 0) return;
    const isSpecial = i === special && k > 0.85;
    drawBanana(g, cell.x, cell.y + (1 - a) * 40, 0.95 * a, -0.15 + sway,
      {alpha: a * (isSpecial ? 1 : 0.92), outline: isSpecial ? ACCENT : null, glow: isSpecial ? rgba(ACCENT, 0.8) : null});
  });
  // scanning line that "checks" the clones
  const sy = top - 60 + ((t * 260) % (rows * gy + 60));
  const sl = g.createLinearGradient(0, sy - 40, 0, sy + 4);
  sl.addColorStop(0, rgba(ACCENT, 0)); sl.addColorStop(1, rgba(ACCENT, 0.35));
  g.globalAlpha = 0.8 * k; g.fillStyle = sl; g.fillRect(0, sy - 40, W, 44);
  g.globalAlpha = 1;
};
