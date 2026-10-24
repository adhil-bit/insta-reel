const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function ridge(x, base, amp, f, ph) { return base - amp * (0.6 * Math.sin(x * f + ph) + 0.3 * Math.sin(x * f * 2.3 + ph * 1.7) + 0.1 * Math.sin(x * f * 5.1)); }
function hill(g, base, amp, f, ph, fill, shift = 0) {
  g.fillStyle = fill; g.beginPath(); g.moveTo(0, H);
  for (let x = 0; x <= W; x += 10) g.lineTo(x, ridge(x + shift, base, amp, f, ph));
  g.lineTo(W, H); g.closePath(); g.fill();
}
function puff(g, x, y, r, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, `rgba(220,225,235,${a})`); gr.addColorStop(1, 'rgba(220,225,235,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); }
// a small hill-railway steam engine with tea wagons, facing right; (x, y) = rail level under the engine
function train(g, x, y, s, t, lamp, smokeT) {
  g.save(); g.translate(x, y); g.scale(s, s);
  for (let w = 1; w <= 3; w++) {                      // wagons with tea sacks
    const wx = -w * 120;
    g.fillStyle = '#4a3423'; g.fillRect(wx - 50, -58, 100, 40);
    g.fillStyle = '#7a5a3a'; for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(wx - 30 + i * 30, -64, 16, 11, 0, 0, 6.283); g.fill(); }
    g.fillStyle = '#151515'; for (const d of [-30, 30]) { g.beginPath(); g.arc(wx + d, -12, 12, 0, 6.283); g.fill(); }
    g.fillStyle = '#2a2a2a'; g.fillRect(wx - 60, -24, 10, 4);
  }
  g.fillStyle = '#23272e'; g.fillRect(-58, -96, 46, 76);               // cab
  g.fillStyle = '#3a414c'; g.fillRect(-66, -104, 62, 10);
  g.fillStyle = lamp ? '#ffd27a' : '#5a6270'; g.fillRect(-48, -86, 24, 20);   // cab window
  g.fillStyle = '#2f353f'; g.beginPath(); g.roundRect(-14, -74, 96, 50, 22); g.fill();   // boiler
  g.fillStyle = '#1c2026'; g.fillRect(52, -110, 18, 40);              // chimney
  g.fillRect(46, -116, 30, 8);
  g.fillStyle = '#151515'; for (const d of [-36, 6, 46]) { g.beginPath(); g.arc(d, -14, 16, 0, 6.283); g.fill();
    g.strokeStyle = '#555'; g.lineWidth = 3; const a = t * 6; g.beginPath(); g.moveTo(d, -14); g.lineTo(d + Math.cos(a) * 12, -14 + Math.sin(a) * 12); g.stroke(); }
  if (lamp) { g.fillStyle = '#ffe9a8'; g.beginPath(); g.arc(86, -54, 9, 0, 6.283); g.fill(); }
  g.restore();
  if (lamp) {                                          // headlamp beam
    const bx = x + 86 * s, by = y - 54 * s;
    const gr = g.createRadialGradient(bx, by, 0, bx, by, 260 * s);
    gr.addColorStop(0, rgba(ACCENT, 0.55 * lamp)); gr.addColorStop(1, rgba(ACCENT, 0));
    g.fillStyle = gr; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + 300 * s, by - 90 * s); g.lineTo(bx + 300 * s, by + 90 * s); g.closePath(); g.fill();
  }
  for (let i = 0; i < 7; i++) {                       // smoke trail drifting back
    const p = ((smokeT * 0.9) + i / 7) % 1;
    puff(g, x + (61 - p * 260) * s, y - (118 + p * 140) * s, (16 + p * 60) * s, 0.5 * (1 - p));
  }
}
const c = makeCanvas(), g = c.getContext('2d');
const deckY = H * 0.36, L = W * 0.08, R = W * 0.92;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#06080d'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#1a1d1a'; x.beginPath(); x.moveTo(0, deckY); x.lineTo(L + 20, deckY); x.lineTo(L + 120, H); x.lineTo(0, H); x.fill();
  x.beginPath(); x.moveTo(W, deckY); x.lineTo(R - 20, deckY); x.lineTo(R - 120, H); x.lineTo(W, H); x.fill(); });
const segs = 8, segW = (R - L) / segs;
const pieces = Array.from({length: segs}, (_, i) => ({i, spin: (rand() - 0.5) * 2.4, drift: (rand() - 0.5) * 120, delay: Math.abs(i - 3.5) * 0.05}));
const drops = Array.from({length: 300}, () => ({x: rand() * W, y: rand() * H, s: 0.8 + rand() * 0.5}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const wy = lerp(H * 0.62, H * 0.45, ease.inOut(clamp(k * 1.3)));
  const brk = clamp((k - 0.4) / 0.5);
  pieces.forEach(p => {
    const f = clamp((brk - p.delay) * 1.6), fall = f * f;
    if (f > 0 && (p.i === 0 || p.i === segs - 1)) return;   // end segments break off first and vanish
    const x0 = L + p.i * segW;
    g.save(); g.translate(x0 + segW / 2 + p.drift * f, deckY + fall * (wy - deckY + 220)); g.rotate(p.spin * f);
    g.globalAlpha = 1 - clamp((f - 0.7) * 3);
    g.fillStyle = '#3a2c20'; g.fillRect(-segW / 2, 0, segW + 1, 16);
    g.strokeStyle = '#9aa0aa'; g.lineWidth = 4; g.beginPath(); g.moveTo(-segW / 2, 0); g.lineTo(segW / 2, 0); g.stroke();
    g.strokeStyle = '#4b3a28'; g.lineWidth = 6;              // trestle legs
    g.beginPath(); g.moveTo(-segW / 2, 16); g.lineTo(0, 160); g.lineTo(segW / 2, 16); g.moveTo(-segW / 4, 90); g.lineTo(segW / 4, 90); g.stroke();
    g.restore();
  });
  // flood
  g.globalAlpha = 1;
  const wv = x => wy + Math.sin(x * 0.015 + t * 4) * 12 + Math.sin(x * 0.04 - t * 6) * 5;
  const wg = g.createLinearGradient(0, wy, 0, H * 0.82); wg.addColorStop(0, '#6a5034'); wg.addColorStop(1, '#07060a');
  g.fillStyle = wg; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 12) g.lineTo(x, wv(x)); g.lineTo(W, H); g.fill();
  g.strokeStyle = rgba(ACCENT, 0.8); g.lineWidth = 4; g.beginPath(); for (let x = 0; x <= W; x += 12) x ? g.lineTo(x, wv(x)) : g.moveTo(x, wv(x)); g.stroke();
  g.strokeStyle = 'rgba(255,240,220,0.25)'; g.lineWidth = 3;
  for (let i = 0; i < 14; i++) { const x = ((i * 90 + t * 300) % (W + 200)) - 100; g.beginPath(); g.moveTo(x, wv(x) + 30); g.lineTo(x + 50, wv(x) + 34); g.stroke(); }
  g.strokeStyle = 'rgba(170,190,220,0.35)'; g.lineWidth = 2; g.beginPath();
  for (const d of drops) { const y = (d.y + t * 1300 * d.s) % H; g.moveTo(d.x - y * 0.15, y); g.lineTo(d.x - y * 0.15 - 6, y + 34); } g.stroke();
};
