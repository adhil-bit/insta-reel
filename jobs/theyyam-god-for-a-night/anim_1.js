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
window.renderFrame = function (t) { const k = clamp(t / DURATION), flip = clamp((k - 0.5) / 0.15);
  SK.sky(g, 'dusk', 0.6); for (let i = 0; i < 3; i++) { g.fillStyle = ['#2a1a30', '#1e1424', '#140c18'][i]; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 30) g.lineTo(x, H * (0.5 + i * 0.05) + Math.sin(x / 200 + i * 2) * 40); g.lineTo(W, H); g.fill(); }
  for (let i = 0; i < 4; i++) { const x = W * (0.2 + i * 0.2), b = Math.abs(Math.sin(t * 4 + i)); SK.person(g, x, H * 0.66, 300, 'stand', '#0a0604', t + i);
    g.fillStyle = '#0a0604'; g.beginPath(); g.ellipse(x + 40, H * 0.58 - b * 8, 46, 30, 0, 0, 6.283); g.fill(); g.strokeStyle = rgba(ACCENT, 0.6 * b); g.lineWidth = 3; g.beginPath(); g.arc(x + 40, H * 0.58, 50 + b * 40, 0, 6.283); g.stroke(); }
  const cx = W / 2, cy = H * 0.34; g.fillStyle = '#efe4c8'; g.fillRect(cx - 200, cy - 130, 400, 260); g.fillStyle = '#7a4a1a'; for (let i = 0; i < 4; i++) g.fillRect(cx - 160, cy - 80 + i * 40, 320 - i * 40, 10);
  if (flip > 0) { g.save(); g.translate(cx, cy - 130); g.transform(1, 0, 0, Math.abs(Math.cos(flip * Math.PI)), 0, 0); g.fillStyle = flip > 0.5 ? ACCENT : '#e2d6b8'; g.fillRect(-200, 0, 400, 260); g.restore(); }
  SK.grain(g, t, 0.06); };
