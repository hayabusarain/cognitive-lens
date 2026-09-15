"use client";

import { useSearchParams } from "next/navigation";
import type { TypeCode } from "@/lib/type-codes";
import { parseScores } from "@/lib/diagnosis/score";

export type ResultScores = readonly [number, number, number, number];

/**
 * 結果ページの URL のクエリを読む（仕様書 2-1・2-3・3-3）。
 *   scores …… p を検証した4軸の割合。p がない・不正なら null（個人スコア欄を出さない）
 *   target …… 相手診断から来た（from=target）。p が正しいときだけ true にし、候補のタイプを見ているだけの人には「あの人のタイプ」と出さない
 * useSearchParams を使うので、呼ぶ部品は <Suspense> で包む（静的に生成したページの残りは HTML に含まれる）
 */
export function useResultQuery(type: TypeCode): { scores: ResultScores | null; target: boolean } {
  const searchParams = useSearchParams();
  const scores = parseScores(type, searchParams.get("p")) as ResultScores | null;
  return { scores, target: scores !== null && searchParams.get("from") === "target" };
}
