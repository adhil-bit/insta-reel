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
function lamp(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); const br = g.createLinearGradient(-60, 0, 60, 0); br.addColorStop(0, '#a8721e'); br.addColorStop(0.5, '#f2c14e'); br.addColorStop(1, '#a8721e');
  g.fillStyle = br; g.beginPath(); g.ellipse(0, 200, 110, 26, 0, 0, 6.283); g.fill(); g.fillRect(-14, -40, 28, 240); g.beginPath(); g.ellipse(0, -40, 90, 22, 0, 0, 6.283); g.fill();
  for (const fx of [-60, 0, 60]) { const f = 1 + 0.15 * Math.sin(t * 9 + fx); g.fillStyle = '#ffd27a'; g.beginPath(); g.ellipse(fx, -70, 9, 24 * f, 0, 0, 6.283); g.fill();
    const gl = g.createRadialGradient(fx, -70, 2, fx, -70, 60); gl.addColorStop(0, 'rgba(255,190,90,0.6)'); gl.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = gl; g.fillRect(fx - 60, -130, 120, 120); } g.restore(); }
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.85)), a = ease.out(clamp(k * 1.5));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.globalAlpha = a; lamp(W * 0.2, H * 0.36, 0.9, t); lamp(W * 0.8, H * 0.36, 0.9, t);
  g.fillStyle = '#f2ece2'; for (let i = 0; i < 60; i++) g.fillRect(W / 2 - 160 + (i * 37) % 320, H * 0.56 - (i * 13) % 40, 8, 5);
  g.globalAlpha = 1; mirror(g, W / 2, H * 0.32, 0.85, t, 0.9);
  const gl = g.createRadialGradient(W / 2, H * 0.32, 40, W / 2, H * 0.32, 480); gl.addColorStop(0, rgba(ACCENT, 0.25 * a)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H); };
