/**
 * 診断ロジック（仕様書 docs/redesign-spec.md 2-1〜2-3）
 *
 * 画面や設問文から切り離した純粋な関数だけを置く。単体テストは score.test.mjs。
 * Node.js の型除去（node --test）でも読めるよう、値の import はしない（型の import だけ）。
 */
import type { Axis, Pole, ScaleValue } from "./types";

const AXIS_ORDER: readonly Axis[] = ["EI", "SN", "TF", "JP"];
const POLE_PAIRS: Readonly<Record<Axis, readonly [Pole, Pole]>> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

/** 「僅差」とみなす p の範囲（両端を含む） */
export const CLOSE_MIN = 42;
export const CLOSE_MAX = 58;

/** 採点に使う設問の最小情報 */
export interface ScoredItem {
  id: string;
  axis: Axis;
  keyed: Pole;
}

export interface AxisScore {
  axis: Axis;
  /** 軸スコア S（前の文字の向きが正） */
  s: number;
  /** 前の文字の割合（0〜100 の整数）。判定不能の軸は null */
  p: number | null;
  /** 採用した文字。決定設問の待ちや判定不能は null */
  letter: Pole | null;
  /** 決定設問に答える必要がある */
  needsTiebreaker: boolean;
  /** 決定設問で決まった */
  decidedByTiebreaker: boolean;
  /** 僅差（p が 42〜58） */
  close: boolean;
  /** 相手診断で、答えた設問が3問未満 */
  undetermined: boolean;
}

export const isClose = (p: number) => p >= CLOSE_MIN && p <= CLOSE_MAX;

const sign = (item: ScoredItem) => (POLE_PAIRS[item.axis][0] === item.keyed ? 1 : -1);

/**
 * 1軸を採点する。
 * answers[id] が null のときは「わからない」（相手診断だけ）として、値 0 で分母から除く。
 * tiebreaker は決定設問の答え（前後どちらかの文字）。null は「わからない」。
 */
export function scoreAxis(
  axis: Axis,
  items: readonly ScoredItem[],
  answers: Readonly<Record<string, ScaleValue | null | undefined>>,
  tiebreaker?: Pole | null,
): AxisScore {
  const onAxis = items.filter((i) => i.axis === axis);
  let s = 0;
  let n = 0;
  for (const item of onAxis) {
    const value = answers[item.id];
    if (value === null || value === undefined) continue;
    s += sign(item) * value;
    n += 1;
  }
  const [first, second] = POLE_PAIRS[axis];
  const base = { axis, s, needsTiebreaker: false, decidedByTiebreaker: false, undetermined: false };
  if (n < 3) return { ...base, p: null, letter: null, close: false, undetermined: true };
  const p = Math.round(50 + (s * 50) / (3 * n));
  if (s > 0) return { ...base, p, letter: first, close: isClose(p) };
  if (s < 0) return { ...base, p, letter: second, close: isClose(p) };
  // S = 0：決定設問で決める
  if (tiebreaker === first || tiebreaker === second) return { ...base, p, letter: tiebreaker, decidedByTiebreaker: true, close: true };
  if (tiebreaker === null) return { ...base, p: null, letter: null, close: false, undetermined: true };
  return { ...base, p, letter: null, needsTiebreaker: true, close: true };
}

export interface DiagnosisResult {
  axes: AxisScore[];
  /** 4軸すべての文字が決まったときの型コード */
  type: string | null;
  /** まだ答えていない決定設問の軸 */
  pendingTiebreakers: Axis[];
  /** 判定不能の軸（相手診断） */
  undeterminedAxes: Axis[];
  /** 結果 URL の p（4軸すべて決まったとき）。例 "61-33-78-50" */
  scores: string | null;
}

export function diagnose(
  items: readonly ScoredItem[],
  answers: Readonly<Record<string, ScaleValue | null | undefined>>,
  tiebreakers: Partial<Record<Axis, Pole | null>> = {},
): DiagnosisResult {
  const axes = AXIS_ORDER.map((axis) => scoreAxis(axis, items, answers, tiebreakers[axis]));
  const complete = axes.every((a) => a.letter !== null && a.p !== null);
  return {
    axes,
    type: complete ? axes.map((a) => a.letter).join("") : null,
    pendingTiebreakers: axes.filter((a) => a.needsTiebreaker).map((a) => a.axis),
    undeterminedAxes: axes.filter((a) => a.undetermined).map((a) => a.axis),
    scores: complete ? axes.map((a) => a.p).join("-") : null,
  };
}

/**
 * 相手診断で判定不能の軸があるときの候補（仕様書 2-3）。
 * 判定不能が1軸なら2タイプ、2軸なら4タイプ、3軸以上なら空（答え直しを促す）。
 */
export function candidateTypes(axes: readonly AxisScore[]): string[] {
  const undetermined = axes.filter((a) => a.letter === null);
  if (undetermined.length === 0) return [axes.map((a) => a.letter).join("")];
  if (undetermined.length >= 3) return [];
  let results = [""];
  for (const a of axes) {
    const options = a.letter ? [a.letter] : [...POLE_PAIRS[a.axis]];
    results = results.flatMap((prefix) => options.map((o) => prefix + o));
  }
  return results;
}

/**
 * 結果 URL の p を検証する（仕様書 2-1「結果ページ側での検証」）。
 * 条件を満たせば4軸の割合を、満たさなければ null を返す（個人スコア欄を出さない）。
 */
export function parseScores(type: string, raw: string | null | undefined): number[] | null {
  if (!raw || !/^\d{1,3}-\d{1,3}-\d{1,3}-\d{1,3}$/.test(raw) || !/^[EI][SN][TF][JP]$/.test(type)) return null;
  const values = raw.split("-").map(Number);
  for (const [i, p] of values.entries()) {
    if (!Number.isInteger(p) || p < 0 || p > 100) return null;
    const [first, second] = POLE_PAIRS[AXIS_ORDER[i]];
    if (p > 50 && type[i] !== first) return null;
    if (p < 50 && type[i] !== second) return null;
  }
  return values;
}
