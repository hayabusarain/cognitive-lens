"use client";

import { useEffect, useRef, useState } from "react";
import type { TypeCode } from "@/lib/type-codes";
import { ROMANCE } from "@/lib/romance/items";
import { readRomanceAiResponse, shouldRequestAiText } from "@/lib/romance/ai-text";
import { TypePicker } from "./TypePicker";
import { QuestionStep } from "./QuestionStep";
import { ResultStep, type AiState } from "./ResultStep";

/**
 * 脈あり度チェックの進行（仕様書 2-4）
 *   1. 相手のタイプを16個から選ぶ
 *   2. ROMANCE[type].questions に1問ずつ「はい」「いいえ」で答える（戻れる）
 *   3. 脈あり度と段階をすぐに出し、そのあと POST /api/romance-ai で AI 文を取りに行く。
 *      AI 文の取得に失敗しても、「はい」が0件で取りに行かなくても、脈あり度と段階の説明は出したままにする
 * 回答はこの画面の中だけで持ち、URL・保存領域・計測には出さない
 */

type Step = "pick" | "question" | "result";

/** 続けて押したときに、次の設問まで同じ答えで進んでしまわないよう、切り替わった直後の押下を無視する時間 */
const ANSWER_LOCK_MS = 300;

export function RomanceChecker() {
  const [type, setType] = useState<TypeCode | null>(null);
  const [answers, setAnswers] = useState<(boolean | undefined)[]>([]);
  const [index, setIndex] = useState(0);
  const [ai, setAi] = useState<AiState>({ status: "idle" });

  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const lockUntil = useRef(0);

  const total = type ? ROMANCE[type].questions.length : 0;
  const step: Step = type === null ? "pick" : index < total ? "question" : "result";

  // 段階が変わったら、その段階の見出しへフォーカスを移す。選択の途中で下までスクロールしていたら、先頭まで戻す
  const shownStep = useRef<Step>(step);
  useEffect(() => {
    if (shownStep.current === step) return;
    shownStep.current = step;
    const root = rootRef.current;
    if (root && root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  // 画面を離れたら、取得中の AI 文を捨てる
  useEffect(() => () => requestRef.current?.abort(), []);

  async function requestAiText(target: TypeCode, finalAnswers: boolean[]) {
    requestRef.current?.abort();
    if (!shouldRequestAiText(finalAnswers)) {
      setAi({ status: "none" });
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setAi({ status: "loading" });

    let status: number | null = null;
    let body: unknown = null;
    try {
      const res = await fetch("/api/romance-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: target, answers: finalAnswers }),
        signal: controller.signal,
      });
      status = res.status;
      body = await res.json().catch(() => null);
    } catch {
      // ネットワークの失敗（status は null のまま）。やり直しなどで中断したときは下で捨てる
    }
    if (controller.signal.aborted) return;
    setAi({ status: "done", result: readRomanceAiResponse(status, body) });
  }

  function pick(next: TypeCode) {
    setType(next);
    setAnswers([]);
    setIndex(0);
    setAi({ status: "idle" });
    lockUntil.current = performance.now() + ANSWER_LOCK_MS;
  }

  function answer(value: boolean) {
    if (!type || performance.now() < lockUntil.current) return;
    lockUntil.current = performance.now() + ANSWER_LOCK_MS;
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
    setIndex(index + 1);
    if (index + 1 === total) {
      void requestAiText(type, Array.from({ length: total }, (_, i) => next[i] === true));
    }
  }

  function back() {
    if (index === 0) {
      setType(null);
      return;
    }
    setIndex(index - 1);
  }

  function reset() {
    requestRef.current?.abort();
    setType(null);
    setAnswers([]);
    setIndex(0);
    setAi({ status: "idle" });
  }

  const finalAnswers = Array.from({ length: total }, (_, i) => answers[i] === true);

  return (
    <div ref={rootRef} className="scroll-mt-4">
      {step === "pick" && <TypePicker headingRef={headingRef} onPick={pick} />}
      {step === "question" && type && (
        <QuestionStep
          headingRef={headingRef}
          type={type}
          index={index}
          total={total}
          question={ROMANCE[type].questions[index]}
          selected={answers[index]}
          onAnswer={answer}
          onBack={back}
        />
      )}
      {step === "result" && type && (
        <ResultStep
          headingRef={headingRef}
          type={type}
          answers={finalAnswers}
          ai={ai}
          onRetry={() => void requestAiText(type, finalAnswers)}
          onBack={() => setIndex(total - 1)}
          onReset={reset}
        />
      )}
    </div>
  );
}
