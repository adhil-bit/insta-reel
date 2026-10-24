const c = makeCanvas(), g = c.getContext('2d');
const bgL = document.createElement('canvas'); bgL.width = W; bgL.height = H;
(() => { const x = bgL.getContext('2d'); const b = x.createRadialGradient(W/2, H*0.36, 0, W/2, H*0.36, H*0.8);
  b.addColorStop(0, '#13233a'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H); })();
const motes = Array.from({length: 120}, () => ({x: rand() * W, y: rand() * H * 0.75, p: rand() * 6.28, r: rand() * 2 + 0.6}));

function helix(cx, y0, y1, phase, alpha, scale) {
  const n = 26, amp = 120 * scale;
  for (let i = 0; i < n; i++) {
    const y = lerp(y0, y1, i / (n - 1)), a = phase + i * 0.42;
    const x1 = cx + Math.sin(a) * amp, x2 = cx - Math.sin(a) * amp;
    const z = Math.cos(a);
    g.globalAlpha = alpha * (0.35 + 0.35 * Math.abs(z));
    g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 5 * scale;
    g.beginPath(); g.moveTo(x1, y); g.lineTo(x2, y); g.stroke();
    for (const [x, zz] of [[x1, z], [x2, -z]]) {
      g.globalAlpha = alpha * (0.45 + 0.55 * (zz + 1) / 2);
      g.fillStyle = zz > 0 ? '#dce8ff' : '#7f93b8';
      g.beginPath(); g.arc(x, y, (9 + 5 * zz) * scale, 0, 6.283); g.fill();
    }
  }
  g.globalAlpha = 1;
}

window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bgL, 0, 0);
  for (const m of motes) { g.globalAlpha = 0.2 + 0.2 * Math.sin(m.p + t * 2); g.fillStyle = '#9fb6e0';
    g.fillRect(m.x, m.y, m.r, m.r); }
  const phase = t * 1.6;                       // all copies spin in lockstep
  const split = ease.inOut(clamp(k * 1.25));
  const spread = 300 * split, scale = 1 - 0.38 * split;
  const y0 = H * 0.1, y1 = H * 0.62;
  if (split > 0.02) {
    helix(W / 2 - spread, y0, y1, phase, 0.85 * split, scale);
    helix(W / 2 + spread, y0, y1, phase, 0.85 * split, scale);
  }
  helix(W / 2, y0, y1, phase, 1, scale);
};
