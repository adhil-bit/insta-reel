const c = makeCanvas(), g = c.getContext('2d');
function warship(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#2a3442';
  g.beginPath(); g.moveTo(-420, 0); g.lineTo(380, 0); g.lineTo(440, -40); g.lineTo(-400, -40); g.closePath(); g.fill();
  g.fillRect(-300, -120, 360, 80); g.fillRect(-180, -200, 160, 80); g.fillRect(-120, -290, 30, 90); g.fillRect(-150, -300, 90, 14);
  g.fillRect(120, -90, 160, 50); g.fillRect(200, -110, 80, 20); g.strokeStyle = '#2a3442'; g.lineWidth = 8; g.beginPath(); g.moveTo(-105, -300); g.lineTo(-105, -360); g.stroke();
  g.fillStyle = 'rgba(255,214,140,0.8)'; for (let i = 0; i < 6; i++) g.fillRect(-280 + i * 52, -100, 16, 12); g.restore(); }
window.renderFrame = function (t) {
  SK.sky(g, 'dusk', 0.42); SK.sea(g, H * 0.4, t, ['#3a4a6a', '#2a3854', '#1c2840'], false, H * 0.52);
  warship(W * 0.56, H * 0.405, 0.9);
  g.fillStyle = '#14161c'; g.fillRect(0, H * 0.5, W, H);
  g.strokeStyle = '#6a6e76'; g.lineWidth = 6; for (let i = 0; i <= 14; i++) { const x = i * W / 14; g.beginPath(); g.moveTo(x, H * 0.36); g.lineTo(x, H * 0.52); g.stroke(); }
  g.lineWidth = 4; for (let y = 0; y < 5; y++) { g.beginPath(); g.moveTo(0, H * 0.36 + y * 40); g.lineTo(W, H * 0.36 + y * 40); g.stroke(); }
  g.strokeStyle = '#8a8e96'; g.lineWidth = 3; for (let i = 0; i < 40; i++) { const x = i * W / 40; g.beginPath(); g.arc(x, H * 0.355, 12, Math.PI, 0); g.stroke(); }
  const bx = W * 0.27, by = H * 0.3; g.fillStyle = '#3a3a40'; g.fillRect(bx - 8, by + 70, 16, 220);
  g.fillStyle = '#f2f0e8'; g.beginPath(); g.roundRect(bx - 190, by - 190, 380, 270, 14); g.fill(); g.strokeStyle = '#c0392b'; g.lineWidth = 10; g.strokeRect(bx - 176, by - 176, 352, 242);
  g.save(); g.translate(bx, by - 100); g.fillStyle = '#1a1a1e'; g.beginPath(); g.roundRect(-54, -30, 108, 64, 10); g.fill(); g.fillRect(-20, -42, 40, 14); g.fillStyle = '#f2f0e8'; g.beginPath(); g.arc(0, 2, 20, 0, 6.283); g.fill(); g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(0, 2, 12, 0, 6.283); g.fill();
  g.strokeStyle = '#c0392b'; g.lineWidth = 9; g.beginPath(); g.arc(0, 0, 62, 0, 6.283); g.stroke(); g.beginPath(); g.moveTo(-44, -44); g.lineTo(44, 44); g.stroke(); g.restore();
  g.fillStyle = '#c0392b'; g.font = '800 34px Inter, Arial, sans-serif'; g.textAlign = 'center'; g.fillText('PHOTOGRAPHY', bx, by + 6); g.fillText('PROHIBITED', bx, by + 48);
  const sg = g.createRadialGradient(W * 0.78, H * 0.2, 10, W * 0.78, H * 0.2, 500); sg.addColorStop(0, 'rgba(255,240,200,0.18)'); sg.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = sg; g.beginPath(); g.moveTo(W * 0.78, H * 0.2); g.lineTo(W * 0.2, H * 0.42); g.lineTo(W * 0.5, H * 0.46); g.fill();
  const q = ease.out(clamp((clamp(t / DURATION) - 0.65) / 0.2)); if (q > 0) { g.fillStyle = `rgba(245,158,59,${q})`; g.beginPath(); g.roundRect(W / 2 + 40, H * 0.14, 300, 120, 30); g.fill(); g.fillStyle = "#14161c"; for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(W / 2 + 120 + j * 70, H * 0.14 + 60, 14, 0, 6.283); g.fill(); } }
  SK.grain(g, t, 0.07); };
