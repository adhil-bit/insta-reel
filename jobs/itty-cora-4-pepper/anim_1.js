const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#120c08'; g.fillRect(0, 0, W, H); const xs = [0.18, 0.5, 0.82], names = ['KERALA', 'ARABIA', 'VENICE'];
  g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 4; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(W * 0.18, H * 0.6); g.lineTo(W * 0.82, H * 0.6); g.stroke(); g.setLineDash([]);
  xs.forEach((x, i) => { const a = clamp((k - i * 0.25) / 0.2); if (a <= 0) return; const n = 2 + i * 5;
    for (let j = 0; j < n * a; j++) { g.fillStyle = j % 2 ? '#e8b84a' : '#c8982a'; g.beginPath(); g.ellipse(W * x, H * 0.58 - j * 18, 60, 14, 0, 0, 6.283); g.fill(); }
    g.font = '800 34px Inter'; g.textAlign = 'center'; g.fillStyle = '#e8dcc0'; g.fillText(names[i], W * x, H * 0.66); });
  SK.grain(g, t, 0.06); };
