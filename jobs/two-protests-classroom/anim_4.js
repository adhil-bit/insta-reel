function sepia(g) { g.fillStyle = 'rgba(112,66,20,0.28)'; g.fillRect(0, 0, W, H); }
function desk(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#5a3a22'; g.fillRect(-160, -20, 320, 24); g.fillRect(-150, 4, 14, 120); g.fillRect(136, 4, 14, 120); g.fillStyle = '#efe4c8'; g.save(); g.rotate(-0.06); g.fillRect(-70, -60, 140, 40); g.restore(); g.fillStyle = '#2a2a30'; g.fillRect(-120, -48, 40, 28); g.restore(); }
function roach(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#6a3a1a'; g.beginPath(); g.ellipse(0, 0, 60, 34, 0, 0, 6.283); g.fill(); g.fillStyle = '#3a1e0c'; g.beginPath(); g.arc(64, 0, 20, 0, 6.283); g.fill();
  g.strokeStyle = '#3a1e0c'; g.lineWidth = 5; for (const sd of [-1, 1]) { for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-30 + i * 30, sd * 26); g.lineTo(-44 + i * 30 + Math.sin(t * 8 + i) * 6, sd * 62); g.stroke(); } g.beginPath(); g.moveTo(76, sd * 8); g.quadraticCurveTo(120, sd * 30, 150, sd * 70); g.stroke(); } g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), fly = ease.inOut(clamp((k - 0.35) / 0.5));
  SK.sky(g, 'dusk', 0.66); g.fillStyle = '#140c18'; g.fillRect(0, H * 0.66, W, H);
  g.fillStyle = '#1e1622'; g.fillRect(W * 0.2, H * 0.42, W * 0.6, H * 0.24); g.beginPath(); g.ellipse(W / 2, H * 0.42, W * 0.16, H * 0.07, 0, Math.PI, 0); g.fill(); for (let i = 0; i < 8; i++) { g.fillStyle = '#2a2230'; g.fillRect(W * (0.23 + i * 0.07), H * 0.46, 22, H * 0.2); }
  SK.crowd(g, W * 0.02, W * 0.98, H * 0.72, 11, 220, t, '#06040a');
  g.save(); g.translate(lerp(W * 0.5, W * 0.82, fly), lerp(H * 0.5, H * 0.18, fly)); g.rotate(fly * 1.4); g.fillStyle = '#f2ede0'; g.fillRect(-90, -60, 180, 120); g.fillStyle = '#6a5a44'; for (let i = 0; i < 4; i++) g.fillRect(-70, -40 + i * 24, 140 - i * 20, 8); g.restore();
  SK.grain(g, t, 0.07); };
