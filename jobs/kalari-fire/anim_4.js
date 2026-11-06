const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) {
  const k = Math.min(1, t / DURATION); CT.sky(g, '#1e0e08', '#3a1c10', '#4a2414');
  g.fillStyle = '#5a2e1a'; g.fillRect(0, 560, W, 700); g.fillStyle = 'rgba(0,0,0,0.2)'; for (let i = 0; i < 9; i++) g.fillRect(i * 130, 560, 6, 700);
  g.fillStyle = '#3a1c10'; g.fillRect(0, 1250, W, H);
  for (let i = 0; i < 7; i++) { const w = 300 - i * 38; g.fillStyle = i % 2 ? '#7a3e22' : '#8a4a28'; g.fillRect(1000 - w, 1250 - (i + 1) * 34, w, 34); }
  const lx = 960, ly = 1250 - 7 * 34; g.fillStyle = '#c99a3a'; g.fillRect(lx - 6, ly - 80, 12, 80); g.beginPath(); g.ellipse(lx, ly - 80, 34, 10, 0, 0, 6.283); g.fill(); g.fillRect(lx - 30, ly - 6, 60, 10);
  CT.flame(g, lx, ly - 88, 14, t, 1, 1); const gl = g.createRadialGradient(lx, ly - 90, 10, lx, ly - 90, 620); gl.addColorStop(0, 'rgba(255,190,90,0.35)'); gl.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = gl; g.fillRect(0, 300, W, 1200);
  const P = CT.at([[0, 'stand'], [0.25, 'salute'], [0.5, 'salute'], [0.75, 'bow'], [1, 'bow']], k);
  CT.fighter(g, 440, 1250, 1.15, P, { dir: 1, weapon: 'none', shield: false });
  const q = Math.min(1, Math.max(0, (k - 0.72) / 0.15)); if (q > 0) { g.save(); g.globalAlpha = q; g.fillStyle = '#f2e6c9'; g.beginPath(); g.roundRect(W / 2 - 160, 600, 320, 120, 36); g.fill(); g.beginPath(); g.moveTo(W / 2 - 40, 715); g.lineTo(W / 2 - 80, 770); g.lineTo(W / 2 + 10, 715); g.fill();
    g.fillStyle = '#2b1a10'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(W / 2 - 70 + i * 70, 660, 16, 0, 6.283); g.fill(); } g.restore(); }
};