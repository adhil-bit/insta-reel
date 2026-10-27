const c = makeCanvas(), g = c.getContext('2d'); const sym = ['π', '∞', 'Σ', '½', '⅓', 'sin', 'cos', '∞', 'π'];
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'night', 0.58); SK.sea(g, H * 0.58, t, ['#16244a', '#101a36', '#0a1024'], false, H * 0.72); g.fillStyle = '#05070c'; g.fillRect(0, H * 0.72, W, H);
  g.save(); g.translate(W * 0.5, H * 0.6); g.fillStyle = SK.ink; g.beginPath(); g.moveTo(-200, 0); g.lineTo(200, 0); g.lineTo(160, 46); g.lineTo(-170, 46); g.fill(); g.fillRect(-6, -280, 12, 280); g.beginPath(); g.moveTo(-6, -270); g.quadraticCurveTo(100, -170, -6, -30); g.fill(); g.restore();
  g.textAlign = 'center'; g.textBaseline = 'middle'; sym.forEach((s, i) => { const a = clamp((k - 0.15 - i * 0.06) / 0.2); if (a <= 0) return; const pos = [[0.2,0.2],[0.5,0.15],[0.8,0.22],[0.33,0.32],[0.67,0.33],[0.15,0.42],[0.85,0.43],[0.42,0.47],[0.58,0.25]][i]; const x = W * pos[0], y = H * pos[1] - a * 20;
    g.font = `700 ${s.length > 1 ? 72 : 120}px Inter, serif`; g.shadowColor = ACCENT; g.shadowBlur = 24; g.fillStyle = rgba('#FFE2A8', a); g.fillText(s, x, y); }); g.shadowBlur = 0;
  SK.grain(g, t, 0.07); };
