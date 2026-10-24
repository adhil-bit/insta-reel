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
const gy = H * 0.5;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#060912'); s.addColorStop(0.5, '#132028'); s.addColorStop(1, '#03050a');
  x.fillStyle = s; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 9; i++) { const hx = i * 130 - 20, hh = 90 + (i % 3) * 30;
    x.fillStyle = '#0a1016'; x.beginPath(); x.moveTo(hx, gy - 120); x.lineTo(hx + 60, gy - 120 - hh * 0.5); x.lineTo(hx + 120, gy - 120); x.lineTo(hx + 120, gy - 40); x.lineTo(hx, gy - 40); x.fill();
    x.fillStyle = 'rgba(255,200,120,0.5)'; x.fillRect(hx + 45, gy - 95, 22, 22); }
  const gd = x.createLinearGradient(0, gy - 40, 0, H * 0.8); gd.addColorStop(0, '#0e1a14'); gd.addColorStop(1, '#03050a'); x.fillStyle = gd; x.fillRect(0, gy - 40, W, H); });
const pairs = [[180, gy - 10, 0.55, 0.15], [900, gy - 10, 0.55, 0.25], [360, gy + 10, 0.65, 0.35], [730, gy + 10, 0.65, 0.45]];
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const [x, y, s, at] of pairs) { const a = ease.out(clamp((k - at) * 4)); if (a <= 0) continue;
    g.globalAlpha = 0.85 * a; twins(g, x, y - (1 - a) * 30, s, '#3b4a52', a); }
  g.globalAlpha = 1;
  const b = 1 + Math.sin(t * 2) * 0.01;
  twins(g, W / 2, gy + 120, 1.6 * b, '#e8eef2', 0.8 + 0.2 * Math.sin(t * 2));
};
