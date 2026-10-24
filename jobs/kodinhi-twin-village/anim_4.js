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
const bg = layer(x => { const b = x.createLinearGradient(0, 0, 0, H); b.addColorStop(0, '#0b1420'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H);
  x.fillStyle = '#2a3440'; x.fillRect(120, H * 0.5, W - 240, 24); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (let i = 0; i < 6; i++) { const x = 220 + i * 128, top = H * 0.24, bot = H * 0.5, fill = ease.inOut(clamp(k * 1.6 - i * 0.1));
    g.strokeStyle = 'rgba(220,230,240,0.8)'; g.lineWidth = 5; g.beginPath(); g.moveTo(x - 34, top); g.lineTo(x - 34, bot - 34); g.arc(x, bot - 34, 34, Math.PI, 0, true); g.lineTo(x + 34, top); g.stroke();
    const ly = lerp(bot, top + 40, fill * 0.8); g.save(); g.beginPath(); g.moveTo(x - 31, top); g.lineTo(x - 31, bot - 34); g.arc(x, bot - 34, 31, Math.PI, 0, true); g.lineTo(x + 31, top); g.clip();
    g.fillStyle = rgba(ACCENT, 0.75); g.fillRect(x - 40, ly, 80, bot - ly + 10); g.restore(); }
  const lx = W / 2 + Math.sin(t * 1.3) * 300, ly = H * 0.36 + Math.cos(t * 0.9) * 60;
  g.strokeStyle = '#e8eef2'; g.lineWidth = 10; g.beginPath(); g.arc(lx, ly, 90, 0, 6.283); g.stroke();
  g.lineWidth = 18; g.beginPath(); g.moveTo(lx + 64, ly + 64); g.lineTo(lx + 140, ly + 140); g.stroke();
  g.fillStyle = 'rgba(160,220,255,0.12)'; g.beginPath(); g.arc(lx, ly, 85, 0, 6.283); g.fill();
  if (k > 0.6) { const p = (t * 0.8) % 1, a = clamp((k - 0.6) * 4); g.strokeStyle = rgba(ACCENT, a * (1 - p)); g.lineWidth = 5;
    g.beginPath(); g.arc(W / 2, H * 0.12, 30 + p * 90, 0, 6.283); g.stroke(); g.fillStyle = rgba(ACCENT, a); g.beginPath(); g.arc(W / 2, H * 0.12, 16, 0, 6.283); g.fill(); }
};
