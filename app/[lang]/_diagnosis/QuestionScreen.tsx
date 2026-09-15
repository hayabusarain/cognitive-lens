import type { Ref } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

/**
 * 設問1問の画面（デザイン案の「自己診断の設問」）。進み具合、設問のカード、選択肢、戻る。
 * 自己診断と相手診断で共用する。選択肢を押すと親が次の設問へ進める。
 * 軸名や、選択肢に対応する文字は出さない（仕様書 2-1）
 */
export interface ChoiceOption {
  key: string;
  label: string;
  /** 前に選んだ答え（戻ったときと答え直しのとき） */
  selected: boolean;
  /** 前の選択肢との間を空ける（6段階の「ややあてはまる」と「あまりあてはまらない」の間） */
  gapBefore?: "sm" | "lg";
  /** 「わからない」。枠を点線にして、尺度の選択肢と見分けられるようにする */
  unknown?: boolean;
}

interface QuestionScreenProps {
  /** 設問番号などの小さなラベル（例：Q.04、追加の設問） */
  label: string;
  /** 設問の上に置く一文（決定設問の説明など） */
  lead?: string;
  text: string;
  options: readonly ChoiceOption[];
  onSelect: (key: string) => void;
  progress: { current: number; total: number; label?: string; percent: number; valueText: string };
  canGoBack: boolean;
  onBack: () => void;
  /** 設問が変わったときにフォーカスを移す先 */
  headingRef: Ref<HTMLHeadingElement>;
  /** 選んでから次へ進むまでの間。重ねて押せないようにする */
  busy: boolean;
}

export function QuestionScreen({
  label,
  lead,
  text,
  options,
  onSelect,
  progress,
  canGoBack,
  onBack,
  headingRef,
  busy,
}: QuestionScreenProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-label="進み具合"
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.current}
          aria-valuetext={progress.valueText}
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface"
        >
          <div className="h-full rounded-full bg-fg motion-safe:transition-[width]" style={{ width: `${progress.percent}%` }} />
        </div>
        <p aria-hidden="true" className="flex shrink-0 items-baseline gap-2 leading-none">
          {progress.label && <span className="text-label font-bold text-muted">{progress.label}</span>}
          <span className="font-display text-lead leading-none">
            {progress.current}
            <span className="text-note text-muted"> / {progress.total}</span>
          </span>
        </p>
      </div>

      {/* 斜めの縞の外枠と、暗い内面 */}
      <div className="mt-4 rounded-card bg-[repeating-linear-gradient(135deg,#2A2F3A_0_8px,#232730_8px_16px)] p-1.5">
        <div className="rounded-[14px] bg-surface px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
          {/* 英数字のラベル（Q.04）だけ表示用の書体にする。和文は太字 */}
          <p className={`text-note leading-none text-muted ${/^[ -~]+$/.test(label) ? "font-display" : "font-bold"}`}>{label}</p>
          {lead && <p className="mt-3 text-note text-muted">{lead}</p>}
          <h2
            ref={headingRef}
            id="question-text"
            tabIndex={-1}
            className="palt text-phrase mt-2 text-h2 font-black leading-[1.6]"
          >
            {text}
          </h2>
          <div role="group" aria-labelledby="question-text" className="mt-4 grid">
            {options.map((option, i) => (
              <button
                key={option.key}
                type="button"
                onClick={() => onSelect(option.key)}
                aria-disabled={busy || undefined}
                className={[
                  "flex min-h-13 w-full cursor-pointer items-center gap-3 rounded-panel border-2 px-4 py-2.5 text-left text-lead font-bold leading-snug",
                  "motion-safe:transition-colors motion-safe:active:scale-[0.99]",
                  i === 0 ? "" : option.gapBefore === "lg" ? "mt-5" : option.gapBefore === "sm" ? "mt-4" : "mt-2",
                  option.selected
                    ? "border-fg bg-fg text-ink"
                    : `${option.unknown ? "border-dashed" : ""} border-line bg-surface hover:border-muted`,
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className={`size-5 shrink-0 rounded-full ${option.selected ? "border-[6px] border-ink" : "border-2 border-muted"}`}
                />
                <span className="text-phrase min-w-0">
                  {option.label}
                  {option.selected && <span className="sr-only">（選んだ答え）</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Button variant="secondary" onClick={onBack} disabled={!canGoBack}>
          <span className="inline-flex items-center gap-1.5">
            <ArrowLeft aria-hidden="true" className="size-4" />
            戻る
          </span>
        </Button>
        <p className="text-right text-note text-muted">選ぶと次の設問に進みます</p>
      </div>
    </div>
  );
}
