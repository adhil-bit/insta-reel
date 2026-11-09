NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d');
function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
function bubble(g, t, x, y, a, size = 50) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = '800 ' + size + 'px Baloo'; const w = g.measureText(t).width + 70; g.fillStyle = '#fff'; g.strokeStyle = '#b5281f'; g.lineWidth = 7; g.beginPath(); g.roundRect(x - w / 2, y - 60, w, 120, 40); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x - 60, y + 58); g.lineTo(x - 100, y + 120); g.lineTo(x, y + 58); g.fill(); g.stroke(); g.fillStyle = '#b5281f'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, x, y + 4); g.restore(); }
function night(g, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; const gr = g.createLinearGradient(0, 560, 0, 1400); gr.addColorStop(0, 'rgba(25,30,45,0.55)'); gr.addColorStop(1, 'rgba(25,30,45,0.15)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); }
const HILL = [[60, 1250], [180, 1050], [300, 920], [420, 860], [540, 900], [640, 1000], [720, 1120], [780, 1250]];
function hill(s) { s.poly(HILL, { w: 11 }); s.line(30, 1250, 1050, 1250, { w: 9 }); }
function hillwash(g) { NB.wash(g, HILL, 'rgba(55,75,60,1)', 0.5); }
function sea(g, t) { g.save(); NB.wash(g, [[760, 1250], [1080, 1250], [1080, 1380], [600, 1380]], 'rgba(70,95,105,1)', 0.5); g.globalAlpha = 0.45; g.strokeStyle = '#2b2b2b'; g.lineWidth = 3; for (let i = 0; i < 4; i++) { const y = 1275 + i * 28; g.beginPath(); for (let x = 760 - i * 40; x <= 1080; x += 25) g.lineTo(x, y + Math.sin(x / 40 + t * 2 + i) * 5); g.stroke(); } g.restore(); }
function board(g, x, y, a, txt) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = '#1b1b1b'; g.lineWidth = 8; g.beginPath(); g.moveTo(x - 110, y + 120); g.lineTo(x - 110, y); g.moveTo(x + 110, y + 120); g.lineTo(x + 110, y); g.stroke(); g.fillStyle = '#b5281f'; g.fillRect(x - 160, y - 80, 320, 100); g.fillStyle = '#f3e9d8'; g.font = '800 50px Baloo'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, x, y - 28); g.restore(); }
const s = NB.sketch(8); hill(s); const A = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); hillwash(g); sea(g, t); NB.mist(g, 1180, 110, 0.6);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.5]] });
  NB.note(g, '← പയ്യന്നൂർ', 250, 1330, { a: NB.cl((t - D * 0.4) / 0.25), col: '#1b1b1b', size: 50, font: 'Baloo' });
  NB.note(g, 'കടൽ', 960, 1330, { a: NB.cl((t - D * 0.5) / 0.25), col: '#f3ead6', size: 50, font: 'Baloo' });
  seal(g, 'ഏഴിമല', 880, 760, NB.cl((t - D * 0.6) / 0.25));
};
