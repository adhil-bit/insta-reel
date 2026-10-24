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
const hz = H * 0.42;
const sky = layer(x => { const s = x.createLinearGradient(0, 0, 0, hz); s.addColorStop(0, '#050914'); s.addColorStop(1, '#1b2d3a'); x.fillStyle = s; x.fillRect(0, 0, W, hz);
  const gd = x.createLinearGradient(0, hz, 0, H); gd.addColorStop(0, '#163a24'); gd.addColorStop(1, '#03060a'); x.fillStyle = gd; x.fillRect(0, hz, W, H - hz); });
const birds = Array.from({length: 7}, () => ({x: rand() * W, y: H * 0.1 + rand() * H * 0.16, s: 0.6 + rand() * 0.6, p: rand() * 6}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(sky, 0, 0);
  const rise = ease.out(k), sy = lerp(hz + 80, hz - 170, rise);
  const glow = g.createRadialGradient(W / 2, sy, 10, W / 2, sy, 620);
  glow.addColorStop(0, rgba('#FFC86B', 0.55 * rise + 0.1)); glow.addColorStop(1, rgba('#FFC86B', 0));
  g.fillStyle = glow; g.fillRect(0, 0, W, hz);
  g.save(); g.beginPath(); g.rect(0, 0, W, hz); g.clip();
  g.fillStyle = '#FFD98A'; g.beginPath(); g.arc(W / 2, sy, 135, 0, 6.283); g.fill(); g.restore();
  // paddy rows in perspective, with channels of water reflecting the sun
  for (let r = 0; r < 14; r++) {
    const f = r / 13, y = hz + Math.pow(f, 1.8) * (H * 0.3), h = 4 + f * 26;
    g.fillStyle = r % 3 === 1 ? rgba('#FFC86B', 0.12 + 0.3 * rise * (1 - f)) : (r % 2 ? '#1f5a30' : '#2a6e3a');
    g.fillRect(0, y, W, h);
  }
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 3;
  for (let i = -10; i <= 10; i++) { g.beginPath(); g.moveTo(W / 2 + i * 30, hz); g.lineTo(W / 2 + i * 240, hz + H * 0.32); g.stroke(); }
  g.strokeStyle = rgba(ACCENT, 0.5); g.lineWidth = 3;
  g.beginPath(); g.moveTo(0, hz); g.lineTo(W, hz); g.stroke();
  g.strokeStyle = 'rgba(10,15,20,0.9)'; g.lineWidth = 3;
  for (const b of birds) {
    const x = (b.x + t * 50 * b.s) % (W + 100) - 50, flap = Math.sin(t * 6 * b.s + b.p) * 10;
    g.beginPath(); g.moveTo(x - 18, b.y - flap); g.quadraticCurveTo(x - 8, b.y - 4, x, b.y); g.quadraticCurveTo(x + 8, b.y - 4, x + 18, b.y - flap); g.stroke();
  }
};
