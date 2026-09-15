/**
 * サイト全体の色（decisions Q20：背景は暗色で統一し、タイプごとに1色）
 * タイプ色は lib/type-base.ts。コントラスト比と色相の散らばりは scripts/check-content.mjs が検査する
 */
export const THEME = {
  /** ページの背景 */
  background: "#0E1016",
  /** カードなど、背景の上に置く面 */
  surface: "#181B23",
  /** 本文 */
  text: "#F1F2F5",
  /** 補足の文字 */
  textMuted: "#A6ABB6",
} as const;
