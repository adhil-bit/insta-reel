const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function tree(x2, x, base, h, col) { x2.fillStyle = col; x2.fillRect(x - 6, base - h * 0.4, 12, h * 0.4); for (let i = 0; i < 3; i++) { x2.beginPath(); x2.arc(x + (i - 1) * h * 0.12, base - h * (0.55 + i * 0.12), h * (0.22 - i * 0.04), 0, 6.283); x2.fill(); } }
function forest(x2, base, n, hmin, hmax, col, seed) { let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n; i++) tree(x2, r() * W, base + r() * 30, hmin + r() * (hmax - hmin), col); }
const sky = (a, b) => layer(x => { const g = x.createLinearGradient(0, 0, 0, H * 0.6); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.6); s.addColorStop(0, '#0c1a14'); s.addColorStop(1, '#2a4a3a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  forest(x, H * 0.36, 40, 160, 260, '#14302a', 1); forest(x, H * 0.46, 40, 200, 320, '#0e2620', 2); forest(x, H * 0.56, 34, 260, 400, '#081a14', 3); });
const flies = Array.from({length: 40}, () => ({x: rand() * W, y: H * (0.2 + rand() * 0.4), p: rand() * 6}));
window.renderFrame = function (t) { g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (let i = 0; i < 6; i++) { const x = ((i * 260 + t * 14) % (W + 500)) - 250, y = H * 0.3 + (i * 61) % 160, gr = g.createRadialGradient(x, y, 0, x, y, 300); gr.addColorStop(0, 'rgba(220,235,225,0.16)'); gr.addColorStop(1, 'rgba(220,235,225,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 300, 0, 6.283); g.fill(); }
  for (const f of flies) { const a = Math.max(0, Math.sin(t * 2 + f.p)); g.fillStyle = rgba(ACCENT, a); g.shadowColor = ACCENT; g.shadowBlur = 14; g.beginPath(); g.arc(f.x + Math.sin(t + f.p) * 20, f.y + Math.cos(t * 0.7 + f.p) * 14, 4, 0, 6.283); g.fill(); }
  g.shadowBlur = 0; fadeBottom(g); };
