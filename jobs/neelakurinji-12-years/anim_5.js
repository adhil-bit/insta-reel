const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function hills(x, base, amp, f, ph, col) { x.fillStyle = col; x.beginPath(); x.moveTo(0, H); for (let X = 0; X <= W; X += 12) x.lineTo(X, base - amp * (0.6 * Math.sin(X * f + ph) + 0.4 * Math.sin(X * f * 2.7 + ph * 2))); x.lineTo(W, H); x.fill(); }
function ridgeY(X, base, amp, f, ph) { return base - amp * (0.6 * Math.sin(X * f + ph) + 0.4 * Math.sin(X * f * 2.7 + ph * 2)); }
function flower(g, x, y, s, a, col) {             // small bell-shaped kurinji flower cluster
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = a;
  for (let i = 0; i < 5; i++) { const an = i / 5 * 6.283; g.fillStyle = col; g.beginPath(); g.ellipse(Math.cos(an) * 10, Math.sin(an) * 10, 9, 14, an, 0, 6.283); g.fill(); }
  g.fillStyle = '#f5f0ff'; g.beginPath(); g.arc(0, 0, 5, 0, 6.283); g.fill(); g.restore(); g.globalAlpha = 1;
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const BLUES = ['#7b6cf0', '#5b6ee8', '#9a7cf2', '#6a5ae0'];
const c = makeCanvas(), g = c.getContext('2d');
const ly = H * 0.36, x0 = W * 0.12, x1 = W * 0.88;
const bg = layer(x => { const b = x.createRadialGradient(W / 2, ly, 40, W / 2, ly, H * 0.8); b.addColorStop(0, '#1a1c34'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const marks = [0.15, 0.5, 0.85];
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), d = ease.inOut(clamp(k * 1.3));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.strokeStyle = 'rgba(200,210,230,0.5)'; g.lineWidth = 8; g.beginPath(); g.moveTo(x0, ly); g.lineTo(lerp(x0, x1, d), ly); g.stroke();
  marks.forEach((m, i) => { const x = lerp(x0, x1, m); if (d < m) return; const last = i === 2;
    if (!last) for (let j = 0; j < 6; j++) { const a = j / 6 * 6.283; flower(g, x + Math.cos(a) * 34, ly - 110 + Math.sin(a) * 34, 1.3, 1, BLUES[j % 4]); }
    else { const p = (t * 0.8) % 1; g.strokeStyle = rgba(ACCENT, 1 - p); g.lineWidth = 6; g.beginPath(); g.arc(x, ly - 110, 30 + p * 90, 0, 6.283); g.stroke();
      g.setLineDash([10, 10]); g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 4; g.beginPath(); g.arc(x, ly - 110, 50, 0, 6.283); g.stroke(); g.setLineDash([]); }
    g.fillStyle = last ? ACCENT : '#c8c0ff'; g.beginPath(); g.arc(x, ly, 22, 0, 6.283); g.fill(); });
  fadeBottom(g);
};
