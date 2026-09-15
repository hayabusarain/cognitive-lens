import { THEME } from "@/lib/theme";
import { TYPE_BASE } from "@/lib/type-base";
import type { TypeCode } from "@/lib/type-codes";

/**
 * 生成画像の色と大きさ。画面（app/globals.css）と同じ値を lib/theme.ts・lib/type-base.ts から読む
 */
export const OG_COLORS = {
  ...THEME,
  /** 画面の --color-line */
  line: "#2E3340",
  /** キャラクターの窓の地（画面の .type-art） */
  art: "#11141B",
  /** タイプ色の面に載せる文字（画面の --color-ink） */
  ink: THEME.background,
} as const;

export function ogTypeColor(type: TypeCode): string {
  return TYPE_BASE[type].color;
}

/** OG 画像の大きさ（仕様書 4-2） */
export const OG_SIZE = { width: 1200, height: 630 } as const;

/** 画像の中に入れるサイトの表記 */
export const OG_SITE_LABEL = "www.cognitive-lens.com";
