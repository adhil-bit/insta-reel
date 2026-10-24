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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#03040a'); s.addColorStop(0.55, '#141018'); s.addColorStop(1, '#030203'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#cfd8ff'; for (let i = 0; i < 260; i++) { x.globalAlpha = rand() * 0.7; x.fillRect(rand() * W, rand() * H * 0.6, 2, 2); } x.globalAlpha = 1;
  x.fillStyle = '#050405'; x.beginPath(); x.moveTo(0, H * 0.6); for (let X = 0; X <= W; X += 20) x.lineTo(X, H * 0.6 - 40 * Math.sin(X * 0.006) - 20 * Math.sin(X * 0.02)); x.lineTo(W, H); x.lineTo(0, H); x.fill(); });
const dust = Array.from({length: 160}, () => ({y: H * 0.12 + rand() * H * 0.5, o: rand(), r: 40 + rand() * 90, w: rand() * 6.28}));
const shards = Array.from({length: 40}, () => ({a: rand() * 6.283, v: 120 + rand() * 260}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  // meteor: streak in, burst at 40%
  const m = clamp(k / 0.4), bx = W * 0.62, by = H * 0.22;
  if (k < 0.4) { const x = lerp(-100, bx, ease.in(m)), y = lerp(-60, by, ease.in(m));
    const tr = g.createLinearGradient(x - 320, y - 190, x, y); tr.addColorStop(0, 'rgba(255,200,150,0)'); tr.addColorStop(1, 'rgba(255,230,200,0.95)');
    g.strokeStyle = tr; g.lineWidth = 10; g.beginPath(); g.moveTo(x - 320, y - 190); g.lineTo(x, y); g.stroke();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, 12, 0, 6.283); g.fill(); }
  const b = clamp((k - 0.4) / 0.25);
  if (b > 0 && b < 1) {
    g.fillStyle = `rgba(255,220,190,${Math.pow(1 - b, 4) * 0.5})`; g.fillRect(0, 0, W, H);
    const fl = g.createRadialGradient(bx, by, 0, bx, by, 80 + b * 400); fl.addColorStop(0, `rgba(255,240,220,${1 - b})`); fl.addColorStop(1, 'rgba(255,120,80,0)');
    g.fillStyle = fl; g.beginPath(); g.arc(bx, by, 80 + b * 400, 0, 6.283); g.fill();
    g.fillStyle = `rgba(255,200,150,${1 - b})`;
    for (const s of shards) g.fillRect(bx + Math.cos(s.a) * s.v * b, by + Math.sin(s.a) * s.v * b, 5, 5);
  }
  // dust cloud rolls in from the left in the second half
  const d = ease.inOut(clamp((k - 0.5) / 0.4));
  if (d > 0) for (const p of dust) {
    const x = lerp(-500, W * 1.3, d) - p.o * 900 + Math.sin(t + p.w) * 30;
    const y = p.y + Math.sin(t * 0.8 + p.w) * 14, gr = g.createRadialGradient(x, y, 0, x, y, p.r);
    gr.addColorStop(0, `rgba(205,150,100,${0.16 * d})`); gr.addColorStop(1, 'rgba(205,150,100,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, p.r, 0, 6.283); g.fill();
  }
};
