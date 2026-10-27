function palmLeaf(g, x, y, w, h, t, glow = 0) { g.fillStyle = '#c9a25a'; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, h / 2); g.fill(); g.fillStyle = '#8a6a34'; g.beginPath(); g.arc(x - w * 0.3, y, 6, 0, 6.283); g.arc(x + w * 0.3, y, 6, 0, 6.283); g.fill();
  if (glow > 0) { g.fillStyle = `rgba(255,236,180,${glow})`; for (let i = 0; i < 3; i++) g.fillRect(x - w * 0.42, y - h * 0.28 + i * h * 0.24, w * (0.84 - i * 0.1), 4); } }
function scholar(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = SK.ink; g.beginPath(); g.arc(0, -210, 30, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(-60, -180); g.quadraticCurveTo(0, -200, 60, -180); g.lineTo(110, 0); g.lineTo(-110, 0); g.fill(); g.strokeStyle = SK.ink; g.lineWidth = 14; g.beginPath(); g.moveTo(30, -150); g.lineTo(110, -90 + Math.sin(t * 3) * 6); g.stroke(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d'); const L = 'അആഇഈഉഎഒകഗചജടതദനപമയരലവശസഹളഴറ'.split('');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#140c08'; g.fillRect(0, 0, W, H); SK.lamp(g, W * 0.86, H * 0.62, 0.9, t);
  for (let i = 0; i < 6; i++) { const y = H * (0.24 + i * 0.07), a = clamp((k - i * 0.08) / 0.15); g.save(); g.globalAlpha = a; palmLeaf(g, W * 0.46, y, 760, 64, t, 0);
    g.font = `700 36px "Noto", "Noto Sans Malayalam", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#3a2410';
    g.fillText(L.slice((i * 5) % L.length, (i * 5) % L.length + 14).join(' '), W * 0.46, y + 2); g.restore(); }
  const gl = g.createRadialGradient(W * 0.46, H * 0.42, 40, W * 0.46, H * 0.42, 600); gl.addColorStop(0, rgba(ACCENT, 0.18 * k)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  SK.grain(g, t, 0.06); };
