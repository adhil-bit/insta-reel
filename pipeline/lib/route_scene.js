// Route journey on real satellite terrain. Needs RT (config) and the rt_* <img> tags (pipeline/route.py).
const c = makeCanvas(), g = c.getContext('2d');
const M = RT.meta, SC = Object.assign({}, RT.scene || {}), B = M.b;
const RS = v => typeof v === 'string' ? M.stop_at[+v.slice(1)] + (v.includes('+') ? +v.split('+')[1] : 0) - (v.includes('-') ? +v.split('-')[1] : 0) : v;
if (SC.from !== undefined) { SC.from = RS(SC.from); SC.to = RS(SC.to); }
const LAT0 = (B[1] + B[3]) / 2, LON0 = (B[0] + B[2]) / 2;
const KX = 111.32 * Math.cos(LAT0 * Math.PI / 180), KY = 110.57;
const wx = lon => (lon - LON0) * KX, wz = lat => -(lat - LAT0) * KY;
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const EX = 2.2;
let S = null;

// cumulative distance along the line (km)
const L = M.line, CUM = [0];
for (let i = 1; i < L.length; i++) CUM.push(CUM[i - 1] + Math.hypot((L[i][0] - L[i - 1][0]) * KY, (L[i][1] - L[i - 1][1]) * KX));
const TOT = CUM[CUM.length - 1];
function at(p) {                                   // lat, lon, index at fraction p of the route
  const d = clamp(p) * TOT; let i = 1; while (i < CUM.length - 1 && CUM[i] < d) i++;
  const f = (d - CUM[i - 1]) / Math.max(1e-6, CUM[i] - CUM[i - 1]);
  return [lerp(L[i - 1][0], L[i][0], f), lerp(L[i - 1][1], L[i][1], f), i];
}
function headingAt(p) { const a = at(clamp(p - 0.012)), b = at(clamp(p + 0.012)); return Math.atan2(wx(b[1]) - wx(a[1]), wz(b[0]) - wz(a[0])); }

function hmap() { const im = document.getElementById('rt_h'), k = document.createElement('canvas'); k.width = im.naturalWidth; k.height = im.naturalHeight; const x = k.getContext('2d'); x.drawImage(im, 0, 0); return { w: k.width, h: k.height, d: x.getImageData(0, 0, k.width, k.height).data }; }
function hAt(lat, lon) { const u = (lon - B[0]) / (B[2] - B[0]), v = (B[3] - lat) / (B[3] - B[1]); if (u < 0 || u > 1 || v < 0 || v > 1) return 0;
  return S.hm.d[(Math.round(v * (S.hm.h - 1)) * S.hm.w + Math.round(u * (S.hm.w - 1))) * 4] / 255 * M.zmax_km * EX; }
function init() {
  const gl = document.createElement('canvas'); gl.width = W; gl.height = H;
  const r = new THREE.WebGLRenderer({ canvas: gl, antialias: true, preserveDrawingBuffer: true }); r.setSize(W, H, false); r.outputEncoding = THREE.sRGBEncoding;
  const sc = new THREE.Scene(); sc.background = new THREE.Color(0x0b1622); sc.fog = new THREE.Fog(0x1b2a36, 30, 120);
  const hm = hmap(), img = document.getElementById('rt_sat');
  const tex = new THREE.Texture(img); tex.needsUpdate = true; tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const geo = new THREE.PlaneGeometry((B[2] - B[0]) * KX, (B[3] - B[1]) * KY, hm.w - 1, hm.h - 1); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, hm.d[i * 4] / 255 * M.zmax_km * EX);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex })); sc.add(mesh);
  // dark sea/skirt around the tile
  const skirt = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshBasicMaterial({ color: 0x14303f })); skirt.rotation.x = -Math.PI / 2; skirt.position.y = -0.05; sc.add(skirt);
  const cam = new THREE.PerspectiveCamera(36, W / H, 0.05, 4000); cam.setViewOffset(W, H, 0, 120, W, H);
  // satellite crop source for bubbles
  const crop = document.createElement('canvas'); crop.width = img.naturalWidth; crop.height = img.naturalHeight; crop.getContext('2d').drawImage(img, 0, 0);
  S = { r, gl, sc, cam, hm, crop, cl: [] };
  for (let i = 0; i < 4; i++) { const q = FX.NOISE[i * 37]; S.cl.push([q[0] * W, i % 2 ? 1380 + q[1] * 120 : 560 + q[1] * 160, 140 + q[2] * 120, 0.5 + q[2]]); }
}
function scr(lat, lon, lift = 0.02) { const v = new THREE.Vector3(wx(lon), hAt(lat, lon) + lift, wz(lat)).project(S.cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z]; }

