NB.use('retro'); const c = makeCanvas(), g = c.getContext('2d');
const im = s => { const i = new Image(); i.src = s; return i; };
window.renderFrame = function (t) { NB.paper(g); NB.halftone(g, 40, 1260, 1000, 120, 'rgba(20,10,5,0.35)', 24);
  const k = NB.cl(t / DURATION), hx = 640 - 160 * NB.ease(k);
  g.save(); g.globalAlpha = NB.ease(NB.cl((t - 0) / 0.3)); g.fillStyle = '#8a5a2a'; g.beginPath(); g.moveTo(hx - 300, 1000); g.quadraticCurveTo(hx, 1160, hx + 330, 960); g.lineTo(hx + 280, 930); g.lineTo(hx - 260, 950); g.closePath(); g.fill();
  g.fillStyle = '#141414'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(hx - 220 + i * 120, 1140, 26, 0, 6.283); g.fill(); } g.restore();
  g.strokeStyle = '#f2e6c9'; g.lineWidth = 9; g.beginPath(); g.moveTo(hx - 260, 985); g.lineTo(40, 1075); g.stroke();
  for (let i = 0; i < 4; i++) { const x = 90 + i * 115, y = 1250, lean = 0.32 + 0.06 * Math.sin(t * 3 + i); g.save(); g.translate(x, y); g.rotate(-lean); g.fillStyle = '#141414'; g.beginPath(); g.arc(0, -250, 30, 0, 6.283); g.fill(); g.beginPath(); g.roundRect(-26, -218, 52, 120, 18); g.fill(); g.lineCap = 'round'; g.strokeStyle = '#141414'; g.lineWidth = 22; g.beginPath(); g.moveTo(-8, -100); g.lineTo(-40, 0); g.moveTo(8, -100); g.lineTo(40, 0); g.stroke(); g.lineWidth = 16; g.beginPath(); g.moveTo(0, -200); g.lineTo(70, -170); g.moveTo(0, -185); g.lineTo(75, -150); g.stroke(); g.restore(); }
  NB.label(g, 'ഖലാസികൾ', 540, 700, NB.ease(NB.cl((t - 0.4) / 0.3)), { size: 84, rot: -0.03 });
  NB.label(g, 'കയർ · കപ്പി · മരത്തടി', 600, 820, NB.ease(NB.cl((t - 1.0) / 0.3)), { size: 46, rot: 0.03, bg: '#141414', col: '#f2e6c9' }); };