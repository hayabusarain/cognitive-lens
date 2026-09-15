import type { TypeCode } from "@/lib/type-codes";
import type { TypeContent } from "@/lib/type-content/schema";
import { content as ENFJ } from "@/lib/type-content/ENFJ";
import { content as ENFP } from "@/lib/type-content/ENFP";
import { content as ENTJ } from "@/lib/type-content/ENTJ";
import { content as ENTP } from "@/lib/type-content/ENTP";
import { content as ESFJ } from "@/lib/type-content/ESFJ";
import { content as ESFP } from "@/lib/type-content/ESFP";
import { content as ESTJ } from "@/lib/type-content/ESTJ";
import { content as ESTP } from "@/lib/type-content/ESTP";
import { content as INFJ } from "@/lib/type-content/INFJ";
import { content as INFP } from "@/lib/type-content/INFP";
import { content as INTJ } from "@/lib/type-content/INTJ";
import { content as INTP } from "@/lib/type-content/INTP";
import { content as ISFJ } from "@/lib/type-content/ISFJ";
import { content as ISFP } from "@/lib/type-content/ISFP";
import { content as ISTJ } from "@/lib/type-content/ISTJ";
import { content as ISTP } from "@/lib/type-content/ISTP";

/** 16タイプの文章をまとめて引く（ページや一覧から使う。検査スクリプトは各ファイルを直接読む） */
export const TYPE_CONTENT = {
  ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP,
  INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP,
} as const satisfies Record<TypeCode, TypeContent>;

/** 一行説明（tagline）を型コードで引く表。TypeGrid の descriptions にそのまま渡せる */
export const TYPE_TAGLINES = Object.fromEntries(
  Object.entries(TYPE_CONTENT).map(([code, c]) => [code, c.tagline]),
) as Record<TypeCode, string>;
