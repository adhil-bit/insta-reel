const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); } catch (e) {}
const MLF = '"Noto", "Noto Sans Malayalam", sans-serif';
const LET = 'അആഇഈഉഎഏഒകഗചജടഡതദനപബമയരലവസഹളഴറ'.split('');
const bgL = (a = '#1a2440', b = '#05070c') => layer(x => { const g = x.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H * 0.36, H * 0.8); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function skyline(x, base, col) { x.fillStyle = col; const B = [[40,180],[150,260],[260,200],[340,320],[420,220],[520,380],[600,240],[690,300],[780,210],[870,280],[960,190],[1040,230]];
  for (const [bx, h] of B) x.fillRect(bx - 40, base - h, 80, h); x.beginPath(); x.moveTo(520 - 30, base - 380); x.lineTo(520, base - 450); x.lineTo(520 + 30, base - 380); x.fill(); x.fillRect(516, base - 490, 8, 40); x.fillRect(504, base - 474, 32, 8); }
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL('#2a2016', '#060403');
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.9)), w = ease.inOut(clamp(k * 1.3));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const fx = W * 0.3, fy = H * 0.52;
  g.fillStyle = '#e8e2d8'; g.beginPath(); g.arc(fx, fy - 330, 60, 0, 6.283); g.fill(); g.fillStyle = '#cfc8bc'; g.beginPath(); g.arc(fx, fy - 360, 50, Math.PI, 0); g.fill();
  g.fillStyle = '#f2f0ea'; g.beginPath(); g.moveTo(fx - 110, fy); g.lineTo(fx - 80, fy - 260); g.lineTo(fx + 80, fy - 260); g.lineTo(fx + 120, fy); g.fill();
  g.fillStyle = '#c8a46a'; g.beginPath(); g.ellipse(fx + 130, fy - 150, 60, 22, -0.4, 0, 6.283); g.fill();
  g.fillStyle = '#2a2a2e'; g.fillRect(W * 0.46, fy - 330, 420, 300); g.strokeStyle = '#8a6a3a'; g.lineWidth = 18; g.strokeRect(W * 0.46, fy - 330, 420, 300);
  g.save(); g.beginPath(); g.rect(W * 0.46, fy - 330, 420 * w, 300); g.clip(); g.font = `700 140px ${MLF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#f2f0ea'; g.fillText('അ ആ', W * 0.46 + 210, fy - 180); g.restore();
  const gl = g.createRadialGradient(W * 0.46 + 210, fy - 180, 20, W * 0.46 + 210, fy - 180, 380); gl.addColorStop(0, rgba(ACCENT, 0.25 * w)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H); };
