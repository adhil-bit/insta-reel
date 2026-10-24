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
const trackY = H * 0.47;
const sky = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.6); s.addColorStop(0, '#0b1424'); s.addColorStop(1, '#2c3c3a'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
window.renderFrame = function (t) {
  const k = clamp(t / DURATION);
  g.globalAlpha = 1; g.drawImage(sky, 0, 0);
  hill(g, H * 0.3, 110, 0.003, 2, '#1d2a35', t * 15);
  hill(g, H * 0.36, 90, 0.005, 4, '#1c3326', t * 40);
  // tea estate slope with curved rows
  hill(g, H * 0.42, 60, 0.004, 1, '#1f4a2a', t * 80);
  g.strokeStyle = 'rgba(120,190,110,0.35)'; g.lineWidth = 7;
  for (let r = 0; r < 7; r++) { g.beginPath();
    for (let x = 0; x <= W; x += 16) { const y = ridge(x + t * 80, H * 0.42, 60, 0.004, 1) + 26 + r * 22; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  g.fillStyle = '#0f1a12'; g.fillRect(0, trackY - 4, W, H);
  g.fillStyle = '#3a2c20'; g.fillRect(0, trackY, W, 12);
  for (let x = -((t * 160) % 34); x < W; x += 34) { g.fillStyle = '#241a12'; g.fillRect(x, trackY + 3, 18, 9); }
  g.strokeStyle = '#9aa0aa'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, trackY); g.lineTo(W, trackY); g.stroke();
  const bob = Math.sin(t * 12) * 1.5;
  train(g, W * 0.62 + Math.sin(t * 0.7) * 20, trackY + bob, 1.55, t, 0.6, t);
  // poles passing in the foreground
  for (let i = 0; i < 4; i++) { const x = ((i * 380 - t * 260) % (W + 400) + W + 400) % (W + 400) - 200;
    g.fillStyle = '#0a0f0b'; g.fillRect(x, trackY - 260, 14, 300); g.fillRect(x - 30, trackY - 250, 74, 8); }
  // the event: a soft highlight sweeps along the route
  const sw = ease.inOut(clamp(k * 1.2));
  const gl = g.createLinearGradient(sw * W - 200, 0, sw * W + 200, 0);
  gl.addColorStop(0, rgba(ACCENT, 0)); gl.addColorStop(0.5, rgba(ACCENT, 0.5)); gl.addColorStop(1, rgba(ACCENT, 0));
  g.fillStyle = gl; g.fillRect(0, trackY - 2, W, 6);
};
