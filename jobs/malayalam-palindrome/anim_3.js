const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); document.fonts.load('80px Baloo'); } catch (e) {}
const ML_FONT = '"Noto", "Noto Sans Malayalam", sans-serif';
const bgL = () => layer(x => { const b = x.createRadialGradient(W / 2, H * 0.38, 40, W / 2, H * 0.38, H * 0.8); b.addColorStop(0, '#2a1630'); b.addColorStop(1, '#07040a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL();
const L = 'അആഇഈഉഊഋഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനപഫബഭമയരലവശഷസഹളഴറ'.split('');
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), n = Math.floor(ease.inOut(k) * L.length);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.font = `700 64px ${ML_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  const cols = 7, cw = 130, ch = 104, x0 = W / 2 - cw * 3, y0 = H * 0.12;
  L.forEach((ch2, i) => { const x = x0 + (i % cols) * cw, y = y0 + Math.floor(i / cols) * ch; const on = i < n, fresh = i >= n - 3 && on;
    g.fillStyle = on ? (fresh ? ACCENT : '#f5ecff') : 'rgba(245,236,255,0.08)'; g.fillText(ch2, x, y); });
  g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 10; g.beginPath(); g.arc(W / 2, H * 0.72, 60, -Math.PI / 2, -Math.PI / 2 + 6.283 * n / L.length); g.stroke();
};
