const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), sail = ease.inOut(clamp((k - 0.3) / 0.6));
  g.fillStyle = '#140c08'; g.fillRect(0, 0, W, H); SK.lamp(g, W * 0.86, H * 0.66, 0.9, t);
  const cx = W * 0.46, cy = H * 0.56; g.fillStyle = '#5a2a1a'; g.fillRect(cx - 330, cy, 660, 26); g.fillStyle = '#efe4c8'; g.beginPath(); g.moveTo(cx - 320, cy); g.quadraticCurveTo(cx - 160, cy - 40, cx, cy - 10); g.quadraticCurveTo(cx + 160, cy - 40, cx + 320, cy); g.lineTo(cx + 320, cy - 300); g.quadraticCurveTo(cx + 160, cy - 340, cx, cy - 310); g.quadraticCurveTo(cx - 160, cy - 340, cx - 320, cy - 300); g.fill();
  g.fillStyle = '#7a6a54'; for (let i = 0; i < 7; i++) { g.fillRect(cx - 290, cy - 270 + i * 34, 220 - (i * 31) % 60, 7); g.fillRect(cx + 40, cy - 270 + i * 34, 220 - (i * 23) % 60, 7); }
  const gl = g.createRadialGradient(cx, cy - 160, 20, cx, cy - 160, 500); gl.addColorStop(0, rgba(ACCENT, 0.25)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.save(); g.translate(cx, lerp(cy - 160, H * 0.24, sail)); g.scale(lerp(0.25, 0.7, sail), lerp(0.25, 0.7, sail)); g.fillStyle = SK.ink; g.beginPath(); g.moveTo(-180, -10); g.quadraticCurveTo(0, 40, 200, -30); g.lineTo(160, 30); g.lineTo(-150, 30); g.fill(); g.fillRect(-5, -250, 10, 240); g.fillStyle = '#e8dcc0'; g.beginPath(); g.moveTo(-70, -220); g.lineTo(70, -220); g.lineTo(60, -80); g.lineTo(-60, -80); g.fill(); g.restore();
  SK.grain(g, t, 0.06); };