function camera(t) {
  const D = DURATION, q = t / D, cam = S.cam;
  const fitD = Math.max((B[3] - B[1]) * KY, (B[2] - B[0]) * KX * H / W) * 0.95;
  let tx, tz, d, pitch, yaw;
  if (SC.mode === 'overview' || SC.mode === 'final') {
    tx = 0; tz = 0; d = fitD * (SC.mode === 'final' ? lerp(0.62, 0.72, ease.inOut(q)) : lerp(0.9, 0.7, ease.out(q)));
    pitch = 62 * Math.PI / 180; yaw = (SC.mode === 'final' ? -10 + 14 * q : 10 - 12 * q) * Math.PI / 180;
  } else {
    const p = lerp(SC.from, SC.to, ease.inOut(clamp(q / 0.92))), a = at(p);
    tx = wx(a[1]); tz = wz(a[0]); d = SC.dist || 7.5; pitch = (SC.pitch || 52) * Math.PI / 180;
    yaw = headingAt(p) + Math.PI + ((SC.yaw || 0) + (SC.orbit || 0) * q) * Math.PI / 180;
    S.p = p;
  }
  cam.position.set(tx + d * Math.cos(pitch) * Math.sin(yaw), d * Math.sin(pitch), tz + d * Math.cos(pitch) * Math.cos(yaw));
  cam.lookAt(tx, 0, tz); S.sc.fog.near = d * 2.6; S.sc.fog.far = d * 8; return { q, d };
}

function label(lat, lon, en, ml, a = 1, big = false) {
  const p = scr(lat, lon); if (p[2] > 1 || p[0] < -50 || p[0] > W + 50 || p[1] < 260 || p[1] > H - 260) return;
  g.save(); g.globalAlpha = a; g.fillStyle = '#ffffff'; g.strokeStyle = '#1f6feb'; g.lineWidth = 5; g.beginPath(); g.arc(p[0], p[1], big ? 13 : 9, 0, 6.283); g.fill(); g.stroke();
  g.shadowColor = 'rgba(0,0,0,0.85)'; g.shadowBlur = 10; g.textAlign = 'left'; g.fillStyle = '#ffffff';
  g.font = `800 ${big ? 36 : 28}px Inter`; g.fillText(en, p[0] + 22, p[1] - 4); g.font = `700 ${big ? 30 : 24}px Baloo`; g.fillText(ml, p[0] + 22, p[1] + (big ? 30 : 24)); g.restore();
}
function routeLine(p1, alpha = 1, dashedRest = false) {
  const n = L.length, end = at(p1)[2]; if (end < 1) return;
  const pts = []; for (let i = 0; i < end; i += 2) pts.push(scr(L[i][0], L[i][1]));
  const e = at(p1); pts.push(scr(e[0], e[1]));
  g.save(); g.globalAlpha = alpha; g.lineJoin = 'round'; g.lineCap = 'round';
  g.strokeStyle = 'rgba(30,120,255,0.35)'; g.lineWidth = 26; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke();
  g.strokeStyle = '#2f8bff'; g.lineWidth = 12; g.stroke(); g.strokeStyle = '#bfe0ff'; g.lineWidth = 3; g.stroke(); g.restore();
  if (dashedRest) { const r = []; for (let i = end; i < n; i += 3) r.push(scr(L[i][0], L[i][1])); g.save(); g.globalAlpha = 0.7 * alpha; g.strokeStyle = '#ffffff'; g.lineWidth = 4; g.setLineDash([4, 14]); g.lineCap = 'round'; g.beginPath(); r.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); g.restore(); }
}
function van(p) {
  const a = at(p), b = at(clamp(p + 0.01)), s1 = scr(a[0], a[1], 0.05), s2 = scr(b[0], b[1], 0.05), ang = Math.atan2(s2[1] - s1[1], s2[0] - s1[0]);
  g.save(); g.translate(s1[0], s1[1]); g.rotate(ang); g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 14; g.shadowOffsetY = 8;
  g.fillStyle = '#f4f6f8'; g.beginPath(); g.roundRect(-34, -19, 68, 38, 9); g.fill(); g.shadowColor = 'transparent';
  g.fillStyle = '#2c3e50'; g.beginPath(); g.roundRect(12, -15, 16, 30, 4); g.fill(); g.fillStyle = '#d0d7de'; g.fillRect(-26, -13, 32, 26); g.restore();
}
function bubble(b, k, side) {                       // satellite close-up bubble with leader line + bilingual pill
  if (k <= 0) return; const P = b.poi, pt = scr(P.lat, P.lon), s = ease.out(clamp(k * 1.6));
  const bx = side < 0 ? 210 : W - 210, by = b.y || 760, R = 125 * s;
  g.save(); g.globalAlpha = clamp(k * 3); g.strokeStyle = '#ffe9a8'; g.lineWidth = 3; g.beginPath(); g.moveTo(bx, by + R); g.lineTo(pt[0], pt[1]); g.stroke();
  g.fillStyle = '#ffe9a8'; g.beginPath(); g.arc(pt[0], pt[1], 8, 0, 6.283); g.fill();
  g.save(); g.beginPath(); g.arc(bx, by, R, 0, 6.283); g.clip();
  const u = (P.lon - B[0]) / (B[2] - B[0]) * S.crop.width, v = (B[3] - P.lat) / (B[3] - B[1]) * S.crop.height, cw = S.crop.width * (P.zoom || 0.11);
  g.filter = 'saturate(1.2) contrast(1.1)'; g.drawImage(S.crop, u - cw / 2, v - cw / 2, cw, cw, bx - R, by - R, 2 * R, 2 * R); g.filter = 'none'; g.restore();
  g.strokeStyle = '#ffffff'; g.lineWidth = 7; g.beginPath(); g.arc(bx, by, R, 0, 6.283); g.stroke();
  g.font = '800 26px Inter'; const w1 = g.measureText(P.en).width; g.font = '700 24px Baloo'; const w2 = g.measureText(P.ml).width; const pw = Math.max(w1, w2) + 36;
  g.fillStyle = 'rgba(255,255,255,0.94)'; g.beginPath(); g.roundRect(bx - pw / 2, by + R + 10, pw, 74, 10); g.fill();
  g.fillStyle = '#10202e'; g.textAlign = 'center'; g.font = '800 26px Inter'; g.fillText(P.en, bx, by + R + 42); g.font = '700 24px Baloo'; g.fillText(P.ml, bx, by + R + 72); g.restore();
}
function title(en, ml, a) { if (!en || a <= 0) return; g.save(); g.globalAlpha = a; g.textAlign = 'center'; g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 18; g.fillStyle = '#fff';
  g.font = '900 78px Inter'; g.fillText(en, 540, 400); g.font = '800 54px Baloo'; g.fillText(ml, 540, 468); g.restore(); }
