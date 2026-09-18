import type { TypeCode } from "@/lib/type-codes";

/**
 * 相性の相手の型コード（仕様書 5-2 の TypeBase.compatibility）
 * 理由の文章は lib/type-content/{TYPE}.ts の compatibility に書く。
 *
 * 決め方（全タイプ同じ規則。2026-09-15）：
 *   easy …… 外向・内向と判断・知覚を入れ替えたタイプ。ものの見方（S/N・T/F）が同じで、動き方が補い合う
 *   hard …… 4文字すべてを入れ替えたタイプ。ものの見方も動き方も逆になる
 * どちらも対称になる（A の easy が B なら、B の easy も A）。
 */
export const TYPE_COMPATIBILITY = {
  ENFJ: { easy: "INFP", hard: "ISTP" },
  ENFP: { easy: "INFJ", hard: "ISTJ" },
  ENTJ: { easy: "INTP", hard: "ISFP" },
  ENTP: { easy: "INTJ", hard: "ISFJ" },
  ESFJ: { easy: "ISFP", hard: "INTP" },
  ESFP: { easy: "ISFJ", hard: "INTJ" },
  ESTJ: { easy: "ISTP", hard: "INFP" },
  ESTP: { easy: "ISTJ", hard: "INFJ" },
  INFJ: { easy: "ENFP", hard: "ESTP" },
  INFP: { easy: "ENFJ", hard: "ESTJ" },
  INTJ: { easy: "ENTP", hard: "ESFP" },
  INTP: { easy: "ENTJ", hard: "ESFJ" },
  ISFJ: { easy: "ESFP", hard: "ENTP" },
  ISFP: { easy: "ESFJ", hard: "ENTJ" },
  ISTJ: { easy: "ESTP", hard: "ENFP" },
  ISTP: { easy: "ESTJ", hard: "ENFJ" },
} as const satisfies Record<TypeCode, { easy: TypeCode; hard: TypeCode }>;
