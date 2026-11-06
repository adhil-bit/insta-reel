const c = makeCanvas(), g = c.getContext('2d');
const MG = (() => {
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), ease = k => 1 - Math.pow(1 - cl(k), 3);
  const pop = k => { k = cl(k); const s = 1.70158 * 1.4; return k === 0 ? 0 : 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2); };
  const RD = '#ff4d4d', GOLD = '#ffc94a', CREAM = '#fff4dc';
  function bg(g, t, hue = 0) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0d3b40'); gr.addColorStop(0.55, '#0a2a33'); gr.addColorStop(1, '#071a22'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const bl = [[180, 700, 260, '#19d3b0'], [900, 1150, 320, '#ffb347'], [620, 520, 200, '#3fa9f5'], [260, 1350, 220, '#ff6b6b']];
    bl.forEach(([x, y, r, col], i) => { const xx = x + Math.sin(t * 0.5 + i) * 40, yy = y + Math.cos(t * 0.4 + i * 2) * 30; const rg = g.createRadialGradient(xx, yy, 0, xx, yy, r); rg.addColorStop(0, col + '33'); rg.addColorStop(1, col + '00'); g.fillStyle = rg; g.fillRect(xx - r, yy - r, 2 * r, 2 * r); });
    g.save(); for (let i = 0; i < 26; i++) { const x = (i * 211 + t * 18 * (1 + i % 3)) % W, y = 560 + ((i * 97) % 820) + Math.sin(t + i) * 12; g.globalAlpha = 0.18; g.fillStyle = ['#ffc94a', '#19d3b0', '#ff6b6b'][i % 3]; g.beginPath(); if (i % 2) g.arc(x, y, 6, 0, 6.283); else g.rect(x - 5, y - 5, 10, 10); g.fill(); } g.restore(); }
  function shadow(g, x, y, rx, a = 0.35) { g.save(); g.globalAlpha = a; g.fillStyle = '#000'; g.beginPath(); g.ellipse(x, y, rx, rx * 0.18, 0, 0, 6.283); g.fill(); g.restore(); }
  function porotta(g, x, y, r, rot = 0, a = 1) { if (a <= 0 || r <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(rot); g.scale(1, 0.92);
    const rg = g.createRadialGradient(-r * 0.2, -r * 0.25, r * 0.1, 0, 0, r); rg.addColorStop(0, '#ffe7a6'); rg.addColorStop(0.7, '#f2b84b'); rg.addColorStop(1, '#c9832a'); g.fillStyle = rg; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill();
    g.strokeStyle = 'rgba(140,80,20,0.55)'; g.lineWidth = Math.max(2, r * 0.035); g.lineCap = 'round'; g.beginPath(); for (let q = 0; q <= 4.2 * 6.283; q += 0.12) { const rr = r * 0.08 + r * 0.85 * q / (4.2 * 6.283); g.lineTo(rr * Math.cos(q), rr * Math.sin(q)); } g.stroke();
    g.fillStyle = 'rgba(120,60,15,0.45)'; for (let i = 0; i < 9; i++) { const q = i * 2.4, rr = r * (0.3 + (i * 37 % 60) / 100); g.beginPath(); g.ellipse(rr * Math.cos(q), rr * Math.sin(q), r * 0.06, r * 0.035, q, 0, 6.283); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.ellipse(-r * 0.35, -r * 0.45, r * 0.3, r * 0.1, -0.5, 0, 6.283); g.fill(); g.restore(); }
  function beef(g, x, y, s = 1, t = 0, a = 1, steam = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
    for (let i = 0; i < 3 && steam > 0; i++) { g.save(); g.globalAlpha = a * 0.5 * steam; g.strokeStyle = '#fff'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); for (let k = 0; k <= 20; k++) { const yy = -40 - k * 7, xx = -60 + i * 60 + Math.sin(k * 0.5 + t * 4 + i) * 10; k ? g.lineTo(xx, yy - ((t * 30) % 14)) : g.moveTo(xx, yy); } g.stroke(); g.restore(); }
    g.fillStyle = '#5a2412'; g.beginPath(); g.ellipse(0, 0, 165, 40, 0, 0, 6.283); g.fill();
    const ch = [[-90, -12], [-35, -26], [25, -14], [80, -24], [-60, 10], [5, 6], [60, 8], [110, -2], [-120, 2]]; ch.forEach(([cx, cy], i) => { g.fillStyle = i % 2 ? '#7a3417' : '#943f1b'; g.beginPath(); g.ellipse(cx, cy, 30, 20, i, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,200,150,0.25)'; g.beginPath(); g.ellipse(cx - 8, cy - 7, 10, 5, i, 0, 6.283); g.fill(); });
    g.fillStyle = '#2f9e44'; [[-70, -30], [45, -32], [95, 12]].forEach(([lx, ly], i) => { g.beginPath(); g.ellipse(lx, ly, 22, 8, 0.6 + i, 0, 6.283); g.fill(); });
    const bw = g.createLinearGradient(0, 0, 0, 120); bw.addColorStop(0, '#d9643a'); bw.addColorStop(1, '#8f3016'); g.fillStyle = bw; g.beginPath(); g.moveTo(-185, 0); g.bezierCurveTo(-170, 130, 170, 130, 185, 0); g.closePath(); g.fill();
    g.strokeStyle = '#f4a26b'; g.lineWidth = 8; g.beginPath(); g.ellipse(0, 0, 185, 30, 0, 0, 3.1416); g.stroke(); g.restore(); }
  function badge(g, t, x, y, k, o = {}) { if (k <= 0) return; const s = pop(k); g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.08); g.scale(s, s); g.font = `800 ${o.size ?? 64}px Baloo, Inter`; const w = g.measureText(t).width + 70, h = (o.size ?? 64) * 1.45;
    g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.roundRect(-w / 2 + 8, -h / 2 + 10, w, h, h / 2); g.fill(); g.fillStyle = o.bg ?? RD; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, h / 2); g.fill();
    g.fillStyle = o.col ?? '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
  function bubble(g, t, x, y, k, o = {}) { if (k <= 0) return; const s = pop(k); g.save(); g.translate(x, y); g.scale(s, s); g.font = `800 ${o.size ?? 58}px Baloo, Inter`; const w = g.measureText(t).width + 80, h = (o.size ?? 58) * 1.9, tx = o.tail ?? -w / 4;
    g.fillStyle = '#fff'; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 40); g.fill(); g.beginPath(); g.moveTo(tx - 25, h / 2 - 2); g.lineTo(tx - 45, h / 2 + 55); g.lineTo(tx + 25, h / 2 - 2); g.fill();
    g.fillStyle = o.col ?? '#0a2a33'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
  function guy(g, x, y, s = 1, t = 0, o = {}) { g.save(); g.translate(x, y); g.scale(s * (o.flip ? -1 : 1), s); const sk = '#b9784a', talk = o.talk ? Math.abs(Math.sin(t * 9)) : 0, arm = o.arm ?? 0;
    shadow(g, 0, 0, 120, 0.3);
    g.fillStyle = '#f6f1e4'; g.beginPath(); g.moveTo(-70, -250); g.lineTo(70, -250); g.lineTo(95, 0); g.lineTo(-95, 0); g.fill(); g.fillStyle = '#e0b84a'; g.fillRect(-95, -14, 190, 12);
    g.fillStyle = '#2b2b2b'; g.fillRect(-60, 0, 45, 12); g.fillRect(15, 0, 45, 12);
    g.fillStyle = '#3fa9f5'; g.beginPath(); g.roundRect(-80, -460, 160, 230, 40); g.fill();
    g.strokeStyle = '#3fa9f5'; g.lineWidth = 42; g.lineCap = 'round'; g.beginPath(); g.moveTo(-70, -420); g.lineTo(-110, -300); g.stroke();
    g.save(); g.translate(70, -420); g.rotate(-0.4 - arm * 1.9); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 120); g.stroke(); g.fillStyle = sk; g.beginPath(); g.arc(0, 135, 24, 0, 6.283); g.fill(); g.restore();
    g.fillStyle = sk; g.beginPath(); g.arc(-112, -290, 22, 0, 6.283); g.fill(); g.fillRect(-18, -490, 36, 40);
    g.beginPath(); g.ellipse(0, -560, 78, 88, 0, 0, 6.283); g.fill(); g.fillStyle = '#1b1b1b'; g.beginPath(); g.ellipse(0, -615, 82, 44, 0, 3.1, 6.35); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(-28, -570, 15, 0, 6.283); g.arc(28, -570, 15, 0, 6.283); g.fill(); g.fillStyle = '#1b1b1b'; g.beginPath(); g.arc(-25 + (o.look ?? 0) * 6, -568, 8, 0, 6.283); g.arc(31 + (o.look ?? 0) * 6, -568, 8, 0, 6.283); g.fill();
    g.strokeStyle = '#1b1b1b'; g.lineWidth = 6; g.beginPath(); g.moveTo(-45, -598 - (o.brow ?? 0) * 10); g.lineTo(-12, -592); g.moveTo(45, -598 - (o.brow ?? 0) * 10); g.lineTo(12, -592); g.stroke();
    g.fillStyle = '#1b1b1b'; g.beginPath(); g.ellipse(-18, -527, 22, 9, 0.25, 0, 6.283); g.ellipse(18, -527, 22, 9, -0.25, 0, 6.283); g.fill();
    g.fillStyle = '#7a1f1f'; g.beginPath(); g.ellipse(0, -505, 18, 4 + talk * 12 + (o.grin ? 8 : 0), 0, 0, 6.283); g.fill(); g.restore(); }
  function dhow(g, x, y, s = 1, t = 0) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 2) * 0.04);
    g.fillStyle = '#7a4a26'; g.beginPath(); g.moveTo(-190, -10); g.lineTo(200, -40); g.quadraticCurveTo(150, 70, 0, 70); g.quadraticCurveTo(-150, 70, -190, -10); g.fill(); g.fillStyle = '#5a3418'; g.fillRect(-150, 20, 300, 10);
    g.strokeStyle = '#3b2412'; g.lineWidth = 10; g.beginPath(); g.moveTo(0, -20); g.lineTo(0, -300); g.stroke();
    g.fillStyle = CREAM; g.beginPath(); g.moveTo(-20, -320); g.quadraticCurveTo(170, -210, 150, -50); g.lineTo(-150, -40); g.closePath(); g.fill(); g.strokeStyle = '#d8c7a0'; g.lineWidth = 4; g.stroke();
    g.fillStyle = RD; g.beginPath(); g.moveTo(0, -300); g.lineTo(60, -285 + Math.sin(t * 6) * 6); g.lineTo(0, -270); g.fill(); g.restore(); }
  function waves(g, top, t, cols = ['#1e8fb5', '#1a7aa0', '#15668a', '#105273']) { cols.forEach((col, i) => { const y0 = top + i * 70; g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 20) g.lineTo(x, y0 + Math.sin(x / 90 + t * (1.5 + i * 0.3) + i) * 14); g.lineTo(W, H); g.fill(); }); }
  function pin(g, x, y, k, col = RD, sc = 1) { if (k <= 0) return; const drop = (1 - ease(k)) * -300, s = pop(k) * sc; g.save(); g.translate(x, y + drop); g.scale(s, s);
    g.fillStyle = 'rgba(0,0,0,0.3)'; g.beginPath(); g.ellipse(0, 4, 26, 8, 0, 0, 6.283); g.fill(); g.fillStyle = col; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-55, -70, -50, -130, 0, -132); g.bezierCurveTo(50, -130, 55, -70, 0, 0); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(0, -88, 20, 0, 6.283); g.fill(); g.restore(); }
  function label(g, t, x, y, a, o = {}) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = `800 ${o.size ?? 50}px Baloo, Inter`; g.textAlign = o.align ?? 'center'; g.fillStyle = o.col ?? '#fff'; g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 10; g.fillText(t, x, y + (1 - ease(a)) * 20); g.restore(); }
  const KX = lon => 300 + (lon - 74.9) * 190, KY = lat => 585 + (12.8 - lat) * 172;
  const KER = [[74.98,12.78],[75.08,12.45],[75.2,12.1],[75.37,11.85],[75.55,11.6],[75.75,11.3],[75.85,11.0],[75.95,10.7],[76.05,10.4],[76.18,10.05],[76.27,9.7],[76.35,9.3],[76.5,9.0],[76.6,8.85],[76.85,8.55],[77.08,8.3],[77.18,8.33],[77.2,8.7],[77.15,9.0],[77.2,9.4],[77.25,9.8],[77.15,10.2],[76.85,10.45],[76.85,10.8],[76.6,11.25],[76.4,11.6],[76.05,11.85],[75.8,12.1],[75.55,12.4],[75.2,12.7],[74.98,12.78]].map(([a, b]) => [KX(a), KY(b)]);
  function kpath(g, dx = 0, dy = 0) { g.beginPath(); KER.forEach(([x, y], i) => i ? g.lineTo(x + dx, y + dy) : g.moveTo(x + dx, y + dy)); g.closePath(); }
  function kmap(g, a, fillTo = null, glowNorth = 0) { if (a <= 0) return; g.save(); g.globalAlpha = a; for (let d = 18; d > 0; d -= 3) { kpath(g, d * 0.6, d); g.fillStyle = '#04141a'; g.fill(); }
    kpath(g); const gr = g.createLinearGradient(0, 580, 0, 1380); gr.addColorStop(0, '#2bb673'); gr.addColorStop(1, '#1d8a57'); g.fillStyle = gr; g.fill();
    if (glowNorth > 0) { g.save(); kpath(g); g.clip(); g.globalAlpha = a * glowNorth; g.fillStyle = '#19d3b0'; g.fillRect(0, 0, W, KY(10.75)); g.restore(); }
    if (fillTo !== null) { g.save(); kpath(g); g.clip(); const gg = g.createLinearGradient(0, 580, 0, fillTo); gg.addColorStop(0, '#ffd166'); gg.addColorStop(1, '#f2a93b'); g.fillStyle = gg; g.beginPath(); g.moveTo(0, 0); for (let x = 0; x <= W; x += 20) g.lineTo(x, fillTo + Math.sin(x / 40 + fillTo / 30) * 8); g.lineTo(W, 0); g.fill(); g.restore(); }
    kpath(g); g.strokeStyle = '#e8fff4'; g.lineWidth = 5; g.stroke(); g.restore(); }
  return { cl, ease, pop, RD, GOLD, CREAM, bg, shadow, porotta, beef, badge, bubble, guy, dhow, waves, pin, label, KX, KY, kmap };
})();
window.renderFrame = function (t) { const D = DURATION, M = MG; M.bg(g, t);
  const k1 = 1, y1 = 930 - Math.sin(M.cl(t / 0.6) * Math.PI) * 60;
  M.shadow(g, 320, 1110, 170 * k1); M.porotta(g, 320, y1, 190 * (0.85 + 0.15 * M.pop(M.cl(t / 0.5))), t * 0.6, 1);
  const k2 = 0.75 + 0.25 * M.ease(M.cl(t / 0.6)); M.shadow(g, 760 + (1 - k2) * 600, 1110, 170, 0.35 * k2); M.beef(g, 760 + (1 - k2) * 600, 1000, 1, t, 1, k2);
  M.label(g, '+', 545, 960, 1, { size: 120 });
  M.badge(g, 'ട്രോൾ!', 790, 720, M.cl((t - D * 0.28) / 0.35), { size: 70, rot: 0.1 });
  M.pin(g, 540, 1330, M.cl((t - D * 0.55) / 0.45), M.RD, 1); M.label(g, 'KOZHIKODE', 540, 1380, M.cl((t - D * 0.65) / 0.3), { size: 46 });
  M.label(g, '?', 800, 1330, M.cl((t - D * 0.75) / 0.25), { size: 170, col: M.GOLD });
};
