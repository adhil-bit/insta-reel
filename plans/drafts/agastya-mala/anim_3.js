NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
const MBASE = [[120, 1300], [300, 1080], [400, 960], [470, 820], [540, 700], [610, 820], [690, 980], [800, 1100], [960, 1300]];
function mpts(bow, grow = 1) { const pv = [540, 1150]; return MBASE.map(([x, y]) => { let yy = 1300 - (1300 - y) * grow; if (yy < pv[1]) { const f = Math.pow((pv[1] - yy) / (pv[1] - 700), 1.3), ang = bow * f, dx = x - pv[0], dy = yy - pv[1], c = Math.cos(ang), s = Math.sin(ang); return [pv[0] + dx * c - dy * s, pv[1] + dx * s + dy * c]; } return [x, yy]; }); }
function mountain(g, bow, grow, a = 1) { const p = mpts(bow, grow); NB.wash(g, p, 'rgba(45,50,48,1)', 0.55 * a); g.save(); g.globalAlpha = a; g.strokeStyle = '#1b1b1b'; g.lineWidth = 11; g.lineJoin = 'round'; g.lineCap = 'round'; g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore(); }
const s = NB.sketch(23); for (let i = 0; i < 7; i++) { const x = 560 + i * 70, y = 1330 - (i % 2) * 18; s.circle(x, y, 9, { w: 4 }, 5); } const A = s.mark();
const f = NB.sketch(24); f.figure(0, 0, 140, 'stand'); f.line(30, -120, 40, 8, { w: 6 }); const FA = f.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g);
  mountain(g, 0.88, 1, 1); NB.mist(g, 1230, 110, 0.6);
  s.draw(g, t, { parts: [[0, A, D * 0.3, D * 0.8]], pen: false });
  const k = NB.ease(NB.cl((t - D * 0.3) / (D * 0.6))); g.save(); g.translate(620 + 420 * k, 1330); g.globalAlpha = 1 - k * 0.7; g.scale(1 - k * 0.4, 1 - k * 0.4); f.draw(g, 99, { ghost: false, pen: false }); g.restore();
  NB.note(g, 'തിരിച്ചുവന്നില്ല...', 540, 640, { a: NB.cl((t - D * 0.6) / 0.25), col: '#b5281f', size: 72, font: 'Baloo' });
};
