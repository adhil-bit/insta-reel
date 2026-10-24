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
const cx = W / 2, cy = H * 0.36;
const bg = layer(x => { const b = x.createRadialGradient(cx, cy, 50, cx, cy, H * 0.8); b.addColorStop(0, '#14222c'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
function drop(a, s) { g.save(); g.translate(cx, cy); g.scale(s, s); g.globalAlpha = a;
  const gr = g.createLinearGradient(0, -180, 0, 140); gr.addColorStop(0, '#9fe0ff'); gr.addColorStop(1, '#2a78c8'); g.fillStyle = gr;
  g.beginPath(); g.moveTo(0, -200); g.bezierCurveTo(60, -90, 140, -10, 140, 50); g.arc(0, 50, 140, 0, Math.PI); g.bezierCurveTo(-140, -10, -60, -90, 0, -200); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.ellipse(-55, 30, 22, 48, 0.3, 0, 6.283); g.fill(); g.restore(); }
function bowl(a, s, t) { g.save(); g.translate(cx, cy); g.scale(s, s); g.globalAlpha = a;
  g.fillStyle = '#f2efe6'; for (let i = 0; i < 40; i++) { const px = -150 + (i * 37) % 300, py = -40 - Math.abs(Math.sin(i)) * 60 + (i % 3) * 8; g.beginPath(); g.ellipse(px * 0.85, py, 12, 7, i, 0, 6.283); g.fill(); }
  g.fillStyle = '#b5532e'; g.beginPath(); g.moveTo(-200, -20); g.lineTo(200, -20); g.quadraticCurveTo(190, 150, 0, 160); g.quadraticCurveTo(-190, 150, -200, -20); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 3; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-40 + i * 40, -110 - ((t * 40 + i * 20) % 60)); g.quadraticCurveTo(-20 + i * 40, -150 - ((t * 40 + i * 20) % 60), -40 + i * 40, -190 - ((t * 40 + i * 20) % 60)); g.stroke(); }
  g.restore(); }
function dna(a, s, t) { g.save(); g.translate(cx, cy); g.scale(s, s); g.globalAlpha = a;
  for (let i = 0; i < 18; i++) { const y = -220 + i * 26, ph = t * 2 + i * 0.5, x1 = Math.sin(ph) * 100, x2 = -x1;
    g.strokeStyle = rgba(ACCENT, 0.7); g.lineWidth = 6; g.beginPath(); g.moveTo(x1, y); g.lineTo(x2, y); g.stroke();
    g.fillStyle = '#e6f0ff'; g.beginPath(); g.arc(x1, y, 12, 0, 6.283); g.arc(x2, y, 12, 0, 6.283); g.fill(); }
  g.restore(); }
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.92)), seg = k * 3, i = Math.min(2, Math.floor(seg)), f = seg - i;
  const a = clamp(f * 5) * (i < 2 ? clamp((1 - f) * 5) : 1), s = 0.85 + 0.15 * ease.out(clamp(f * 3));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const gl = g.createRadialGradient(cx, cy, 20, cx, cy, 380); gl.addColorStop(0, rgba(ACCENT, 0.25)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  [() => drop(a, s), () => bowl(a, s, t), () => dna(a, s, t)][i]();
  g.globalAlpha = 1;
  for (let j = 0; j < 3; j++) { g.fillStyle = j === i ? ACCENT : 'rgba(200,210,230,0.3)'; g.beginPath(); g.arc(cx + (j - 1) * 60, H * 0.62, j === i ? 12 : 9, 0, 6.283); g.fill(); }
};
