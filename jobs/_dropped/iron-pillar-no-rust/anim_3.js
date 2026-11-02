const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function pillar(g, x, base, h, s) {                 // tapered iron shaft with a bell-shaped capital
  const gr = g.createLinearGradient(x - 40 * s, 0, x + 40 * s, 0); gr.addColorStop(0, '#1e1c1a'); gr.addColorStop(0.35, '#5a524a'); gr.addColorStop(0.6, '#3a3430'); gr.addColorStop(1, '#151412');
  g.fillStyle = gr; g.beginPath(); g.moveTo(x - 40 * s, base); g.lineTo(x - 30 * s, base - h); g.lineTo(x + 30 * s, base - h); g.lineTo(x + 40 * s, base); g.fill();
  const top = base - h;
  g.beginPath(); g.moveTo(x - 30 * s, top); g.bezierCurveTo(x - 70 * s, top - 30 * s, x - 70 * s, top - 70 * s, x - 40 * s, top - 90 * s); g.lineTo(x + 40 * s, top - 90 * s);
  g.bezierCurveTo(x + 70 * s, top - 70 * s, x + 70 * s, top - 30 * s, x + 30 * s, top); g.fill();
  g.fillRect(x - 46 * s, top - 110 * s, 92 * s, 20 * s); g.fillRect(x - 30 * s, top - 140 * s, 60 * s, 30 * s);
  g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 4 * s; g.beginPath(); g.moveTo(x - 12 * s, base - 10); g.lineTo(x - 9 * s, top + 10); g.stroke();
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const base = H * 0.6;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#10141c'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H); x.fillStyle = '#1a1814'; x.fillRect(0, base, W, H); });
const spots = Array.from({length: 120}, () => ({x: rand(), y: rand(), r: 8 + rand() * 26, at: rand()}));
const flakes = Array.from({length: 40}, () => ({x: rand(), y: rand(), at: 0.4 + rand() * 0.5}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const bx = W * 0.27, top = base - 640, bw = 90;
  g.fillStyle = '#5a5a60'; g.fillRect(bx - bw / 2, top, bw, 640);
  g.save(); g.beginPath(); g.rect(bx - bw / 2, top, bw, 640); g.clip();
  for (const s of spots) { const a = clamp((k - s.at * 0.6) * 3); if (a <= 0) continue; g.fillStyle = `rgba(${150 + s.at * 40},${70 + s.at * 20},30,${0.85 * a})`;
    g.beginPath(); g.arc(bx - bw / 2 + s.x * bw, top + s.y * 640, s.r * a, 0, 6.283); g.fill(); }
  g.restore();
  for (const f of flakes) { const a = clamp((k - f.at) * 4); if (a <= 0) continue; const y = top + f.y * 640 + a * 300;
    g.fillStyle = `rgba(160,80,30,${1 - a * 0.7})`; g.fillRect(bx - bw / 2 + f.x * bw + a * 30, Math.min(y, base - 6), 8, 6); }
  pillar(g, W * 0.7, base, 640, 1.3);
  g.strokeStyle = ACCENT; g.lineWidth = 9; g.lineCap = 'round'; const ck = ease.out(clamp((k - 0.6) * 4));
  if (ck > 0) { g.beginPath(); g.moveTo(W * 0.7 - 40, H * 0.08 + 30); g.lineTo(W * 0.7 - 40 + 30 * ck, H * 0.08 + 30 + 30 * ck); g.lineTo(W * 0.7 - 10 + 60 * ck, H * 0.08 + 60 - 70 * ck); g.stroke(); }
  fadeBottom(g);
};
