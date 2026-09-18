// 色の計算（WCAG のコントラスト比と、色相）
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

export function relativeLuminance(hex) {
  const [r, g, b] = channels(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
  const [l1, l2] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** HSL の色相（0〜360） */
export function hue(hex) {
  const [r, g, b] = channels(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const d = max - min;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

/** 色相の組をすべて含む、色相環上の最小の弧の角度 */
export function hueArc(hues) {
  const sorted = [...hues].sort((a, b) => a - b);
  let maxGap = 0;
  for (let i = 0; i < sorted.length; i++) {
    const next = i === sorted.length - 1 ? sorted[0] + 360 : sorted[i + 1];
    maxGap = Math.max(maxGap, next - sorted[i]);
  }
  return 360 - maxGap;
}

/** 2つの色相の差（0〜180） */
export const hueDistance = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
