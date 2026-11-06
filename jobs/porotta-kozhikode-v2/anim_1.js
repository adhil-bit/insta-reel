NB.use('whiteboard'); const c = makeCanvas(), g = c.getContext('2d'); const RD = '#d23b2f';
function spiral(s, cx, cy, R, turns, o) { const p = []; for (let a = 0; a <= turns * 6.283; a += 0.25) { const r = 14 + (R - 14) * a / (turns * 6.283); p.push([cx + r * Math.cos(a), cy + r * Math.sin(a) * 0.9]); } s.poly(p, o); }
const s = NB.sketch(91);
s.arc(330, 1060, 170, 0.05, 3.09, { w: 8 }, 120); s.line(160, 1065, 500, 1065, { w: 8 });
for (const [x, y] of [[260, 1040], [330, 1028], [405, 1044], [295, 1000], [370, 998]]) s.poly([[x - 26, y], [x - 8, y - 22], [x + 24, y - 14], [x + 22, y + 10], [x - 20, y + 12], [x - 26, y]], { w: 5 });
s.circle(760, 1080, 170, { w: 7 }, 70);
const A = s.mark();
const p = NB.sketch(92); spiral(p, 0, 0, 150, 3.6, { w: 6 }); p.circle(0, 0, 160, { w: 7 }, 146); const PA = p.mark();
window.renderFrame = function (t) { NB.paper(g); const D = DURATION;
  NB.blob(g, 330, 1110, 150, 60, '#8a4a2a', NB.cl(t / 0.5) * 0.6);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.3]] });
  const q = NB.cl((t - D * 0.25) / 0.2), k = NB.ease(NB.cl((t - D * 0.55) / 0.35));
  if (k < 1) NB.note(g, '?', 760, 1110, { size: 200, col: RD, font: 'Hand', a: q * (1 - k) });
  if (q > 0) { g.save(); g.globalAlpha = q * (1 - k * 0.6); g.fillStyle = '#fff'; g.strokeStyle = RD; g.lineWidth = 7; g.beginPath(); g.roundRect(330, 640, 470, 130, 34); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(420, 768); g.lineTo(390, 830); g.lineTo(480, 768); g.fill(); g.stroke(); g.fillStyle = RD; g.font = '800 60px Baloo'; g.textAlign = 'center'; g.fillText('പൊറോട്ട എവിടെ?', 565, 728); g.restore(); }
  if (k > 0) { const x = 1250 - (1250 - 760) * k; g.save(); g.translate(x, 1050); g.rotate((1 - k) * 2); NB.blob(g, 0, 0, 160, 146, '#e7b45a', 0.75); p.draw(g, 99, { ghost: false, pen: false }); g.restore(); }
  NB.stamp(g, 'രണ്ടല്ല, ഒന്ന്!', 545, 1300, NB.cl((t - D * 0.8) / 0.15), { col: RD, size: 66 });
};
