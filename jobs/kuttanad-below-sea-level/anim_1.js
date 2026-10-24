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
const seaY = H * 0.3;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#07101c'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
const prof = x => {                // ground height: coast left, deep basin in the middle, rising right
  const u = x / W; return seaY - 30 + 300 * Math.exp(-Math.pow((u - 0.55) / 0.2, 2)) + 170 * Math.exp(-Math.pow(u / 0.12, 2));
};
const plants = Array.from({length: 30}, () => { const x = W * (0.36 + rand() * 0.38); return {x, h: 60 + rand() * 40, p: rand() * 6}; });
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  // sea on the far left
  waves(g, seaY, 7, t, 1.5, '#174a73', 0, W * 0.24);
  // ground profile, revealed left to right
  const rev = Math.max(0.26, ease.inOut(clamp(k * 1.7)));
  const soil = g.createLinearGradient(0, seaY, 0, H * 0.72); soil.addColorStop(0, '#3a2816'); soil.addColorStop(1, '#05070b');
  g.fillStyle = soil; g.beginPath(); g.moveTo(0, H);
  for (let x = 0; x <= W * rev; x += 8) g.lineTo(x, prof(x));
  g.lineTo(W * rev, H); g.closePath(); g.fill();
  g.strokeStyle = '#4c7a3a'; g.lineWidth = 6; g.beginPath();
  for (let x = W * 0.2; x <= W * rev; x += 8) x === W * 0.2 ? g.moveTo(x, prof(x)) : g.lineTo(x, prof(x)); g.stroke();
  for (const p of plants) if (p.x < W * rev) rice(g, p.x, prof(p.x), p.h, Math.sin(t * 2 + p.p) * 5, '#7cc46a');
  // sea level line + the area below it tinted
  g.setLineDash([22, 14]); g.strokeStyle = rgba(ACCENT, 0.95); g.lineWidth = 6;
  g.beginPath(); g.moveTo(0, seaY); g.lineTo(W, seaY); g.stroke(); g.setLineDash([]);
  const tint = ease.inOut(clamp(k * 1.6 - 0.5));
  g.fillStyle = rgba(ACCENT, 0.2 * tint); g.beginPath(); g.moveTo(W * 0.26, seaY);
  for (let x = W * 0.26; x <= W * 0.86; x += 8) g.lineTo(x, Math.max(seaY, prof(x)));
  g.lineTo(W * 0.86, seaY); g.closePath(); g.fill();
  // depth arrows at the deepest point
  if (tint > 0) {
    const x = W * 0.55, y1 = prof(x), a = tint * (0.7 + 0.3 * Math.sin(t * 4));
    g.strokeStyle = rgba(ACCENT, a); g.lineWidth = 5; g.beginPath(); g.moveTo(x, seaY + 12); g.lineTo(x, y1 - 14); g.stroke();
    g.fillStyle = rgba(ACCENT, a);
    g.beginPath(); g.moveTo(x - 14, y1 - 30); g.lineTo(x, y1 - 8); g.lineTo(x + 14, y1 - 30); g.fill();
  }
};
