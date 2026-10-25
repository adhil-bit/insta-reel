const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function tree(x2, x, base, h, col) { x2.fillStyle = col; x2.fillRect(x - 6, base - h * 0.4, 12, h * 0.4); for (let i = 0; i < 3; i++) { x2.beginPath(); x2.arc(x + (i - 1) * h * 0.12, base - h * (0.55 + i * 0.12), h * (0.22 - i * 0.04), 0, 6.283); x2.fill(); } }
function forest(x2, base, n, hmin, hmax, col, seed) { let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n; i++) tree(x2, r() * W, base + r() * 30, hmin + r() * (hmax - hmin), col); }
const sky = (a, b) => layer(x => { const g = x.createLinearGradient(0, 0, 0, H * 0.6); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.6); s.addColorStop(0, '#0e2018'); s.addColorStop(1, '#2a4a36'); x.fillStyle = s; x.fillRect(0, 0, W, H); forest(x, H * 0.6, 40, 300, 500, '#0a1a12', 11); });
function macaque(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s);
  g.strokeStyle = '#111'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(60, 40); g.bezierCurveTo(160, 80, 170, 200, 120 + Math.sin(t * 2) * 20, 260); g.stroke();
  g.fillStyle = '#c8c8c0'; g.beginPath(); g.arc(120 + Math.sin(t * 2) * 20, 270, 16, 0, 6.283); g.fill();
  g.fillStyle = '#141414'; g.beginPath(); g.ellipse(0, 40, 80, 70, 0, 0, 6.283); g.fill();
  g.fillStyle = '#d8d6cc'; g.beginPath(); g.arc(-40, -40, 78, 0, 6.283); g.fill();
  g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(-40, -38, 48, 0, 6.283); g.fill();
  g.fillStyle = '#e8c8a8'; g.beginPath(); g.arc(-56, -46, 8, 0, 6.283); g.arc(-26, -46, 8, 0, 6.283); g.fill(); g.restore(); }
window.renderFrame = function (t) { g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.strokeStyle = '#3a2a1a'; g.lineWidth = 40; g.beginPath(); g.moveTo(0, H * 0.42); g.quadraticCurveTo(W * 0.5, H * 0.36, W, H * 0.44); g.stroke();
  for (let i = 0; i < 14; i++) { g.fillStyle = '#2e6a3a'; g.beginPath(); g.ellipse(80 + i * 75, H * 0.38 + Math.sin(i) * 20, 40, 18, i, 0, 6.283); g.fill(); }
  macaque(W * 0.46, H * 0.33 + Math.sin(t * 1.5) * 4, 1.3, t);
  const gl = g.createRadialGradient(W * 0.42, H * 0.28, 20, W * 0.42, H * 0.28, 420); gl.addColorStop(0, rgba(ACCENT, 0.2)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H); fadeBottom(g); };
