NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
const MBASE = [[120, 1300], [300, 1080], [400, 960], [470, 820], [540, 700], [610, 820], [690, 980], [800, 1100], [960, 1300]];
function mpts(bow, grow = 1) { const pv = [540, 1150]; return MBASE.map(([x, y]) => { let yy = 1300 - (1300 - y) * grow; if (yy < pv[1]) { const f = Math.pow((pv[1] - yy) / (pv[1] - 700), 1.3), ang = bow * f, dx = x - pv[0], dy = yy - pv[1], c = Math.cos(ang), s = Math.sin(ang); return [pv[0] + dx * c - dy * s, pv[1] + dx * s + dy * c]; } return [x, yy]; }); }
function mountain(g, bow, grow, a = 1) { const p = mpts(bow, grow); NB.wash(g, p, 'rgba(45,50,48,1)', 0.55 * a); g.save(); g.globalAlpha = a; g.strokeStyle = '#1b1b1b'; g.lineWidth = 11; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore(); }
const s = NB.sketch(13); s.figure(880, 1320, 170, 'stand'); s.line(930, 1170, 945, 1330, { w: 7 }); const A = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g);
  const bow = 0.55 * NB.ease(NB.cl((t - D * 0.4) / (D * 0.45)));
  mountain(g, bow * 1.6, 1); NB.mist(g, 1230, 110, 0.6);
  NB.glow(g, 880, 1200, 140, 'rgba(255,214,120,0.5)', NB.cl((t - D * 0.2) / 0.4));
  s.draw(g, t, { parts: [[0, A, 0, D * 0.35]] });
  seal(g, 'അഗസ്ത്യൻ', 170, 700, NB.cl((t - D * 0.3) / 0.3));
};
