NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
const MBASE = [[120, 1300], [300, 1080], [400, 960], [470, 820], [540, 700], [610, 820], [690, 980], [800, 1100], [960, 1300]];
function mpts(bow, grow = 1) { const pv = [540, 1150]; return MBASE.map(([x, y]) => { let yy = 1300 - (1300 - y) * grow; if (yy < pv[1]) { const f = Math.pow((pv[1] - yy) / (pv[1] - 700), 1.3), ang = bow * f, dx = x - pv[0], dy = yy - pv[1], c = Math.cos(ang), s = Math.sin(ang); return [pv[0] + dx * c - dy * s, pv[1] + dx * s + dy * c]; } return [x, yy]; }); }
function mountain(g, bow, grow, a = 1) { const p = mpts(bow, grow); NB.wash(g, p, 'rgba(45,50,48,1)', 0.55 * a); g.save(); g.globalAlpha = a; g.strokeStyle = '#1b1b1b'; g.lineWidth = 11; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore(); }
const s = NB.sketch(3); s.figure(900, 1320, 120, 'stand'); s.line(935, 1215, 945, 1325, { w: 6 }); const A = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); NB.blob(g, 200, 640, 60, 60, '#d9d2c3', 1.2);
  const bow = 0.15 + 0.35 * NB.ease(NB.cl(t / (D * 0.6)));
  mountain(g, bow * 1.6, 1); NB.mist(g, 1180, 140, 0.8); NB.line && 0;
  s.draw(g, t, { parts: [[0, A, 0, D * 0.4]] });
  seal(g, 'അഗസ്ത്യൻ', 190, 820, NB.cl((t - D * 0.5) / 0.3));
};
