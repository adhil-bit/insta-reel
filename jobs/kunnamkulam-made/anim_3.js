function box(g, x, y, w, h, col, label) { g.fillStyle = col; g.fillRect(x - w / 2, y - h, w, h); g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x - w / 2, y - h, w * 0.18, h); g.fillStyle = '#f2ede0'; g.fillRect(x - w * 0.36, y - h * 0.68, w * 0.72, h * 0.3); g.fillStyle = col; g.font = `800 ${Math.round(w * 0.16)}px Inter`; g.textAlign = 'center'; g.fillText(label, x, y - h * 0.47); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), slide = ease.out(clamp((k - 0.2) / 0.3)), tag = ease.out(clamp((k - 0.55) / 0.2));
  g.fillStyle = '#121014'; g.fillRect(0, 0, W, H); g.fillStyle = '#2a2024'; g.fillRect(0, H * 0.62, W, H);
  box(g, W * 0.3, H * 0.62, 260, 320, '#c0392b', 'BRAND'); box(g, lerp(W * 1.2, W * 0.7, slide), H * 0.62, 260, 320, '#c0392b', 'BRAND');
  g.strokeStyle = '#efe4c8'; g.lineWidth = 6; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(W / 2, H * 0.2); g.lineTo(W / 2, H * 0.62); g.stroke(); g.setLineDash([]);
  if (tag > 0) { g.save(); g.translate(W * 0.78, H * 0.26); g.rotate(0.15); g.scale(tag, tag); g.fillStyle = '#FACC15'; g.beginPath(); g.moveTo(-110, -50); g.lineTo(90, -50); g.lineTo(130, 0); g.lineTo(90, 50); g.lineTo(-110, 50); g.closePath(); g.fill(); g.fillStyle = '#121014'; g.font = '800 44px Inter'; g.textAlign = 'center'; g.fillText('½ PRICE', -10, 16); g.restore(); }
  SK.grain(g, t, 0.06); };
