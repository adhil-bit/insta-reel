NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d');
function line(t, y, a, col, size) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = `800 ${size}px Baloo`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(t, 540, y); g.restore(); }
window.renderFrame = function (t) { const D = DURATION; NB.paper(g);
  const k1 = 0.55 + 0.45 * NB.cl(t / 0.4), k2 = NB.cl((t - D * 0.4) / 0.4), k3 = NB.ease(NB.cl((t - D * 0.5) / 0.4));
  line('മാനവിക്രമന്റെ', 760, k1 * (1 - 0.6 * k2), '#1b1b1b', 104); line('ചിറ', 880, k1 * (1 - 0.6 * k2), '#1b1b1b', 104);
  if (k2 > 0) { g.save(); g.globalAlpha = k2; g.strokeStyle = '#b5281f'; g.lineWidth = 8; g.beginPath(); g.moveTo(540, 960); g.lineTo(540, 1060); g.lineTo(515, 1030); g.moveTo(540, 1060); g.lineTo(565, 1030); g.stroke(); g.restore(); }
  g.save(); g.translate(540, 1170); const sc = 0.6 + 0.4 * k3; g.scale(sc, sc); g.translate(-540, -1170); line('മാനാഞ്ചിറ', 1170, k3, '#b5281f', 150); g.restore();
  if (k3 > 0.9) NB.blob(g, 540, 1180, 330, 40, 'rgba(181,40,31,1)', 0.12);
};
