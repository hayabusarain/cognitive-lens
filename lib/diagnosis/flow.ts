/**
 * 診断の画面の進行（仕様書 docs/redesign-spec.md 2-1・2-3）
 *
 * React から切り離した純粋な関数だけを置く。状態と操作を受け取って次の状態を返す flowReducer と、
 * 状態から「いまどの画面を出すか」を導く flowView が中心。単体テストは flow.test.mjs。
 *
 * Node.js の型除去（node --test）でも読めるよう、値の import はしない（型の import だけ。score.ts と同じ方針）。
 * 採点の diagnose・candidateTypes（score.ts）は、呼ぶ側が FlowConfig に入れて渡す。
 *
 * 決まり
 * - 設問は items の順に1問ずつ。全問必須で、飛ばせない
 * - 全問に答えたあと、軸スコアが 0 の軸の決定設問を E/I → S/N → T/F → J/P の順に出す
 * - 「戻る」は直前の回答を取り消す。決定設問も取り消せ、答え直すまで結果へ進まない（T7）
 * - 相手診断だけ「わからない」（null）を受け付ける。判定不能の軸数で、完了・候補・答え直しの案内に分かれる
 */
import type { Axis, Pole, ScaleValue } from "./types";
import type { ScoredItem, candidateTypes, diagnose } from "./score";

const AXIS_ORDER: readonly Axis[] = ["EI", "SN", "TF", "JP"];
const POLE_PAIRS: Readonly<Record<Axis, readonly [Pole, Pole]>> = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};
const SCALE_VALUES: readonly number[] = [3, 2, 1, -1, -2, -3];

/** 途中経過の保存形式の版。形式を変えたら上げる（設問セットの改訂は保存キーの版で扱う） */
const FORMAT_VERSION = 1;

export interface FlowConfig {
  /** 設問（表示順） */
  items: readonly ScoredItem[];
  /** 相手診断の「わからない」を受け付ける */
  allowUnknown: boolean;
  /** score.ts の diagnose */
  diagnose: typeof diagnose;
  /** score.ts の candidateTypes */
  candidateTypes: typeof candidateTypes;
}

/** 1つの回答。value が null のときは「わからない」 */
export type Step =
  | { kind: "item"; id: string; value: ScaleValue | null }
  | { kind: "tiebreaker"; axis: Axis; value: Pole | null };

export interface FlowState {
  /** 答えた順の回答。「戻る」は末尾から取り消す */
  steps: readonly Step[];
  /** 答え直しの途中（相手診断で「わからない」と答えた設問を順に出す）。keys は stepKey の値 */
  revise: { keys: readonly string[]; index: number } | null;
  /** 「戻る」で取り消した回答。同じ設問を出すときに選択肢へ印を付けるだけで、回答には数えない */
  undone: Step | null;
}

export const INITIAL_FLOW: FlowState = { steps: [], revise: null, undone: null };

export type FlowAction =
  /** 設問に答える（null は「わからない」） */
  | { type: "answer"; value: ScaleValue | null }
  /** 決定設問に答える（null は「わからない」） */
  | { type: "choose"; value: Pole | null }
  | { type: "back" }
  /** 候補の画面・答え直しの案内から、「わからない」と答えた設問の答え直しを始める */
  | { type: "revise" }
  | { type: "reset" };

export interface FlowProgress {
  /** items：通常の設問、tiebreakers：決定設問、revise：答え直し */
  phase: "items" | "tiebreakers" | "revise";
  /** 何問目か（1始まり） */
  current: number;
  total: number;
}

export type FlowView =
  | {
      kind: "item";
      item: ScoredItem;
      /** items の中の位置（0始まり） */
      index: number;
      /** 印を付ける選択肢。undefined は印なし、null は「わからない」 */
      selected: ScaleValue | null | undefined;
      progress: FlowProgress;
    }
  | {
      kind: "tiebreaker";
      axis: Axis;
      /** 前の文字と後の文字（画面には出さない） */
      poles: readonly [Pole, Pole];
      selected: Pole | null | undefined;
      progress: FlowProgress;
    }
  /** 4軸が決まった。結果ページへ進む */
  | { kind: "complete"; type: string; scores: string }
  /** 相手診断で判定不能が1〜2軸。候補を2つか4つ出す */
  | { kind: "candidates"; types: string[]; undeterminedAxes: Axis[]; unknownCount: number }
  /** 相手診断で判定不能が3軸以上。候補を出さず、答え直しを促す */
  | { kind: "retry"; undeterminedAxes: Axis[]; unknownCount: number };

