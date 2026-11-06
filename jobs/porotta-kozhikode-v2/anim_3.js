NB.use('whiteboard'); const c = makeCanvas(), g = c.getContext('2d'); const AC = NB.style.accent, RD = '#d23b2f';
function spiral(s, cx, cy, R, turns, o) { const p = []; for (let a = 0; a <= turns * 6.283; a += 0.25) { const r = 12 + (R - 12) * a / (turns * 6.283); p.push([cx + r * Math.cos(a), cy + r * Math.sin(a) * 0.9]); } s.poly(p, o); }
const s = NB.sketch(44);
const rope = []; for (let x = 110; x <= 970; x += 40) rope.push([x, 690 + Math.sin(x / 55) * 22]); s.curve(rope, { w: 26, col: '#c9b48c' }); s.curve(rope, { w: 5 });
s.text('മൈദ', 180, 800, { size: 56 });
const A = s.mark();
s.arrow(540, 760, 540, 880, { w: 6, col: AC });
spiral(s, 460, 1110, 190, 4.5, { w: 7 }); s.circle(460, 1110, 200, { w: 8 }, 182);
const B = s.mark();
s.line(880, 1340, 880, 1060, { w: 6, col: '#a7843a' }); for (let i = 0; i < 6; i++) { const y = 1080 + i * 34; s.curve([[880, y + 30], [850, y + 8], [846, y - 10]], { w: 5, col: '#a7843a' }); s.curve([[880, y + 30], [910, y + 8], [914, y - 10]], { w: 5, col: '#a7843a' }); }
s.line(790, 1080, 970, 1330, { w: 12, col: RD }); s.line(970, 1080, 790, 1330, { w: 12, col: RD });
s.text('ഗോതമ്പ്', 880, 1050, { size: 50 });
const C = s.mark();
window.renderFrame = function (t) { NB.paper(g); const D = DURATION;
  NB.blob(g, 460, 1110, 200, 182, '#e7b45a', NB.cl((t - D * 0.5) / 0.6) * 0.7);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.22], [A, B, D * 0.22, D * 0.6], [B, C, D * 0.6, D * 0.88]] });
};
