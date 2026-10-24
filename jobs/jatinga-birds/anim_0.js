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
const lx = W / 2, ly = H * 0.42;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#04060c'); s.addColorStop(1, '#121a1c'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  hills(x, H * 0.4, 60, 0.004, 1, '#0c1412'); hills(x, H * 0.47, 40, 0.006, 3, '#080e0c');
  x.fillStyle = '#2a2a2a'; x.fillRect(lx - 6, ly, 12, H * 0.2); });
const birds = Array.from({length: 14}, () => ({a: rand() * 6.283, r: 200 + rand() * 300, s: 0.7 + rand() * 0.6, sp: 0.5 + rand() * 0.6, ph: rand()}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  fog(g, t, H * 0.2, H * 0.5, 0.14);
  lamp(g, lx, ly, 0.85 + 0.15 * Math.sin(t * 5), 340);
  for (const b of birds) { const pull = ((t * b.sp * 0.25 + b.ph) % 1), r = b.r * (1 - pull * 0.8), a = b.a + t * b.sp * 1.5;
    bird(g, lx + Math.cos(a) * r, ly - 40 + Math.sin(a) * r * 0.55, b.s, Math.sin(t * 12 * b.sp + b.ph * 9), '#0a0c0c', a + Math.PI / 2); }
  fadeBottom(g);
};
