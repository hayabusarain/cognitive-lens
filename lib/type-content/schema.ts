import type { Tuple } from "@/lib/tuple";

/** 見出しと本文の組 */
export interface Section {
  heading: string;
  body: string;
}

/** すれ違いやすい場面と対処 */
export interface Friction {
  scene: string;
  tip: string;
}

/**
 * タイプごとの文章（仕様書 5-2）。呼称は lib/type-names.ts、職業名は lib/career-jobs.ts に置き、ここには持たせない。
 * 文章の長さの決まり（scripts/check-content.mjs が検査する）:
 *   - tagline と og.catch は24字以内
 *   - どの文字列も、1段落120字以内かつ3文以内、1文45字以内（decisions N4）
 */
export interface TypeContent {
  tagline: string;
  summary: string;
  traits: Tuple<Section, 3>;
  relationships: { friends: string; work: string; love: string };
  frictions: Tuple<Friction, 2>;
  compatibility: { easyReason: string; hardReason: string };
  career: { avoidReason: string; fitReason: string; interviewTip: string };
  og: { catch: string };
  /** {name} と {url} を含む */
  share: { text: string };
  seo: { title: string; description: string };
}
