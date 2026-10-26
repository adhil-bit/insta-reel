const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
// invented abstract signs (NOT real letters): strokes, forks, circles, fish-like shapes
function sign(g, kind, x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath();
  switch (kind % 7) { case 0: g.moveTo(-12, -20); g.lineTo(-12, 20); g.moveTo(12, -20); g.lineTo(12, 20); g.moveTo(-12, 0); g.lineTo(12, 0); break; case 1: g.moveTo(0, 20); g.lineTo(0, -4); g.lineTo(-14, -22); g.moveTo(0, -4); g.lineTo(14, -22); break;
    case 2: g.arc(0, 0, 14, 0, 6.283); g.moveTo(0, -14); g.lineTo(0, -24); break; case 3: g.moveTo(-18, 0); g.quadraticCurveTo(0, -22, 18, 0); g.quadraticCurveTo(0, 22, -18, 0); g.moveTo(18, 0); g.lineTo(26, -8); g.moveTo(18, 0); g.lineTo(26, 8); break;
    case 4: g.moveTo(-14, -20); g.lineTo(14, 20); g.moveTo(14, -20); g.lineTo(-14, 20); break; case 5: g.moveTo(-16, -16); g.lineTo(16, -16); g.lineTo(16, 16); g.lineTo(-16, 16); g.closePath(); g.moveTo(0, -16); g.lineTo(0, 16); break;
    default: g.moveTo(-16, 20); g.lineTo(-16, -10); g.lineTo(0, -22); g.lineTo(16, -10); g.lineTo(16, 20); } g.stroke(); g.restore(); }
function bull(g, x, y, s, col = '#4a2e18') { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, 150, 70, 0, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(-150, -40, 50, 36, 0.3, 0, 6.283); g.fill();
  for (const lx of [-90, -40, 40, 90]) g.fillRect(lx - 10, 50, 20, 90); g.strokeStyle = col; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(-180, -70); g.quadraticCurveTo(-220, -170, -150, -220); g.stroke(); g.beginPath(); g.moveTo(150, -10); g.quadraticCurveTo(200, 10, 190, 60); g.stroke();
  g.lineWidth = 6; g.beginPath(); g.moveTo(-230, 20); g.lineTo(-230, 140); g.stroke(); g.beginPath(); g.arc(-230, 10, 22, 0, 6.283); g.stroke(); g.restore(); }
function seal(g, x, y, size, rot, t, kSigns = 1, lit = -1) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = '#8a6a44'; g.beginPath(); g.roundRect(-size / 2 + 10, -size / 2 + 10, size, size, size * 0.06); g.fill(); g.fillStyle = '#c9a678'; g.beginPath(); g.roundRect(-size / 2, -size / 2, size, size, size * 0.06); g.fill();
  bull(g, 0, size * 0.12, size / 720); for (let i = 0; i < 6; i++) { const col = i === lit ? ACCENT : '#4a2e18'; if (i < kSigns * 6) sign(g, i, -size * 0.36 + i * size * 0.145, -size * 0.33, size / 720 * 1.6, col); } g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.globalAlpha = 1; g.fillStyle = '#120d0a'; g.fillRect(0, 0, W, H); const sp = g.createRadialGradient(W * 0.1, 0, 50, W * 0.2, H * 0.2, 1300); sp.addColorStop(0, `rgba(255,210,140,${0.15 + 0.3 * k})`); sp.addColorStop(1, 'rgba(255,210,140,0)'); g.fillStyle = sp; g.fillRect(0, 0, W, H);
  const r = ease.out(clamp((k - 0.15) / (0.8 / DURATION))); g.strokeStyle = '#e8c060'; g.lineWidth = 14; g.beginPath(); g.arc(W / 2, H * 0.45, 420, -Math.PI / 2, -Math.PI / 2 + 6.283 * r); g.stroke();
  if (r >= 1) for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + t * 0.4; g.fillStyle = '#f2d27a'; g.beginPath(); g.arc(W / 2 + Math.cos(a) * 420, H * 0.45 + Math.sin(a) * 420, 16, 0, 6.283); g.fill(); g.fillStyle = '#b08a2a'; g.beginPath(); g.arc(W / 2 + Math.cos(a) * 420, H * 0.45 + Math.sin(a) * 420, 7, 0, 6.283); g.fill(); }
  seal(g, W / 2, H * 0.45, 576, 0.05, t, 1, -1);
  if (k > 0.85) { g.globalAlpha = 0.3 + 0.3 * Math.sin(t * 3); g.save(); g.translate(W / 2, H * 0.45); for (let i = 0; i < 6; i++) sign(g, i, -576 * 0.36 + i * 576 * 0.145, -576 * 0.33 + 70, 1.3, ACCENT); g.restore(); g.globalAlpha = 1; } };
