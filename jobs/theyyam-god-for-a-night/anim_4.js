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
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'night', 0.66); g.fillStyle = '#0c0806'; g.fillRect(0, H * 0.66, W, H); for (let i = 0; i < 4; i++) torch(g, W * (0.05 + i * 0.3), H * 0.66, t, 260);
  mudi(g, W * 0.72, H * 0.45, 190, t); SK.person(g, W * 0.72, H * 0.67, 420, 'stand', '#0a0604', t);
  for (let i = 0; i < 7; i++) { const x = W * 0.08 + i * 70, bow = ease.inOut(clamp((k - 0.3 - i * 0.03) / 0.3)) * 0.4; g.save(); g.translate(x, H * 0.67); g.rotate(bow); SK.person(g, 0, 0, 240 + (i % 2) * 20, i % 3 === 0 ? 'pray' : 'stand', '#0a0604', t + i); g.restore(); }
  SK.grain(g, t, 0.06); };
