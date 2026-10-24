const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function palm(g2, x, base, h, lean, color) { g2.strokeStyle = color; g2.lineWidth = 10; g2.lineCap = 'round'; const tx = x + lean, ty = base - h;
  g2.beginPath(); g2.moveTo(x, base); g2.quadraticCurveTo(x + lean * 0.2, base - h * 0.5, tx, ty); g2.stroke(); g2.lineWidth = 6;
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42, L = 100 + (i % 2) * 24; g2.beginPath(); g2.moveTo(tx, ty); g2.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 16, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 40); g2.stroke(); } }
function stonesRow(g, x0, x1, y, h, t, col) { for (let x = x0, i = 0; x < x1; x += 44, i++) { g.fillStyle = i % 2 ? col : '#6a6458'; g.beginPath(); g.roundRect(x, y - h + (i % 3) * 4, 46, h, 10); g.fill(); } }
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { x.fillStyle = '#8a7a5a'; x.fillRect(0, 0, W, H); });
const src = [W / 2, 60];
const canals = Array.from({length: 7}, (_, i) => { const ang = -0.9 + i * 0.3; return {pts: Array.from({length: 30}, (_, j) => { const u = j / 29; return [src[0] + Math.sin(ang) * u * 900 + Math.sin(u * 6 + i) * 30, src[1] + u * 820]; }), at: i * 0.05}; });
const fields = Array.from({length: 46}, () => ({x: rand() * W, y: 160 + rand() * 720, w: 60 + rand() * 80, h: 40 + rand() * 50}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const f of fields) { const near = Math.min(...canals.map(cn => Math.min(...cn.pts.map(([px, py]) => Math.hypot(px - f.x, py - f.y))))) / 400;
    const gr = clamp((ease.inOut(k) - near * 0.6) * 2.5); g.fillStyle = `rgb(${lerp(140, 60, gr) | 0},${lerp(120, 150, gr) | 0},${lerp(80, 60, gr) | 0})`; g.fillRect(f.x, f.y, f.w, f.h); }
  for (const cn of canals) { const n = Math.floor(clamp((k - cn.at) * 1.6) * (cn.pts.length - 1)); if (n < 1) continue;
    g.strokeStyle = '#3a8ac8'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(...cn.pts[0]); for (let j = 1; j <= n; j++) g.lineTo(...cn.pts[j]); g.stroke(); }
  g.fillStyle = '#3a8ac8'; g.beginPath(); g.ellipse(src[0], src[1], 140, 50, 0, 0, 6.283); g.fill();
  g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 6; g.beginPath(); g.ellipse(src[0], src[1], 150, 58, 0, 0, 6.283); g.stroke();
  fadeBottom(g);
};
