const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function palm(x, base, h, lean, g2, color) {        // coconut palm silhouette
  g2.strokeStyle = color; g2.lineWidth = 12; g2.lineCap = 'round';
  const tx = x + lean, ty = base - h;
  g2.beginPath(); g2.moveTo(x, base); g2.quadraticCurveTo(x + lean * 0.2, base - h * 0.5, tx, ty); g2.stroke();
  g2.lineWidth = 7;
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42, L = 120 + (i % 2) * 30;
    g2.beginPath(); g2.moveTo(tx, ty); g2.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 20, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 50); g2.stroke(); }
}
function mixc(a, b, t) { return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; }
const c = makeCanvas(), g = c.getContext('2d');
const tx = W * 0.5;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#0a0e12'); s.addColorStop(0.6, '#0c120c'); s.addColorStop(1, '#020302'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  palm(W * 0.12, H * 0.62, 380, 40, x, '#0a120c'); palm(W * 0.9, H * 0.62, 340, -50, x, '#0a120c');
  // big tree trunk filling the middle
  const tr = x.createLinearGradient(tx - 170, 0, tx + 170, 0); tr.addColorStop(0, '#1e1610'); tr.addColorStop(0.5, '#3d2c1e'); tr.addColorStop(1, '#16100b');
  x.fillStyle = tr; x.beginPath(); x.moveTo(tx - 150, H); x.lineTo(tx - 120, 0); x.lineTo(tx + 120, 0); x.lineTo(tx + 150, H); x.fill();
  x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 4;
  for (let i = 0; i < 16; i++) { const xx = tx - 110 + i * 15; x.beginPath(); x.moveTo(xx, 0); x.bezierCurveTo(xx + 10, H * 0.3, xx - 10, H * 0.5, xx + 6, H); x.stroke(); } });
const patches = Array.from({length: 70}, () => ({x: tx + (rand() - 0.5) * 220, y: H * (0.08 + rand() * 0.55), r: 14 + rand() * 40, at: rand()}));
const spores = Array.from({length: 120}, () => ({x: tx + (rand() - 0.5) * 240, y: H * (0.1 + rand() * 0.5), vx: (rand() - 0.5) * 60, vy: -20 - rand() * 50, p: rand()}));
const drops = Array.from({length: 200}, () => ({x: rand() * W, y: rand() * H, s: 0.8 + rand() * 0.5}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const p of patches) { const a = ease.out(clamp((k - p.at * 0.6) * 3)); if (a <= 0) continue;
    const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * a); gr.addColorStop(0, 'rgba(240,110,60,0.95)'); gr.addColorStop(0.7, rgba(ACCENT, 0.6)); gr.addColorStop(1, rgba(ACCENT, 0));
    g.fillStyle = gr; g.beginPath(); g.ellipse(p.x, p.y, p.r * a, p.r * a * 1.3, 0, 0, 6.283); g.fill(); }
  const rel = clamp((k - 0.45) / 0.4);
  for (const s of spores) { if (rel <= 0) break; const ph = (s.p + t * 0.25) % 1, a = rel * (1 - ph);
    g.fillStyle = rgba(ACCENT, 0.85 * a); g.beginPath(); g.arc(s.x + s.vx * ph * 6, s.y + s.vy * ph * 6, 4, 0, 6.283); g.fill(); }
  g.strokeStyle = 'rgba(170,190,220,0.35)'; g.lineWidth = 2; g.beginPath();
  for (const d of drops) { const y = (d.y + t * 1100 * d.s) % H; g.moveTo(d.x, y); g.lineTo(d.x - 3, y + 28); } g.stroke();
};
