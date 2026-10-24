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
const bg = layer(x => { x.fillStyle = '#0b1410'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(30,${60 + (i * 37) % 40},35,0.9)`; x.beginPath(); x.arc((i * 211) % W, (i * 137) % (H * 0.72), 18 + (i % 4) * 8, 0, 6.283); x.fill(); }
  x.strokeStyle = '#3a3226'; x.lineWidth = 22; x.beginPath(); x.moveTo(0, H * 0.33); x.bezierCurveTo(W * 0.3, H * 0.28, W * 0.6, H * 0.42, W, H * 0.36); x.stroke(); });
const houses = [];
for (let r = 0; r < 6; r++) for (let q = 0; q < 5; q++) houses.push({x: 120 + q * 200 + (r % 2) * 60, y: 160 + r * 150, p: Math.floor((r * 5 + q) / 2)});
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const lit = Math.floor(ease.inOut(k) * 15);
  houses.forEach((h, i) => {
    const on = h.p < lit && h.p % 2 === 0;
    g.save(); g.translate(h.x, h.y); g.rotate(0.05 * Math.sin(i));
    if (on) { const gl = g.createRadialGradient(0, 0, 10, 0, 0, 110); gl.addColorStop(0, rgba(ACCENT, 0.5)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(-110, -110, 220, 220); }
    g.fillStyle = on ? '#c45a3a' : '#6b3a2a'; g.fillRect(-55, -40, 110, 80);
    g.strokeStyle = 'rgba(0,0,0,0.4)'; g.lineWidth = 4; g.beginPath(); g.moveTo(-55, 0); g.lineTo(55, 0); g.stroke();
    if (on) { g.strokeStyle = ACCENT; g.lineWidth = 4; g.strokeRect(-60, -45, 120, 90); }
    g.restore();
  });
  const p = (t * 0.7) % 1; g.strokeStyle = rgba(ACCENT, 1 - p); g.lineWidth = 4; g.beginPath(); g.arc(W / 2, H * 0.36, 40 + p * 300, 0, 6.283); g.stroke();
};
