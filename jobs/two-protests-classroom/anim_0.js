function sepia(g) { g.fillStyle = 'rgba(112,66,20,0.28)'; g.fillRect(0, 0, W, H); }
function desk(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#5a3a22'; g.fillRect(-160, -20, 320, 24); g.fillRect(-150, 4, 14, 120); g.fillRect(136, 4, 14, 120); g.fillStyle = '#efe4c8'; g.save(); g.rotate(-0.06); g.fillRect(-70, -60, 140, 40); g.restore(); g.fillStyle = '#2a2a30'; g.fillRect(-120, -48, 40, 28); g.restore(); }
function roach(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); const sh = g.createLinearGradient(0, -34, 0, 34); sh.addColorStop(0, '#a0622e'); sh.addColorStop(0.5, '#6a3a1a'); sh.addColorStop(1, '#3a1e0c'); g.fillStyle = sh; g.beginPath(); g.ellipse(0, 0, 60, 34, 0, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(30,14,4,0.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-58, 0); g.lineTo(40, 0); g.stroke(); g.fillStyle = 'rgba(255,230,190,0.35)'; g.beginPath(); g.ellipse(-8, -16, 30, 7, -0.1, 0, 6.283); g.fill(); g.fillStyle = '#3a1e0c'; g.beginPath(); g.arc(64, 0, 20, 0, 6.283); g.fill();
  g.strokeStyle = '#3a1e0c'; g.lineWidth = 5; for (const sd of [-1, 1]) { for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-30 + i * 30, sd * 26); g.lineTo(-44 + i * 30 + Math.sin(t * 8 + i) * 6, sd * 62); g.stroke(); } g.beginPath(); g.moveTo(76, sd * 8); g.quadraticCurveTo(120, sd * 30, 150, sd * 70); g.stroke(); } g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#c8a878'; g.fillRect(0, 0, W / 2, H); SK.ground(g, H * 0.66, '#8a6a44', '#4a3422'); g.save(); g.beginPath(); g.rect(0, 0, W / 2, H); g.clip(); SK.crowd(g, W * 0.02, W * 0.48, H * 0.66, 6, 260, t, '#3a2414'); sepia(g); g.restore();
  g.save(); g.beginPath(); g.rect(W / 2, 0, W / 2, H); g.clip(); g.fillStyle = '#0e1024'; g.fillRect(W / 2, 0, W / 2, H); SK.crowd(g, W * 0.52, W * 0.98, H * 0.66, 6, 260, t, '#05060c');
  for (let i = 0; i < 6; i++) { const x = W * (0.55 + i * 0.075), y = H * 0.66 - 300 - (i % 2) * 20; g.fillStyle = `rgba(120,200,255,${0.6 + 0.4 * Math.sin(t * 3 + i)})`; g.fillRect(x, y, 22, 36); } g.restore();
  g.fillStyle = '#efe4c8'; g.fillRect(W / 2 - 3, 0, 6, H); desk(g, W / 2, H * 0.72, 1.2 * (0.9 + 0.1 * ease.out(clamp(k * 2))));
  const cr = ease.out(clamp(k / 0.4)), sx = lerp(-160, W / 2, cr), sy = H * 0.285;      // the party's own symbol, crawling in above the claim
  const glow = g.createRadialGradient(sx, sy, 20, sx, sy, 260); glow.addColorStop(0, rgba(ACCENT, 0.35)); glow.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = glow; g.fillRect(sx - 260, sy - 260, 520, 520);
  g.save(); g.translate(sx, sy); g.rotate(cr < 1 ? 0 : Math.sin(t * 2) * 0.04); g.translate(-sx, -sy); roach(g, sx - 30, sy, 1.7, cr < 1 ? t : t * 0.3); g.restore();
  SK.grain(g, t, 0.07); };
