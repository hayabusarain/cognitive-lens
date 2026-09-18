import type { TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import type { ArticleContent } from "@/lib/articles/schema";
import { article as ENFJ } from "@/lib/articles/ENFJ";
import { article as ENFP } from "@/lib/articles/ENFP";
import { article as ENTJ } from "@/lib/articles/ENTJ";
import { article as ENTP } from "@/lib/articles/ENTP";
import { article as ESFJ } from "@/lib/articles/ESFJ";
import { article as ESFP } from "@/lib/articles/ESFP";
import { article as ESTJ } from "@/lib/articles/ESTJ";
import { article as ESTP } from "@/lib/articles/ESTP";
import { article as INFJ } from "@/lib/articles/INFJ";
import { article as INFP } from "@/lib/articles/INFP";
import { article as INTJ } from "@/lib/articles/INTJ";
import { article as INTP } from "@/lib/articles/INTP";
import { article as ISFJ } from "@/lib/articles/ISFJ";
import { article as ISFP } from "@/lib/articles/ISFP";
import { article as ISTJ } from "@/lib/articles/ISTJ";
import { article as ISTP } from "@/lib/articles/ISTP";

/** 16タイプの恋愛コラムをまとめて引く（ページ・一覧・OG 画像から使う。検査スクリプトは各ファイルを直接読む） */
export const ARTICLES = {
  ENFJ, ENFP, ENTJ, ENTP, ESFJ, ESFP, ESTJ, ESTP,
  INFJ, INFP, INTJ, INTP, ISFJ, ISFP, ISTJ, ISTP,
} as const satisfies Record<TypeCode, ArticleContent>;

/**
 * title を「INTJ（スフィンクス）の恋愛」と、「：」の後ろの副題に分ける。
 * 見出しやカードで2行に組むときに使う。title の書式は scripts/check-content.mjs が検査している
 */
export function splitArticleTitle(type: TypeCode): { prefix: string; subtitle: string } {
  const title = ARTICLES[type].title;
  const prefix = `${type}（${TYPE_NAMES[type]}）の恋愛`;
  if (!title.startsWith(prefix)) return { prefix: "", subtitle: title };
  return { prefix, subtitle: title.slice(prefix.length).replace(/^[：:]\s*/, "") };
}
