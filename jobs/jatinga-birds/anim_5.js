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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.55); s.addColorStop(0, '#1a2440'); s.addColorStop(0.6, '#c87a5a'); s.addColorStop(1, '#f2c27a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  hills(x, H * 0.42, 70, 0.004, 2, '#2a3a36'); hills(x, H * 0.5, 50, 0.006, 4, '#16221e'); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const sy = lerp(H * 0.44, H * 0.3, ease.out(k));
  const sun = g.createRadialGradient(W * 0.5, sy, 10, W * 0.5, sy, 360); sun.addColorStop(0, 'rgba(255,230,170,0.95)'); sun.addColorStop(0.25, 'rgba(255,210,140,0.5)'); sun.addColorStop(1, 'rgba(255,210,140,0)');
  g.fillStyle = sun; g.fillRect(0, 0, W, H * 0.5);
  g.drawImage(bg, 0, H * 0.4, W, H * 0.6, 0, H * 0.4, W, H * 0.6);
  const lead = [lerp(-100, W * 0.75, ease.inOut(k)), lerp(H * 0.36, H * 0.12, ease.inOut(k))];
  for (let i = -4; i <= 4; i++) { const off = Math.abs(i);
    bird(g, lead[0] - off * 90, lead[1] + i * 60, 1.5, Math.sin(t * 9 + i), '#1a1414', 0); }
  g.strokeStyle = rgba(ACCENT, 0.6); g.lineWidth = 3; g.beginPath(); g.moveTo(0, H * 0.5); for (let x = 0; x <= W; x += 12) g.lineTo(x, H * 0.5 - 50 * (0.6 * Math.sin(x * 0.006 + 4) + 0.4 * Math.sin(x * 0.006 * 2.7 + 8))); g.stroke();
  fadeBottom(g);
};
