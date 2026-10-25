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
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const cx = W / 2, cy = H * 0.4, seam = 0.5 + 0.5 * Math.sin(t * 2.5);
  const gl = g.createRadialGradient(cx, cy, 40, cx, cy, 460); gl.addColorStop(0, `rgba(255,190,90,${0.2 + 0.15 * seam})`); gl.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.fillStyle = '#5a3418'; g.fillRect(cx - 300, cy - 160, 600, 320); g.fillStyle = '#6e421e'; g.fillRect(cx - 320, cy - 200, 640, 60);
  g.strokeStyle = `rgba(255,200,110,${0.5 + 0.5 * seam})`; g.lineWidth = 5; g.beginPath(); g.moveTo(cx - 320, cy - 140); g.lineTo(cx + 320, cy - 140); g.stroke();
  for (let i = 0; i < 6; i++) { g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 300, cy - 100 + i * 45); g.lineTo(cx + 300, cy - 100 + i * 45); g.stroke(); }
  const lk = ease.out(clamp(k * 2)); g.save(); g.translate(cx, cy - 140 + (1 - lk) * -200); g.globalAlpha = lk;
  g.strokeStyle = '#d8dce4'; g.lineWidth = 18; g.beginPath(); g.arc(0, -40, 46, Math.PI, 0); g.stroke(); g.fillStyle = ACCENT; g.beginPath(); g.roundRect(-70, -40, 140, 120, 14); g.fill();
  g.fillStyle = '#2a0a12'; g.beginPath(); g.arc(0, 10, 14, 0, 6.283); g.fill(); g.fillRect(-6, 10, 12, 34); g.restore(); };
