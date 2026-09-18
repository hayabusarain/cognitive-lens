"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Axis, Item, Tiebreaker } from "@/lib/diagnosis/types";
import { SCALE } from "@/lib/diagnosis/types";
import { candidateTypes, diagnose } from "@/lib/diagnosis/score";
import {
  INITIAL_FLOW,
  canGoBack,
  flowReducer,
  flowView,
  restoreFlow,
  resultHref,
  serializeFlow,
  type FlowAction,
  type FlowConfig,
  type FlowView,
} from "@/lib/diagnosis/flow";
import { isTypeCode, type TypeCode } from "@/lib/type-codes";
import { trackDiagnosisComplete } from "@/lib/analytics";
import { useStoredString } from "@/app/components/use-stored-string";
import { QuestionScreen, type ChoiceOption } from "./QuestionScreen";
import { TargetOutcome } from "./TargetOutcome";

/**
 * 自己診断と相手診断の進行（仕様書 2-1・2-3）。進行の決まりは lib/diagnosis/flow.ts にあり、ここは画面と保存だけを持つ。
 * 設問はサーバーのページから受け取り、最初の描画（HTML）は1問目になる。
 * 途中経過は sessionStorage に保存し、完了したら消してから結果ページへ移る。回答はサーバーにも計測にも送らない。
 */
export type DiagnosisMode = "self" | "target";

/** 途中経過の保存キー。設問セットを改訂したら版を上げる */
const STORAGE_KEYS: Record<DiagnosisMode, string> = {
  self: "cl:test:v1",
  target: "cl:target:v1",
};

/** 選んだ答えを見せてから次の設問へ進むまでの時間（ミリ秒）。続けて押した指が次の設問に当たらないようにする */
const ADVANCE_DELAY = 150;

const UNKNOWN_LABEL = "わからない";

