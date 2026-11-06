NB.use('whiteboard'); const c = makeCanvas(), g = c.getContext('2d'); const AC = NB.style.accent, RD = '#d23b2f';
const KX = lon => 300 + (lon - 74.9) * 190, KY = lat => 585 + (12.8 - lat) * 172;
const KER = [[74.98,12.78],[75.08,12.45],[75.2,12.1],[75.37,11.85],[75.55,11.6],[75.75,11.3],[75.85,11.0],[75.95,10.7],[76.05,10.4],[76.18,10.05],[76.27,9.7],[76.35,9.3],[76.5,9.0],[76.6,8.85],[76.85,8.55],[77.08,8.3],[77.18,8.33],[77.2,8.7],[77.15,9.0],[77.2,9.4],[77.25,9.8],[77.15,10.2],[76.85,10.45],[76.85,10.8],[76.6,11.25],[76.4,11.6],[76.05,11.85],[75.8,12.1],[75.55,12.4],[75.2,12.7],[74.98,12.78]].map(([a, b]) => [KX(a), KY(b)]);
function kfill(g, col, a, y0, y1) { if (a <= 0) return; g.save(); g.beginPath(); g.rect(0, y0, W, y1 - y0); g.clip(); g.globalAlpha = a; g.fillStyle = col; g.beginPath(); KER.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); g.restore(); }
function pin(s, x, y, col) { s.curve([[x, y], [x - 30, y - 60], [x - 22, y - 92], [x, y - 102], [x + 22, y - 92], [x + 30, y - 60], [x, y]], { w: 6, col }); s.circle(x, y - 70, 12, { w: 5, col }); }
const s = NB.sketch(55);
s.poly(KER, { w: 7 });
const A = s.mark();
s.line(KX(74.9), KY(10.75), KX(77.3), KY(10.75), { w: 4, dash: true, col: AC }); s.text('MALABAR', 830, KY(11.9), { size: 60, font: 'Hand', col: AC });
pin(s, KX(75.78), KY(11.25), RD); s.text('KOZHIKODE', 840, KY(11.25) - 20, { size: 52, font: 'Hand', col: RD });
const B = s.mark();
s.arrow(70, KY(11.6), KX(75.6) - 20, KY(11.32), { w: 6, col: AC }); s.text('ARAB', 120, KY(11.6) - 30, { size: 46, font: 'Hand' }); s.text('TRADERS', 140, KY(11.6) + 70, { size: 46, font: 'Hand' });
const C = s.mark();
window.renderFrame = function (t) { NB.paper(g); const D = DURATION;
  kfill(g, '#cfe0f7', NB.cl((t - D * 0.35) / 0.6), 0, KY(10.75));
  s.draw(g, t, { parts: [[0, A, 0, D * 0.3], [A, B, D * 0.3, D * 0.6], [B, C, D * 0.6, D * 0.85]] });
  NB.glow(g, KX(75.78), KY(11.25) - 70, 120, 'rgba(210,59,47,0.25)', NB.cl((t - D * 0.6) / 0.3));
};
