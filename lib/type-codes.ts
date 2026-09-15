/** 16の型コード。一覧などで並べる順（アルファベット順。decisions Q4） */
export const TYPE_CODES = [
  "ENFJ", "ENFP", "ENTJ", "ENTP", "ESFJ", "ESFP", "ESTJ", "ESTP",
  "INFJ", "INFP", "INTJ", "INTP", "ISFJ", "ISFP", "ISTJ", "ISTP",
] as const;

export type TypeCode = (typeof TYPE_CODES)[number];

export function isTypeCode(value: string): value is TypeCode {
  return (TYPE_CODES as readonly string[]).includes(value);
}
