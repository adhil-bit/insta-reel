const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function palm(x, base, h, lean, g2, color) {        // coconut palm silhouette
  g2.strokeStyle = color; g2.lineWidth = 12; g2.lineCap = 'round';
  const tx = x + lean, ty = base - h;
  g2.beginPath(); g2.moveTo(x, base); g2.quadraticCurveTo(x + lean * 0.2, base - h * 0.5, tx, ty); g2.stroke();
  g2.lineWidth = 7;
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42, L = 120 + (i % 2) * 30;
    g2.beginPath(); g2.moveTo(tx, ty); g2.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 20, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 50); g2.stroke(); }
}
function mixc(a, b, t) { return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; }
const c = makeCanvas(), g = c.getContext('2d');
const cx = W / 2, cy = H * 0.36, R = 400;
const cells = Array.from({length: 90}, () => ({x: (rand() - 0.5) * 2, y: (rand() - 0.5) * 2, r: 0.04 + rand() * 0.05, vx: (rand() - 0.5) * 0.05, vy: (rand() - 0.5) * 0.05, p: rand() * 6}));
const bg = layer(x => { x.fillStyle = '#030203'; x.fillRect(0, 0, W, H); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), zoom = lerp(0.7, 1.6, ease.inOut(k));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.clip();
  const field = g.createRadialGradient(cx, cy, 0, cx, cy, R); field.addColorStop(0, '#f4e6dc'); field.addColorStop(1, '#a8908a');
  g.fillStyle = field; g.fillRect(cx - R, cy - R, R * 2, R * 2);
  for (const cl of cells) {
    let x = ((cl.x + cl.vx * t + 3) % 2) - 1, y = ((cl.y + cl.vy * t + 3) % 2) - 1;
    const px = cx + x * R * zoom, py = cy + y * R * zoom, r = cl.r * R * zoom;
    if (Math.hypot(px - cx, py - cy) > R + r) continue;
    const gr = g.createRadialGradient(px - r * 0.3, py - r * 0.3, r * 0.1, px, py, r);
    gr.addColorStop(0, '#ff9a8a'); gr.addColorStop(0.7, ACCENT); gr.addColorStop(1, '#8a1020');
    g.fillStyle = gr; g.beginPath(); g.arc(px, py, r, 0, 6.283); g.fill();
    g.strokeStyle = 'rgba(90,0,10,0.6)'; g.lineWidth = Math.max(1.5, r * 0.12); g.stroke();
    g.fillStyle = 'rgba(120,10,25,0.55)'; g.beginPath(); g.arc(px + r * 0.15, py + r * 0.1, r * 0.32, 0, 6.283); g.fill();
  }
  g.restore();
  const vig = g.createRadialGradient(cx, cy, R * 0.7, cx, cy, R); vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(0,0,0,0.7)');
  g.fillStyle = vig; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.fill();
  g.strokeStyle = '#2a2a30'; g.lineWidth = 28; g.beginPath(); g.arc(cx, cy, R + 14, 0, 6.283); g.stroke();
  g.strokeStyle = rgba(ACCENT, 0.6); g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R + 30, 0, 6.283); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 2;   // crosshair
  g.beginPath(); g.moveTo(cx - R, cy); g.lineTo(cx + R, cy); g.moveTo(cx, cy - R); g.lineTo(cx, cy + R); g.stroke();
};
