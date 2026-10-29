const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), ghost = 0.35 + 0.35 * Math.sin(t * 2);
  g.fillStyle = '#0a0c12'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#16181e'; g.fillRect(W * 0.2, H * 0.22, W * 0.6, H * 0.46); g.fillStyle = '#05060a'; g.fillRect(W * 0.3, H * 0.28, W * 0.4, H * 0.3);
  const gl = g.createRadialGradient(W / 2, H * 0.43, 10, W / 2, H * 0.43, 300); gl.addColorStop(0, `rgba(190,220,255,${0.5 * ghost})`); gl.addColorStop(1, 'rgba(190,220,255,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.fillStyle = `rgba(230,240,255,${ghost})`; g.beginPath(); g.arc(W / 2, H * 0.36, 34, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(W / 2 - 40, H * 0.39); g.lineTo(W / 2 + 40, H * 0.39); g.lineTo(W / 2 + 60, H * 0.56); g.lineTo(W / 2 - 60, H * 0.56); g.fill();
  g.strokeStyle = '#3a3a44'; g.lineWidth = 10; g.strokeRect(W * 0.3, H * 0.28, W * 0.4, H * 0.3); g.beginPath(); g.moveTo(W / 2, H * 0.28); g.lineTo(W / 2, H * 0.58); g.stroke();
  g.fillStyle = '#d8d0b8'; g.fillRect(W * 0.36, H * 0.72, 300, 90); g.fillStyle = '#2a2420'; g.font = '800 64px Inter'; g.textAlign = 'center'; g.fillText('25 GB', W * 0.36 + 150, H * 0.72 + 68);
  SK.grain(g, t, 0.09); };
