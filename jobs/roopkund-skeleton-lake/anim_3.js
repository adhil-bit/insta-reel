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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#05080f'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  peaks(x, H * 0.66, RIDGE.map(([a, b]) => [a, b * 0.5]), '#111a2a', '#7f8ba4'); });
const hail = Array.from({length: 140}, () => ({x: rand() * W, y: rand() * H, s: 0.7 + rand() * 0.6, r: 5 + rand() * 7}));
function helmet(x, y, a) { g.globalAlpha = a; g.fillStyle = '#7a8070'; g.beginPath(); g.arc(x, y, 80, Math.PI, 0); g.fill(); g.fillRect(x - 110, y - 6, 220, 22);
  g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 5; g.beginPath(); g.arc(x, y, 92, Math.PI, 0); g.stroke(); g.globalAlpha = 1; }
function pilgrims(cx, y, a, t) { g.globalAlpha = a;
  for (let i = 0; i < 9; i++) { const x = cx - 240 + i * 60 + ((t * 30) % 60), b = Math.sin(t * 6 + i) * 4;
    g.fillStyle = '#c8b090'; g.beginPath(); g.arc(x, y - 70 + b, 12, 0, 6.283); g.fill(); g.fillRect(x - 10, y - 58 + b, 20, 50);
    g.strokeStyle = '#8a7050'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 14, y - 60 + b); g.lineTo(x + 20, y); g.stroke(); }
  g.fillStyle = '#f2c35a'; g.beginPath(); const cx2 = cx; g.moveTo(cx2 - 50, y - 160); g.lineTo(cx2 - 60, y - 210); g.lineTo(cx2 - 25, y - 185); g.lineTo(cx2, y - 225); g.lineTo(cx2 + 25, y - 185); g.lineTo(cx2 + 60, y - 210); g.lineTo(cx2 + 50, y - 160); g.fill();
  g.globalAlpha = 1; }
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const cy = H * 0.38;
  const w1 = clamp(k * 3) * (1 - clamp((k - 0.3) * 6)), w2 = clamp((k - 0.33) * 6) * (1 - clamp((k - 0.63) * 6)), w3 = clamp((k - 0.66) * 6);
  if (w1 > 0) { g.save(); g.translate(W / 2, cy + 60); g.scale(1.9, 1.9); helmet(0, 0, w1); g.restore(); }
  if (w2 > 0) { g.save(); g.translate(W / 2, cy + 150); g.scale(1.5, 1.5); pilgrims(0, 0, w2, t); g.restore(); }
  if (w3 > 0) { for (const h of hail) { const y = (h.y + t * 900 * h.s) % (H * 0.7);
      const gr = g.createRadialGradient(h.x - h.r * 0.3, y - h.r * 0.3, 1, h.x, y, h.r * 1.6); gr.addColorStop(0, `rgba(255,255,255,${w3})`); gr.addColorStop(1, `rgba(170,200,230,${0.6 * w3})`);
      g.fillStyle = gr; g.beginPath(); g.arc(h.x, y, h.r * 1.6, 0, 6.283); g.fill(); }
    const p = (t * 1.2) % 1; g.strokeStyle = rgba(ACCENT, w3 * (1 - p)); g.lineWidth = 5; g.beginPath(); g.arc(W / 2, cy, 60 + p * 260, 0, 6.283); g.stroke(); }
  // three markers showing which theory we're on
  for (let i = 0; i < 3; i++) { const on = [w1, w2, w3][i]; g.fillStyle = on > 0.5 ? ACCENT : 'rgba(200,210,230,0.3)';
    g.beginPath(); g.arc(W / 2 + (i - 1) * 60, H * 0.62, on > 0.5 ? 12 : 9, 0, 6.283); g.fill(); }
};
