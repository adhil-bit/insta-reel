const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); } catch (e) {}
const MLF = '"Noto", "Noto Sans Malayalam", sans-serif';
const LET = 'അആഇഈഉഎഏഒകഗചജടഡതദനപബമയരലവസഹളഴറ'.split('');
const bgL = (a = '#1a2440', b = '#05070c') => layer(x => { const g = x.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H * 0.36, H * 0.8); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function skyline(x, base, col) { x.fillStyle = col; const B = [[40,180],[150,260],[260,200],[340,320],[420,220],[520,380],[600,240],[690,300],[780,210],[870,280],[960,190],[1040,230]];
  for (const [bx, h] of B) x.fillRect(bx - 40, base - h, 80, h); x.beginPath(); x.moveTo(520 - 30, base - 380); x.lineTo(520, base - 450); x.lineTo(520 + 30, base - 380); x.fill(); x.fillRect(516, base - 490, 8, 40); x.fillRect(504, base - 474, 32, 8); }
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL('#2a2014', '#060403');
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.9)), cyc = (t * 0.7) % 1, press = Math.max(0, Math.sin(cyc * Math.PI));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const cx = W / 2, py = H * 0.46;
  g.fillStyle = '#3a2a1a'; g.fillRect(cx - 360, H * 0.08, 40, py - H * 0.08 + 100); g.fillRect(cx + 320, H * 0.08, 40, py - H * 0.08 + 100); g.fillRect(cx - 360, H * 0.08, 720, 50);
  g.strokeStyle = '#8a7a6a'; g.lineWidth = 16; g.beginPath(); g.moveTo(cx, H * 0.08 + 50); g.lineTo(cx, py - 160 + press * 90); g.stroke();
  g.fillStyle = '#5a4a3a'; g.fillRect(cx - 260, py - 160 + press * 90, 520, 60);
  g.fillStyle = '#efe6d2'; g.fillRect(cx - 240, py - 40, 480, 300);
  const lines = Math.floor(k * 9); g.fillStyle = '#2a2018'; for (let i = 0; i < lines; i++) g.fillRect(cx - 210, py - 10 + i * 30, 300 + (i * 53) % 120, 12);
  if (press > 0.95) { g.strokeStyle = rgba(ACCENT, 0.8); g.lineWidth = 4; g.strokeRect(cx - 250, py - 50, 500, 320); } };
