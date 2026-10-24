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
const bg = layer(x => { const b = x.createRadialGradient(W / 2, H * 0.35, 50, W / 2, H * 0.35, H * 0.8); b.addColorStop(0, '#13202a'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const N = 8, sp = 68;
const right = Array.from({length: 64}, (_, i) => i).filter(i => i % 8 < 7).sort(() => 0).filter((_, j) => j % 3 === 0).slice(0, 14);
function grid(cx, cy, litPairs, t, label) {
  for (let r = 0; r < N; r++) for (let q = 0; q < N; q++) {
    const i = r * N + q, pair = litPairs.includes(i) || litPairs.includes(i - 1) && q > 0;
    g.fillStyle = pair ? ACCENT : 'rgba(200,210,225,0.35)';
    const s = pair ? 15 + Math.sin(t * 4 + i) * 2 : 12;
    g.beginPath(); g.arc(cx - (N - 1) * sp / 2 + q * sp, cy - (N - 1) * sp / 2 + r * sp, s, 0, 6.283); g.fill(); }
  g.strokeStyle = 'rgba(200,210,225,0.25)'; g.lineWidth = 3; g.strokeRect(cx - N * sp / 2 - 10, cy - N * sp / 2 - 10, N * sp + 20, N * sp + 20);
}
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  grid(W / 2, H * 0.17, k > 0.1 ? [27] : [], t);
  const n = Math.floor(ease.inOut(clamp((k - 0.3) / 0.6)) * right.length);
  grid(W / 2, H * 0.47, right.slice(0, n), t);
  g.fillStyle = rgba(ACCENT, 0.8); for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(W / 2, H * 0.31 + i * 18, 5, 0, 6.283); g.fill(); }
};
