const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); } catch (e) {}
const MLF = '"Noto", "Noto Sans Malayalam", sans-serif';
const LET = 'അആഇഈഉഎഏഒകഗചജടഡതദനപബമയരലവസഹളഴറ'.split('');
const bgL = (a = '#1a2440', b = '#05070c') => layer(x => { const g = x.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H * 0.36, H * 0.8); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function skyline(x, base, col) { x.fillStyle = col; const B = [[40,180],[150,260],[260,200],[340,320],[420,220],[520,380],[600,240],[690,300],[780,210],[870,280],[960,190],[1040,230]];
  for (const [bx, h] of B) x.fillRect(bx - 40, base - h, 80, h); x.beginPath(); x.moveTo(520 - 30, base - 380); x.lineTo(520, base - 450); x.lineTo(520 + 30, base - 380); x.fill(); x.fillRect(516, base - 490, 8, 40); x.fillRect(504, base - 474, 32, 8); }
const c = makeCanvas(), g = c.getContext('2d'); const base = H * 0.56;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, base); s.addColorStop(0, '#0a1024'); s.addColorStop(1, '#3a3050'); x.fillStyle = s; x.fillRect(0, 0, W, H); skyline(x, base, '#0a0a12'); x.fillStyle = '#0a0a12'; x.fillRect(0, base, W, H); });
const lan = Array.from({length: 40}, () => ({x: rand() * W, d: rand(), ch: LET[Math.floor(rand() * LET.length)], s: 40 + rand() * 40}));
window.renderFrame = function (t) { g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (let i = 0; i < 14; i++) { const wx = 60 + (i * 77) % 960, wy = base - 60 - (i * 53) % 200; g.fillStyle = 'rgba(255,214,140,0.7)'; g.fillRect(wx, wy, 14, 18); }
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const l of lan) { const u = (t * 0.08 + l.d) % 1, y = lerp(base, H * 0.04, u), a = Math.sin(u * Math.PI);
    g.font = `700 ${l.s}px ${MLF}`; g.shadowColor = ACCENT; g.shadowBlur = 20; g.fillStyle = rgba('#FFE2A8', a); g.fillText(l.ch, l.x + Math.sin(t + l.d * 9) * 20, y); }
  g.shadowBlur = 0; };
