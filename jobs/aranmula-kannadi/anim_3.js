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
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.9)), shine = ease.inOut(k);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const cx = W / 2, cy = H * 0.38, R = 300;
  const sf = g.createRadialGradient(cx - 80, cy - 80, 20, cx, cy, R); sf.addColorStop(0, `rgb(${lerp(120, 235, shine)|0},${lerp(100, 238, shine)|0},${lerp(80, 245, shine)|0})`); sf.addColorStop(1, `rgb(${lerp(70, 140, shine)|0},${lerp(55, 145, shine)|0},${lerp(40, 155, shine)|0})`);
  g.fillStyle = sf; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.fill();
  g.strokeStyle = `rgba(255,255,255,${0.15 + 0.3 * shine})`; g.lineWidth = 3; for (let r = 40; r < R; r += 34) { g.beginPath(); g.arc(cx, cy, r, t * 2 + r, t * 2 + r + 1.2); g.stroke(); }
  const a = t * 4, hx = cx + Math.cos(a) * 150, hy = cy + Math.sin(a) * 110;
  g.fillStyle = '#e8d8c0'; g.beginPath(); g.ellipse(hx, hy, 90, 60, a, 0, 6.283); g.fill(); g.fillStyle = '#c8a07a'; g.beginPath(); g.ellipse(hx + 30, hy - 40, 50, 70, a + 0.5, 0, 6.283); g.fill();
  if (shine > 0.6) { const p = (t * 0.8) % 1; g.strokeStyle = rgba(ACCENT, (1 - p) * (shine - 0.6) * 2.5); g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, R + p * 120, 0, 6.283); g.stroke(); } };
