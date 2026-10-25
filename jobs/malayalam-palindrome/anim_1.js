const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); document.fonts.load('80px Baloo'); } catch (e) {}
const ML_FONT = '"Noto", "Noto Sans Malayalam", sans-serif';
const bgL = () => layer(x => { const b = x.createRadialGradient(W / 2, H * 0.38, 40, W / 2, H * 0.38, H * 0.8); b.addColorStop(0, '#2a1630'); b.addColorStop(1, '#07040a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL(); const word = 'MALAYALAM';
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const y = H * 0.4, cw = 104, x0 = W / 2 - cw * 4;
  const pairs = Math.min(5, Math.floor(ease.inOut(k) * 5.99));
  g.font = '800 110px Inter, Arial, sans-serif'; g.textAlign = 'center';
  for (let i = 0; i < 9; i++) { const lit = Math.min(i, 8 - i) < pairs; g.fillStyle = lit ? ACCENT : 'rgba(245,236,255,0.55)'; g.fillText(word[i], x0 + i * cw, y); }
  for (let p = 0; p < pairs && p < 4; p++) { const a = x0 + p * cw, b = x0 + (8 - p) * cw; g.strokeStyle = rgba(ACCENT, 0.7); g.lineWidth = 4;
    g.beginPath(); g.moveTo(a, y + 30); g.quadraticCurveTo((a + b) / 2, y + 120 + p * 40, b, y + 30); g.stroke(); }
  const sw = (t * 0.6) % 2, sx = sw < 1 ? lerp(x0 - 80, x0 + 8 * cw + 80, sw) : lerp(x0 + 8 * cw + 80, x0 - 80, sw - 1);
  const gr = g.createLinearGradient(sx - 80, 0, sx + 80, 0); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.18)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(sx - 80, y - 130, 160, 170);
};
