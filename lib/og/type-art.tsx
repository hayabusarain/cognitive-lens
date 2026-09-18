import type { TypeCode } from "@/lib/type-codes";
import { OG_FONT_FAMILY } from "@/lib/og/assets";

/**
 * 生成画像のタイプの窓に置く型コード（画面の CharacterFigure に対応）
 *
 * キャラクター画像16枚は 2026-09-19 にサイトから外した（docs/asset-credits.md 1-1）。
 * 差し替えが済むまで、窓の中央に型コードを薄く大きく置く（地紋の扱い。カードの型コードと重ねて読ませない）。
 * 親は position: relative の窓で、その全面に重ねる（親の alignItems に左右されないため）。
 */
export function TypeArtText({ type, width, height }: { type: TypeCode; width: number; height: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: OG_FONT_FAMILY,
          fontSize: Math.round(Math.min(width, height) * 0.38),
          fontWeight: 900,
          letterSpacing: Math.max(2, Math.round(width * 0.012)),
          // Satori は opacity を見ないので、色そのものを薄くする
          color: "rgba(255, 255, 255, 0.13)",
        }}
      >
        {type}
      </span>
    </div>
  );
}
