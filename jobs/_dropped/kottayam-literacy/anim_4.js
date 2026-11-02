const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); } catch (e) {}
const MLF = '"Noto", "Noto Sans Malayalam", sans-serif';
const LET = 'അആഇഈഉഎഏഒകഗചജടഡതദനപബമയരലവസഹളഴറ'.split('');
const bgL = (a = '#1a2440', b = '#05070c') => layer(x => { const g = x.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H * 0.36, H * 0.8); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function skyline(x, base, col) { x.fillStyle = col; const B = [[40,180],[150,260],[260,200],[340,320],[420,220],[520,380],[600,240],[690,300],[780,210],[870,280],[960,190],[1040,230]];
  for (const [bx, h] of B) x.fillRect(bx - 40, base - h, 80, h); x.beginPath(); x.moveTo(520 - 30, base - 380); x.lineTo(520, base - 450); x.lineTo(520 + 30, base - 380); x.fill(); x.fillRect(516, base - 490, 8, 40); x.fillRect(504, base - 474, 32, 8); }
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL('#1e2a1a', '#040604');
const homes = Array.from({length: 10}, (_, i) => ({x: 120 + (i % 5) * 210, y: H * (0.2 + Math.floor(i / 5) * 0.24)}));
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.strokeStyle = '#4a3a2a'; g.lineWidth = 26; g.beginPath(); g.moveTo(0, H * 0.32); g.lineTo(W, H * 0.32); g.moveTo(0, H * 0.56); g.lineTo(W, H * 0.56); g.stroke();
  homes.forEach((h, i) => { const on = k > (i + 1) / 11; g.fillStyle = on ? '#f2c14e' : '#3a4a32'; g.beginPath(); g.moveTo(h.x - 60, h.y); g.lineTo(h.x, h.y - 50); g.lineTo(h.x + 60, h.y); g.fill(); g.fillRect(h.x - 50, h.y, 100, 70);
    if (on) { g.font = `700 40px ${MLF}`; g.textAlign = 'center'; g.fillStyle = '#2a1a0a'; g.fillText(LET[i], h.x, h.y + 50); } });
  const seg = k * 10, i = Math.min(9, Math.floor(seg)), f = seg - i, a = homes[i], b = homes[Math.min(9, i + 1)];
  const vx = lerp(a.x, b.x, f), vy = (i < 5 ? H * 0.32 : H * 0.56) + (i === 4 ? f * (H * 0.24) : 0);
  g.fillStyle = ACCENT; g.beginPath(); g.arc(vx, vy - 40, 18, 0, 6.283); g.fill(); g.fillRect(vx - 14, vy - 22, 28, 44); g.fillStyle = '#efe6d2'; g.fillRect(vx + 14, vy - 10, 22, 30); };
