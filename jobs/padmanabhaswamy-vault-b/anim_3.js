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
const cx = W / 2, cy = H * 0.42;
const bg = layer(x => { const b = x.createRadialGradient(cx, cy - 100, 50, cx, cy, H * 0.75); b.addColorStop(0, '#2a1a0e'); b.addColorStop(1, '#040306'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const coins = Array.from({length: 260}, () => { const u = rand(), v = rand(); const x = cx + (u - 0.5) * 760 * (1 - v * 0.7), y = cy + 120 - v * 300 + (rand() - 0.5) * 20; return {x, y, r: 16 + rand() * 12, s: rand()}; }).sort((a, b) => a.y - b.y);
const gems = Array.from({length: 18}, () => ({x: cx + (rand() - 0.5) * 520, y: cy - rand() * 160, c: ['#e8334a', '#2fbf71', '#3b82f6', '#e8334a'][Math.floor(rand() * 4)], s: 18 + rand() * 14}));
const glints = Array.from({length: 40}, () => ({x: cx + (rand() - 0.5) * 700, y: cy - 200 + rand() * 320, p: rand() * 6}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), rise = ease.out(clamp(k * 1.5));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const gl = g.createRadialGradient(cx, cy, 30, cx, cy, 520); gl.addColorStop(0, `rgba(255,190,80,${0.4 * rise})`); gl.addColorStop(1, 'rgba(255,190,80,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  for (const c2 of coins) { const y = c2.y + (1 - rise) * 300; if (y > cy + 160) continue;
    g.fillStyle = c2.s > 0.5 ? '#f2c14e' : '#d9a23a'; g.beginPath(); g.ellipse(c2.x, y, c2.r, c2.r * 0.45, 0, 0, 6.283); g.fill();
    g.strokeStyle = '#a0721e'; g.lineWidth = 2; g.stroke(); }
  for (const gm of gems) { const y = gm.y + (1 - rise) * 300; g.fillStyle = gm.c; g.beginPath(); g.moveTo(gm.x, y - gm.s); g.lineTo(gm.x + gm.s * 0.8, y); g.lineTo(gm.x, y + gm.s); g.lineTo(gm.x - gm.s * 0.8, y); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.45)'; g.beginPath(); g.moveTo(gm.x, y - gm.s); g.lineTo(gm.x + gm.s * 0.3, y - gm.s * 0.2); g.lineTo(gm.x - gm.s * 0.3, y - gm.s * 0.2); g.fill(); }
  for (const s of glints) { const a = Math.max(0, Math.sin(t * 3 + s.p)) ** 6; if (a > 0.05) sparkle(g, s.x, s.y + (1 - rise) * 300, 22 * a, a * rise); }
  fadeBottom(g);
};
