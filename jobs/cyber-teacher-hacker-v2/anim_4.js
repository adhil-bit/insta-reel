const c = makeCanvas(), g = c.getContext('2d');
const X = (() => {
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), ease = k => { k = cl(k); return 1 - Math.pow(1 - k, 3); }, RED = '#ff3b3b', CY = '#4fd1c5';
  function room(g, t, zoom = 1, red = 0) { g.save(); g.translate(540, 1100); g.scale(zoom, zoom); g.translate(-540, -1100);
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#05070d'); gr.addColorStop(0.55, '#0b1220'); gr.addColorStop(1, '#03050a'); g.fillStyle = gr; g.fillRect(-200, -200, W + 400, H + 400);
    g.fillStyle = '#0e1626'; g.fillRect(760, 600, 220, 360); g.strokeStyle = '#1d2a40'; g.lineWidth = 8; g.strokeRect(760, 600, 220, 360); g.beginPath(); g.moveTo(870, 600); g.lineTo(870, 960); g.moveTo(760, 780); g.lineTo(980, 780); g.stroke();
    g.fillStyle = 'rgba(120,160,255,0.06)'; g.fillRect(760, 600, 220, 360);
    g.fillStyle = '#121a28'; g.fillRect(-200, 1250, W + 400, 40); g.fillStyle = '#0a0f18'; g.fillRect(-200, 1290, W + 400, 600); g.restore(); }
  function phone(g, x, y, s, t, a = 1, screen = null) { g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
    const rg = g.createRadialGradient(0, -40, 10, 0, -40, 420); rg.addColorStop(0, 'rgba(110,170,255,0.35)'); rg.addColorStop(1, 'rgba(110,170,255,0)'); g.fillStyle = rg; g.fillRect(-420, -460, 840, 840);
    g.fillStyle = '#05080e'; g.beginPath(); g.roundRect(-110, -220, 220, 440, 30); g.fill(); g.strokeStyle = '#2a3550'; g.lineWidth = 6; g.stroke();
    const sg = g.createLinearGradient(0, -200, 0, 200); sg.addColorStop(0, '#1d4f8f'); sg.addColorStop(1, '#0d2340'); g.fillStyle = sg; g.beginPath(); g.roundRect(-96, -200, 192, 400, 20); g.fill();
    if (screen) screen(g, t); g.restore(); }
  function shadow(g, x, y, s, t, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y + Math.sin(t * 1.3) * 6); g.scale(s, s); g.fillStyle = 'rgba(0,0,0,0.85)'; g.beginPath(); g.ellipse(0, 0, 130, 150, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(-260, 380); g.quadraticCurveTo(-230, 130, 0, 120); g.quadraticCurveTo(230, 130, 260, 380); g.fill();
    g.beginPath(); g.moveTo(-150, -20); g.quadraticCurveTo(0, -260, 150, -20); g.quadraticCurveTo(0, -120, -150, -20); g.fill();
    const blink = Math.sin(t * 2.2) > 0.96 ? 0.2 : 1; for (const ex of [-45, 45]) { const rg = g.createRadialGradient(ex, 10, 0, ex, 10, 40); rg.addColorStop(0, 'rgba(255,60,60,0.95)'); rg.addColorStop(1, 'rgba(255,60,60,0)'); g.fillStyle = rg; g.fillRect(ex - 40, -30, 80, 80); g.fillStyle = '#ff6a6a'; g.globalAlpha = a * blink; g.beginPath(); g.ellipse(ex, 10, 16, 7 * blink, 0, 0, 6.283); g.fill(); g.globalAlpha = a; } g.restore(); }
  function glitch(g, t, a = 0.6) { g.save(); for (let i = 0; i < 6; i++) { const ph = Math.floor(t * 9 + i * 13.7); if ((ph * 7919) % 11 > 3) continue; const y = 560 + ((ph * 104729) % 820), h = 4 + (ph % 9); g.globalAlpha = a * 0.5; g.fillStyle = (ph % 2) ? 'rgba(255,59,59,0.6)' : 'rgba(79,209,197,0.5)'; g.fillRect(((ph * 31) % 200) - 100, y, W, h); } g.globalAlpha = a * 0.06; g.fillStyle = '#fff'; for (let y = 560; y < 1400; y += 6) g.fillRect(0, y, W, 1); g.restore(); }
  function stamp(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = '800 46px Baloo, Inter'; const w = g.measureText(t).width + 50; g.strokeStyle = RED; g.lineWidth = 4; g.strokeRect(x - w / 2, y - 40, w, 80); g.fillStyle = RED; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, x, y + 3); g.restore(); }
  function txt(g, t, x, y, size, col, a, font = 'Baloo, Inter') { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = '800 ' + size + 'px ' + font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(0,0,0,0.85)'; g.shadowBlur = 14; g.fillStyle = col; g.fillText(t, x, y); g.restore(); }
  return { cl, ease, RED, CY, room, phone, shadow, glitch, stamp, txt };
})();
window.renderFrame = function (t) { const D = DURATION; X.room(g, t, 1.0);
  const a1 = X.cl(t / 0.4); g.save(); g.globalAlpha = a1; g.translate(540, 760); g.fillStyle = X.CY; g.beginPath(); g.roundRect(-70, -40, 140, 120, 18); g.fill(); g.strokeStyle = X.CY; g.lineWidth = 18; g.beginPath(); g.arc(0, -40, 50, Math.PI, 0); g.stroke(); g.fillStyle = '#04121a'; g.beginPath(); g.arc(0, 15, 16, 0, 6.283); g.fill(); g.restore();
  X.txt(g, 'ടു-സ്റ്റെപ്പ് ON', 540, 920, 66, '#ffffff', a1);
  const k = X.ease(X.cl((t - D * 0.45) / 0.3)); if (k > 0) { g.save(); g.globalAlpha = k; g.translate(540, 1140); g.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k); g.fillStyle = X.CY; g.beginPath(); g.roundRect(-260, -100, 520, 200, 50); g.fill(); g.fillStyle = '#04121a'; g.font = '900 130px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('1930', 0, 8); g.restore(); }
};
