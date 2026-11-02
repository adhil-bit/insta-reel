const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
const bgL = (a, b) => layer(x => { const g = x.createRadialGradient(W * 0.7, H * 0.2, 40, W / 2, H * 0.4, H * 0.9); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
// curved sabre path from (x0,y0) to (x1,y1); width w
function bladePath(g, x0, y0, x1, y1, w) { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - 90; g.beginPath(); g.moveTo(x0, y0 - w / 2); g.quadraticCurveTo(mx, my - w / 2, x1, y1); g.quadraticCurveTo(mx, my + w / 2, x0, y0 + w / 2); g.closePath(); }
function watered(g, phase, light, dark, amp = 6, wl = 90, rows = 25, y0 = 0, y1 = H) { const step = (y1 - y0) / rows;
  for (let i = 0; i < rows; i++) { g.fillStyle = i % 2 ? dark : light; g.beginPath(); const yb = y0 + i * step;
    g.moveTo(-10, yb); for (let x = -10; x <= W + 10; x += 12) g.lineTo(x, yb + Math.sin(x / wl * 6.283 + phase + i * 0.6) * amp); g.lineTo(W + 10, yb + step + 20); g.lineTo(-10, yb + step + 20); g.fill(); } }
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL('#2a1a10', '#070504');
const india = [[0.72,0.42],[0.78,0.44],[0.82,0.5],[0.8,0.58],[0.76,0.64],[0.72,0.66],[0.68,0.6],[0.66,0.52],[0.68,0.46]];
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.globalAlpha = 0.35; g.fillStyle = '#c9a24a'; g.beginPath(); india.forEach((p, i) => { i ? g.lineTo(p[0] * W, p[1] * H) : g.moveTo(p[0] * W, p[1] * H); }); g.closePath(); g.fill(); g.globalAlpha = 1;
  const cx = W / 2, cy = H * 0.48;
  for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283, f = 0.7 + 0.3 * Math.sin(t * 9 + i * 1.7); g.fillStyle = `rgba(255,${120 + i * 8},40,0.85)`; g.beginPath(); g.moveTo(cx + Math.cos(a) * 150, cy + 60); g.quadraticCurveTo(cx + Math.cos(a) * 190, cy - 40 * f, cx + Math.cos(a) * 120, cy - 120 * f); g.quadraticCurveTo(cx + Math.cos(a) * 110, cy - 20, cx + Math.cos(a) * 100, cy + 60); g.fill(); }
  g.fillStyle = '#5a3a26'; g.beginPath(); g.moveTo(cx - 130, cy - 40); g.quadraticCurveTo(cx - 150, cy + 110, cx - 80, cy + 130); g.lineTo(cx + 80, cy + 130); g.quadraticCurveTo(cx + 150, cy + 110, cx + 130, cy - 40); g.closePath(); g.fill();
  const m = clamp(k * 2); const mc = g.createRadialGradient(cx, cy - 30, 5, cx, cy - 30, 110); mc.addColorStop(0, m > 0.9 ? '#fff6d8' : '#ffd27a'); mc.addColorStop(1, '#e8641e'); g.fillStyle = mc; g.beginPath(); g.ellipse(cx, cy - 36, 118, 26, 0, 0, 6.283); g.fill();
  const s = ease.out(clamp((k - 0.55) / 0.3)); if (s > 0) { const cool = clamp((k - 0.7) / 0.2); g.fillStyle = `rgb(${lerp(242, 138, cool)|0},${lerp(165, 143, cool)|0},${lerp(58, 152, cool)|0})`; g.beginPath(); g.roundRect(cx + 120 + s * 160, cy + 50, 200, 90, 14); g.fill(); }
  const gl = g.createRadialGradient(cx, cy - 20, 20, cx, cy - 20, 420); gl.addColorStop(0, 'rgba(255,140,60,0.3)'); gl.addColorStop(1, 'rgba(255,140,60,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H); };
