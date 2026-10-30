const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#0e1418'; g.fillRect(0, 0, W, H);
  const cx = W * 0.32, cy = H * 0.5; g.fillStyle = '#d8dce4'; g.fillRect(cx - 20, cy - 260, 40, 200); g.save(); g.translate(cx, cy - 60); g.rotate(-0.4); g.fillRect(-30, -180, 60, 200); g.restore(); g.fillRect(cx - 120, cy + 120, 240, 40); g.fillRect(cx - 14, cy - 40, 28, 170); g.beginPath(); g.ellipse(cx + 40, cy + 40, 110, 20, 0, 0, 6.283); g.fill();
  g.save(); g.translate(W * 0.7, H * 0.42); g.fillStyle = '#f2f0e8'; g.fillRect(-170, -220, 340, 440); g.fillStyle = '#2a4a8a'; g.font = '800 34px Inter'; g.textAlign = 'center'; g.fillText('GUIDANCE', 0, -160);
  const rows = [['MOST BODIES', true], ['LOW RISK', true], ['SOME DISEASES', false]];
  rows.forEach(([txt, ok], i) => { const a = ease.out(clamp((k - 0.2 - i * 0.18) / 0.15)); g.globalAlpha = a; g.fillStyle = '#3a3a44'; g.font = '700 26px Inter'; g.textAlign = 'left'; g.fillText(txt, -140, -80 + i * 90);
    if (ok) { g.strokeStyle = '#2a9a4a'; g.lineWidth = 8; g.beginPath(); g.moveTo(90, -90 + i * 90); g.lineTo(110, -70 + i * 90); g.lineTo(140, -110 + i * 90); g.stroke(); } else { g.fillStyle = '#e0a020'; g.beginPath(); g.moveTo(115, -115 + i * 90); g.lineTo(145, -65 + i * 90); g.lineTo(85, -65 + i * 90); g.fill(); } g.globalAlpha = 1; });
  g.restore(); SK.grain(g, t, 0.05); };
