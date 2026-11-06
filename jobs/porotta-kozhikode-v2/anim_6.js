NB.use('whiteboard'); const c = makeCanvas(), g = c.getContext('2d'); const AC = NB.style.accent, RD = '#d23b2f';
function spiral(s, cx, cy, R, turns, o) { const p = []; for (let a = 0; a <= turns * 6.283; a += 0.25) { const r = 14 + (R - 14) * a / (turns * 6.283); p.push([cx + r * Math.cos(a), cy + r * Math.sin(a) * 0.9]); } s.poly(p, o); }
const s = NB.sketch(77);
s.circle(540, 1000, 360, { w: 7 }, 300);
spiral(s, 420, 990, 150, 3.6, { w: 6 }); s.circle(420, 990, 160, { w: 7 }, 146);
s.arc(690, 980, 130, 0.05, 3.09, { w: 7 }, 95); s.line(560, 985, 820, 985, { w: 7 });
for (const [x, y] of [[640, 965], [700, 955], [760, 968], [670, 930]]) s.poly([[x - 22, y], [x - 6, y - 18], [x + 20, y - 12], [x + 18, y + 8], [x - 18, y + 10], [x - 22, y]], { w: 5 });
const A = s.mark();
s.curve([[80, 640], [200, 600], [330, 660], [420, 760]], { w: 5, dash: true, col: AC }); s.text('KOZHIKODE', 230, 600, { size: 52, font: 'Hand', col: RD }); s.text('SEA ~', 150, 720, { size: 44, font: 'Hand', col: AC });
const B = s.mark();
window.renderFrame = function (t) { NB.paper(g); const D = DURATION;
  const w = NB.cl((t - D * 0.3) / 0.6); NB.blob(g, 420, 990, 160, 146, '#e7b45a', w * 0.7); NB.blob(g, 690, 1035, 115, 45, '#8a4a2a', w * 0.6);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.4], [A, B, D * 0.4, D * 0.65]] });
  const a = NB.cl((t - D * 0.68) / 0.2); if (a > 0) { g.save(); g.globalAlpha = a; g.fillStyle = '#fff'; g.strokeStyle = RD; g.lineWidth = 7; g.beginPath(); g.roundRect(560, 1240, 450, 120, 30); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(640, 1240); g.lineTo(610, 1195); g.lineTo(690, 1240); g.fill(); g.stroke(); g.fillStyle = RD; g.font = '800 54px Baloo'; g.textAlign = 'center'; g.fillText('കമന്റ് ചെയ്യൂ!', 785, 1320); g.restore(); }
};
