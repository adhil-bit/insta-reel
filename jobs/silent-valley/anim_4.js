const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function tree(x2, x, base, h, col) { x2.fillStyle = col; x2.fillRect(x - 6, base - h * 0.4, 12, h * 0.4); for (let i = 0; i < 3; i++) { x2.beginPath(); x2.arc(x + (i - 1) * h * 0.12, base - h * (0.55 + i * 0.12), h * (0.22 - i * 0.04), 0, 6.283); x2.fill(); } }
function forest(x2, base, n, hmin, hmax, col, seed) { let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n; i++) tree(x2, r() * W, base + r() * 30, hmin + r() * (hmax - hmin), col); }
const sky = (a, b) => layer(x => { const g = x.createLinearGradient(0, 0, 0, H * 0.6); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.6); s.addColorStop(0, '#1a3a4a'); s.addColorStop(1, '#6a9a7a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#1e3a2a'; x.beginPath(); x.moveTo(0, H * 0.2); x.lineTo(W * 0.35, H * 0.52); x.lineTo(W * 0.65, H * 0.52); x.lineTo(W, H * 0.2); x.lineTo(W, H); x.lineTo(0, H); x.fill(); });
const trees = Array.from({length: 26}, () => ({x: rand() * W, h: 120 + rand() * 160, d: rand()}));
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.88)), gone = ease.inOut(clamp(k * 1.8)), grow = ease.out(clamp((k - 0.4) * 2));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  if (gone < 1) { g.globalAlpha = 1 - gone; g.fillStyle = '#7a7a80'; g.fillRect(W * 0.6, H * 0.24 + gone * 200, 70, H * 0.32); g.globalAlpha = 1; }
  for (const tr of trees) { const s = clamp((grow - tr.d * 0.5) * 2); if (s > 0) tree(g, tr.x, H * 0.54, tr.h * s, '#2e6a3a'); }
  if (grow > 0.6) { const p = (t * 0.6) % 1; g.strokeStyle = rgba(ACCENT, (1 - p)); g.lineWidth = 6; g.beginPath(); g.arc(W / 2, H * 0.24, 60 + p * 140, 0, 6.283); g.stroke();
    g.fillStyle = rgba(ACCENT, 0.9); g.beginPath(); g.moveTo(W / 2, H * 0.24 - 50); g.quadraticCurveTo(W / 2 + 60, H * 0.24, W / 2, H * 0.24 + 50); g.quadraticCurveTo(W / 2 - 60, H * 0.24, W / 2, H * 0.24 - 50); g.fill(); }
  fadeBottom(g); };
