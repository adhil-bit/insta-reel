const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function gopuram(x, cx, base, s, col) {           // stepped temple tower silhouette
  x.save(); x.translate(cx, base); x.scale(s, s); x.fillStyle = col;
  const tiers = 7; for (let i = 0; i < tiers; i++) { const w = 300 - i * 34, h = 50; x.fillRect(-w / 2, -(i + 1) * h, w, h + 1);
    x.fillRect(-w / 2 - 10, -(i + 1) * h, w + 20, 8); }
  x.beginPath(); x.moveTo(-70, -tiers * 50); x.quadraticCurveTo(0, -tiers * 50 - 90, 70, -tiers * 50); x.fill();
  for (let i = -2; i <= 2; i++) { x.beginPath(); x.arc(i * 28, -tiers * 50 - 40 - (2 - Math.abs(i)) * 12, 7, 0, 6.283); x.fill(); }
  x.restore();
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
function sparkle(g, x, y, r, a) { g.fillStyle = `rgba(255,240,200,${a})`; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r * 0.25, y - r * 0.25); g.lineTo(x + r, y); g.lineTo(x + r * 0.25, y + r * 0.25);
  g.lineTo(x, y + r); g.lineTo(x - r * 0.25, y + r * 0.25); g.lineTo(x - r, y); g.lineTo(x - r * 0.25, y - r * 0.25); g.fill(); }
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { x.fillStyle = '#07060a'; x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(80,70,60,0.5)'; x.lineWidth = 3; for (let r = 0; r < 14; r++) for (let q = 0; q < 8; q++) x.strokeRect(q * 150 + (r % 2) * 75 - 75, r * 70, 150, 70); });
const chests = Array.from({length: 9}, (_, i) => ({x: 180 + (i % 3) * 360, y: H * 0.22 + Math.floor(i / 3) * 170}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [ox, sp] of [[W * 0.3, 1.1], [W * 0.7, 0.8]]) { const a = Math.sin(t * sp) * 0.5, tx = ox + Math.sin(a) * 600, ty = H * 0.45;
    const gr = g.createRadialGradient(tx, ty, 10, tx, ty, 260); gr.addColorStop(0, 'rgba(255,230,170,0.35)'); gr.addColorStop(1, 'rgba(255,230,170,0)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(ox, -20); g.lineTo(tx - 200, ty); g.arc(tx, ty, 200, Math.PI, 0, true); g.lineTo(ox, -20); g.fill(); }
  g.restore();
  chests.forEach((c2, i) => { const done = k > 0.15 + i * 0.08;
    g.fillStyle = '#4a3420'; g.fillRect(c2.x - 70, c2.y - 40, 140, 80); g.fillStyle = '#6a4a2a'; g.fillRect(c2.x - 74, c2.y - 52, 148, 22);
    g.fillStyle = '#c9a046'; g.fillRect(c2.x - 8, c2.y - 30, 16, 20);
    if (done) { g.strokeStyle = ACCENT; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(c2.x + 50, c2.y - 70); g.lineTo(c2.x + 66, c2.y - 52); g.lineTo(c2.x + 96, c2.y - 92); g.stroke(); } });
  fadeBottom(g);
};
