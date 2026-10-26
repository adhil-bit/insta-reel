const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function seaSky(g, t, top = '#3a4a5a', mid = '#8a98a6') { const s = g.createLinearGradient(0, 0, 0, H * 0.5); s.addColorStop(0, top); s.addColorStop(1, mid); g.fillStyle = s; g.fillRect(0, 0, W, H * 0.5);
  for (let i = 0; i < 6; i++) { const y = H * 0.5 + i * 60, amp = 8 + i; const c1 = `rgb(${42 - i * 5},${63 - i * 7},${85 - i * 9})`; g.fillStyle = c1; g.beginPath(); g.moveTo(-10, H); g.lineTo(-10, y); for (let x = -10; x <= W + 10; x += 12) g.lineTo(x, y + Math.sin(x / 140 + t * 1.2 + i) * amp); g.lineTo(W + 10, H); g.fill(); } }
function ship(g, x, y, s, t, torn = true) { g.save(); g.translate(x, y + Math.sin(t * 1.2) * 8 * s); g.scale(s, s); g.rotate(Math.sin(t * 0.9) * 0.02);
  g.fillStyle = '#3a2416'; g.beginPath(); g.moveTo(-260, 0); g.lineTo(260, 0); g.lineTo(220, 60); g.lineTo(-230, 60); g.closePath(); g.fill(); g.fillStyle = '#5a3a22'; g.fillRect(-250, -14, 500, 14);
  for (const mx of [-110, 90]) { g.fillStyle = '#2a1a10'; g.fillRect(mx - 6, -330, 12, 320); for (let i = 0; i < 2; i++) { const sy = -300 + i * 130, sw = i ? 150 : 180; g.fillStyle = '#e8e2d2'; g.beginPath(); g.moveTo(mx - sw / 2, sy); g.lineTo(mx + sw / 2, sy); g.lineTo(mx + sw / 2 - 10 + Math.sin(t * 2) * 6, sy + 100); g.lineTo(mx - sw / 2 + (torn && i && mx > 0 ? 30 : 0), sy + 100); g.fill(); } }
  g.restore(); }
function rain(g, t) { g.strokeStyle = 'rgba(220,230,240,0.25)'; g.lineWidth = 2; for (let i = 0; i < 30; i++) { const x = (i * 97 + t * 200) % (W + 100) - 50, y = (i * 163 + t * 900) % H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6, y + 40); g.stroke(); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), fog = clamp((k - 0.2) / 0.7) * 0.8, s = lerp(1.0, 0.7, k);
  g.globalAlpha = 1; seaSky(g, t, '#1a2030', '#3a4556'); ship(g, W / 2 + k * 220, H * 0.5, s, t);
  for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(230,235,240,${fog * (0.5 + 0.5 * Math.sin(i))})`; g.beginPath(); g.ellipse(W + 200 - fog * (W + 600) + (i % 4) * 300, H * 0.3 + (i * 97) % 500, 420, 120, 0, 0, 6.283); g.fill(); }
  if (k > 0.9) { g.fillStyle = `rgba(255,214,120,${0.5 + 0.5 * Math.sin(t * 6)})`; g.beginPath(); g.arc(W * 0.2, H * 0.49, 5, 0, 6.283); g.fill(); } };
