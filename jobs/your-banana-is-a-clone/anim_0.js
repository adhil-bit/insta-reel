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
const cx = W / 2, cy = H * 0.37;
const bg = backdrop(g, cx, cy, '#1c2410', '#04060a');
const dust = Array.from({length: 140}, () => ({x: rand() * W, y: rand() * H * 0.8, r: rand() * 2 + 0.5, s: rand() * 0.6 + 0.2, p: rand() * 6.28}));
const copies = 8;

window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const d of dust) {
    g.globalAlpha = 0.25 + 0.25 * Math.sin(d.p + t * 1.5);
    g.fillStyle = '#e8f0c8';
    g.fillRect(d.x, (d.y - t * 18 * d.s + H) % (H * 0.8), d.r, d.r);
  }
  g.globalAlpha = 1;
  const bob = Math.sin(t * 1.4) * 10, rot = -0.12 + Math.sin(t * 0.9) * 0.05;
  const spin = t * 0.15;
  // identical clones burst out into a ring around the original, all posed the same
  for (let i = 0; i < copies; i++) {
    const appear = ease.out(clamp(k * 1.6 - i * 0.09));
    if (appear <= 0) continue;
    const a = spin + i / copies * 6.283;
    const r = 380 * appear;
    drawBanana(g, cx + Math.cos(a) * r, cy + 20 + Math.sin(a) * r * 0.82 + bob, 1.05,
      rot, {alpha: 0.55 * appear, outline: rgba(ACCENT, 0.9)});
  }
  const ring = ease.out(clamp(k * 1.6));
  g.strokeStyle = rgba(ACCENT, 0.18 * ring); g.lineWidth = 2;
  g.beginPath(); g.ellipse(cx, cy + 20 + bob, 380 * ring, 312 * ring, 0, 0, 6.283); g.stroke();
  drawBanana(g, cx, cy + 40 + bob, 2.6, rot, {glow: rgba(ACCENT, 0.55)});
};
