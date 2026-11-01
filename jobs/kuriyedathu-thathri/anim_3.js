const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#0e0a0a'; g.fillRect(0, 0, W, H); const cols = 8, rows = 8, cw = W * 0.8 / cols, ch = H * 0.5 / rows;
  for (let i = 0; i < 64; i++) { const cx = W * 0.1 + (i % cols) * cw + cw / 2, cy = H * 0.18 + Math.floor(i / cols) * ch + ch * 0.9; const out = clamp((k - 0.15 - (i / 64) * 0.6) / 0.08);
    g.fillStyle = `rgba(${Math.round(lerp(232, 70, out))},${Math.round(lerp(200, 60, out))},${Math.round(lerp(140, 60, out))},1)`; g.beginPath(); g.arc(cx, cy - ch * 0.6, ch * 0.16, 0, 6.283); g.fill(); g.fillRect(cx - ch * 0.16, cy - ch * 0.44, ch * 0.32, ch * 0.42);
    if (i === 27) { g.beginPath(); g.moveTo(cx - ch * 0.3, cy - ch * 0.66); g.quadraticCurveTo(cx, cy - ch * 1.15, cx + ch * 0.3, cy - ch * 0.66); g.fill(); } }
  SK.grain(g, t, 0.06); };
