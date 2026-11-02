const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
const bgL = (a, b) => layer(x => { const g = x.createRadialGradient(W * 0.7, H * 0.2, 40, W / 2, H * 0.4, H * 0.9); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
// curved sabre path from (x0,y0) to (x1,y1); width w
function bladePath(g, x0, y0, x1, y1, w) { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - 90; g.beginPath(); g.moveTo(x0, y0 - w / 2); g.quadraticCurveTo(mx, my - w / 2, x1, y1); g.quadraticCurveTo(mx, my + w / 2, x0, y0 + w / 2); g.closePath(); }
function watered(g, phase, light, dark, amp = 6, wl = 90, rows = 25, y0 = 0, y1 = H) { const step = (y1 - y0) / rows;
  for (let i = 0; i < rows; i++) { g.fillStyle = i % 2 ? dark : light; g.beginPath(); const yb = y0 + i * step;
    g.moveTo(-10, yb); for (let x = -10; x <= W + 10; x += 12) g.lineTo(x, yb + Math.sin(x / wl * 6.283 + phase + i * 0.6) * amp); g.lineTo(W + 10, yb + step + 20); g.lineTo(-10, yb + step + 20); g.fill(); } }
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL('#1a1410', '#050403');
const embers = Array.from({length: 20}, () => ({x: rand(), s: 0.5 + rand(), p: rand()}));
window.renderFrame = function (t) { const k = clamp(t / DURATION), b = clamp((k - 0.15) / 0.6);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const px = W / 2 - 280, py = H * 0.42 - 210, pw = 560, ph = 420;
  g.save(); g.beginPath(); g.rect(px, py, pw, ph); g.clip();
  g.fillStyle = '#e8dcc0'; g.fillRect(px, py, pw, ph); g.fillStyle = 'rgba(90,80,60,0.5)'; for (let i = 0; i < 7; i++) g.fillRect(px + 50, py + 50 + i * 46, 300 + (i * 61) % 160, 10);
  if (b > 0) { const d = b * (pw + ph) * 1.1; g.fillStyle = '#050403'; g.beginPath(); g.moveTo(px + pw, py + ph); g.lineTo(px + pw - d, py + ph); for (let i = 0; i <= 10; i++) { const u = i / 10; g.lineTo(px + pw - d + u * d + Math.sin(u * 20 + t * 3) * 14, py + ph - u * d + Math.cos(u * 17 + t * 2) * 14); } g.closePath(); g.fill();
    g.strokeStyle = '#ff8a2a'; g.lineWidth = 3; g.shadowColor = '#ff8a2a'; g.shadowBlur = 16; g.beginPath(); for (let i = 0; i <= 10; i++) { const u = i / 10; const x = px + pw - d + u * d + Math.sin(u * 20 + t * 3) * 14, y = py + ph - u * d + Math.cos(u * 17 + t * 2) * 14; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.shadowBlur = 0; }
  g.restore();
  if (b > 0) for (const e of embers) { const u = (t * 0.3 * e.s + e.p) % 1; g.fillStyle = `rgba(255,160,60,${(1 - u) * b})`; g.fillRect(px + e.x * pw, py + ph - u * 500, 4, 4); }
  const cool = clamp((k - 0.3) / 0.6); g.fillStyle = '#2a2a2e'; g.fillRect(W / 2 - 120, H * 0.68, 240, 40); g.fillRect(W / 2 - 60, H * 0.68 + 40, 120, 50);
  g.fillStyle = `rgb(${lerp(255, 120, cool)|0},${lerp(150, 125, cool)|0},${lerp(60, 130, cool)|0})`; g.fillRect(W / 2 - 150, H * 0.68 - 16, 300, 12); };
