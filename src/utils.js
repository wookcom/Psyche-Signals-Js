export function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function angularEntropy(history) {
  let chaos = 0;
  for (let i = 2; i < history.length; i++) {
    const a = history[i - 2];
    const b = history[i - 1];
    const c = history[i];
    const ang1 = Math.atan2(b.y - a.y, b.x - a.x);
    const ang2 = Math.atan2(c.y - b.y, c.x - b.x);
    let diff = Math.abs(ang1 - ang2);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    chaos += diff;
  }
  return chaos / history.length;
}

export function jerkValue(history) {
  const n = history.length;
  // Guard clause for short history
  if (n < 3) return 0;

  const a = history[n - 3];
  const b = history[n - 2];
  const c = history[n - 1];
  const v1 = distance(a, b);
  const v2 = distance(b, c);
  return Math.abs(v2 - v1) / (c.t - b.t || 1);
}