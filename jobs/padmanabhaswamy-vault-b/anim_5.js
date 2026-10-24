const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function gopuram(x, cx, base, s, col) {           // stepped temple tower silhouette
  x.save(); x.translate(cx, base); x.scale(s, s); x.fillStyle = col;
  const tiers = 7; for (let i = 0; i < tiers; i++) { const w = 300 - i * 34, h = 50; x.fillRect(-w / 2, -(i + 1) * h, w, h + 1);
    x.fillRect(-w / 2 - 10, -(i + 1) * h, w + 20, 8); }
  x.beginPath(); x.moveTo(-70, -tiers * 50); x.quadraticCurveTo(0, -tiers * 50 - 90, 70, -tiers * 50); x.fill();
  for (let i = -2; i <= 2; i++) { x.beginPath(); x.arc(i * 28, -tiers * 50 - 40 - (2 - Math.abs(i)) * 12, 7, 0, 6.283); x.fill(); }
  x.restore();
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
function sparkle(g, x, y, r, a) { g.fillStyle = `rgba(255,240,200,${a})`; g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r * 0.25, y - r * 0.25); g.lineTo(x + r, y); g.lineTo(x + r * 0.25, y + r * 0.25);
  g.lineTo(x, y + r); g.lineTo(x - r * 0.25, y + r * 0.25); g.lineTo(x - r, y); g.lineTo(x - r * 0.25, y - r * 0.25); g.fill(); }
const c = makeCanvas(), g = c.getContext('2d');
const ground = H * 0.44;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, ground); s.addColorStop(0, '#05050c'); s.addColorStop(1, '#2a1c22'); x.fillStyle = s; x.fillRect(0, 0, W, ground);
  x.fillStyle = '#e6e2f0'; for (let i = 0; i < 120; i++) { x.globalAlpha = rand() * 0.5; x.fillRect(rand() * W, rand() * ground * 0.6, 2, 2); } x.globalAlpha = 1;
  const bl = x.createRadialGradient(W / 2, ground - 250, 20, W / 2, ground - 250, 520); bl.addColorStop(0, 'rgba(255,170,110,0.45)'); bl.addColorStop(1, 'rgba(255,170,110,0)');
  x.fillStyle = bl; x.fillRect(0, 0, W, ground);
  gopuram(x, W / 2, ground, 1.15, '#0a090e');
  x.fillStyle = '#0c0a0e'; x.fillRect(0, ground, W, H); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const lit = ease.inOut(clamp(k * 1.3));
  for (let row = 0; row < 3; row++) for (let i = 0; i < 14; i++) { if (i / 14 > lit) continue;
    const x = 70 + i * 72, y = ground + 30 + row * 60, f = 1 + 0.15 * Math.sin(t * 9 + i * 1.7 + row);
    const gl = g.createRadialGradient(x, y - 14, 1, x, y - 14, 40); gl.addColorStop(0, 'rgba(255,190,90,0.6)'); gl.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = gl; g.fillRect(x - 40, y - 54, 80, 80);
    g.fillStyle = '#ffd27a'; g.beginPath(); g.ellipse(x, y - 14, 5, 12 * f, 0, 0, 6.283); g.fill(); g.fillStyle = '#7a5a2a'; g.fillRect(x - 10, y - 4, 20, 6); }
  const p = (t * 0.5) % 1; g.strokeStyle = rgba(ACCENT, 0.5 * (1 - p)); g.lineWidth = 4; g.beginPath(); g.ellipse(W / 2, ground + 260, 100 + p * 300, 30 + p * 80, 0, 0, 6.283); g.stroke();
  fadeBottom(g);
};
