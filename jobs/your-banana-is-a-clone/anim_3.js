const c = makeCanvas(), g = c.getContext('2d');
const ground = H * 0.6;
const bgL = document.createElement('canvas'); bgL.width = W; bgL.height = H;
(() => { const x = bgL.getContext('2d');
  const sky = x.createLinearGradient(0, 0, 0, ground); sky.addColorStop(0, '#05080f'); sky.addColorStop(1, '#17241b');
  x.fillStyle = sky; x.fillRect(0, 0, W, ground);
  const soil = x.createLinearGradient(0, ground, 0, H); soil.addColorStop(0, '#2b1e12'); soil.addColorStop(0.35, '#0e0a06'); soil.addColorStop(1, '#040302');
  x.fillStyle = soil; x.fillRect(0, ground, W, H - ground); })();
const plants = [{x: W * 0.2, s: 0.8}, {x: W * 0.82, s: 0.85}, {x: W * 0.5, s: 1.2}];
// underground fungal network spreading from left to right
const threads = [];
for (let i = 0; i < 22; i++) {
  let x = -40, y = ground + 30 + rand() * 170; const pts = [[x, y]];
  while (x < W + 40) { x += 18 + rand() * 22; y += (rand() - 0.5) * 34; y = clamp(y, ground + 15, ground + 230); pts.push([x, y]); }
  threads.push({pts, delay: rand() * 0.15});
}
const front = k => lerp(-60, W + 480, ease.inOut(clamp(k / 0.8)));   // how far the fungus has reached
function mix(a, b, t) { return a.map((v, i) => Math.round(v + (b[i] - v) * t)); }

function plant(p, infect, wilt, t) {
  const h = 560 * p.s, x = p.x, sway = Math.sin(t * 1.2 + p.x) * 0.03 * (1 - wilt);
  const topX = x + sway * 200, topY = ground - h;
  g.lineCap = 'round';
  g.strokeStyle = `rgb(${mix([78, 128, 56], [96, 74, 44], wilt)})`; g.lineWidth = 40 * p.s;
  g.beginPath(); g.moveTo(x, ground); g.lineTo(topX, topY); g.stroke();
  if (infect > 0) {                      // infection climbs the trunk
    g.strokeStyle = rgba(ACCENT, 0.85); g.lineWidth = 12 * p.s;
    g.shadowColor = ACCENT; g.shadowBlur = 20;
    g.beginPath(); g.moveTo(x, ground); g.lineTo(lerp(x, topX, infect), lerp(ground, topY, infect)); g.stroke();
    g.shadowBlur = 0;
  }
  const leaf = mix([72, 168, 74], [116, 86, 40], wilt);
  for (let i = 0; i < 7; i++) {
    const side = i % 2 ? 1 : -1, base = -Math.PI / 2 + side * (0.3 + i * 0.13);
    const ang = base + side * wilt * (1.2 + i * 0.08) + sway;
    const len = (380 - i * 20) * p.s, wd = 95 * p.s;
    g.save(); g.translate(topX, topY); g.rotate(ang);
    g.fillStyle = `rgb(${leaf})`; g.globalAlpha = 0.95 - wilt * 0.2;
    g.beginPath(); g.moveTo(0, 0);
    g.quadraticCurveTo(len * 0.5, -wd, len, 0); g.quadraticCurveTo(len * 0.5, wd * 0.7, 0, 0); g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(len, 0); g.stroke();
    g.restore();
  }
  g.globalAlpha = 1;
}

window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  const fx = front(k);
  g.globalAlpha = 1; g.drawImage(bgL, 0, 0);
  g.lineCap = 'round'; g.lineWidth = 3; g.strokeStyle = rgba(ACCENT, 0.7);
  g.shadowColor = rgba(ACCENT, 0.9); g.shadowBlur = 10;
  for (const th of threads) {
    g.beginPath(); g.moveTo(th.pts[0][0], th.pts[0][1]);
    for (const [x, y] of th.pts) { if (x > fx - th.delay * 300) break; g.lineTo(x, y); }
    g.stroke();
  }
  g.shadowBlur = 0;
  for (const p of plants) {
    const reached = clamp((fx - p.x) / 260);
    plant(p, ease.out(reached), ease.inOut(clamp((fx - p.x - 120) / 420)), t);
  }
};
