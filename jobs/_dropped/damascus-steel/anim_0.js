const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
const bgL = (a, b) => layer(x => { const g = x.createRadialGradient(W * 0.7, H * 0.2, 40, W / 2, H * 0.4, H * 0.9); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
// curved sabre path from (x0,y0) to (x1,y1); width w
function bladePath(g, x0, y0, x1, y1, w) { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - 90; g.beginPath(); g.moveTo(x0, y0 - w / 2); g.quadraticCurveTo(mx, my - w / 2, x1, y1); g.quadraticCurveTo(mx, my + w / 2, x0, y0 + w / 2); g.closePath(); }
function watered(g, phase, light, dark, amp = 6, wl = 90, rows = 25, y0 = 0, y1 = H) { const step = (y1 - y0) / rows;
  for (let i = 0; i < rows; i++) { g.fillStyle = i % 2 ? dark : light; g.beginPath(); const yb = y0 + i * step;
    g.moveTo(-10, yb); for (let x = -10; x <= W + 10; x += 12) g.lineTo(x, yb + Math.sin(x / wl * 6.283 + phase + i * 0.6) * amp); g.lineTo(W + 10, yb + step + 20); g.lineTo(-10, yb + step + 20); g.fill(); } }
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL('#3a2a18', '#0c0b0a');
window.renderFrame = function (t) { const k = ease.out(clamp(t / (DURATION * 0.25))), sx = lerp(-700, 0, k);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const x0 = W * 0.15 + sx, y0 = H * 0.62, x1 = W * 0.85 + sx, y1 = H * 0.30;
  g.save(); bladePath(g, x0, y0, x1, y1, 60); g.clip(); watered(g, t * 0.5, '#d8dce4', '#6a7080', 6, 90, 25, H * 0.2, H * 0.72);
  const hx = ((t * 0.5) % 1) * (W + 400) - 200 + sx; const sh = g.createLinearGradient(hx - 120, 0, hx + 120, 0); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, 'rgba(255,255,255,0.45)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sh; g.fillRect(0, 0, W, H); g.restore();
  g.strokeStyle = '#2a2a30'; g.lineWidth = 3; bladePath(g, x0, y0, x1, y1, 60); g.stroke();
  g.save(); g.translate(x0 + 70, y0 - 20); g.rotate(-0.45); g.fillStyle = '#c9a24a'; g.fillRect(-18, -90, 36, 180); g.fillStyle = '#6a4a1a'; g.fillRect(-14, 90, 28, 150); g.restore(); };
