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
const cx = W / 2, cy = H * 0.37, SR = 330;
const bg = backdrop(g, cx, cy, '#14261c', '#03060a');
const hexes = [];
for (let q = -6; q <= 6; q++) for (let r = -6; r <= 6; r++) {
  const x = cx + 58 * 1.5 * q, y = cy + 58 * Math.sqrt(3) * (r + q / 2);
  const d = Math.hypot(x - cx, y - cy);
  if (Math.abs(d - SR) < 60) hexes.push({x, y, d: Math.atan2(y - cy, x - cx)});
}
const spores = Array.from({length: 36}, () => ({a: rand() * 6.283, sp: 0.5 + rand() * 0.6, off: rand()}));
function hex(x, y, r) { g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i;
  g.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); } g.closePath(); }

window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const build = ease.inOut(clamp(k * 1.4));
  // spores fly in; once the shield is up they bounce back out
  for (const s of spores) {
    const ph = (t * s.sp * 0.5 + s.off) % 1;
    const far = 760, near = build > 0.6 ? SR + 30 : 120;
    const dist = ph < 0.5 ? lerp(far, near, ph * 2) : lerp(near, far, (ph - 0.5) * 2);
    const alpha = build > 0.6 ? 0.8 : (ph < 0.5 ? 0.8 : 0);
    g.fillStyle = `rgba(255,110,90,${alpha})`;
    g.beginPath(); g.arc(cx + Math.cos(s.a) * dist, cy + Math.sin(s.a) * dist, 7, 0, 6.283); g.fill();
  }
  drawBanana(g, cx, cy + 40 + Math.sin(t * 1.3) * 8, 2.4, -0.18 + Math.sin(t) * 0.04,
    {glow: rgba(ACCENT, 0.3 + 0.4 * build)});
  for (const h of hexes) {
    const order = ((h.d + Math.PI) / 6.283);
    const a = clamp((build - order * 0.8) * 6);
    if (a <= 0) continue;
    hex(h.x, h.y, 50);
    g.fillStyle = rgba(ACCENT, 0.08 * a + 0.05 * a * Math.sin(t * 3 + h.d * 3));
    g.fill(); g.strokeStyle = rgba(ACCENT, 0.7 * a); g.lineWidth = 2.5; g.stroke();
  }
};
