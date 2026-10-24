const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function palm(g2, x, base, h, lean, color) { g2.strokeStyle = color; g2.lineWidth = 10; g2.lineCap = 'round'; const tx = x + lean, ty = base - h;
  g2.beginPath(); g2.moveTo(x, base); g2.quadraticCurveTo(x + lean * 0.2, base - h * 0.5, tx, ty); g2.stroke(); g2.lineWidth = 6;
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42, L = 100 + (i % 2) * 24; g2.beginPath(); g2.moveTo(tx, ty); g2.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 16, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 40); g2.stroke(); } }
function stonesRow(g, x0, x1, y, h, t, col) { for (let x = x0, i = 0; x < x1; x += 44, i++) { g.fillStyle = i % 2 ? col : '#6a6458'; g.beginPath(); g.roundRect(x, y - h + (i % 3) * 4, 46, h, 10); g.fill(); } }
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const wy = H * 0.4;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, wy); s.addColorStop(0, '#2a3a5a'); s.addColorStop(1, '#c8a880'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  const w = x.createLinearGradient(0, wy, 0, H * 0.75); w.addColorStop(0, '#3a6a8a'); w.addColorStop(1, '#05070b'); x.fillStyle = w; x.fillRect(0, wy, W, H); });
const stones = Array.from({length: 18}, (_, i) => ({x: 40 + (i % 9) * 118, row: Math.floor(i / 9), at: i / 18, w: 110 + rand() * 20, h: 70 + rand() * 20, c: ['#7a7266', '#8a8276', '#6a6458'][i % 3]}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const s of stones) { const f = clamp((k - s.at * 0.85) * 6); if (f <= 0) continue; const ty = wy + 40 - s.row * 70, y = lerp(-120, ty, ease.in(f));
    g.fillStyle = s.c; g.beginPath(); g.roundRect(s.x, y - s.h, s.w, s.h, 18); g.fill(); g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(s.x + 10, y - s.h + 8, s.w - 20, 8);
    if (f >= 1 && f < 1.0001 + 0) {} 
    if (f > 0.95 && (k - s.at * 0.85) * 6 < 1.4) { const sp = ((k - s.at * 0.85) * 6 - 0.95) / 0.45; g.strokeStyle = `rgba(230,245,255,${1 - sp})`; g.lineWidth = 4; g.beginPath(); g.ellipse(s.x + s.w / 2, wy + 20, 40 + sp * 100, 10 + sp * 20, 0, 0, 6.283); g.stroke(); } }
  fadeBottom(g);
};
