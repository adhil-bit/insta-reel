const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), m = ease.inOut(clamp((k - 0.3) / 0.5));
  g.fillStyle = '#100a08'; g.fillRect(0, 0, W, H);
  g.save(); g.translate(lerp(W * 0.28, W * 0.42, m), H * 0.45); g.rotate(-0.05); g.fillStyle = '#e8dcc0'; g.fillRect(-200, -260, 400, 520); g.fillStyle = '#7a6a54'; for (let i = 0; i < 12; i++) g.fillRect(-160, -220 + i * 36, 300 - (i * 41) % 90, 8); g.restore();
  g.save(); g.translate(lerp(W * 0.72, W * 0.58, m), H * 0.45); g.globalAlpha = 0.9; for (let i = 0; i < 9; i++) { g.strokeStyle = `rgba(${150 + i * 10},${90 + i * 8},255,0.7)`; g.lineWidth = 6; g.beginPath(); for (let a = 0; a < 12; a += 0.2) { const r = 20 + a * 18 + i * 4; g.lineTo(Math.cos(a + t * 0.8 + i) * r, Math.sin(a + t * 0.8 + i) * r * 0.9); } g.stroke(); } g.restore();
  if (m > 0.6) { const gl = g.createRadialGradient(W / 2, H * 0.45, 20, W / 2, H * 0.45, 400); gl.addColorStop(0, rgba(ACCENT, 0.35 * (m - 0.6) * 2.5)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H); }
  SK.grain(g, t, 0.07); };