/** 回答を指す文字列。設問は ID（q01）、決定設問は tb:EI */
export const stepKey = (step: Step): string => (step.kind === "item" ? step.id : `tb:${step.axis}`);

const isScaleValue = (value: unknown): value is ScaleValue => typeof value === "number" && SCALE_VALUES.includes(value);
const isAxis = (value: unknown): value is Axis => typeof value === "string" && (AXIS_ORDER as readonly string[]).includes(value);

/** 回答を diagnose に渡す形へまとめる */
function collect(steps: readonly Step[]) {
  const answers: Record<string, ScaleValue | null> = {};
  const tiebreakers: Partial<Record<Axis, Pole | null>> = {};
  for (const step of steps) {
    if (step.kind === "item") answers[step.id] = step.value;
    else tiebreakers[step.axis] = step.value;
  }
  return { answers, tiebreakers };
}

/** 決定設問が要る軸（全問に答えた時点で S=0 かつ回答数3以上） */
function axesNeedingTiebreaker(steps: readonly Step[], config: FlowConfig): Set<Axis> {
  const { answers } = collect(steps);
  const result = config.diagnose(config.items, answers, {});
  return new Set(result.axes.filter((a) => a.needsTiebreaker).map((a) => a.axis));
}

/** 答え直しで軸スコアが 0 でなくなった軸の決定設問を、回答から外す */
function pruneTiebreakers(steps: readonly Step[], config: FlowConfig): Step[] {
  const needed = axesNeedingTiebreaker(steps, config);
  return steps.filter((s) => s.kind !== "tiebreaker" || needed.has(s.axis));
}

/** 判定不能の軸にある「わからない」の回答（設問の順、決定設問は最後） */
function unknownKeys(steps: readonly Step[], undeterminedAxes: readonly Axis[], config: FlowConfig): string[] {
  const axisOf = new Map(config.items.map((item) => [item.id, item.axis]));
  const keys: string[] = [];
  for (const step of steps) {
    if (step.value !== null) continue;
    const axis = step.kind === "item" ? axisOf.get(step.id) : step.axis;
    if (axis && undeterminedAxes.includes(axis)) keys.push(stepKey(step));
  }
  const tiebreakerLast = (key: string) => (key.startsWith("tb:") ? 1 : 0);
  return keys.sort((a, b) => tiebreakerLast(a) - tiebreakerLast(b));
}

/** 答え直しの位置を、まだ回答に残っている設問まで dir の向きに進める。範囲を出たら答え直しを終える */
function settleRevise(revise: NonNullable<FlowState["revise"]>, steps: readonly Step[], dir: 1 | -1): FlowState["revise"] {
  const present = new Set(steps.map(stepKey));
  let index = revise.index;
  while (index >= 0 && index < revise.keys.length && !present.has(revise.keys[index])) index += dir;
  if (index < 0 || index >= revise.keys.length) return null;
  return { keys: revise.keys, index };
}

