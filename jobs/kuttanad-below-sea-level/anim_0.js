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
const sea = H * 0.27, field = H * 0.43, dikeX = W * 0.36, bed = H * 0.56;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#060a14'); s.addColorStop(0.45, '#0d1a2a'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
const plants = Array.from({length: 22}, (_, i) => ({x: dikeX + 120 + i * ((W - dikeX - 150) / 21) + (rand() - 0.5) * 10, h: 110 + rand() * 50, p: rand() * 6}));
const stars = Array.from({length: 90}, () => ({x: rand() * W, y: rand() * H * 0.3, p: rand() * 6}));
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.fillStyle = '#cfe0ff'; for (const s of stars) { g.globalAlpha = 0.2 + 0.25 * Math.sin(s.p + t * 2); g.fillRect(s.x, s.y, 2, 2); }
  g.globalAlpha = 1;
  // ground under everything
  const soil = g.createLinearGradient(0, field, 0, H * 0.75); soil.addColorStop(0, '#3a2816'); soil.addColorStop(1, 'rgba(10,7,4,0)');
  g.fillStyle = soil; g.fillRect(0, field + 30, W, H);
  // sea / lake on the left, higher than the field
  const wg = g.createLinearGradient(0, sea, 0, field + 120); wg.addColorStop(0, '#1f5a8a'); wg.addColorStop(1, '#0b2440');
  g.save(); g.beginPath(); g.rect(0, 0, dikeX + 20, bed); g.clip();
  waves(g, sea, 9, t, 1.6, wg, 0, dikeX + 20); g.restore();
  g.fillStyle = soil; g.fillRect(0, bed, dikeX + 20, H);
  // the dike (mud wall)
  g.fillStyle = '#5a4026'; g.beginPath();
  g.moveTo(dikeX - 50, bed); g.lineTo(dikeX + 6, sea - 30); g.lineTo(dikeX + 56, sea - 30); g.lineTo(dikeX + 130, field + 40); g.lineTo(dikeX + 130, bed); g.closePath(); g.fill();
  g.fillStyle = '#6f8f3a'; g.fillRect(dikeX + 6, sea - 36, 50, 9);
  // rice field below sea level
  g.fillStyle = '#1d3a22'; g.fillRect(dikeX + 100, field, W - dikeX - 100, 40);
  g.fillStyle = 'rgba(80,140,200,0.35)'; g.fillRect(dikeX + 100, field - 8, W - dikeX - 100, 10);
  const grow = ease.out(clamp(k * 1.5));
  for (const p of plants) rice(g, p.x, field, p.h * grow, Math.sin(t * 1.8 + p.p) * 6, `rgb(${110 + grow * 40},${190},${90})`);
  // sea-level line extending over the field
  const reach = ease.inOut(clamp(k * 1.3 - 0.2));
  g.setLineDash([22, 14]); g.strokeStyle = rgba(ACCENT, 0.95); g.lineWidth = 6;
  g.beginPath(); g.moveTo(dikeX + 60, sea); g.lineTo(lerp(dikeX + 60, W - 40, reach), sea); g.stroke(); g.setLineDash([]);
  if (reach > 0.95) {               // gap bracket: the field sits below the sea
    const a = clamp((reach - 0.95) * 20) * (0.7 + 0.3 * Math.sin(t * 4));
    g.strokeStyle = rgba(ACCENT, a); g.lineWidth = 6;
    const bx = W - 70; g.beginPath(); g.moveTo(bx - 16, sea); g.lineTo(bx, sea); g.lineTo(bx, field); g.lineTo(bx - 16, field); g.stroke();
    g.fillStyle = rgba(ACCENT, a); g.beginPath(); g.moveTo(bx - 12, field - 22); g.lineTo(bx, field); g.lineTo(bx + 12, field - 22); g.fill();
  }
};
