function box(g, x, y, w, h, col, label) { g.fillStyle = col; g.fillRect(x - w / 2, y - h, w, h); g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x - w / 2, y - h, w * 0.18, h); g.fillStyle = '#f2ede0'; g.fillRect(x - w * 0.36, y - h * 0.68, w * 0.72, h * 0.3); g.fillStyle = col; g.font = `800 ${Math.round(w * 0.16)}px Inter`; g.textAlign = 'center'; g.fillText(label, x, y - h * 0.47); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#120e0c'; g.fillRect(0, 0, W, H); const gl = g.createRadialGradient(W / 2, H * 0.2, 10, W / 2, H * 0.3, 600); gl.addColorStop(0, 'rgba(255,220,150,0.45)'); gl.addColorStop(1, 'rgba(255,220,150,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#3a3030'; g.lineWidth = 4; g.beginPath(); g.moveTo(W / 2, 0); g.lineTo(W / 2, H * 0.14); g.stroke(); g.fillStyle = '#2a2424'; g.beginPath(); g.moveTo(W / 2 - 60, H * 0.17); g.lineTo(W / 2 + 60, H * 0.17); g.lineTo(W / 2 + 30, H * 0.14); g.lineTo(W / 2 - 30, H * 0.14); g.fill(); g.fillStyle = '#ffe2a0'; g.beginPath(); g.arc(W / 2, H * 0.175, 14, 0, 6.283); g.fill();
  g.fillStyle = '#4a3020'; g.fillRect(0, H * 0.46, W, 24); g.fillStyle = '#2a1a12'; g.fillRect(0, H * 0.47, W, H);
  box(g, W * 0.3, H * 0.46, 250, 300, '#1f6aa5', 'BRAND'); box(g, W * 0.7, H * 0.46, 250, 300, '#1f6aa5', 'BRAND');
  g.font = '800 160px Inter'; g.textAlign = 'center'; g.fillStyle = `rgba(250,204,21,${0.7 + 0.3 * Math.sin(t * 3)})`; g.fillText('?', W / 2, H * 0.36);
  SK.grain(g, t, 0.07); };
