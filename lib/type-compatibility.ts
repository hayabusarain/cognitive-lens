import type { TypeCode } from "@/lib/type-codes";

/**
 * 相性の相手の型コード（仕様書 5-2 の TypeBase.compatibility）
 * 理由の文章は lib/type-content/{TYPE}.ts の compatibility に書く。
 * 16タイプの文章がそろうまでは、書いたタイプだけを置く（ステップ 2-4・2-5）
 */
export const TYPE_COMPATIBILITY: Partial<Record<TypeCode, { easy: TypeCode; hard: TypeCode }>> = {
  INTJ: { easy: "ENTP", hard: "ESFP" },
};
