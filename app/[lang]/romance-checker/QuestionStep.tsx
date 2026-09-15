import type { RefObject } from "react";
import type { TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { typeColorStyle } from "@/lib/type-display";
import { Button } from "@/app/components/ui/Button";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";
import { TypeFrame } from "@/app/components/type/TypeFrame";

/**
 * 脈あり度チェックの2段目：1問ずつ「はい」「いいえ」で答える（デザイン案の設問カードの見た目）。
 * 押すと次の設問に進む。戻ったときは、前に選んだ答えを押された状態で出す
 */

const CHOICES = [
  { value: true, label: "はい" },
  { value: false, label: "いいえ" },
] as const;

interface QuestionStepProps {
  headingRef: RefObject<HTMLHeadingElement | null>;
  type: TypeCode;
  /** 0 から数えた設問の番号 */
  index: number;
  total: number;
  question: string;
  /** 前に選んだ答え（まだなら undefined） */
  selected: boolean | undefined;
  onAnswer: (value: boolean) => void;
  onBack: () => void;
}

export function QuestionStep({ headingRef, type, index, total, question, selected, onAnswer, onBack }: QuestionStepProps) {
  const number = index + 1;
  return (
    <section aria-labelledby="question-heading" className="mt-4 max-w-[37.5rem]" style={typeColorStyle(type)}>
      <div className="flex items-center gap-3">
        <div aria-hidden="true" className="w-12 shrink-0">
          <TypeFrame size="sm" className="[--frame-radius:10px] [--frame:3px]">
            <CharacterFigure type={type} sizes="48px" />
          </TypeFrame>
        </div>
        <h2 id="question-heading" ref={headingRef} tabIndex={-1} className="leading-snug">
          <span className="block text-label font-bold text-muted">相手のタイプ</span>
          <span className="font-display text-lead tracking-[0.02em]">{type}</span>
          <span className="ml-2 font-bold text-type">{TYPE_NAMES[type]}</span>
        </h2>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div
          role="progressbar"
          aria-label="進み具合"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index}
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface"
        >
          <div className="h-full rounded-full bg-type" style={{ width: `${(index / total) * 100}%` }} />
        </div>
        <p className="font-display text-lead leading-none">
          {number}
          <span className="text-note text-muted"> / {total}</span>
        </p>
      </div>

      {/* 斜めの縞の縁（デザイン案の設問カード） */}
      <div className="mt-4 rounded-card bg-[repeating-linear-gradient(135deg,#2A2F3A_0_8px,#232730_8px_16px)] p-1.5">
        <div className="rounded-[14px] bg-surface px-4 pb-6 pt-5 md:px-6 md:pb-8 md:pt-6">
          <div aria-live="polite">
            <p className="font-display text-note leading-none text-muted">Q.{String(number).padStart(2, "0")}</p>
            <p id="question-text" className="palt text-phrase mt-3 text-[1.375rem] font-black leading-relaxed md:text-[1.625rem]">
              {question}
            </p>
          </div>
          <p className="mt-1 text-note text-muted">相手に当てはまりますか</p>
          <div role="group" aria-labelledby="question-text" className="mt-5 grid grid-cols-2 gap-2 md:gap-3">
            {CHOICES.map((choice) => {
              const pressed = selected === choice.value;
              return (
                <button
                  key={choice.label}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => onAnswer(choice.value)}
                  className={`flex min-h-16 cursor-pointer items-center justify-center gap-3 rounded-panel border-2 px-4 text-lead font-bold motion-safe:transition motion-safe:active:scale-[0.99] ${
                    pressed ? "border-fg bg-fg text-ink" : "border-line bg-surface hover:border-muted"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`size-5 shrink-0 rounded-full border-2 ${pressed ? "border-[6px] border-ink" : "border-muted"}`}
                  />
                  {choice.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={onBack}>
          {index === 0 ? "タイプを選び直す" : "戻る"}
        </Button>
        <p className="text-note text-muted">選ぶと次の設問に進みます</p>
      </div>
    </section>
  );
}
