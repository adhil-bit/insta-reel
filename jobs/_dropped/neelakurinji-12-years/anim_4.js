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
const bg = layer(x => { const b = x.createLinearGradient(0, 0, 0, H); b.addColorStop(0, '#0e1824'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H);
  x.fillStyle = '#1a2a1e'; x.fillRect(0, H * 0.6, W, H); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), n = Math.min(5, Math.floor(ease.inOut(k) * 5.99));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const s = 0.6 + n * 0.12, fx = W * 0.3, fy = H * 0.6;
  g.fillStyle = '#d8dce6'; g.beginPath(); g.arc(fx, fy - 330 * s, 34 * s, 0, 6.283); g.fill(); g.beginPath(); g.roundRect(fx - 40 * s, fy - 290 * s, 80 * s, 170 * s, 24 * s); g.fill();
  g.fillRect(fx - 32 * s, fy - 125 * s, 26 * s, 125 * s); g.fillRect(fx + 6 * s, fy - 125 * s, 26 * s, 125 * s);
  for (let i = 0; i < 5; i++) { const x = W * 0.58 + (i % 3) * 140, y = H * 0.2 + Math.floor(i / 3) * 170, on = i < n;
    g.strokeStyle = on ? ACCENT : 'rgba(200,210,220,0.2)'; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 60, 0, 6.283); g.stroke();
    if (on) for (let j = 0; j < 5; j++) { const a = j / 5 * 6.283 + t * 0.3; flower(g, x + Math.cos(a) * 26, y + Math.sin(a) * 26, 1.1, 1, BLUES[j % 4]); } }
  fadeBottom(g);
};
