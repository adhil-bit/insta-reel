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
const ground = H * 0.5;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, ground); s.addColorStop(0, '#07070c'); s.addColorStop(1, '#241418'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  const gd = x.createLinearGradient(0, ground, 0, H * 0.8); gd.addColorStop(0, '#120c0e'); gd.addColorStop(1, '#030203'); x.fillStyle = gd; x.fillRect(0, ground, W, H);
  palm(W * 0.14, ground, 420, 60, x, '#050506'); palm(W * 0.84, ground, 380, -70, x, '#050506'); palm(W * 0.66, ground, 300, 30, x, '#0a0a0c');
  x.fillStyle = '#060607'; x.beginPath(); x.moveTo(W * 0.3, ground); x.lineTo(W * 0.3, ground - 90); x.lineTo(W * 0.42, ground - 170); x.lineTo(W * 0.55, ground - 90); x.lineTo(W * 0.55, ground); x.fill();
  x.fillStyle = '#e8b060'; x.fillRect(W * 0.4, ground - 70, 26, 30); });
const drops = Array.from({length: 520}, () => ({x: rand() * (W + 200), y: rand() * H, l: 26 + rand() * 40, s: 0.8 + rand() * 0.5}));
const splash = Array.from({length: 40}, () => ({x: rand() * W, p: rand()}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), red = ease.inOut(clamp(k * 1.4 - 0.1));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const gl = g.createRadialGradient(W / 2, H * 0.2, 50, W / 2, H * 0.2, 700);
  gl.addColorStop(0, rgba(ACCENT, 0.25 * red)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, ground);
  // red puddle sheen on the ground
  const pd = g.createLinearGradient(0, ground, 0, ground + 220); pd.addColorStop(0, rgba(ACCENT, 0.45 * red)); pd.addColorStop(1, rgba(ACCENT, 0));
  g.fillStyle = pd; g.fillRect(0, ground, W, 220);
  g.strokeStyle = mixc([150, 165, 190], [255, 60, 80], red); g.lineWidth = 3; g.globalAlpha = 0.75; g.beginPath();
  for (const d of drops) { const y = (d.y + t * 1300 * d.s) % (ground + 200) - 100, x = d.x - y * 0.12;
    g.moveTo(x, y); g.lineTo(x - d.l * 0.12, y + d.l); } g.stroke();
  g.globalAlpha = 1;
  for (const s of splash) { const p = (s.p + t * 1.7) % 1; g.strokeStyle = rgba(ACCENT, (1 - p) * 0.7 * red); g.lineWidth = 2;
    g.beginPath(); g.ellipse(s.x, ground + 30 + (s.x % 120), 6 + p * 34, 2 + p * 8, 0, 0, 6.283); g.stroke(); }
};
