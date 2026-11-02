const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
const bgL = (a, b) => layer(x => { const g = x.createRadialGradient(W * 0.7, H * 0.2, 40, W / 2, H * 0.4, H * 0.9); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
// curved sabre path from (x0,y0) to (x1,y1); width w
function bladePath(g, x0, y0, x1, y1, w) { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - 90; g.beginPath(); g.moveTo(x0, y0 - w / 2); g.quadraticCurveTo(mx, my - w / 2, x1, y1); g.quadraticCurveTo(mx, my + w / 2, x0, y0 + w / 2); g.closePath(); }
function watered(g, phase, light, dark, amp = 6, wl = 90, rows = 25, y0 = 0, y1 = H) { const step = (y1 - y0) / rows;
  for (let i = 0; i < rows; i++) { g.fillStyle = i % 2 ? dark : light; g.beginPath(); const yb = y0 + i * step;
    g.moveTo(-10, yb); for (let x = -10; x <= W + 10; x += 12) g.lineTo(x, yb + Math.sin(x / wl * 6.283 + phase + i * 0.6) * amp); g.lineTo(W + 10, yb + step + 20); g.lineTo(-10, yb + step + 20); g.fill(); } }
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL('#1a1c22', '#06070a');
const grain = Array.from({length: 400}, () => [rand(), rand(), rand()]);
function hexTube(x, y, w, h, a) { g.save(); g.translate(x, y); g.rotate(a); g.strokeStyle = rgba(ACCENT, 0.8); g.lineWidth = 2; for (let r = 0; r < h / 22; r++) for (let q = 0; q < w / 26; q++) { const cx = -w / 2 + q * 26 + (r % 2) * 13, cy = -h / 2 + r * 22; g.beginPath(); for (let i = 0; i < 6; i++) { const an = i / 6 * 6.283; i ? g.lineTo(cx + Math.cos(an) * 12, cy + Math.sin(an) * 12) : g.moveTo(cx + Math.cos(an) * 12, cy + Math.sin(an) * 12); } g.closePath(); g.stroke(); } g.restore(); }
window.renderFrame = function (t) { const k = clamp(t / DURATION), cx = W / 2, cy = H * 0.46;
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const s1 = 0.8 + 0.2 * ease.out(clamp(k / 0.1)); g.save(); g.translate(cx, cy); g.scale(s1, s1); g.fillStyle = '#8a8f98'; g.fillRect(-W / 2, -140, W, 280); g.fillStyle = '#c8ccd4'; g.fillRect(-W / 2, -140, W, 30); g.restore();
  if (k >= 0.3) { const s2 = 0.8 + 0.2 * ease.out(clamp((k - 0.3) / 0.1)); g.save(); g.translate(cx, cy); g.scale(s2, s2); g.beginPath(); g.arc(0, 0, 360, 0, 6.283); g.clip(); g.fillStyle = '#5c6472'; g.fillRect(-400, -400, 800, 800);
    for (const [x, y, r] of grain) { g.fillStyle = `rgba(230,233,239,${0.3 + 0.5 * r})`; g.fillRect(-360 + x * 720, -360 + y * 720, 3 + r * 4, 3 + r * 4); }
    if (k >= 0.6) { const f = ease.out(clamp((k - 0.6) / 0.15)); g.globalAlpha = f; g.fillStyle = 'rgba(10,12,16,0.85)'; g.fillRect(-400, -400, 800, 800); for (let i = 0; i < 14; i++) { hexTube(-300 + (i % 7) * 100, -120 + Math.floor(i / 7) * 220, 70, 190, 0.35 + Math.sin(t * 0.5 + i) * 0.05); } g.globalAlpha = 1;
      const gl = g.createRadialGradient(0, 0, 20, 0, 0, 360); gl.addColorStop(0, rgba(ACCENT, 0.25 * f * (0.7 + 0.3 * Math.sin(t * 2)))); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(-400, -400, 800, 800); }
    g.restore(); g.strokeStyle = '#e6e9ef'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 360 * s2, 0, 6.283); g.stroke(); g.beginPath(); g.moveTo(cx - 24, cy); g.lineTo(cx + 24, cy); g.moveTo(cx, cy - 24); g.lineTo(cx, cy + 24); g.stroke(); } };
