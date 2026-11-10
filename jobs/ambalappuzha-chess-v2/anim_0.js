const c = makeCanvas(), g = c.getContext('2d');
const K = (() => {
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), ease = k => { k = cl(k); return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; };
  const GOLD = '#f2c14e';
  // one continuous camera across the reel: each scene eases from CAMS[i] to CAMS[i+1]
  const CAMS = [ {cx: 540, near: 1330, far: 930, w: 1000, p: 0.16, lit: 0},
                 {cx: 540, near: 1330, far: 930, w: 1000, p: 0.16, lit: 0},
                 {cx: 420, near: 1520, far: 820, w: 1900, p: 0.22, lit: 0},
                 {cx: 600, near: 1420, far: 900, w: 1500, p: 0.2, lit: 12},
                 {cx: 540, near: 1270, far: 1080, w: 560, p: 0.12, lit: 64},
                 {cx: 540, near: 1270, far: 1080, w: 560, p: 0.12, lit: 64},
                 {cx: 540, near: 1290, far: 1090, w: 520, p: 0.12, lit: 64} ];
  function cam(i, t, D) { const a = CAMS[i], b = CAMS[i + 1], k = ease(t / D), o = {}; for (const key in a) o[key] = a[key] + (b[key] - a[key]) * k; return o; }
  function P(C, u, v) { const s = 1 / (1 + C.p * v), s8 = 1 / (1 + C.p * 8); return [C.cx + (u - 4) * C.w / 8 * s, C.near - (C.near - C.far) * (1 - s) / (1 - s8)]; }
  function bg(g, t, warm = 0.5) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#07131b'); gr.addColorStop(0.6, '#0d2230'); gr.addColorStop(1, '#05090d'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const rg = g.createRadialGradient(540, 900, 50, 540, 900, 700); rg.addColorStop(0, `rgba(255,170,70,${0.28 * warm})`); rg.addColorStop(1, 'rgba(255,170,70,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    for (const x of [140, 940]) { g.fillStyle = '#0a1820'; g.fillRect(x - 40, 560, 80, 900); g.fillStyle = 'rgba(255,190,90,0.10)'; g.fillRect(x - 40, 560, 12, 900); } }
  function dust(g, t, a = 1) { g.save(); for (let i = 0; i < 40; i++) { const x = (i * 263 + t * 12 * (1 + i % 3)) % W, y = 560 + ((i * 157 - t * 20 * (1 + i % 2)) % 860 + 860) % 860; g.globalAlpha = a * (0.25 + 0.25 * Math.sin(t * 2 + i)); g.fillStyle = '#ffd98a'; g.beginPath(); g.arc(x, y, 2 + (i % 3), 0, 6.283); g.fill(); } g.restore(); }
  function board(g, C, t) { for (let v = 0; v < 8; v++) for (let u = 0; u < 8; u++) { const q = [P(C, u, v), P(C, u + 1, v), P(C, u + 1, v + 1), P(C, u, v + 1)]; g.beginPath(); q.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = (u + v) % 2 ? '#2a1d14' : '#c9a77a'; g.fill(); }
    const e = [P(C, 0, 0), P(C, 8, 0), P(C, 8, 8), P(C, 0, 8)]; g.strokeStyle = '#7a5530'; g.lineWidth = 6; g.beginPath(); e.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.stroke();
    const n = C.lit; for (let i = 63; i >= 0; i--) { if (i >= n) continue; const u = i % 8, v = Math.floor(i / 8), [x, y] = P(C, u + 0.5, v + 0.5), s = 1 / (1 + C.p * (v + 0.5)), sq = C.w / 8 * s;
      const a = cl(n - i); if (i < 4) { for (let k = 0; k < (1 << i); k++) { g.globalAlpha = a; g.fillStyle = GOLD; g.beginPath(); g.ellipse(x - sq * 0.22 + (k % 4) * sq * 0.14, y - sq * 0.05 + Math.floor(k / 4) * sq * 0.12, sq * 0.05, sq * 0.03, 0.4, 0, 6.283); g.fill(); } g.globalAlpha = 1; continue; }
      const h = Math.min(sq * 3.2, sq * 0.12 * (i - 2) * (1 + i / 18)), r = Math.min(sq * 0.48, sq * (0.18 + i * 0.012)); g.globalAlpha = a;
      const gr = g.createLinearGradient(0, y - h, 0, y); gr.addColorStop(0, '#fff1b8'); gr.addColorStop(1, '#d99a2b'); g.fillStyle = gr; g.beginPath(); g.moveTo(x - r, y); g.quadraticCurveTo(x - r * 0.6, y - h, x, y - h); g.quadraticCurveTo(x + r * 0.6, y - h, x + r, y); g.closePath(); g.fill();
      if (i > 20) { const rg = g.createRadialGradient(x, y - h * 0.5, 0, x, y - h * 0.5, h); rg.addColorStop(0, 'rgba(255,210,110,0.35)'); rg.addColorStop(1, 'rgba(255,210,110,0)'); g.fillStyle = rg; g.fillRect(x - h, y - h * 1.5, 2 * h, 2 * h); } g.globalAlpha = 1; } }
  function king(g, x, y, s, a = 1) { g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.fillStyle = '#04080b'; g.beginPath(); g.moveTo(-110, 0); g.quadraticCurveTo(-100, -260, 0, -280); g.quadraticCurveTo(100, -260, 110, 0); g.fill(); g.beginPath(); g.arc(0, -330, 55, 0, 6.283); g.fill();
    g.fillStyle = '#d9a527'; g.beginPath(); g.moveTo(-50, -370); g.lineTo(-50, -410); g.lineTo(-25, -385); g.lineTo(0, -425); g.lineTo(25, -385); g.lineTo(50, -410); g.lineTo(50, -370); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,180,80,0.5)'; g.lineWidth = 4; g.beginPath(); g.arc(0, -330, 56, -1.2, 0.6); g.stroke(); g.restore(); }
  function sage(g, x, y, s, a = 1, glow = 0) { g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); if (glow > 0) { const rg = g.createRadialGradient(0, -250, 10, 0, -250, 380); rg.addColorStop(0, `rgba(120,190,255,${0.55 * glow})`); rg.addColorStop(1, 'rgba(120,190,255,0)'); g.fillStyle = rg; g.fillRect(-400, -650, 800, 800); }
    g.fillStyle = '#04080b'; g.beginPath(); g.moveTo(-100, 0); g.quadraticCurveTo(-90, -240, 0, -260); g.quadraticCurveTo(90, -240, 100, 0); g.fill(); g.beginPath(); g.arc(0, -310, 50, 0, 6.283); g.fill(); g.beginPath(); g.arc(0, -370, 24, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(-30, -290); g.quadraticCurveTo(0, -200, 30, -290); g.fill(); if (glow > 0.3) { g.save(); g.globalAlpha = a * glow; g.fillStyle = '#2bb673'; g.beginPath(); g.ellipse(30, -400, 14, 40, 0.5, 0, 6.283); g.fill(); g.fillStyle = '#3b6fd8'; g.beginPath(); g.arc(36, -414, 10, 0, 6.283); g.fill(); g.restore(); } g.restore(); }
  function stamp(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = '800 46px Baloo'; const w = g.measureText(t).width + 50; g.strokeStyle = GOLD; g.lineWidth = 4; g.strokeRect(x - w / 2, y - 40, w, 80); g.fillStyle = GOLD; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, x, y + 3); g.restore(); }
  function big(g, t, x, y, size, col, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = `800 ${size}px Inter, Baloo`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 16; g.fillStyle = col; g.fillText(t, x, y); g.restore(); }
  function pot(g, x, y, s, t, a = 1) { g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); for (let i = 0; i < 3; i++) { g.save(); g.globalAlpha = a * 0.5; g.strokeStyle = '#fff'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); for (let k = 0; k <= 16; k++) { const yy = -150 - k * 9, xx = -50 + i * 50 + Math.sin(k * 0.5 + t * 3 + i) * 9; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore(); }
    const gr = g.createLinearGradient(0, -140, 0, 60); gr.addColorStop(0, '#e0a25a'); gr.addColorStop(1, '#7a4a20'); g.fillStyle = gr; g.beginPath(); g.ellipse(0, -20, 170, 120, 0, 0, 6.283); g.fill(); g.fillStyle = '#f5e6c4'; g.beginPath(); g.ellipse(0, -120, 120, 30, 0, 0, 6.283); g.fill(); g.strokeStyle = '#d9a527'; g.lineWidth = 8; g.beginPath(); g.ellipse(0, -120, 130, 34, 0, 0, 6.283); g.stroke(); g.restore(); }
  return { cl, ease, GOLD, cam, P, bg, dust, board, king, sage, stamp, big, pot };
})();
window.renderFrame = function (t) { const D = DURATION; K.bg(g, t, 0.9); const C = Object.assign({}, K.cam(0, t, D), { lit: 40 + 24 * K.cl(t / D) });
  K.board(g, C, t); K.king(g, 150, 1420, 0.9); K.sage(g, 930, 1420, 0.9, 1, 0); K.dust(g, t); K.pot(g, 540, 1440, 0.55, t, 1);
  K.stamp(g, 'അമ്പലപ്പുഴ', 540, 650, K.cl(t / 0.4)); K.big(g, '?', 540, 820, 150, K.GOLD, K.cl((t - D * 0.7) / 0.2));
};