/** いまどの画面を出すか */
export function flowView(state: FlowState, config: FlowConfig): FlowView {
  const { answers, tiebreakers } = collect(state.steps);

  if (state.revise) {
    const key = state.revise.keys[state.revise.index];
    const step = state.steps.find((s) => stepKey(s) === key);
    const progress: FlowProgress = { phase: "revise", current: state.revise.index + 1, total: state.revise.keys.length };
    if (step?.kind === "item") {
      const index = config.items.findIndex((item) => item.id === step.id);
      if (index >= 0) return { kind: "item", item: config.items[index], index, selected: step.value, progress };
    } else if (step?.kind === "tiebreaker") {
      return { kind: "tiebreaker", axis: step.axis, poles: POLE_PAIRS[step.axis], selected: step.value, progress };
    }
  }

  const index = config.items.findIndex((item) => answers[item.id] === undefined);
  if (index >= 0) {
    const item = config.items[index];
    const undone = state.undone;
    const selected = undone?.kind === "item" && undone.id === item.id ? undone.value : undefined;
    return { kind: "item", item, index, selected, progress: { phase: "items", current: index + 1, total: config.items.length } };
  }

  const result = config.diagnose(config.items, answers, tiebreakers);
  if (result.pendingTiebreakers.length > 0) {
    const axis = result.pendingTiebreakers[0];
    const answered = state.steps.filter((s) => s.kind === "tiebreaker").length;
    const undone = state.undone;
    const selected = undone?.kind === "tiebreaker" && undone.axis === axis ? undone.value : undefined;
    return {
      kind: "tiebreaker",
      axis,
      poles: POLE_PAIRS[axis],
      selected,
      progress: { phase: "tiebreakers", current: answered + 1, total: answered + result.pendingTiebreakers.length },
    };
  }

  if (result.type && result.scores) return { kind: "complete", type: result.type, scores: result.scores };

  const undeterminedAxes = result.undeterminedAxes;
  const unknownCount = unknownKeys(state.steps, undeterminedAxes, config).length;
  const types = config.candidateTypes(result.axes);
  if (types.length > 0) return { kind: "candidates", types, undeterminedAxes, unknownCount };
  return { kind: "retry", undeterminedAxes, unknownCount };
}

function commit(state: FlowState, step: Step, config: FlowConfig): FlowState {
  if (!state.revise) return { steps: [...state.steps, step], revise: null, undone: null };
  // 答え直し：同じ設問の回答を置き換え、次の「わからない」へ進む
  const key = stepKey(step);
  const steps = pruneTiebreakers(
    state.steps.map((s) => (stepKey(s) === key ? step : s)),
    config,
  );
  const revise = settleRevise({ keys: state.revise.keys, index: state.revise.index + 1 }, steps, 1);
  return { steps, revise, undone: null };
}

export function flowReducer(state: FlowState, action: FlowAction, config: FlowConfig): FlowState {
  switch (action.type) {
    case "reset":
      return INITIAL_FLOW;

    case "back": {
      if (state.revise) {
        const revise = settleRevise({ keys: state.revise.keys, index: state.revise.index - 1 }, state.steps, -1);
        return { ...state, revise, undone: null };
      }
      if (state.steps.length === 0) return state;
      return { steps: state.steps.slice(0, -1), revise: null, undone: state.steps[state.steps.length - 1] };
    }

    case "answer": {
      const view = flowView(state, config);
      if (view.kind !== "item") return state;
      const valid = isScaleValue(action.value) || (action.value === null && config.allowUnknown);
      if (!valid) return state;
      return commit(state, { kind: "item", id: view.item.id, value: action.value }, config);
    }

    case "choose": {
      const view = flowView(state, config);
      if (view.kind !== "tiebreaker") return state;
      const valid = action.value === null ? config.allowUnknown : view.poles.includes(action.value);
      if (!valid) return state;
      return commit(state, { kind: "tiebreaker", axis: view.axis, value: action.value }, config);
    }

    case "revise": {
      const view = flowView(state, config);
      if (view.kind !== "candidates" && view.kind !== "retry") return state;
      const keys = unknownKeys(state.steps, view.undeterminedAxes, config);
      if (keys.length === 0) return state;
      return { ...state, revise: { keys, index: 0 }, undone: null };
    }
  }
}

/** 戻れるか（最初の設問では戻れない） */
export const canGoBack = (state: FlowState): boolean => state.steps.length > 0 || state.revise !== null;

/**
 * 結果ページの URL（仕様書 2-1・2-3）。
 * 自己診断は /ja/result/{TYPE}?p=…、相手診断は末尾に from=target を付ける。候補（scores なし）は p を付けない
 */
