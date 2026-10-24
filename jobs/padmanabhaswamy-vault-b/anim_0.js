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
const ground = H * 0.36;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, ground); s.addColorStop(0, '#070710'); s.addColorStop(1, '#241a28'); x.fillStyle = s; x.fillRect(0, 0, W, ground);
  const bl = x.createRadialGradient(W / 2, ground - 250, 20, W / 2, ground - 250, 520); bl.addColorStop(0, 'rgba(255,170,110,0.45)'); bl.addColorStop(1, 'rgba(255,170,110,0)');
  x.fillStyle = bl; x.fillRect(0, 0, W, ground);
  gopuram(x, W / 2, ground, 1.05, '#0b0a10');
  const e = x.createLinearGradient(0, ground, 0, H * 0.75); e.addColorStop(0, '#2a2018'); e.addColorStop(1, '#05040a'); x.fillStyle = e; x.fillRect(0, ground, W, H);
  x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 3; for (let r = 0; r < 8; r++) for (let q = 0; q < 8; q++) x.strokeRect(q * 140 + (r % 2) * 70 - 70, ground + 20 + r * 60, 140, 60); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), glow = 0.5 + 0.5 * ease.inOut(k), vy = H * 0.52;
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const gl = g.createRadialGradient(W / 2, vy, 20, W / 2, vy, 420); gl.addColorStop(0, `rgba(255,190,90,${0.35 * glow})`); gl.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = gl; g.fillRect(0, ground, W, H);
  g.save(); g.translate(W / 2, vy); g.scale(1.5, 1.5); g.translate(-W / 2, -vy);
  g.fillStyle = '#1a140e'; g.fillRect(W / 2 - 160, vy - 120, 320, 240);
  g.fillStyle = '#3a3a40'; g.fillRect(W / 2 - 130, vy - 100, 260, 200);
  g.strokeStyle = `rgba(255,200,110,${0.6 + 0.4 * Math.sin(t * 3)})`; g.lineWidth = 5; g.strokeRect(W / 2 - 130, vy - 100, 260, 200);
  g.beginPath(); g.moveTo(W / 2, vy - 100); g.lineTo(W / 2, vy + 100); g.stroke();
  g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 8; g.beginPath(); g.moveTo(W / 2 - 150, vy - 30); g.lineTo(W / 2 + 150, vy + 30); g.moveTo(W / 2 - 150, vy + 30); g.lineTo(W / 2 + 150, vy - 30); g.stroke();
  g.restore();
  for (let i = 0; i < 12; i++) { const a = (t * 0.5 + i / 12) % 1; sparkle(g, W / 2 + Math.sin(i * 7) * 200, vy - 120 - a * 200, 8 * (1 - a), (1 - a) * glow); }
};
