NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
const s = NB.sketch(5);
s.line(60, 1080, 1020, 1080, { w: 14 });
s.line(270, 1080, 270, 720, { w: 12 }); s.curve([[270, 720], [310, 690], [370, 700]], { w: 9 }); s.rect(350, 700, 54, 30, { w: 7 });
s.poly([[700, 900], [820, 820], [950, 900]], { w: 10 }); s.rect(725, 900, 200, 180, { w: 9 }); s.rect(800, 980, 50, 100, { w: 7 });
s.line(540, 1092, 540, 1180, { w: 5, dash: true });
s.rect(380, 1190, 320, 150, { w: 11 }); s.curve([[380, 1190], [400, 1140], [540, 1125], [680, 1140], [700, 1190]], { w: 10 }); s.rect(520, 1225, 40, 46, { w: 7 });
const A = s.mark();
window.renderFrame = function (t) { NB.paper(g);
  NB.blob(g, 820, 640, 70, 70, '#d9d2c3', 1.4); NB.ridge(g, 930, 150, 'rgba(70,70,70,0.22)', 1, 2); NB.ridge(g, 1010, 110, 'rgba(30,30,30,0.35)', 1, 6); NB.mist(g, 900, 160, 0.9);
  NB.wash(g, [60, 1092, 960, 300], 'rgba(60,55,50,1)', 0.35);
  const w = NB.cl((t - DURATION * 0.5) / 0.9);
  NB.glow(g, 377, 760, 260, 'rgba(255,214,120,0.55)', w); NB.glow(g, 540, 1260, 260, 'rgba(240,190,80,0.6)', w); NB.wash(g, [382, 1192, 316, 146], '#d9a23a', w);
  s.draw(g, t, { parts: [[0, A, 0, Math.min(3.4, DURATION * 0.6)]] });
  seal(g, 'നിധി', 900, 1300, NB.cl((t - DURATION * 0.7) / 0.3));
};
