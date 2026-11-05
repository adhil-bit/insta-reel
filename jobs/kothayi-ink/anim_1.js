NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
const s = NB.sketch(15);
s.curve([[700, 560], [660, 700], [690, 820], [630, 960], [650, 1100], [580, 1250], [560, 1380]], { w: 12 });
for (let i = 0; i < 6; i++) s.curve([[150, 650 + i * 120], [230, 640 + i * 120], [310, 655 + i * 120]], { w: 5 });
s.text('അറബിക്കടൽ', 300, 1180, { size: 54 }); s.text('പയ്യന്നൂർ', 870, 830, { size: 58 });
const A = s.mark();
s.figure(800, 1330, 230, 'dig'); s.rect(890, 1290, 90, 50, { w: 7 });
const B = s.mark();
window.renderFrame = function (t) { NB.paper(g); NB.blob(g, 880, 620, 60, 60, '#d9d2c3', 1.4); NB.wash(g, [[0, 560], [690, 560], [650, 960], [570, 1380], [0, 1380]], 'rgba(90,110,120,1)', 0.25);
  s.draw(g, t, { parts: [[0, A, 0, DURATION * 0.4], [A, B, DURATION * 0.42, DURATION * 0.7]] });
  seal(g, 'കോതായി', 560, 830, NB.cl((t - DURATION * 0.35) / 0.25)); NB.glow(g, 935, 1315, 120, 'rgba(240,190,80,0.6)', NB.cl((t - DURATION * 0.7) / 0.4));
};
