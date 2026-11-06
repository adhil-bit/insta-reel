const c = makeCanvas(), g = c.getContext('2d');
const A = [[0, 'stance'], [0.35, 'raise'], [0.55, 'strike'], [0.8, 'stance'], [1.15, 'block'], [1.4, 'block'], [1.7, 'stance'], [2.0, 'stance']];
const B = [[0, 'stance'], [0.35, 'stance'], [0.55, 'block'], [0.8, 'stance'], [0.95, 'raise'], [1.15, 'strike'], [1.4, 'stance'], [2.0, 'stance']];
window.renderFrame = function (t) {
  const k = Math.min(1, t / DURATION), grey = Math.max(0, (k - 0.72) / 0.18);
  g.save(); if (grey > 0) g.filter = `grayscale(${grey}) sepia(${grey * 0.5}) brightness(${1 - grey * 0.25})`;
  CT.sky(g, '#2b1a3c', '#c2552f', '#f2a54a', 1150);
  g.fillStyle = 'rgba(255,220,150,0.9)'; g.beginPath(); g.arc(760, 900, 70, 0, 6.283); g.fill();
  g.fillStyle = '#3a2232'; for (let i = 0; i < 9; i++) { const x = 40 + i * 120; g.beginPath(); g.moveTo(x, 1060); g.lineTo(x + 55, 960 - (i % 3) * 20); g.lineTo(x + 110, 1060); g.fill(); g.fillRect(x + 53, 900 - (i % 3) * 20, 4, 70); g.fillStyle = '#b52a2a'; g.beginPath(); g.moveTo(x + 57, 900 - (i % 3) * 20); g.lineTo(x + 90, 912 - (i % 3) * 20); g.lineTo(x + 57, 924 - (i % 3) * 20); g.fill(); g.fillStyle = '#3a2232'; }
  const wg = g.createLinearGradient(0, 1060, 0, 1150); wg.addColorStop(0, '#d98a44'); wg.addColorStop(1, '#5a3a48'); g.fillStyle = wg; g.fillRect(0, 1060, W, 90);
  g.fillStyle = 'rgba(255,230,170,0.5)'; for (let i = 0; i < 8; i++) g.fillRect(700 + Math.sin(t * 2 + i) * 30, 1070 + i * 10, 140 - i * 12, 3);
  g.fillStyle = '#c9a074'; g.fillRect(0, 1150, W, H); g.fillStyle = 'rgba(120,80,50,0.25)'; for (let i = 0; i < 40; i++) g.fillRect((i * 97) % W, 1170 + (i * 53) % 220, 30, 4);
  const T = 2.0, u = t % T, pa = CT.at(A, u), pb = CT.at(B, u);
  CT.fighter(g, 360, 1300, 1.05, pa, { dir: 1, weapon: 'sword' }); CT.fighter(g, 725, 1300, 1.05, pb, { dir: -1, weapon: 'sword' });
  for (const hit of [0.55, 1.15]) { const d = Math.abs(u - hit); if (d < 0.12) CT.spark(g, 542, 1010, t, 1 - d / 0.12); }
  g.restore();
  if (grey > 0) NB.stamp(g, 'ബ്രിട്ടീഷ് കാലം', 540, 760, Math.min(1, grey * 1.6), { col: '#f2e6c9', size: 62 });
};