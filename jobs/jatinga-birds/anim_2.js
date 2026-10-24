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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#06080e'); s.addColorStop(1, '#141c1e'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  hills(x, H * 0.5, 40, 0.005, 2, '#0a100e'); });
const lamps = [[W * 0.25, H * 0.42], [W * 0.55, H * 0.4], [W * 0.82, H * 0.43]];
const birds = Array.from({length: 18}, (_, i) => ({sx: rand() * W, sy: -50 - rand() * 300, tgt: i % 3, sp: 0.4 + rand() * 0.5, ph: rand()}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const [x, y] of lamps) { g.fillStyle = '#222'; g.fillRect(x - 5, y, 10, H * 0.2); lamp(g, x, y, 0.9, 240); }
  for (const b of birds) { const u = ((t * b.sp * 0.3 + b.ph) % 1) * ease.inOut(clamp(k * 1.4)), [tx, ty] = lamps[b.tgt];
    const x = lerp(b.sx, tx, u) + Math.sin(t * 2 + b.ph * 9) * 30 * (1 - u), y = lerp(b.sy, ty - 30, u);
    bird(g, x, y, 0.9, Math.sin(t * 14 * b.sp + b.ph * 9), '#0c0e0e', Math.atan2(ty - b.sy, tx - b.sx) - Math.PI / 2 + Math.PI / 2); }
  fog(g, t, H * 0.15, H * 0.55, 0.12 + 0.12 * k); fadeBottom(g);
};
