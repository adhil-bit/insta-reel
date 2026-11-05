NB.use('retro'); const c = makeCanvas(), g = c.getContext('2d');
const im = s => { const i = new Image(); i.src = s; return i; };
function log(x, y, w, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = '#8a5a2a'; g.fillRect(x, y, w, 70); g.fillStyle = '#c99a5a'; g.beginPath(); g.ellipse(x, y + 35, 22, 35, 0, 0, 6.283); g.fill();
  g.strokeStyle = '#6a4220'; g.lineWidth = 3; for (let r = 8; r < 30; r += 8) { g.beginPath(); g.ellipse(x, y + 35, r * 0.6, r, 0, 0, 6.283); g.stroke(); } g.restore(); }
window.renderFrame = function (t) { NB.paper(g);
  for (let i = 0; i < 4; i++) log(130 + (i % 2) * 40, 1080 + i * 74 - (i > 1 ? 0 : 0), 420, (0.55 + 0.45 * NB.ease(NB.cl(t / 0.3))) );
  NB.label(g, 'നിലമ്പൂർ തേക്ക്', 340, 1000, NB.ease(NB.cl((t - 0.4) / 0.3)), { size: 58 });
  const b = NB.ease(NB.cl((t - 0.8) / 0.3)); if (b > 0) { g.save(); g.globalAlpha = b; g.translate(780, 820); g.rotate(0.05); g.fillStyle = '#1f4e8c'; g.fillRect(-200, -170, 400, 340);
    g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 2; for (let k = -160; k < 200; k += 40) { g.beginPath(); g.moveTo(k, -170); g.lineTo(k, 170); g.stroke(); g.beginPath(); g.moveTo(-200, k * 0.85); g.lineTo(200, k * 0.85); g.stroke(); }
    g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.moveTo(-150, 60); g.quadraticCurveTo(0, 140, 150, 40); g.lineTo(130, 10); g.lineTo(-130, 20); g.closePath(); g.stroke(); g.restore(); }
  const x = NB.ease(NB.cl((t - 1.4) / 0.25)); if (x > 0) { g.save(); g.globalAlpha = x; g.strokeStyle = '#141414'; g.lineWidth = 26; g.lineCap = 'round'; g.beginPath(); g.moveTo(600, 660); g.lineTo(600 + 360 * x, 660 + 330 * x); g.moveTo(960, 660); g.lineTo(960 - 360 * x, 660 + 330 * x); g.stroke(); g.restore(); }
  NB.label(g, 'പ്ലാനില്ല!', 790, 1110, NB.ease(NB.cl((t - 1.8) / 0.3)), { size: 70, rot: 0.05, bg: '#141414', col: '#f2e6c9' }); };