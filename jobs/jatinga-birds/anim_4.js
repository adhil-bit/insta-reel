const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function bird(g, x, y, s, flap, col, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = col;
  g.beginPath(); g.ellipse(0, 0, 18, 7, 0, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(-4, -2); g.quadraticCurveTo(-14, -26 * flap, -40, -18 * flap); g.quadraticCurveTo(-20, -6, -4, 2); g.fill();
  g.beginPath(); g.moveTo(4, -2); g.quadraticCurveTo(14, -26 * flap, 40, -18 * flap); g.quadraticCurveTo(20, -6, 4, 2); g.fill();
  g.restore();
}
function lamp(g, x, y, a, glowR = 260) {
  const gl = g.createRadialGradient(x, y, 4, x, y, glowR); gl.addColorStop(0, `rgba(255,230,160,${0.75 * a})`); gl.addColorStop(1, 'rgba(255,230,160,0)');
  g.fillStyle = gl; g.beginPath(); g.arc(x, y, glowR, 0, 6.283); g.fill();
  g.fillStyle = '#fff2c8'; g.beginPath(); g.arc(x, y, 12, 0, 6.283); g.fill();
}
function fog(g, t, y0, y1, a) { for (let i = 0; i < 9; i++) { const x = ((i * 260 + t * (12 + i * 3)) % (W + 500)) - 250, y = y0 + (i * 97) % (y1 - y0);
  const gr = g.createRadialGradient(x, y, 0, x, y, 280); gr.addColorStop(0, `rgba(190,200,210,${a})`); gr.addColorStop(1, 'rgba(190,200,210,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 280, 0, 6.283); g.fill(); } }
function hills(x, base, amp, f, ph, col) { x.fillStyle = col; x.beginPath(); x.moveTo(0, H); for (let X = 0; X <= W; X += 12) x.lineTo(X, base - amp * (0.6 * Math.sin(X * f + ph) + 0.4 * Math.sin(X * f * 2.7 + ph * 2))); x.lineTo(W, H); x.fill(); }
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const lx = W * 0.62, ly = H * 0.44;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#05070d'); s.addColorStop(1, '#101818'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  hills(x, H * 0.52, 40, 0.005, 2, '#090f0d'); x.fillStyle = '#222'; x.fillRect(lx - 6, ly, 12, H * 0.2); });
const winds = Array.from({length: 60}, () => ({y: rand() * H * 0.5, o: rand(), l: 80 + rand() * 160, s: 0.8 + rand()}));
const path = []; for (let u = 0; u <= 1.0001; u += 0.01) { const a = u * 9, r = lerp(420, 10, u); path.push([lerp(80, lx, u * u) + Math.cos(a) * r * (1 - u) * 0.6, lerp(H * 0.08, ly, u) + Math.sin(a) * r * 0.3 * (1 - u)]); }
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.strokeStyle = 'rgba(200,215,225,0.25)'; g.lineWidth = 3; g.beginPath();
  for (const w of winds) { const x = ((w.o * W * 1.4 + t * 500 * w.s) % (W + 300)) - 150; g.moveTo(x, w.y); g.lineTo(x + w.l, w.y + 6); } g.stroke();
  fog(g, t, H * 0.1, H * 0.5, 0.12);
  lamp(g, lx, ly, 0.95, 300);
  const n = Math.floor(ease.inOut(k) * (path.length - 1));
  g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 5; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(...path[0]);
  for (let i = 1; i <= n; i++) g.lineTo(...path[i]); g.stroke(); g.setLineDash([]);
  const [bx, by] = path[n], [px, py] = path[Math.max(0, n - 1)];
  bird(g, bx, by, 1.3, Math.sin(t * 14), '#0a0c0c', Math.atan2(by - py, bx - px));
  fadeBottom(g);
};
