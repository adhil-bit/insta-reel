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
const cx = W / 2, cy = H * 0.36, R = 300;
const bg = layer(x => { const b = x.createRadialGradient(cx, cy, 40, cx, cy, H * 0.8); b.addColorStop(0, '#13222a'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const burst = Array.from({length: 60}, () => ({a: rand() * 6.283, d: 0.3 + rand() * 0.9, c: BLUES[Math.floor(rand() * 4)], s: 0.8 + rand() * 1.2}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9)), years = Math.min(12, Math.floor(k / 0.7 * 12));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (let i = 0; i < 12; i++) { const a0 = -Math.PI / 2 + i / 12 * 6.283 + 0.03, a1 = a0 + 6.283 / 12 - 0.06;
    g.strokeStyle = i < years ? (i === 11 ? '#8a7af5' : '#3a8a4a') : 'rgba(200,210,220,0.15)'; g.lineWidth = 46; g.beginPath(); g.arc(cx, cy, R, a0, a1); g.stroke(); }
  g.fillStyle = '#2f6a34'; g.beginPath(); g.ellipse(cx, cy + 40, 60, 26, 0, 0, 6.283); g.fill();
  g.strokeStyle = '#3a6a3a'; g.lineWidth = 10; g.beginPath(); g.moveTo(cx, cy + 40); g.lineTo(cx, cy - 60); g.stroke();
  const b = ease.out(clamp((k - 0.7) / 0.25));
  if (b > 0) for (const p of burst) flower(g, cx + Math.cos(p.a) * R * 0.85 * p.d * b, cy + Math.sin(p.a) * R * 0.85 * p.d * b, p.s * b, b, p.c);
  fadeBottom(g);
};
