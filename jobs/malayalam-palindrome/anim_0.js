const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); document.fonts.load('80px Baloo'); } catch (e) {}
const ML_FONT = '"Noto", "Noto Sans Malayalam", sans-serif';
const bgL = () => layer(x => { const b = x.createRadialGradient(W / 2, H * 0.38, 40, W / 2, H * 0.38, H * 0.8); b.addColorStop(0, '#2a1630'); b.addColorStop(1, '#07040a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL(); const word = 'MALAYALAM';
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), n = Math.min(9, Math.floor(ease.out(clamp(k * 1.6)) * 9.99));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.font = '800 128px Inter, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  const y = H * 0.4, shown = word.slice(0, n);
  const gl = g.createRadialGradient(W / 2, y - 40, 20, W / 2, y - 40, 520); gl.addColorStop(0, rgba(ACCENT, 0.3)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.fillStyle = '#f5ecff'; g.fillText(shown, W / 2, y);
  g.save(); g.translate(0, 2 * y + 30); g.scale(1, -1); g.globalAlpha = 0.35;
  for (let i = 0; i < 12; i++) { g.save(); g.beginPath(); g.rect(0, y - 120 + i * 12, W, 12); g.clip(); g.translate(Math.sin(t * 3 + i) * 6, 0); g.fillStyle = rgba(ACCENT, 1); g.fillText(shown, W / 2, y); g.restore(); }
  g.restore(); g.globalAlpha = 1;
  g.strokeStyle = rgba(ACCENT, 0.6); g.lineWidth = 3; g.beginPath(); g.moveTo(100, y + 18); g.lineTo(W - 100, y + 18); g.stroke();
};
