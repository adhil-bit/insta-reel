const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); } catch (e) {}
const MLF = '"Noto", "Noto Sans Malayalam", sans-serif';
const LET = 'അആഇഈഉഎഏഒകഗചജടഡതദനപബമയരലവസഹളഴറ'.split('');
const bgL = (a = '#1a2440', b = '#05070c') => layer(x => { const g = x.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H * 0.36, H * 0.8); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function skyline(x, base, col) { x.fillStyle = col; const B = [[40,180],[150,260],[260,200],[340,320],[420,220],[520,380],[600,240],[690,300],[780,210],[870,280],[960,190],[1040,230]];
  for (const [bx, h] of B) x.fillRect(bx - 40, base - h, 80, h); x.beginPath(); x.moveTo(520 - 30, base - 380); x.lineTo(520, base - 450); x.lineTo(520 + 30, base - 380); x.fill(); x.fillRect(516, base - 490, 8, 40); x.fillRect(504, base - 474, 32, 8); }
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL('#16261e', '#040806');
const houses = Array.from({length: 48}, (_, i) => ({x: 120 + (i % 8) * 120 + ((i >> 3) % 2) * 50, y: H * 0.14 + (i >> 3) * 120, at: rand()}));
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.85)), p = ease.inOut(k);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const h of houses) { const on = h.at < p; g.fillStyle = on ? '#f2c14e' : '#2a3a2e'; g.beginPath(); g.moveTo(h.x - 34, h.y); g.lineTo(h.x, h.y - 30); g.lineTo(h.x + 34, h.y); g.fill(); g.fillRect(h.x - 28, h.y, 56, 40);
    if (on) { const gl = g.createRadialGradient(h.x, h.y + 10, 4, h.x, h.y + 10, 60); gl.addColorStop(0, 'rgba(255,214,120,0.35)'); gl.addColorStop(1, 'rgba(255,214,120,0)'); g.fillStyle = gl; g.fillRect(h.x - 60, h.y - 50, 120, 120); } }
  g.strokeStyle = 'rgba(255,255,255,0.15)'; g.lineWidth = 18; g.beginPath(); g.arc(W / 2, H * 0.73, 80, 0, 6.283); g.stroke();
  g.strokeStyle = ACCENT; g.beginPath(); g.arc(W / 2, H * 0.73, 80, -Math.PI / 2, -Math.PI / 2 + 6.283 * p); g.stroke(); };
