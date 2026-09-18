import type { CSSProperties } from "react";
import { TYPE_BASE } from "@/lib/type-base";
import { TYPE_CODES, type TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";

/**
 * タイプを画面に出すときの共通の組み立て（docs/design-system.md）
 */

/** その要素の中をタイプ色にする style。--tc を読む部品（bg-type、TypeFrame など）が、この色で描かれる */
export function typeColorStyle(type: TypeCode): CSSProperties {
  return { "--tc": TYPE_BASE[type].color } as CSSProperties;
}

/** キャラクター画像の alt（仕様書 4-1）：「INTJ（スフィンクス）のキャラクター」 */
export function characterAlt(type: TypeCode): string {
  return `${type}（${TYPE_NAMES[type]}）のキャラクター`;
}

/** カードの通し番号。一覧の並び（アルファベット順）で No.01〜No.16 */
export function typeNumber(type: TypeCode): string {
  return `No.${String(TYPE_CODES.indexOf(type) + 1).padStart(2, "0")}`;
}
