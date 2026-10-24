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
const sky = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.5); s.addColorStop(0, '#5a7ab8'); s.addColorStop(1, '#d8d4ec'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
function mix(a, b, t) { return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; }
const ridges = [[H * 0.3, 90, 0.003, 2, [70, 110, 90], [120, 110, 210]], [H * 0.37, 80, 0.004, 4, [50, 95, 70], [100, 90, 200]], [H * 0.44, 70, 0.005, 1, [40, 80, 56], [90, 80, 190]], [H * 0.52, 60, 0.006, 3, [30, 66, 46], [80, 70, 175]]];
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(sky, 0, 0);
  ridges.forEach(([b, a, f, ph, c1, c2], i) => hills(g, b, a, f, ph + t * 0.02, mix(c1, c2, ease.inOut(clamp(k * 1.6 - (3 - i) * 0.18)))));
  fadeBottom(g);
};
