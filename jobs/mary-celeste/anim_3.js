const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function seaSky(g, t, top = '#3a4a5a', mid = '#8a98a6') { const s = g.createLinearGradient(0, 0, 0, H * 0.5); s.addColorStop(0, top); s.addColorStop(1, mid); g.fillStyle = s; g.fillRect(0, 0, W, H * 0.5);
  for (let i = 0; i < 6; i++) { const y = H * 0.5 + i * 60, amp = 8 + i; const c1 = `rgb(${42 - i * 5},${63 - i * 7},${85 - i * 9})`; g.fillStyle = c1; g.beginPath(); g.moveTo(-10, H); g.lineTo(-10, y); for (let x = -10; x <= W + 10; x += 12) g.lineTo(x, y + Math.sin(x / 140 + t * 1.2 + i) * amp); g.lineTo(W + 10, H); g.fill(); } }
function ship(g, x, y, s, t, torn = true) { g.save(); g.translate(x, y + Math.sin(t * 1.2) * 8 * s); g.scale(s, s); g.rotate(Math.sin(t * 0.9) * 0.02);
  g.fillStyle = '#3a2416'; g.beginPath(); g.moveTo(-260, 0); g.lineTo(260, 0); g.lineTo(220, 60); g.lineTo(-230, 60); g.closePath(); g.fill(); g.fillStyle = '#5a3a22'; g.fillRect(-250, -14, 500, 14);
  for (const mx of [-110, 90]) { g.fillStyle = '#2a1a10'; g.fillRect(mx - 6, -330, 12, 320); for (let i = 0; i < 2; i++) { const sy = -300 + i * 130, sw = i ? 150 : 180; g.fillStyle = '#e8e2d2'; g.beginPath(); g.moveTo(mx - sw / 2, sy); g.lineTo(mx + sw / 2, sy); g.lineTo(mx + sw / 2 - 10 + Math.sin(t * 2) * 6, sy + 100); g.lineTo(mx - sw / 2 + (torn && i && mx > 0 ? 30 : 0), sy + 100); g.fill(); } }
  g.restore(); }
function rain(g, t) { g.strokeStyle = 'rgba(220,230,240,0.25)'; g.lineWidth = 2; for (let i = 0; i < 30; i++) { const x = (i * 97 + t * 200) % (W + 100) - 50, y = (i * 163 + t * 900) % H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6, y + 40); g.stroke(); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), x = ease.inOut(clamp((k - 0.5) / (0.4 / DURATION)));
  g.globalAlpha = 1;
  if (x < 1) { g.globalAlpha = 1 - x; seaSky(g, t, '#2a3a4a', '#6a7886'); g.fillStyle = '#3a2416'; g.fillRect(0, H * 0.5, W, H * 0.2); g.fillStyle = '#5a3a22'; g.fillRect(0, H * 0.48, W, 24);
    for (const dx of [W * 0.35, W * 0.65]) { g.strokeStyle = '#8a8f98'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(dx, H * 0.5); g.lineTo(dx, H * 0.3); g.quadraticCurveTo(dx, H * 0.22, dx + 70, H * 0.24); g.stroke();
      g.strokeStyle = '#c8b89a'; g.lineWidth = 4; g.beginPath(); g.moveTo(dx + 70, H * 0.24); g.lineTo(dx + 70 + Math.sin(t * 2) * 14, H * 0.42); g.stroke(); }
    const p = (t * 1.2) % 1; g.strokeStyle = rgba(ACCENT, 0.5 + 0.5 * Math.sin(t * 4)); g.lineWidth = 4; g.setLineDash([16, 12]); g.beginPath(); g.ellipse(W / 2, H * 0.4, 170, 50, 0, 0, 6.283); g.stroke(); g.setLineDash([]); g.globalAlpha = 1; }
  if (x > 0) { g.globalAlpha = x; const push = 1 + 0.06 * clamp((k - 0.55) / 0.45); g.save(); g.translate(W / 2, H * 0.45); g.scale(push, push); g.fillStyle = '#1a1a1e'; g.fillRect(-W / 2, -H / 2, W, H);
    g.fillStyle = '#e8dcc0'; g.fillRect(-360, -240, 350, 480); g.fillRect(10, -240, 350, 480); g.fillStyle = '#c8b89a'; g.fillRect(-8, -240, 16, 480);
    g.strokeStyle = '#2a2420'; g.lineWidth = 3; for (let i = 0; i < 8; i++) { const w = i === 7 ? 120 : 280; g.beginPath(); for (let s = 0; s <= w; s += 6) { const px = -330 + s, py = -190 + i * 50 + Math.sin(s * 0.5 + i) * 5; s ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }
    if (k > 0.85) { g.fillStyle = 'rgba(30,25,20,0.7)'; g.beginPath(); g.arc(60, 40, 22, 0, 6.283); g.fill(); } g.restore(); g.globalAlpha = 1; } };