function clouds(t) { for (const [x0, y, r, sp] of S.cl) { const x = ((x0 + t * 30 * sp) % (W + 4 * r)) - 2 * r; g.save(); g.translate(x, y); g.scale(1.8, 0.75); for (let k = 0; k < 3; k++) { const ox = (k - 1) * r * 0.55, rr = r * (0.75 + 0.25 * (k === 1)); const rg = g.createRadialGradient(ox, 0, 1, ox, 0, rr); rg.addColorStop(0, 'rgba(255,255,255,0.30)'); rg.addColorStop(0.6, 'rgba(255,255,255,0.12)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.beginPath(); g.arc(ox, 0, rr, 0, 6.283); g.fill(); } g.restore(); } }

window.renderFrame = function (t) {
  if (!S) init();
  const C = camera(t), q = C.q;
  S.r.render(S.sc, S.cam);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#0b1622'; g.fillRect(0, 0, W, H); g.restore();
  g.filter = 'brightness(1.14) contrast(1.06) saturate(1.18)'; g.drawImage(S.gl, 0, 0); g.filter = 'none';
  const vg = g.createLinearGradient(0, 0, 0, H); vg.addColorStop(0, 'rgba(5,12,20,0.55)'); vg.addColorStop(0.3, 'rgba(5,12,20,0)'); vg.addColorStop(0.75, 'rgba(5,12,20,0)'); vg.addColorStop(1, 'rgba(5,12,20,0.6)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const overview = SC.mode === 'overview' || SC.mode === 'final';
  if (overview) routeLine(SC.mode === 'final' ? 1 : clamp(0.25 + q * 1.4), 1, SC.mode !== 'final');
  else { routeLine(S.p, 1, true); van(S.p); }
  (M.pois || []).forEach(P => { if (!P.bubble) label(P.lat, P.lon, P.en, P.ml, 0.95); });
  M.stops.forEach((P, i) => label(P.lat, P.lon, P.en, P.ml, 1, true));
  (SC.bubbles || []).forEach((b, i) => { const P = M.pois[b.poi] || M.stops[b.stop]; if (!P) return; bubble({ poi: P, y: b.y }, (q - b.at) / 0.25, b.side || (i % 2 ? 1 : -1)); });
  clouds(t);
  if (SC.title !== undefined) { const P = M.stops[SC.title]; title(P.en, P.ml, ease.out(clamp(q / 0.15))); }
  if (!overview || SC.mode === 'final') {
    const km = SC.mode === 'final' ? M.km : M.km * (S.p || 0);
    g.save(); g.font = '800 40px Inter'; const s = km.toFixed(1) + ' km'; const w = g.measureText(s).width + 40; g.fillStyle = 'rgba(10,20,30,0.72)'; g.beginPath(); g.roundRect(60, 1520, w, 64, 32); g.fill();
    g.fillStyle = '#ffffff'; g.textAlign = 'left'; g.fillText(s, 80, 1566); g.restore();
  }
  g.save(); g.globalAlpha = 0.75; g.fillStyle = '#ffffff'; g.font = '500 18px Inter'; g.textAlign = 'right'; g.fillText(RT.credit, W - 40, 1612); g.restore();
};
