const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
const bgL = (a, b) => layer(x => { const g = x.createRadialGradient(W * 0.7, H * 0.2, 40, W / 2, H * 0.4, H * 0.9); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
// curved sabre path from (x0,y0) to (x1,y1); width w
function bladePath(g, x0, y0, x1, y1, w) { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - 90; g.beginPath(); g.moveTo(x0, y0 - w / 2); g.quadraticCurveTo(mx, my - w / 2, x1, y1); g.quadraticCurveTo(mx, my + w / 2, x0, y0 + w / 2); g.closePath(); }
function watered(g, phase, light, dark, amp = 6, wl = 90, rows = 25, y0 = 0, y1 = H) { const step = (y1 - y0) / rows;
  for (let i = 0; i < rows; i++) { g.fillStyle = i % 2 ? dark : light; g.beginPath(); const yb = y0 + i * step;
    g.moveTo(-10, yb); for (let x = -10; x <= W + 10; x += 12) g.lineTo(x, yb + Math.sin(x / wl * 6.283 + phase + i * 0.6) * amp); g.lineTo(W + 10, yb + step + 20); g.lineTo(-10, yb + step + 20); g.fill(); } }
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { x.fillStyle = '#0f1a2b'; x.fillRect(0, 0, W, H); x.strokeStyle = 'rgba(255,255,255,0.06)'; x.lineWidth = 1; for (let i = 0; i < W; i += 90) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); } for (let j = 0; j < H; j += 90) { x.beginPath(); x.moveTo(0, j); x.lineTo(W, j); x.stroke(); }
  x.fillStyle = '#243649'; const poly = (pts) => { x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0] * W, p[1] * H) : x.moveTo(p[0] * W, p[1] * H)); x.closePath(); x.fill(); };
  poly([[0.6,0.35],[0.75,0.33],[0.9,0.4],[0.88,0.5],[0.8,0.62],[0.72,0.66],[0.66,0.58],[0.62,0.48]]); poly([[0.15,0.3],[0.35,0.28],[0.5,0.34],[0.5,0.46],[0.42,0.55],[0.3,0.56],[0.18,0.5]]); });
function route(u) { const a = [0.72 * W, 0.55 * H], b = [0.32 * W, 0.38 * H], cpt = [0.5 * W, 0.68 * H]; const x = (1 - u) ** 2 * a[0] + 2 * (1 - u) * u * cpt[0] + u * u * b[0], y = (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * cpt[1] + u * u * b[1]; return [x, y]; }
window.renderFrame = function (t) { const k = clamp(t / DURATION), p = clamp((k - 0.1) / 0.6);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.strokeStyle = ACCENT; g.lineWidth = 5; g.setLineDash([18, 12]); g.beginPath(); for (let u = 0; u <= p; u += 0.01) { const [x, y] = route(u); u ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.setLineDash([]);
  if (k >= 0.1 && k < 0.45) { const [x, y] = route(clamp((k - 0.1) / 0.6)); g.fillStyle = '#e8dcc0'; g.beginPath(); g.moveTo(x, y - 40); g.lineTo(x + 26, y - 6); g.lineTo(x, y - 6); g.fill(); g.fillStyle = '#6a4a2a'; g.fillRect(x - 24, y - 6, 48, 12); }
  if (k >= 0.45 && k < 0.7) { const [x, y] = route(clamp((k - 0.1) / 0.6)); g.fillStyle = '#c8a46a'; g.fillRect(x - 20, y - 24, 40, 18); g.fillRect(x - 6, y - 40, 14, 20); g.fillRect(x - 16, y - 6, 6, 14); g.fillRect(x + 10, y - 6, 6, 14); }
  if (k >= 0.7) { const [x, y] = route(1), q = (t * 1.1) % 1; g.strokeStyle = rgba(ACCENT, 1 - q); g.lineWidth = 4; g.beginPath(); g.arc(x, y, 12 + q * 70, 0, 6.283); g.stroke(); g.strokeStyle = '#e8dcc0'; g.lineWidth = 6; g.beginPath(); g.moveTo(x - 30, y + 30); g.lineTo(x + 30, y - 30); g.moveTo(x - 10, y - 12); g.lineTo(x + 8, y + 6); g.stroke(); } };
