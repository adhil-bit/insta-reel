const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); } catch (e) {}
const MLF = '"Noto", "Noto Sans Malayalam", sans-serif';
const LET = 'അആഇഈഉഎഏഒകഗചജടഡതദനപബമയരലവസഹളഴറ'.split('');
const bgL = (a = '#1a2440', b = '#05070c') => layer(x => { const g = x.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H * 0.36, H * 0.8); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function skyline(x, base, col) { x.fillStyle = col; const B = [[40,180],[150,260],[260,200],[340,320],[420,220],[520,380],[600,240],[690,300],[780,210],[870,280],[960,190],[1040,230]];
  for (const [bx, h] of B) x.fillRect(bx - 40, base - h, 80, h); x.beginPath(); x.moveTo(520 - 30, base - 380); x.lineTo(520, base - 450); x.lineTo(520 + 30, base - 380); x.fill(); x.fillRect(516, base - 490, 8, 40); x.fillRect(504, base - 474, 32, 8); }
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL('#1e2a3a', '#05070c');
const papers = Array.from({length: 14}, (_, i) => ({x: rand() * W, d: rand(), r: (rand() - 0.5) * 1.2}));
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const stack = Math.floor(ease.out(k) * 12);
  for (let i = 0; i < stack; i++) { g.fillStyle = i % 2 ? '#efe6d2' : '#e2d8c2'; g.fillRect(W / 2 - 200 + (i % 3) * 4, H * 0.58 - i * 18, 400, 16); }
  for (const p of papers) { const u = (t * 0.25 + p.d) % 1; g.save(); g.translate(p.x + Math.sin(u * 6) * 80, lerp(-100, H * 0.5, u)); g.rotate(p.r + u * 2);
    g.fillStyle = '#efe6d2'; g.fillRect(-90, -60, 180, 120); g.fillStyle = '#2a2018'; g.fillRect(-76, -46, 152, 18); for (let j = 0; j < 4; j++) g.fillRect(-76, -18 + j * 16, 120, 6); g.restore(); }
  g.font = `800 120px ${MLF}`; g.textAlign = 'center'; g.fillStyle = rgba(ACCENT, 0.25 + 0.2 * Math.sin(t * 2)); g.fillText('അ', W / 2, H * 0.24); };
