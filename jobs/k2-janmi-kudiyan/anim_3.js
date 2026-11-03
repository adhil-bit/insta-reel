function paddy(g, top, t) { g.fillStyle = '#4a6a2a'; g.fillRect(0, top, W, H - top); g.strokeStyle = '#7aa04a'; g.lineWidth = 4;
  for (let r = 0; r < 18; r++) for (let i = 0; i < 24; i++) { const x = (i * 47 + r * 19) % (W + 40) - 20, y = top + 20 + r * 34; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 5 + Math.sin(t * 1.5 + i + r) * 3, y - 22); g.stroke(); } }
function deed(g, x, y, s, title, sub) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#efe4c8'; g.fillRect(-220, -280, 440, 560); g.fillStyle = '#3a2a1a'; g.font = '800 34px Inter, Baloo, Noto'; g.textAlign = 'center'; g.fillText(title, 0, -200); g.font = '700 26px Inter, Baloo, Noto'; g.fillText(sub, 0, -158);
  g.fillStyle = '#7a6a54'; for (let i = 0; i < 9; i++) g.fillRect(-170, -100 + i * 36, 340 - (i * 37) % 90, 8); g.fillStyle = '#9a1a1a'; g.beginPath(); g.arc(130, 220, 42, 0, 6.283); g.fill(); g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), walk = ease.inOut(clamp((k - 0.25) / 0.4)), rev = ease.out(clamp((k - 0.62) / 0.3));
  SK.sky(g, 'dusk', 0.62); paddy(g, H * 0.62, t); g.fillStyle = 'rgba(10,8,12,0.4)'; g.fillRect(0, H * 0.62, W, H);
  deed(g, W * 0.76, H * 0.3, 0.6, 'ജന്മം', '= സ്വകാര്യ സ്വത്ത്');
  SK.house(g, W * 0.22, H * 0.64, 0.6, '#1a1214', 0.2 * (1 - walk), t);
  for (let i = 0; i < 3; i++) SK.person(g, lerp(W * 0.3, W * 0.62, walk) + i * 50, H * 0.7, 230 - i * 50, 'stand', '#08060a', t * 2 + i);
  if (rev > 0) { g.save(); g.globalAlpha = rev; SK.crowd(g, W * 0.02, W * 0.98, H * 0.84, 12, 220, t, '#050406'); for (let i = 0; i < 5; i++) { const x = W * (0.12 + i * 0.19), y = H * 0.84 - 260; g.fillStyle = `rgba(255,170,80,${0.8 + 0.2 * Math.sin(t * 9 + i)})`; g.beginPath(); g.ellipse(x, y, 12, 26, 0, 0, 6.283); g.fill(); } g.restore(); }
  SK.grain(g, t, 0.07); };
