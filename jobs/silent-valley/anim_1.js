const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function tree(x2, x, base, h, col) { x2.fillStyle = col; x2.fillRect(x - 6, base - h * 0.4, 12, h * 0.4); for (let i = 0; i < 3; i++) { x2.beginPath(); x2.arc(x + (i - 1) * h * 0.12, base - h * (0.55 + i * 0.12), h * (0.22 - i * 0.04), 0, 6.283); x2.fill(); } }
function forest(x2, base, n, hmin, hmax, col, seed) { let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n; i++) tree(x2, r() * W, base + r() * 30, hmin + r() * (hmax - hmin), col); }
const sky = (a, b) => layer(x => { const g = x.createLinearGradient(0, 0, 0, H * 0.6); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.6); s.addColorStop(0, '#16302a'); s.addColorStop(1, '#3a5a46'); x.fillStyle = s; x.fillRect(0, 0, W, H); forest(x, H * 0.5, 60, 200, 380, '#0e2620', 7); });
window.renderFrame = function (t) { g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const cx = W / 2, cy = H * 0.3; for (let i = 0; i < 3; i++) { const p = ((t * 0.4) + i / 3) % 1; g.strokeStyle = `rgba(230,240,235,${0.35 * (1 - p) * (1 - p)})`; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 30 + p * 120, 0, 6.283); g.stroke(); }
  g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 8; g.beginPath(); g.moveTo(cx - 50, cy - 50); g.lineTo(cx + 50, cy + 50); g.stroke();
  g.fillStyle = '#d8e6dc'; g.beginPath(); g.ellipse(cx, cy, 18, 30, 0, 0, 6.283); g.fill(); fadeBottom(g); };
