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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#05070e'); s.addColorStop(1, '#0e1814'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#dfe6f5'; for (let i = 0; i < 140; i++) { x.globalAlpha = rand() * 0.6; x.fillRect(rand() * W, rand() * H * 0.3, 2, 2); } x.globalAlpha = 1;
  hills(x, H * 0.3, 90, 0.003, 2, '#101a1c'); hills(x, H * 0.38, 70, 0.005, 4, '#0c1612'); hills(x, H * 0.46, 50, 0.007, 1, '#08100c'); });
const lights = Array.from({length: 22}, () => ({x: W * (0.2 + rand() * 0.6), y: H * (0.4 + rand() * 0.08), at: rand()}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const l of lights) { const a = clamp((k - l.at * 0.6) * 4); if (a > 0) lamp(g, l.x, l.y, a * (0.6 + 0.2 * Math.sin(t * 4 + l.x)), 60); }
  const pin = ease.out(clamp(k * 2)), py = lerp(H * 0.15, H * 0.36, pin);
  g.fillStyle = ACCENT; g.beginPath(); g.arc(W / 2, py - 40, 30, Math.PI, 0); g.lineTo(W / 2, py + 10); g.closePath(); g.fill();
  g.fillStyle = '#0c1412'; g.beginPath(); g.arc(W / 2, py - 40, 12, 0, 6.283); g.fill();
  if (pin >= 1) { const p = (t * 0.8) % 1; g.strokeStyle = rgba(ACCENT, 1 - p); g.lineWidth = 4; g.beginPath(); g.ellipse(W / 2, py + 10, 30 + p * 120, 10 + p * 40, 0, 0, 6.283); g.stroke(); }
  fog(g, t, H * 0.35, H * 0.5, 0.08); fadeBottom(g);
};
