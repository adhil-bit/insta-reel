const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function seaSky(g, t, top = '#3a4a5a', mid = '#8a98a6') { const s = g.createLinearGradient(0, 0, 0, H * 0.5); s.addColorStop(0, top); s.addColorStop(1, mid); g.fillStyle = s; g.fillRect(0, 0, W, H * 0.5);
  for (let i = 0; i < 6; i++) { const y = H * 0.5 + i * 60, amp = 8 + i; const c1 = `rgb(${42 - i * 5},${63 - i * 7},${85 - i * 9})`; g.fillStyle = c1; g.beginPath(); g.moveTo(-10, H); g.lineTo(-10, y); for (let x = -10; x <= W + 10; x += 12) g.lineTo(x, y + Math.sin(x / 140 + t * 1.2 + i) * amp); g.lineTo(W + 10, H); g.fill(); } }
function ship(g, x, y, s, t, torn = true) { g.save(); g.translate(x, y + Math.sin(t * 1.2) * 8 * s); g.scale(s, s); g.rotate(Math.sin(t * 0.9) * 0.02);
  g.fillStyle = '#3a2416'; g.beginPath(); g.moveTo(-260, 0); g.lineTo(260, 0); g.lineTo(220, 60); g.lineTo(-230, 60); g.closePath(); g.fill(); g.fillStyle = '#5a3a22'; g.fillRect(-250, -14, 500, 14);
  for (const mx of [-110, 90]) { g.fillStyle = '#2a1a10'; g.fillRect(mx - 6, -330, 12, 320); for (let i = 0; i < 2; i++) { const sy = -300 + i * 130, sw = i ? 150 : 180; g.fillStyle = '#e8e2d2'; g.beginPath(); g.moveTo(mx - sw / 2, sy); g.lineTo(mx + sw / 2, sy); g.lineTo(mx + sw / 2 - 10 + Math.sin(t * 2) * 6, sy + 100); g.lineTo(mx - sw / 2 + (torn && i && mx > 0 ? 30 : 0), sy + 100); g.fill(); } }
  g.restore(); }
function rain(g, t) { g.strokeStyle = 'rgba(220,230,240,0.25)'; g.lineWidth = 2; for (let i = 0; i < 30; i++) { const x = (i * 97 + t * 200) % (W + 100) - 50, y = (i * 163 + t * 900) % H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6, y + 40); g.stroke(); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), push = 1 + 0.08 * ease.inOut(clamp((k - 0.6) / 0.4));
  g.globalAlpha = 1; g.save(); g.translate(W / 2, H / 2); g.scale(push, push); g.translate(-W / 2, -H / 2); seaSky(g, t); ship(g, W * 0.6, H * 0.48, 0.8, t);
  g.strokeStyle = '#6a4a2a'; g.lineWidth = 3; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(W * 0.6 - 200, H * 0.48 - 8 + i * 1.2); g.lineTo(W * 0.6 + 200, H * 0.48 - 8 + i * 1.2); g.stroke(); }
  g.strokeStyle = '#2a1a10'; g.lineWidth = 4; g.beginPath(); g.arc(W * 0.6 + 150, H * 0.48 - 30, 18, 0, 6.283); g.stroke(); g.restore();
  const open = clamp((k - 0.6) / 0.1); if (open < 1) { const cx = lerp(-200, W / 2, ease.inOut(clamp(k / 0.4))), r = lerp(260, 1400, open); g.save(); g.beginPath(); g.rect(0, 0, W, H); g.moveTo(cx - 60 + r, H * 0.46); g.arc(cx - 60, H * 0.46, r, 0, 6.283); g.moveTo(cx + 60 + r, H * 0.46); g.arc(cx + 60, H * 0.46, r, 0, 6.283); g.fillStyle = '#000'; g.fill('evenodd'); g.restore(); } };
