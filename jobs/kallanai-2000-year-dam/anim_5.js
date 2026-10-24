const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function palm(g2, x, base, h, lean, color) { g2.strokeStyle = color; g2.lineWidth = 10; g2.lineCap = 'round'; const tx = x + lean, ty = base - h;
  g2.beginPath(); g2.moveTo(x, base); g2.quadraticCurveTo(x + lean * 0.2, base - h * 0.5, tx, ty); g2.stroke(); g2.lineWidth = 6;
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42, L = 100 + (i % 2) * 24; g2.beginPath(); g2.moveTo(tx, ty); g2.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 16, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 40); g2.stroke(); } }
function stonesRow(g, x0, x1, y, h, t, col) { for (let x = x0, i = 0; x < x1; x += 44, i++) { g.fillStyle = i % 2 ? col : '#6a6458'; g.beginPath(); g.roundRect(x, y - h + (i % 3) * 4, 46, h, 10); g.fill(); } }
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const dy = H * 0.44;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, dy); s.addColorStop(0, '#2a1a3a'); s.addColorStop(0.6, '#c8604a'); s.addColorStop(1, '#f2b26a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  palm(x, W * 0.12, dy - 30, 280, 30, '#140c10'); palm(x, W * 0.86, dy - 30, 320, -30, '#140c10'); });
const birds = Array.from({length: 7}, () => ({x: rand() * W, y: H * 0.1 + rand() * H * 0.14, s: 0.6 + rand() * 0.5, p: rand() * 6}));
window.renderFrame = function (t) {
  const k = clamp(t / DURATION);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const sy = lerp(dy - 220, dy - 40, ease.inOut(k)); g.save(); g.beginPath(); g.rect(0, 0, W, dy - 30); g.clip(); g.fillStyle = '#ffd08a'; g.beginPath(); g.arc(W * 0.55, sy, 110, 0, 6.283); g.fill(); g.restore();
  g.fillStyle = '#3a4a6a'; g.fillRect(0, dy - 90, W, 70);
  stonesRow(g, -10, W + 10, dy, 36, t, '#5a4e46');
  for (let i = 0; i < 60; i++) { const x = (i * 19) % W, ph = (t * 1.4 + i * 0.29) % 1; g.strokeStyle = `rgba(255,220,190,${0.55 * (1 - ph)})`; g.lineWidth = 3; g.beginPath(); g.moveTo(x, dy); g.lineTo(x + 6, dy + 20 + ph * 90); g.stroke(); }
  const dn = g.createLinearGradient(0, dy + 40, 0, H * 0.75); dn.addColorStop(0, '#6a4a5a'); dn.addColorStop(1, '#05070b'); g.fillStyle = dn; g.fillRect(0, dy + 60, W, H);
  g.strokeStyle = '#140c10'; g.lineWidth = 3; for (const b of birds) { const x = (b.x + t * 40 * b.s) % (W + 80) - 40, f = Math.sin(t * 5 * b.s + b.p) * 9;
    g.beginPath(); g.moveTo(x - 16, b.y - f); g.quadraticCurveTo(x - 6, b.y - 3, x, b.y); g.quadraticCurveTo(x + 6, b.y - 3, x + 16, b.y - f); g.stroke(); }
  fadeBottom(g);
};
