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
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.88)), m = ease.inOut(clamp(k * 1.5));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const cy = H * 0.5;
  g.fillStyle = '#3a3a40'; g.beginPath(); g.moveTo(W / 2 - 200, cy - 120); g.lineTo(W / 2 + 200, cy - 120); g.lineTo(W / 2 + 150, cy + 80); g.lineTo(W / 2 - 150, cy + 80); g.fill();
  const lv = g.createLinearGradient(0, cy - 110, 0, cy); lv.addColorStop(0, '#ffcf6a'); lv.addColorStop(1, '#e8641e'); g.fillStyle = lv; g.beginPath(); g.ellipse(W / 2, cy - 110, 190 * (0.3 + 0.7 * m), 30, 0, 0, 6.283); g.fill();
  const glow = g.createRadialGradient(W / 2, cy - 110, 10, W / 2, cy - 110, 400); glow.addColorStop(0, `rgba(255,140,60,${0.5 * m})`); glow.addColorStop(1, 'rgba(255,140,60,0)'); g.fillStyle = glow; g.fillRect(0, 0, W, H);
  for (const [x0, col] of [[W * 0.22, '#c8643a'], [W * 0.78, '#c8ccd4']]) { const x = lerp(x0, W / 2, ease.in(clamp(k * 1.4))), y = lerp(H * 0.16, cy - 170, ease.in(clamp(k * 1.4)));
    if (k < 0.72) { g.fillStyle = col; g.save(); g.translate(x, y); g.rotate((x0 < W / 2 ? 1 : -1) * 0.3); g.fillRect(-90, -36, 180, 72); g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(-80, -30, 160, 12); g.restore(); } }
  for (let i = 0; i < 20; i++) { const ph = (t * 0.8 + i * 0.05) % 1; g.fillStyle = `rgba(255,200,120,${(1 - ph) * m})`; g.fillRect(W / 2 + Math.sin(i * 7) * 160, cy - 130 - ph * 220, 5, 5); } };
