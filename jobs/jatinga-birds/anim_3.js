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
const bg = layer(x => { const s = x.createRadialGradient(W / 2, H * 0.3, 50, W / 2, H * 0.3, H * 0.8); s.addColorStop(0, '#1a1426'); s.addColorStop(1, '#030308'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  hills(x, H * 0.55, 30, 0.006, 1, '#06060a'); });
const falls = Array.from({length: 16}, () => ({x: rand() * W, d: rand(), sp: 0.35 + rand() * 0.4, spin: (rand() - 0.5) * 8}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const mg = g.createRadialGradient(W / 2, H * 0.3, 200, W / 2, H * 0.3, 420); mg.addColorStop(0, 'rgba(220,215,235,0.35)'); mg.addColorStop(1, 'rgba(220,215,235,0)');
  g.fillStyle = mg; g.fillRect(0, 0, W, H);
  g.fillStyle = '#d8d4e4'; g.beginPath(); g.arc(W / 2, H * 0.3, 230, 0, 6.283); g.fill();
  for (let i = 0; i < 5; i++) { const a = t * 0.4 + i * 1.26, r = 160 + i * 50;
    g.strokeStyle = rgba(ACCENT, 0.12 + 0.06 * Math.sin(t + i)); g.lineWidth = 18; g.beginPath(); g.arc(W / 2, H * 0.3, r, a, a + 1.6); g.stroke(); }
  for (const f of falls) { const u = (t * f.sp * 0.4 + f.d) % 1, y = lerp(-60, H * 0.55, u * u);
    bird(g, f.x + Math.sin(u * 6) * 40, y, 2.0, 0.7 + 0.3 * Math.sin(t * 9 + f.d * 7), '#0a0a10', f.spin * u); }
  fadeBottom(g);
};
