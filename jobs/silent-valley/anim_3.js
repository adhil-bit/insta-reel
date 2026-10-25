const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function tree(x2, x, base, h, col) { x2.fillStyle = col; x2.fillRect(x - 6, base - h * 0.4, 12, h * 0.4); for (let i = 0; i < 3; i++) { x2.beginPath(); x2.arc(x + (i - 1) * h * 0.12, base - h * (0.55 + i * 0.12), h * (0.22 - i * 0.04), 0, 6.283); x2.fill(); } }
function forest(x2, base, n, hmin, hmax, col, seed) { let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n; i++) tree(x2, r() * W, base + r() * 30, hmin + r() * (hmax - hmin), col); }
const sky = (a, b) => layer(x => { const g = x.createLinearGradient(0, 0, 0, H * 0.6); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d'); const base = H * 0.55;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, base); s.addColorStop(0, '#1a2a2a'); s.addColorStop(1, '#4a5a3a'); x.fillStyle = s; x.fillRect(0, 0, W, H); forest(x, base - 160, 40, 160, 260, '#14302a', 9); });
const people = Array.from({length: 22}, (_, i) => ({x: 40 + i * 47, h: 120 + (i * 37) % 50, p: i * 0.6, sign: i % 4 === 1}));
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.88)), n = Math.floor(ease.out(k) * people.length);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  people.slice(0, n).forEach(p => { const up = Math.abs(Math.sin(t * 3 + p.p)); g.fillStyle = '#0a1210'; g.beginPath(); g.arc(p.x, base - p.h - 20, 16, 0, 6.283); g.fill(); g.fillRect(p.x - 14, base - p.h, 28, p.h);
    if (p.sign) { g.fillStyle = '#e8e0c8'; g.fillRect(p.x - 40, base - p.h - 120 - up * 10, 80, 56); g.strokeStyle = '#0a1210'; g.lineWidth = 4; g.beginPath(); g.moveTo(p.x, base - p.h - 64 - up * 10); g.lineTo(p.x, base - p.h); g.stroke();
      g.fillStyle = '#2e7a3a'; g.beginPath(); g.arc(p.x, base - p.h - 92 - up * 10, 16, 0, 6.283); g.fill(); }
    else { g.strokeStyle = '#0a1210'; g.lineWidth = 7; g.beginPath(); g.moveTo(p.x + 10, base - p.h + 10); g.lineTo(p.x + 22, base - p.h - 40 - up * 20); g.stroke(); } });
  g.fillStyle = '#f2ece0'; g.save(); g.translate(W * 0.7, H * 0.14); g.rotate(0.06); g.fillRect(-150, -90, 300, 200); g.fillStyle = '#5a4a3a'; for (let i = 0; i < 6; i++) g.fillRect(-120, -60 + i * 28, 180 + (i * 41) % 60, 7); g.restore();
  fadeBottom(g); };
