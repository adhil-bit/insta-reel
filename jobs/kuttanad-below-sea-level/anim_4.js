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
const top = H * 0.2, bot = H * 0.56, gateX = W * 0.5;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#07101c'); s.addColorStop(1, '#03050a');
  x.fillStyle = s; x.fillRect(0, 0, W, H);
  const so = x.createLinearGradient(0, bot, 0, H * 0.78); so.addColorStop(0, '#3a2816'); so.addColorStop(1, '#05070b'); x.fillStyle = so; x.fillRect(0, bot, W, H - bot); });
const salt = Array.from({length: 260}, () => ({y: top + 40 + rand() * (bot - top - 60), sp: 0.5 + rand() * 0.8, o: rand(), r: 2 + rand() * 3}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const close = ease.inOut(clamp((k - 0.3) * 2.2));
  // salty water on the left, fresh water on the right
  g.save(); g.beginPath(); g.rect(0, 0, W, bot); g.clip(); waves(g, top + 30, 8, t, 1.4, '#1c4a6e', 0, gateX + 10);
  waves(g, top + 34, 6, t * 0.8, 1.2, '#1a6a5c', gateX - 10, W); g.restore();
  // salt particles drift right; once the gates close they pile up against them
  for (const s of salt) {
    let x = ((t * 140 * s.sp + s.o * W * 1.2) % (W * 1.2)) - 60;
    if (close > 0.5 && x > gateX - 30) x = gateX - 30 - (x - gateX) * 0.08 - s.o * 40;
    else if (close > 0 && x > gateX - 30 && x < gateX + 20) x = gateX - 30;
    const fresh = x > gateX; g.fillStyle = fresh ? 'rgba(255,255,255,0.25)' : 'rgba(240,250,255,0.85)';
    g.beginPath(); g.arc(x, s.y + Math.sin(t * 2 + s.o * 9) * 6, s.r, 0, 6.283); g.fill();
  }
  // the barrier: pillars + gates that slide down
  for (let i = 0; i < 1; i++) {
    g.fillStyle = '#5c6470'; g.fillRect(gateX - 34, top - 120, 68, bot - top + 120);
    const gh = lerp(0, bot - top + 20, close);
    g.fillStyle = rgba(ACCENT, 0.9); g.fillRect(gateX - 22, top - 40, 44, gh);
    g.shadowColor = ACCENT; g.shadowBlur = 30 * close; g.fillRect(gateX - 22, top - 40, 44, gh); g.shadowBlur = 0;
  }
  g.fillStyle = '#3d444e'; g.fillRect(gateX - 90, top - 150, 180, 40);
  // rice on the protected side
  for (let i = 0; i < 9; i++) rice(g, gateX + 80 + i * 52, bot + 4, 90 * ease.out(clamp(close * 1.2)), Math.sin(t * 2 + i) * 5, '#7cc46a');
};
