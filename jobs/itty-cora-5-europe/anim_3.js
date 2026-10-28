const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), tilt = Math.sin(t * 1.4) * 0.12 * (1 - 0.3 * k);
  g.fillStyle = '#100c0a'; g.fillRect(0, 0, W, H); for (let r = 0; r < 4; r++) { g.fillStyle = '#2a1a10'; g.fillRect(0, H * (0.22 + r * 0.12), W, 10); for (let i = 0; i < 12; i++) { g.fillStyle = ['#5a3a22', '#4a2e1a', '#6a4428'][(i + r) % 3]; g.fillRect(40 + i * 86, H * (0.22 + r * 0.12) - 90 + (i * 13) % 20, 60, 90 - (i * 13) % 20); } }
  g.fillStyle = 'rgba(16,12,10,0.6)'; g.fillRect(0, 0, W, H);
  g.save(); g.translate(W / 2, H * 0.44); g.strokeStyle = '#e8c070'; g.fillStyle = '#e8c070'; g.lineWidth = 8; g.beginPath(); g.moveTo(0, -200); g.lineTo(0, 160); g.stroke(); g.fillRect(-90, 160, 180, 16);
  g.rotate(tilt); g.beginPath(); g.moveTo(-280, -190); g.lineTo(280, -190); g.stroke();
  for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 280, -190); g.lineTo(sx * 230, -80); g.moveTo(sx * 280, -190); g.lineTo(sx * 330, -80); g.stroke(); g.beginPath(); g.ellipse(sx * 280, -80, 70, 16, 0, 0, Math.PI); g.fill(); }
  g.fillStyle = '#c9a25a'; g.fillRect(-320, -116, 80, 26); g.fillStyle = '#e8dcc0'; g.fillRect(240, -120, 80, 30); g.restore();
  const q = ease.out(clamp((k - 0.45) / 0.2)); if (q > 0) { g.font = `800 ${180 * q}px Inter`; g.textAlign = 'center'; g.fillStyle = rgba(ACCENT, 0.85); g.fillText('?', W / 2, H * 0.3); }
  SK.grain(g, t, 0.06); };
