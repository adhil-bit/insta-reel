const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function sea(g, y0, amp, t, sp, col, x0 = 0, x1 = W) {
  g.fillStyle = col; g.beginPath(); g.moveTo(x0, H);
  for (let x = x0; x <= x1; x += 10) g.lineTo(x, y0 + Math.sin(x * 0.012 + t * sp) * amp + Math.sin(x * 0.033 - t * sp * 1.4) * amp * 0.4);
  g.lineTo(x1, H); g.closePath(); g.fill();
}

function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
function ruin(g, x, base, s, col) {      // broken church facade with an arched doorway
  g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = col;
  g.beginPath(); g.moveTo(-170, 0); g.lineTo(-170, -260); g.lineTo(-120, -300); g.lineTo(-90, -270); g.lineTo(-60, -340); g.lineTo(-10, -360);
  g.lineTo(30, -310); g.lineTo(70, -330); g.lineTo(110, -250); g.lineTo(150, -260); g.lineTo(170, -200); g.lineTo(170, 0); g.closePath(); g.fill();
  g.globalCompositeOperation = 'destination-out';
  g.beginPath(); g.moveTo(-45, 0); g.lineTo(-45, -150); g.arc(0, -150, 45, Math.PI, 0); g.lineTo(45, 0); g.fill();
  for (const wx of [-120, 100]) { g.beginPath(); g.moveTo(wx - 18, -150); g.lineTo(wx - 18, -210); g.arc(wx, -210, 18, Math.PI, 0); g.lineTo(wx + 18, -150); g.fill(); }
  g.restore();
}
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { const s = x.createRadialGradient(W / 2, H * 0.35, 50, W / 2, H * 0.35, H); s.addColorStop(0, '#16406a'); s.addColorStop(1, '#061424'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#c9b48a'; x.beginPath(); x.moveTo(-50, H * 0.2); x.quadraticCurveTo(W * 0.3, H * 0.27, W * 0.55, H * 0.36); x.quadraticCurveTo(W * 0.6, H * 0.38, W * 0.55, H * 0.39);
  x.quadraticCurveTo(W * 0.3, H * 0.34, -50, H * 0.32); x.fill();
  x.fillStyle = '#9fb37a'; x.beginPath(); x.ellipse(W * 1.02, H * 0.52, 200, 120, -0.3, 0, 6.283); x.fill(); });
const houses = Array.from({length: 26}, () => ({x: W * (0.25 + rand() * 0.27), y: 0, s: 6 + rand() * 6}));
houses.forEach(h => { const u = (h.x + 50) / (W * 0.6); h.y = lerp(H * 0.255, H * 0.37, u) + (rand() - 0.5) * 20; });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  houses.forEach((h, i) => { const a = clamp(k * 3 - i * 0.05); g.fillStyle = rgba(ACCENT, 0.9 * a); g.fillRect(h.x, h.y, h.s, h.s); });
  const A = [W * 0.56, H * 0.375], B = [W * 0.86, H * 0.5];
  g.setLineDash([16, 12]); g.strokeStyle = 'rgba(230,240,255,0.7)'; g.lineWidth = 4; g.beginPath(); g.moveTo(...A); g.quadraticCurveTo(W * 0.74, H * 0.4, ...B); g.stroke(); g.setLineDash([]);
  const u = (t * 0.15) % 1, bx = (1 - u) ** 2 * A[0] + 2 * (1 - u) * u * W * 0.74 + u * u * B[0], by = (1 - u) ** 2 * A[1] + 2 * (1 - u) * u * H * 0.4 + u * u * B[1];
  g.fillStyle = '#f2f2f2'; g.beginPath(); g.moveTo(bx - 26, by - 8); g.lineTo(bx + 26, by - 8); g.lineTo(bx + 16, by + 8); g.lineTo(bx - 16, by + 8); g.fill();
  g.fillStyle = ACCENT; g.fillRect(bx - 8, by - 22, 14, 14);
  const p = (t * 0.8) % 1; g.strokeStyle = rgba(ACCENT, 1 - p); g.lineWidth = 4; g.beginPath(); g.arc(W * 0.53, H * 0.37, 20 + p * 90, 0, 6.283); g.stroke();
};
