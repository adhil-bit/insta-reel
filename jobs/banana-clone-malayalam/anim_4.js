const c = makeCanvas(), g = c.getContext('2d');
const cx = W / 2, cy = H * 0.37, R = W * 0.37, D = Math.PI / 180;
const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
const bgL = layer(x => { const b = x.createRadialGradient(cx, cy, R * 0.3, cx, cy, H * 0.9);
  b.addColorStop(0, '#0f1a30'); b.addColorStop(1, '#03050a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const bodyL = layer(x => { const b = x.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
  b.addColorStop(0, '#24406f'); b.addColorStop(0.75, '#0d1a36'); b.addColorStop(1, '#050a16');
  x.fillStyle = b; x.beginPath(); x.arc(cx, cy, R, 0, 6.283); x.fill(); });
const dots = Array.from({length: 1500}, () => ({lat: Math.asin(rand() * 2 - 1), lon: rand() * 6.283}));
const stars = Array.from({length: 200}, () => ({x: rand() * W, y: rand() * H * 0.8, p: rand() * 6.28}));
// approximate outbreak regions, in the order the narration names them
const outbreaks = [
  {lat: 3, lon: 104, at: 0.08}, {lat: 22, lon: 113, at: 0.14}, {lat: 13, lon: 122, at: 0.2},
  {lat: -17, lon: 145, at: 0.3}, {lat: -13, lon: 131, at: 0.34},
  {lat: -15, lon: 38, at: 0.5}, {lat: 31, lon: 35, at: 0.56},
  {lat: 11, lon: -74, at: 0.74}, {lat: -5, lon: -80, at: 0.8}, {lat: 8, lon: -70, at: 0.85},
].map(o => ({...o, la: o.lat * D, lo: o.lon * D}));
const camPath = [[0, 115], [0.42, 125], [0.55, 35], [0.68, 35], [0.82, -72], [1, -75]];
function camLon(k) {
  for (let i = 1; i < camPath.length; i++) if (k <= camPath[i][0]) {
    const [k0, a] = camPath[i - 1], [k1, b] = camPath[i];
    return lerp(a, b, ease.inOut((k - k0) / (k1 - k0))) * D;
  }
  return camPath[camPath.length - 1][1] * D;
}
const tilt = 0.25;
function project(lat, lon, c0) {
  const x = Math.cos(lat) * Math.sin(lon - c0), y = Math.sin(lat), z = Math.cos(lat) * Math.cos(lon - c0);
  const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
  return [cx + x * R, cy - y2 * R, z2];
}

window.renderFrame = function (t) {
  const k = clamp(t / DURATION);
  const c0 = camLon(k);
  g.globalAlpha = 1; g.drawImage(bgL, 0, 0);
  g.fillStyle = '#cfe0ff';
  for (const s of stars) { g.globalAlpha = 0.25 + 0.25 * Math.sin(s.p + t * 2); g.fillRect(s.x, s.y, 2, 2); }
  g.globalAlpha = 1; g.drawImage(bodyL, 0, 0);
  for (const d of dots) {
    const [x, y, z] = project(d.lat, d.lon, c0);
    if (z < 0) continue;
    g.fillStyle = `rgba(140,180,255,${0.1 + 0.45 * z})`;
    const s = 1.4 + 2.2 * z; g.fillRect(x - s / 2, y - s / 2, s, s);
  }
  for (const o of outbreaks) {
    const a = clamp((k - o.at) * 8);
    if (a <= 0) continue;
    const [x, y, z] = project(o.la, o.lo, c0);
    if (z < 0.05) continue;
    const pulse = (t * 0.9 + o.at * 3) % 1;
    g.strokeStyle = rgba(ACCENT, (1 - pulse) * 0.8 * a); g.lineWidth = 3;
    g.beginPath(); g.arc(x, y, 14 + pulse * 70 * z, 0, 6.283); g.stroke();
    const gl = g.createRadialGradient(x, y, 0, x, y, 46 * z);
    gl.addColorStop(0, rgba(ACCENT, 0.9 * a)); gl.addColorStop(1, rgba(ACCENT, 0));
    g.fillStyle = gl; g.beginPath(); g.arc(x, y, 46 * z, 0, 6.283); g.fill();
  }
  g.strokeStyle = rgba(ACCENT, 0.3); g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.stroke();
};
