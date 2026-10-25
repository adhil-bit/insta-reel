const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
const bgL = () => layer(x => { const b = x.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H * 0.36, H * 0.8); b.addColorStop(0, '#3a1420'); b.addColorStop(1, '#070305'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
function mirror(g, x, y, s, t, shine) {          // oval Aranmula-style mirror in a bronze frame on a stand
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#8a5a20'; g.fillRect(-18, 190, 36, 120); g.beginPath(); g.ellipse(0, 320, 110, 26, 0, 0, 6.283); g.fill();
  const fr = g.createLinearGradient(-200, -260, 200, 260); fr.addColorStop(0, '#f2c14e'); fr.addColorStop(0.5, '#a8721e'); fr.addColorStop(1, '#f2d27a');
  g.fillStyle = fr; g.beginPath(); g.ellipse(0, 0, 200, 250, 0, 0, 6.283); g.fill();
  for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; g.fillStyle = '#c8902e'; g.beginPath(); g.arc(Math.cos(a) * 214, Math.sin(a) * 264, 14, 0, 6.283); g.fill(); }
  g.save(); g.beginPath(); g.ellipse(0, 0, 165, 215, 0, 0, 6.283); g.clip();
  const sf = g.createLinearGradient(-165, -215, 165, 215); sf.addColorStop(0, '#d8dce4'); sf.addColorStop(0.5, '#8a909a'); sf.addColorStop(1, '#e8ecf2'); g.fillStyle = sf; g.fillRect(-170, -220, 340, 440);
  const sx = ((t * 0.5) % 1.6 - 0.3) * 500; const sh = g.createLinearGradient(sx - 80, -220, sx + 80, 220); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, `rgba(255,255,255,${0.7 * shine})`); sh.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = sh; g.fillRect(-170, -220, 340, 440); g.restore(); g.restore();
}
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL();
function ray(x0, y0, x1, y1, a, col) { g.strokeStyle = col; g.globalAlpha = a; g.lineWidth = 6; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.globalAlpha = 1; }
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.88)), p = ease.inOut(clamp(k * 1.3));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const top = H * 0.27, mid = H * 0.5;
  // ordinary mirror: glass front, silver at the back, a faint second image
  g.fillStyle = 'rgba(160,200,230,0.35)'; g.fillRect(W * 0.62, top, 60, 260); g.fillStyle = '#9aa0aa'; g.fillRect(W * 0.62 + 60, top, 16, 260);
  ray(W * 0.12, top + 30, W * 0.62 + 60, top + 130, p, '#ffd27a'); ray(W * 0.62 + 60, top + 130, W * 0.12, top + 230, p, '#ffd27a'); ray(W * 0.62, top + 128, W * 0.12, top + 250, p * 0.35, '#ffd27a');
  // Aranmula mirror: metal surface reflects right at the front
  const ar = g.createLinearGradient(W * 0.62, 0, W * 0.62 + 70, 0); ar.addColorStop(0, '#e8ecf2'); ar.addColorStop(1, '#a8721e'); g.fillStyle = ar; g.fillRect(W * 0.62, mid, 70, 260);
  ray(W * 0.12, mid + 30, W * 0.62, mid + 130, p, ACCENT); ray(W * 0.62, mid + 130, W * 0.12, mid + 230, p, ACCENT);
  if (p > 0.95) { const q = (t * 0.8) % 1; g.strokeStyle = rgba(ACCENT, 1 - q); g.lineWidth = 5; g.strokeRect(W * 0.62 - 20 - q * 40, mid - 20 - q * 40, 110 + q * 80, 300 + q * 80); } };