export function resultHref(type: string, scores: string | null, mode: "self" | "target"): string {
  const params = new URLSearchParams();
  if (scores) params.set("p", scores);
  if (mode === "target") params.set("from", "target");
  const query = params.toString();
  return `/ja/result/${type}${query ? `?${query}` : ""}`;
}

type StoredStep = [key: string, value: number | string | null];

const toStored = (step: Step): StoredStep => [stepKey(step), step.value];

/** 途中経過を sessionStorage に入れる文字列にする */
export function serializeFlow(state: FlowState): string {
  return JSON.stringify({
    v: FORMAT_VERSION,
    steps: state.steps.map(toStored),
    revise: state.revise,
    undone: state.undone ? toStored(state.undone) : null,
  });
}

/** 保存形式の1件を回答に戻す。形が合わなければ null */
function fromStored(raw: unknown, config: FlowConfig): Step | null {
  if (!Array.isArray(raw) || raw.length !== 2 || typeof raw[0] !== "string") return null;
  const [key, value] = raw as [string, unknown];
  if (value === null && !config.allowUnknown) return null;
  if (key.startsWith("tb:")) {
    const axis = key.slice(3);
    if (!isAxis(axis)) return null;
    if (value !== null && !POLE_PAIRS[axis].includes(value as Pole)) return null;
    return { kind: "tiebreaker", axis, value: value as Pole | null };
  }
  if (!config.items.some((item) => item.id === key)) return null;
  if (value !== null && !isScaleValue(value)) return null;
  return { kind: "item", id: key, value: value as ScaleValue | null };
}

/**
 * 保存した途中経過を読み戻す。
 * 設問の順に答えた形になっていない、要らない決定設問がある、完了している（完了時に消すので、残っていれば壊れた値）など、
 * 画面の進行で作れない値は捨てて null を返す
 */
export function restoreFlow(raw: string | null | undefined, config: FlowConfig): FlowState | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const { v, steps: rawSteps, revise: rawRevise, undone: rawUndone } = data as Record<string, unknown>;
  if (v !== FORMAT_VERSION || !Array.isArray(rawSteps)) return null;

  const steps: Step[] = [];
  for (const entry of rawSteps) {
    const step = fromStored(entry, config);
    if (!step) return null;
    steps.push(step);
  }

  // 設問は先頭から順に答えている。決定設問は全問のあとで、軸ごとに1つ、要る軸だけ
  const itemSteps = steps.filter((s) => s.kind === "item");
  const tiebreakerSteps = steps.filter((s) => s.kind === "tiebreaker");
  // 設問の数より多い履歴は、壊れているか別の版のもの。先に弾かないと config.items[i] が undefined になる
  if (itemSteps.length > config.items.length) return null;
  if (!itemSteps.every((s, i) => s.id === config.items[i].id)) return null;
  if (tiebreakerSteps.length > 0) {
    if (itemSteps.length !== config.items.length) return null;
    if (!steps.slice(0, itemSteps.length).every((s) => s.kind === "item")) return null;
    const needed = axesNeedingTiebreaker(steps, config);
    const axes = tiebreakerSteps.map((s) => s.axis);
    if (new Set(axes).size !== axes.length || !axes.every((axis) => needed.has(axis))) return null;
  }

  let revise: FlowState["revise"] = null;
  if (rawRevise !== null && rawRevise !== undefined) {
    const r = rawRevise as { keys?: unknown; index?: unknown };
    const keys = r.keys;
    const present = new Set(steps.map(stepKey));
    if (
      !Array.isArray(keys) ||
      keys.length === 0 ||
      !keys.every((k) => typeof k === "string") ||
      new Set(keys).size !== keys.length ||
      !Number.isInteger(r.index) ||
      (r.index as number) < 0 ||
      (r.index as number) >= keys.length ||
      !present.has(keys[r.index as number]) ||
      itemSteps.length !== config.items.length
    ) {
      return null;
    }
    revise = { keys: keys as string[], index: r.index as number };
  }

  const undone = rawUndone === null || rawUndone === undefined ? null : fromStored(rawUndone, config);
  if (rawUndone && !undone) return null;

  const state: FlowState = { steps, revise, undone };
  if (flowView(state, config).kind === "complete") return null;
  return state;
}
