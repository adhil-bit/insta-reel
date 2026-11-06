const c = makeCanvas(), g = c.getContext('2d');
const CARDS = [['മെയ്പ്പയറ്റ്', 'body'], ['വടി', 'stick'], ['വാൾ', 'sword'], ['പരിച', 'shield'], ['ഉറുമി', 'urumi'], ['വെറുംകൈ', 'hand']];
function icon(kind, x, y, t) { g.save(); g.translate(x, y);
  if (kind === 'body') { g.restore(); CT.fighter(g, x, y + 70, 0.42, CT.POSES.elephant, { dir: 1, weapon: 'none', shield: false }); return; }
  if (kind === 'stick') { g.strokeStyle = '#8a5a2a'; g.lineWidth = 14; g.lineCap = 'round'; g.rotate(-0.7); g.beginPath(); g.moveTo(0, -95); g.lineTo(0, 95); g.stroke(); }
  if (kind === 'sword') { g.rotate(-0.7); g.strokeStyle = '#dfe3ea'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, -95); g.lineTo(0, 55); g.stroke(); g.strokeStyle = '#d9a23a'; g.lineWidth = 12; g.beginPath(); g.moveTo(-30, 55); g.lineTo(30, 55); g.moveTo(0, 55); g.lineTo(0, 92); g.stroke(); }
  if (kind === 'shield') { g.fillStyle = '#7a4a22'; g.beginPath(); g.arc(0, 0, 72, 0, 6.283); g.fill(); g.strokeStyle = '#d9a23a'; g.lineWidth = 10; g.stroke(); g.fillStyle = '#d9a23a'; g.beginPath(); g.arc(0, 0, 14, 0, 6.283); g.fill(); }
  if (kind === 'urumi') { g.strokeStyle = '#dfe3ea'; g.lineWidth = 6; g.beginPath(); for (let i = 0; i <= 60; i++) { const a = i / 60 * 10, r = 12 + i * 1.25; g.lineTo(Math.cos(a + t) * r, Math.sin(a + t) * r); } g.stroke(); g.fillStyle = '#d9a23a'; g.fillRect(-12, -12, 24, 24); }
  if (kind === 'hand') { g.fillStyle = '#c98a5a'; g.beginPath(); g.roundRect(-45, -10, 90, 90, 22); g.fill(); for (let i = 0; i < 4; i++) { g.beginPath(); g.roundRect(-44 + i * 23, -85 + Math.abs(i - 1.5) * 10, 20, 85, 10); g.fill(); } g.beginPath(); g.roundRect(30, 0, 50, 22, 11); g.fill(); }
  g.restore(); }
window.renderFrame = function (t) {
  const k = Math.min(1, t / DURATION); CT.sky(g, '#2a140c', '#4a2414', '#5a2a1a');
  g.fillStyle = 'rgba(255,200,140,0.06)'; for (let i = 0; i < 14; i++) g.fillRect(0, 560 + i * 60, W, 2);
  CARDS.forEach(([lbl, kind], i) => { const a = Math.min(1, Math.max(0, (k - i * 0.085) / 0.08)); if (a <= 0) return; const x = 200 + (i % 3) * 340, y = 760 + Math.floor(i / 3) * 400;
    g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(0.8 + 0.2 * a, 0.8 + 0.2 * a); g.fillStyle = '#f2e6c9'; g.beginPath(); g.roundRect(-145, -175, 290, 340, 26); g.fill();
    g.fillStyle = '#b52a2a'; g.font = '800 40px Baloo, Inter'; g.textAlign = 'center'; g.fillText(String(i + 1), -110, -128); g.fillStyle = '#2b1a10'; g.font = '800 46px Baloo, Inter'; g.fillText(lbl, 0, 140); g.restore();
    g.save(); g.globalAlpha = a; icon(kind, x, y - 25, t); g.restore(); });
  const f = Math.min(1, Math.max(0, (k - 0.62) / 0.1)); if (f > 0) { g.save(); g.fillStyle = `rgba(20,8,4,${0.75 * f})`; g.fillRect(0, 520, W, 900); g.restore(); CT.fireRing(g, 540, 960, 170, 220, t, 'all', f);
    const x = Math.min(1, Math.max(0, (k - 0.74) / 0.08)); if (x > 0) { g.save(); g.strokeStyle = '#e8352a'; g.lineWidth = 28; g.lineCap = 'round'; g.beginPath(); g.moveTo(330, 700); g.lineTo(330 + 420 * x, 700 + 520 * x); g.moveTo(750, 700); g.lineTo(750 - 420 * x, 700 + 520 * x); g.stroke(); g.restore(); }
    NB.stamp(g, 'ഷോയ്ക്ക് വേണ്ടി', 540, 1300, Math.min(1, Math.max(0, (k - 0.84) / 0.1)), { col: '#f2e6c9', size: 60 }); }
};