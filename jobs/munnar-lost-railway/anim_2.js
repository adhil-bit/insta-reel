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
const A = [W * 0.14, H * 0.15], B = [W * 0.9, H * 0.58];
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#0a1220'); s.addColorStop(0.6, '#1e2c34'); s.addColorStop(1, '#05070b');
  x.fillStyle = s; x.fillRect(0, 0, W, H);
  // steep mountain on the left with the station on top, valley floor right
  x.fillStyle = '#1a2b22'; x.beginPath(); x.moveTo(0, H * 0.13); x.lineTo(W * 0.22, H * 0.16); x.quadraticCurveTo(W * 0.45, H * 0.5, W * 0.6, H * 0.62); x.lineTo(W, H * 0.6); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  x.fillStyle = '#123018'; x.fillRect(W * 0.55, H * 0.6, W * 0.45, H);
  x.fillStyle = '#3b3f48'; x.fillRect(W * 0.06, H * 0.1, 170, 70); x.fillStyle = '#5a3a26'; x.beginPath(); x.moveTo(W * 0.04, H * 0.1); x.lineTo(W * 0.06 + 85, H * 0.07); x.lineTo(W * 0.06 + 190, H * 0.1); x.fill();
  x.fillStyle = '#3b3f48'; x.fillRect(B[0] - 50, B[1] - 10, 120, 50); });
const mist = Array.from({length: 8}, () => ({x: rand() * W, y: H * (0.3 + rand() * 0.25), r: 150 + rand() * 150, s: 8 + rand() * 14}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const sag = (u) => [lerp(A[0], B[0], u), lerp(A[1], B[1], u) + Math.sin(u * Math.PI) * 70];
  g.strokeStyle = '#b8bec8'; g.lineWidth = 3;
  for (const off of [0, 14]) { g.beginPath(); for (let u = 0; u <= 1.001; u += 0.02) { const [x, y] = sag(u); u ? g.lineTo(x, y + off) : g.moveTo(x, y + off); } g.stroke(); }
  // crates: more of them appear as the scene goes on
  const n = 1 + Math.floor(ease.out(k) * 5);
  for (let i = 0; i < n; i++) {
    const u = ((t * 0.09) + i / 5) % 1, [x, y] = sag(u);
    g.strokeStyle = '#888'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 46); g.stroke();
    g.fillStyle = '#6b4a2e'; g.fillRect(x - 32, y + 46, 64, 46); g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 3; g.strokeRect(x - 32, y + 46, 64, 46);
    g.strokeStyle = 'rgba(0,0,0,0.4)'; g.beginPath(); g.moveTo(x - 32, y + 69); g.lineTo(x + 32, y + 69); g.stroke();
  }
  for (const m of mist) puff(g, (m.x + t * m.s) % (W + 300) - 150, m.y, m.r, 0.15);
  const glow = g.createRadialGradient(A[0] + 80, A[1] + 20, 5, A[0] + 80, A[1] + 20, 160);
  glow.addColorStop(0, rgba(ACCENT, 0.45)); glow.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = glow; g.fillRect(0, 0, W, H * 0.4);
};
