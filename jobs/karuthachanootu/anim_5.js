const c = makeCanvas(), g = c.getContext('2d');
function hooded(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#060304'; g.beginPath(); g.moveTo(-120, 0); g.quadraticCurveTo(-110, -150, -80, -210); g.quadraticCurveTo(-70, -250, -46, -270);
  g.quadraticCurveTo(-30, -360, 0, -380); g.quadraticCurveTo(30, -360, 46, -270); g.quadraticCurveTo(70, -250, 80, -210); g.quadraticCurveTo(110, -150, 120, 0); g.closePath(); g.fill();
  const rim = g.createLinearGradient(0, -380, 0, 0); rim.addColorStop(0, 'rgba(200,40,30,0.0)'); rim.addColorStop(1, 'rgba(200,40,30,0.35)'); g.strokeStyle = rim; g.lineWidth = 4; g.stroke();
  g.fillStyle = '#000'; g.beginPath(); g.ellipse(0, -290, 26, 40, 0, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(30,14,16,1)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -250); g.lineTo(0, -10); g.stroke(); g.restore(); }
window.renderFrame = function (t) {
  g.fillStyle = '#080406'; g.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H * 0.5; const gl = g.createRadialGradient(cx, cy, 30, cx, cy, 700); gl.addColorStop(0, 'rgba(180,30,30,0.55)'); gl.addColorStop(0.5, 'rgba(90,10,20,0.3)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(220,60,50,0.55)'; g.lineWidth = 5; g.beginPath(); g.ellipse(cx, cy + 40, 360, 110, 0, 0, 6.283); g.stroke();
  for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283, x = cx + Math.cos(a) * 360, y = cy + 40 + Math.sin(a) * 110; g.fillStyle = '#e8dcc0'; g.fillRect(x - 7, y - 40, 14, 40); const f = 1 + 0.2 * Math.sin(t * 9 + i); g.fillStyle = '#ffcf6a'; g.beginPath(); g.ellipse(x, y - 52, 7, 16 * f, 0, 0, 6.283); g.fill();
    const cg = g.createRadialGradient(x, y - 52, 2, x, y - 52, 70); cg.addColorStop(0, 'rgba(255,190,90,0.5)'); cg.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = cg; g.fillRect(x - 70, y - 122, 140, 140); }
  hooded(cx - 300, cy - 20, 1.1); hooded(cx + 300, cy - 20, 1.1); hooded(cx, cy - 80, 1.35);
  g.fillStyle = 'rgba(255,90,70,0.85)'; g.beginPath(); g.arc(cx - 11, cy - 476, 5, 0, 6.283); g.arc(cx + 11, cy - 476, 5, 0, 6.283); g.fill();
  const q = ease.out(clamp((clamp(t / DURATION) - 0.6) / 0.2)); if (q > 0) { g.save(); g.globalAlpha = q; g.font = "800 44px Inter"; g.textAlign = "center"; for (const [x, txt, col] of [[W * 0.27, "FACT?", "#34D399"], [W * 0.73, "RUMOUR?", "#FF4D5E"]]) { g.fillStyle = "rgba(8,6,10,0.8)"; g.beginPath(); g.roundRect(x - 150, H * 0.75, 300, 80, 40); g.fill(); g.strokeStyle = col; g.lineWidth = 4; g.stroke(); g.fillStyle = col; g.fillText(txt, x, H * 0.75 + 55); } g.restore(); }
  SK.grain(g, t, 0.09); };
