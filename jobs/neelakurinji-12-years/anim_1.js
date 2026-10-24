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
const bg = layer(x => { const b = x.createRadialGradient(W / 2, H * 0.35, 50, W / 2, H * 0.35, H * 0.8); b.addColorStop(0, '#1c2a3a'); b.addColorStop(1, '#04060a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const heads = Array.from({length: 7}, (_, i) => ({ang: -1.2 + i * 0.4, len: 260 + (i % 3) * 60}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const bx = W / 2, by = H * 0.62, sway = Math.sin(t * 1.2) * 0.05;
  for (const h of heads) { const a = -Math.PI / 2 + h.ang * 0.6 + sway, ex = bx + Math.cos(a) * h.len, ey = by + Math.sin(a) * h.len;
    g.strokeStyle = '#3a6a3a'; g.lineWidth = 8; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + Math.cos(a) * h.len * 0.5 + 20, by + Math.sin(a) * h.len * 0.5, ex, ey); g.stroke();
    g.fillStyle = '#2f5a30'; g.beginPath(); g.ellipse(bx + Math.cos(a) * h.len * 0.55, by + Math.sin(a) * h.len * 0.55, 40, 14, a + 0.6, 0, 6.283); g.fill();
    const open = ease.out(clamp(k * 1.6 - Math.abs(h.ang) * 0.2));
    for (let j = 0; j < 6; j++) { const fa = j / 6 * 6.283; flower(g, ex + Math.cos(fa) * 30 * open, ey + Math.sin(fa) * 30 * open, 1.4 * open + 0.01, open, BLUES[j % 4]); }
    flower(g, ex, ey, 1.6 * open + 0.01, open, '#8a7af5'); }
  const gl = g.createRadialGradient(W / 2, H * 0.3, 40, W / 2, H * 0.3, 420); gl.addColorStop(0, rgba(ACCENT, 0.15 * k)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  fadeBottom(g);
};
