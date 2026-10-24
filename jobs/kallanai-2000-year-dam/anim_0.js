const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function palm(g2, x, base, h, lean, color) { g2.strokeStyle = color; g2.lineWidth = 10; g2.lineCap = 'round'; const tx = x + lean, ty = base - h;
  g2.beginPath(); g2.moveTo(x, base); g2.quadraticCurveTo(x + lean * 0.2, base - h * 0.5, tx, ty); g2.stroke(); g2.lineWidth = 6;
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42, L = 100 + (i % 2) * 24; g2.beginPath(); g2.moveTo(tx, ty); g2.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 16, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 40); g2.stroke(); } }
function stonesRow(g, x0, x1, y, h, t, col) { for (let x = x0, i = 0; x < x1; x += 44, i++) { g.fillStyle = i % 2 ? col : '#6a6458'; g.beginPath(); g.roundRect(x, y - h + (i % 3) * 4, 46, h, 10); g.fill(); } }
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const dy = H * 0.42;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, dy); s.addColorStop(0, '#141a34'); s.addColorStop(1, '#e09a6a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  palm(x, W * 0.08, dy - 40, 300, 30, '#0a0a10'); palm(x, W * 0.92, dy - 40, 260, -40, '#0a0a10');
  const up = x.createLinearGradient(0, dy - 120, 0, dy); up.addColorStop(0, '#3a5a7a'); up.addColorStop(1, '#2a4a6a'); x.fillStyle = up; x.fillRect(0, dy - 110, W, 110); });
window.renderFrame = function (t) {
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  stonesRow(g, -10, W + 10, dy + 30, 80, t, '#7a7266');
  for (let i = 0; i < 70; i++) { const x = (i * 16 + 4) % W, ph = (t * 1.6 + i * 0.37) % 1; g.strokeStyle = `rgba(230,240,255,${0.6 * (1 - ph)})`; g.lineWidth = 4;
    g.beginPath(); g.moveTo(x, dy + 30); g.quadraticCurveTo(x + 10, dy + 30 + ph * 100, x + 16, dy + 40 + ph * 220); g.stroke(); }
  const dn = g.createLinearGradient(0, dy + 20, 0, H * 0.75); dn.addColorStop(0, '#d8e6f0'); dn.addColorStop(0.15, '#3a5a7a'); dn.addColorStop(1, '#05070b'); g.fillStyle = dn; g.fillRect(0, dy + 200, W, H);
  const gl = g.createRadialGradient(W / 2, dy, 20, W / 2, dy, 500); gl.addColorStop(0, rgba(ACCENT, 0.2)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  fadeBottom(g);
};
