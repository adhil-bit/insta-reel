function mudi(g, x, y, r, t, c1 = '#c0302a', c2 = '#f2b632', a = 1) {   // circular Theyyam headdress
  g.save(); g.globalAlpha = a; g.translate(x, y);
  for (let i = 0; i < 24; i++) { const an = i / 24 * 6.283 + Math.sin(t) * 0.02; g.strokeStyle = i % 2 ? c2 : c1; g.lineWidth = 10; g.beginPath(); g.moveTo(Math.cos(an) * r * 0.35, Math.sin(an) * r * 0.35); g.lineTo(Math.cos(an) * r, Math.sin(an) * r); g.stroke(); }
  for (const [rr, col] of [[1, c1], [0.82, c2], [0.62, c1], [0.42, '#2a120a']]) { g.strokeStyle = col; g.lineWidth = r * 0.08; g.beginPath(); g.arc(0, 0, r * rr, 0, 6.283); g.stroke(); }
  g.fillStyle = '#fff6d8'; for (let i = 0; i < 36; i++) { const an = i / 36 * 6.283; g.beginPath(); g.arc(Math.cos(an) * r * 1.04, Math.sin(an) * r * 1.04, r * 0.025, 0, 6.283); g.fill(); }
  const gl = g.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 1.6); gl.addColorStop(0, 'rgba(255,170,80,0.25)'); gl.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = gl; g.fillRect(-r * 1.6, -r * 1.6, r * 3.2, r * 3.2);
  g.restore(); }
function torch(g, x, y, t, h = 220) { g.fillStyle = '#2a1608'; g.fillRect(x - 5, y - h, 10, h); const f = 1 + 0.2 * Math.sin(t * 11 + x); g.fillStyle = '#ffb43a'; g.beginPath(); g.ellipse(x, y - h - 18, 14, 30 * f, 0, 0, 6.283); g.fill();
  const gl = g.createRadialGradient(x, y - h - 18, 4, x, y - h - 18, 180); gl.addColorStop(0, 'rgba(255,160,60,0.45)'); gl.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = gl; g.fillRect(x - 180, y - h - 200, 360, 360); }
const c = makeCanvas(), g = c.getContext('2d');
function strokeTo(path, p) { g.beginPath(); const n = Math.floor(path.length * p); for (let i = 0; i < n; i++) i ? g.lineTo(path[i][0], path[i][1]) : g.moveTo(path[i][0], path[i][1]); g.stroke(); }
const cx = W / 2, cy = H * 0.45, curves = [];
for (const s of [-1, 1]) { const a = []; for (let i = 0; i <= 40; i++) { const u = i / 40; a.push([cx + s * (60 + u * 130), cy - 60 + Math.sin(u * 3.2) * 90]); } curves.push(a); const b = []; for (let i = 0; i <= 40; i++) { const u = i / 40; b.push([cx + s * (40 + u * 150), cy + 120 + Math.cos(u * 3) * 50]); } curves.push(b); }
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#120a06'; g.fillRect(0, 0, W, H); const gl = g.createRadialGradient(cx, cy, 50, cx, cy, 700); gl.addColorStop(0, 'rgba(255,170,80,0.25)'); gl.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.fillStyle = '#c88a5a'; g.beginPath(); g.ellipse(cx, cy, 220, 290, 0, 0, 6.283); g.fill();
  const red = ease.inOut(clamp((k - 0.1) / 0.3)); g.save(); g.beginPath(); g.ellipse(cx, cy, 220, 290, 0, 0, 6.283); g.clip(); g.fillStyle = '#c0302a'; g.fillRect(cx - 230, cy + 300 - red * 600, 460, 600); g.restore();
  g.lineCap = 'round'; g.strokeStyle = '#f2b632'; g.lineWidth = 14; curves.forEach((cv, i) => strokeTo(cv, clamp((k - 0.4 - i * 0.05) / 0.25)));
  g.fillStyle = '#fff6d8'; for (let i = 0; i < 14; i++) { if (k < 0.65 + i * 0.015) continue; const a = i / 14 * 6.283; g.beginPath(); g.arc(cx + Math.cos(a) * 200, cy + Math.sin(a) * 268, 8, 0, 6.283); g.fill(); }
  g.fillStyle = '#1a0a04'; g.beginPath(); g.ellipse(cx - 80, cy - 40, 34, 10, 0, 0, 6.283); g.ellipse(cx + 80, cy - 40, 34, 10, 0, 0, 6.283); g.fill();
  const bx = k < 0.4 ? cx + (Math.sin(t * 3) * 120) : cx + 150, by = k < 0.4 ? cy + 200 : cy - 80; g.fillStyle = '#3a2a1a'; g.save(); g.translate(bx, by); g.rotate(-0.6); g.fillRect(-6, -160, 12, 160); g.fillStyle = '#f2b632'; g.beginPath(); g.ellipse(0, -170, 10, 18, 0, 0, 6.283); g.fill(); g.restore();
  SK.grain(g, t, 0.06); };