interface DiagnosisFlowProps {
  mode: DiagnosisMode;
  items: readonly Item[];
  tiebreakers: Readonly<Record<Axis, Tiebreaker>>;
  /** 相手診断の候補カードに添える一行説明 */
  taglines?: Readonly<Record<TypeCode, string>>;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** 画面が変わったかを見分けるための文字列 */
function viewKey(view: FlowView): string {
  if (view.kind === "item") return `${view.progress.phase}:${view.item.id}`;
  if (view.kind === "tiebreaker") return `${view.progress.phase}:tb:${view.axis}`;
  return view.kind;
}

export function DiagnosisFlow({ mode, items, tiebreakers, taglines }: DiagnosisFlowProps) {
  const router = useRouter();
  const config = useMemo<FlowConfig>(
    () => ({ items, allowUnknown: mode === "target", diagnose, candidateTypes }),
    [items, mode],
  );
  const [raw, setRaw] = useStoredString(STORAGE_KEYS[mode]);
  // 保存が壊れていても1問目から始められるようにする（restoreFlow は形が違えば null を返すが、念のため）
  const state = useMemo(() => {
    try {
      return restoreFlow(raw, config) ?? INITIAL_FLOW;
    } catch {
      return INITIAL_FLOW;
    }
  }, [raw, config]);
  const view = flowView(state, config);

  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocus = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // 操作で画面が変わったら、新しい設問（か案内の見出し）へフォーカスを移す。読み上げで次の設問が伝わる
  const currentKey = viewKey(view);
  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    headingRef.current?.focus();
  }, [currentKey]);

  function dispatch(action: FlowAction) {
    const next = flowReducer(state, action, config);
    if (next === state) return;
    shouldFocus.current = true;
    const nextView = flowView(next, config);
    if (nextView.kind === "complete") {
      setLeaving(true);
      setRaw(null);
      if (isTypeCode(nextView.type)) trackDiagnosisComplete(nextView.type, mode);
      router.push(resultHref(nextView.type, nextView.scores, mode));
      return;
    }
    setRaw(next.steps.length === 0 && next.revise === null ? null : serializeFlow(next));
  }

  /** 選んだ答えに印を付けてから進む */
  function select(key: string, action: FlowAction) {
    if (pendingKey !== null) return;
    setPendingKey(key);
    timer.current = window.setTimeout(() => {
      setPendingKey(null);
      dispatch(action);
    }, ADVANCE_DELAY);
  }

  function back() {
    if (pendingKey !== null) return;
    dispatch({ type: "back" });
  }

  if (leaving || view.kind === "complete") {
    return (
      <p role="status" className="mt-6 rounded-panel bg-surface px-4 py-6 text-center font-bold">
        結果のページを開いています
      </p>
    );
  }

  if (view.kind === "candidates" || view.kind === "retry") {
    return (
      <TargetOutcome
        kind={view.kind}
        types={view.kind === "candidates" ? view.types.filter(isTypeCode) : []}
        hrefOf={(type) => resultHref(type, null, "target")}
        taglines={taglines ?? ({} as Record<TypeCode, string>)}
        unknownCount={view.unknownCount}
        onRevise={() => dispatch({ type: "revise" })}
        onBack={back}
        onReset={() => dispatch({ type: "reset" })}
        headingRef={headingRef}
      />
    );
  }

  const revising = view.progress.phase === "revise";
  const { current, total } = view.progress;
  const unknownOption = (selected: boolean): ChoiceOption => ({ key: "unknown", label: UNKNOWN_LABEL, selected, gapBefore: "lg", unknown: true });
  const isSelected = (key: string, previous: boolean) => (pendingKey !== null ? pendingKey === key : previous);

  let label: string;
  let lead: string | undefined;
  let text: string;
  let options: ChoiceOption[];
  let actionOf: (key: string) => FlowAction;
  let progressLabel: string | undefined;
  let percent: number;
  let valueText: string;

  if (view.kind === "item") {
    const item = items[view.index];
    label = `Q.${pad2(view.index + 1)}`;
    text = item.text;
    options = SCALE.map((s, i) => ({
      key: String(s.value),
      label: s.label,
      selected: isSelected(String(s.value), view.selected === s.value),
      gapBefore: i === 3 ? "sm" : undefined,
    }));
    if (config.allowUnknown) options.push(unknownOption(isSelected("unknown", view.selected === null)));
    actionOf = (key) => ({ type: "answer", value: key === "unknown" ? null : (Number(key) as (typeof SCALE)[number]["value"]) });
  } else {
    const tiebreaker = tiebreakers[view.axis];
    label = "追加の設問";
    lead = revising
      ? undefined
      : mode === "self"
        ? "答えが半々に分かれた部分があるので、近いほうを選んでください。"
        : "答えが半々に分かれた部分があるので、あの人に近いほうを選んでください。";
    text = tiebreaker.prompt;
    const [first, second] = view.poles;
    options = [
      { key: first, label: tiebreaker.first, selected: isSelected(first, view.selected === first) },
      { key: second, label: tiebreaker.second, selected: isSelected(second, view.selected === second) },
    ];
    if (config.allowUnknown) options.push(unknownOption(isSelected("unknown", view.selected === null)));
    actionOf = (key) => ({ type: "choose", value: key === "unknown" ? null : (key as typeof first) });
  }

  if (revising) {
    progressLabel = "答え直し";
    percent = (current / total) * 100;
    valueText = `答え直し ${total}問中${current}問目`;
  } else if (view.kind === "tiebreaker") {
    progressLabel = "追加";
    percent = 100;
    valueText = `追加の設問 ${total}問中${current}問目`;
  } else {
    percent = (current / total) * 100;
    valueText = `${total}問中${current}問目`;
  }

  return (
    <QuestionScreen
      label={label}
      lead={lead}
      text={text}
      options={options}
      onSelect={(key) => select(key, actionOf(key))}
      progress={{ current, total, label: progressLabel, percent, valueText }}
      canGoBack={canGoBack(state)}
      onBack={back}
      onReset={() => dispatch({ type: "reset" })}
      headingRef={headingRef}
      busy={pendingKey !== null}
    />
  );
}
