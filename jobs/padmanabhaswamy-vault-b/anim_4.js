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
const cx = W / 2, cy = H * 0.36;
const bg = layer(x => { x.fillStyle = '#08070a'; x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(70,60,50,0.6)'; x.lineWidth = 3; for (let r = 0; r < 14; r++) for (let q = 0; q < 8; q++) x.strokeRect(q * 150 + (r % 2) * 75 - 75, r * 70, 150, 70); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), shake = k > 0.45 && k < 0.6 ? Math.sin(t * 60) * 4 * (1 - (k - 0.45) / 0.15) : 0;
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const seam = 0.5 + 0.5 * Math.sin(t * 2.5);
  const gl = g.createRadialGradient(cx, cy, 100, cx, cy, 520); gl.addColorStop(0, `rgba(255,190,90,${0.18 + 0.12 * seam})`); gl.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.save(); g.translate(cx + shake, cy);
  g.fillStyle = '#2a2a30'; g.fillRect(-280, -340, 560, 680);
  g.fillStyle = '#3c3c44'; g.fillRect(-250, -310, 245, 620); g.fillRect(5, -310, 245, 620);
  g.strokeStyle = `rgba(255,200,110,${0.5 + 0.5 * seam})`; g.lineWidth = 6; g.beginPath(); g.moveTo(0, -310); g.lineTo(0, 310); g.stroke();
  g.fillStyle = '#5a5a64'; for (let r = 0; r < 8; r++) for (const xx of [-225, -30, 30, 225]) { g.beginPath(); g.arc(xx, -280 + r * 80, 9, 0, 6.283); g.fill(); }
  for (const s of [-1, 1]) { g.strokeStyle = '#8a8a94'; g.lineWidth = 14; g.setLineDash([26, 10]); g.beginPath(); g.moveTo(-300, s * 120 - 140 * s); g.lineTo(300, s * 120 + 140 * s); g.stroke(); }
  g.setLineDash([]);
  g.fillStyle = ACCENT; g.beginPath(); g.roundRect(-60, -40, 120, 110, 14); g.fill(); g.strokeStyle = ACCENT; g.lineWidth = 16; g.beginPath(); g.arc(0, -40, 42, Math.PI, 0); g.stroke();
  g.fillStyle = '#1a0a0e'; g.beginPath(); g.arc(0, 10, 14, 0, 6.283); g.fill(); g.fillRect(-6, 10, 12, 34);
  g.restore();
  fadeBottom(g);
};
