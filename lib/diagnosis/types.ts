/** 自己診断・相手診断で共通の型（仕様書 2-1、5-2）。設問の本文はステップ 2-6・2-7 で lib/diagnosis/items.ts・lib/target/items.ts に書く */
export const AXES = ["EI", "SN", "TF", "JP"] as const;
export type Axis = (typeof AXES)[number];
export type Pole = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

/** 軸ごとの前の文字と後の文字 */
export const POLES: Readonly<Record<Axis, readonly [Pole, Pole]>> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};

export interface Item {
  /** q01〜q24。途中経過の保存と単体テストで使う */
  id: string;
  axis: Axis;
  /** この設問が述べている傾向の文字 */
  keyed: Pole;
  /** 45字以内 */
  text: string;
}

export interface Tiebreaker {
  prompt: string;
  first: string;
  second: string;
}

export type ScaleValue = 3 | 2 | 1 | -1 | -2 | -3;

/** 中立を置かない6段階の尺度（仕様書 2-1） */
export const SCALE: readonly { label: string; value: ScaleValue }[] = [
  { label: "とてもあてはまる", value: 3 },
  { label: "あてはまる", value: 2 },
  { label: "ややあてはまる", value: 1 },
  { label: "あまりあてはまらない", value: -1 },
  { label: "あてはまらない", value: -2 },
  { label: "まったくあてはまらない", value: -3 },
];
