import type { TypeCode } from "@/lib/type-codes";

/**
 * 16タイプの呼称（docs/decisions.md 3章）。表記は幻獣名だけにし、「〜型」は付けない。
 * 系統（古代の怪物・光る生き物・番人・野生）はサイトに出さない（decisions N2）。
 * 確認の記録：docs/naming-check.md
 */
export const TYPE_NAMES = {
  ENFJ: "フェニックス",
  ENFP: "ピクシー",
  ENTJ: "ドラゴン",
  ENTP: "キマイラ",
  ESFJ: "ドライアド",
  ESFP: "サラマンダー",
  ESTJ: "ケルベロス",
  ESTP: "ミノタウロス",
  INFJ: "ユニコーン",
  INFP: "ペガサス",
  INTJ: "スフィンクス",
  INTP: "リヴァイアサン",
  ISFJ: "グリフォン",
  ISFP: "マーメイド",
  ISTJ: "ゴーレム",
  ISTP: "フェンリル",
} as const satisfies Record<TypeCode, string>;
