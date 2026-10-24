const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function rice(g, x, y, h, sway, color) {           // one rice plant: a few curved blades
  g.strokeStyle = color; g.lineWidth = 3; g.lineCap = 'round';
  for (let b = -2; b <= 2; b++) {
    g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x + b * 4 + sway * 0.5, y - h * 0.6, x + b * 9 + sway, y - h * (0.85 + 0.1 * Math.cos(b)));
    g.stroke();
  }
}
function waves(g, y0, amp, t, speed, color, x0 = 0, x1 = W) {
  g.fillStyle = color; g.beginPath(); g.moveTo(x0, H);
  for (let x = x0; x <= x1; x += 12) g.lineTo(x, y0 + Math.sin(x * 0.012 + t * speed) * amp + Math.sin(x * 0.031 - t * speed * 1.3) * amp * 0.4);
  g.lineTo(x1, H); g.closePath(); g.fill();
}
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { const b = x.createRadialGradient(W/2, H*0.34, 40, W/2, H*0.34, H*0.8);
  b.addColorStop(0, '#16243a'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H);
  // fields seen from above in perspective at the bottom of the hero area
  for (let r = 0; r < 9; r++) { const y = H * 0.44 + r * r * 4 + r * 18; x.fillStyle = r % 2 ? '#1f4a2a' : '#245a30';
    x.fillRect(0, y, W, 18 + r * 4); }
  x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 3;
  for (let i = -8; i <= 8; i++) { x.beginPath(); x.moveTo(W / 2 + i * 40, H * 0.44); x.lineTo(W / 2 + i * 260, H * 0.44 + 81 * 4 + 9 * 18 + 70); x.stroke(); } });
const sparks = Array.from({length: 70}, () => ({a: rand() * 6.283, r: 160 + rand() * 260, s: 0.2 + rand() * 0.6, p: rand() * 6}));
function crown(cx, cy, s) {
  g.save(); g.translate(cx, cy); g.scale(s, s);
  const gr = g.createLinearGradient(0, -120, 0, 60); gr.addColorStop(0, '#FFE58A'); gr.addColorStop(1, '#C8901E');
  g.fillStyle = gr; g.beginPath();
  g.moveTo(-170, 60); g.lineTo(-190, -70); g.lineTo(-95, 0); g.lineTo(0, -120); g.lineTo(95, 0); g.lineTo(190, -70); g.lineTo(170, 60); g.closePath(); g.fill();
  g.fillStyle = '#B07A14'; g.fillRect(-172, 40, 344, 34);
  for (const [x, y, col] of [[-190, -70, '#9fe8c8'], [0, -120, ACCENT], [190, -70, '#9fe8c8']]) {
    g.fillStyle = col; g.beginPath(); g.arc(x, y, 18, 0, 6.283); g.fill(); }
  for (const x of [-110, 0, 110]) { g.fillStyle = '#2d7f6a'; g.beginPath(); g.arc(x, 57, 11, 0, 6.283); g.fill(); }
  g.restore();
}
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const drop = ease.out(clamp(k * 1.5));
  const cy = lerp(-200, H * 0.32, drop) + Math.sin(t * 1.5) * 8;
  const glow = g.createRadialGradient(W / 2, cy, 20, W / 2, cy, 420);
  glow.addColorStop(0, rgba('#FFD45A', 0.35 * drop)); glow.addColorStop(1, rgba('#FFD45A', 0));
  g.fillStyle = glow; g.fillRect(0, 0, W, H);
  for (const s of sparks) {
    const a = s.a + t * s.s * 0.4, r = s.r * drop;
    g.globalAlpha = drop * (0.3 + 0.5 * Math.abs(Math.sin(s.p + t * 2)));
    g.fillStyle = '#FFE58A'; g.fillRect(W / 2 + Math.cos(a) * r, cy + Math.sin(a) * r * 0.6, 4, 4);
  }
  g.globalAlpha = 1;
  crown(W / 2, cy, 1.25 + 0.03 * Math.sin(t * 2));
};
