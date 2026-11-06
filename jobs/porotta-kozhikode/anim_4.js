NB.use('whiteboard'); const c = makeCanvas(), g = c.getContext('2d'); const AC = NB.style.accent, RD = '#d23b2f';
const KX = lon => 300 + (lon - 74.9) * 190, KY = lat => 585 + (12.8 - lat) * 172;
const KER = [[74.98,12.78],[75.08,12.45],[75.2,12.1],[75.37,11.85],[75.55,11.6],[75.75,11.3],[75.85,11.0],[75.95,10.7],[76.05,10.4],[76.18,10.05],[76.27,9.7],[76.35,9.3],[76.5,9.0],[76.6,8.85],[76.85,8.55],[77.08,8.3],[77.18,8.33],[77.2,8.7],[77.15,9.0],[77.2,9.4],[77.25,9.8],[77.15,10.2],[76.85,10.45],[76.85,10.8],[76.6,11.25],[76.4,11.6],[76.05,11.85],[75.8,12.1],[75.55,12.4],[75.2,12.7],[74.98,12.78]].map(([a, b]) => [KX(a), KY(b)]);
function kfill(g, col, a, y0, y1) { if (a <= 0) return; g.save(); g.beginPath(); g.rect(0, y0, W, y1 - y0); g.clip(); g.globalAlpha = a; g.fillStyle = col; g.beginPath(); KER.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); g.restore(); }
function pin(s, x, y, col) { s.curve([[x, y], [x - 30, y - 60], [x - 22, y - 92], [x, y - 102], [x + 22, y - 92], [x + 30, y - 60], [x, y]], { w: 6, col }); s.circle(x, y - 70, 12, { w: 5, col }); }
const s = NB.sketch(66);
s.poly(KER, { w: 7 });
s.circle(KX(75.09), KY(12.31), 10, { w: 6, col: RD }); s.text('KANHANGAD', 640, KY(12.31) + 16, { size: 50, font: 'Hand' });
const A = s.mark();
s.circle(KX(77.17), KY(8.33), 10, { w: 6, col: RD }); s.text('KALIYIKKAVILA', KX(77.17) + 30, KY(8.33) + 14, { size: 50, font: 'Hand', align: 'left' });
const B = s.mark();
window.renderFrame = function (t) { NB.paper(g); const D = DURATION;
  const f = NB.ease(NB.cl((t - D * 0.15) / (D * 0.5)));
  kfill(g, '#cfe0f7', 1, 0, KY(10.75)); kfill(g, '#f2c46a', 0.85, 0, KY(12.85) + (KY(8.25) - KY(12.85)) * f);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.15], [A, B, D * 0.2, D * 0.6]] });
  NB.stamp(g, '#1 ORDER', 880, 860, NB.cl((t - D * 0.62) / 0.25), { col: RD, size: 54 });
  NB.note(g, 'Swiggy · 2022', 880, 960, { size: 46, font: 'Hand', col: NB.style.ink, a: NB.cl((t - D * 0.72) / 0.25) });
};
