const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); document.fonts.load('80px Baloo'); } catch (e) {}
const ML_FONT = '"Noto", "Noto Sans Malayalam", sans-serif';
const bgL = () => layer(x => { const b = x.createRadialGradient(W / 2, H * 0.38, 40, W / 2, H * 0.38, H * 0.8); b.addColorStop(0, '#2a1630'); b.addColorStop(1, '#07040a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL();
const bubbles = Array.from({length: 22}, () => ({x: 90 + rand() * (W - 180), y: H * (0.12 + rand() * 0.5), r: 40 + rand() * 40, p: rand() * 6}));
function bubble(x, y, r, fill) { g.fillStyle = fill; g.beginPath(); g.ellipse(x, y, r * 1.4, r, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(x - r * 0.4, y + r * 0.7); g.lineTo(x - r * 0.9, y + r * 1.4); g.lineTo(x, y + r * 0.85); g.fill(); }
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), hi = ease.out(clamp((k - 0.35) * 2.5));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const b of bubbles) { g.globalAlpha = 0.55 - 0.3 * hi; bubble(b.x, b.y + Math.sin(t + b.p) * 8, b.r, '#6a5a74'); }
  g.globalAlpha = 1;
  if (hi > 0) { const s = 0.6 + 0.4 * hi, x = W / 2, y = H * 0.38;
    const gl = g.createRadialGradient(x, y, 20, x, y, 420 * s); gl.addColorStop(0, rgba(ACCENT, 0.4)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
    bubble(x, y, 170 * s, '#f5ecff'); g.fillStyle = '#2a1630'; g.font = `800 ${Math.round(96 * s)}px ${ML_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('മലയാളം', x, y); }
};
