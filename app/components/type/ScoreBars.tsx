import type { ReactNode } from "react";
import type { TypeCode } from "@/lib/type-codes";
import { AXES, type Axis } from "@/lib/diagnosis/types";
import { isClose } from "@/lib/diagnosis/score";

/**
 * 4軸の割合バー（仕様書 3-3、2-1）。表示だけの部品で、URL の読み取りと検証は置く側で行う。
 *   scores …… 前の文字（E・S・T・J）の割合。URL の p と同じ順（例：p=61-33-78-50 → [61, 33, 78, 50]）
 *   type ……… 採用した文字を太字とタイプ色にする。割合が 50 の軸（決定設問で決まった）も型コードで判断する
 *   closeActions … 僅差（42〜58）の軸で、印の横に置くもの（入れ替えたタイプへのリンクなど）
 * タイプ色は外側で指定する（typeColorStyle）
 */
const AXIS_LABELS: Record<Axis, { name: string; first: string; second: string }> = {
  EI: { name: "外向・内向", first: "外向", second: "内向" },
  SN: { name: "感覚・直観", first: "感覚", second: "直観" },
  TF: { name: "思考・感情", first: "思考", second: "感情" },
  JP: { name: "判断・知覚", first: "判断", second: "知覚" },
};

interface ScoreBarsProps {
  type: TypeCode;
  scores: readonly [number, number, number, number];
  closeActions?: Partial<Record<Axis, ReactNode>>;
  className?: string;
}

function Side({ label, percent, win }: { label: string; percent: number; win: boolean }) {
  return (
    <span className={win ? "font-black text-fg" : ""}>
      {label}
      <span className={`ml-1 font-display text-lead font-normal ${win ? "text-type" : ""}`}>{percent}%</span>
    </span>
  );
}

export function ScoreBars({ type, scores, closeActions, className = "" }: ScoreBarsProps) {
  return (
    <ul className={`divide-y divide-line ${className}`}>
      {AXES.map((axis, i) => {
        const p = Math.min(100, Math.max(0, Math.round(scores[i])));
        const label = AXIS_LABELS[axis];
        const firstWins = type[i] === axis[0];
        return (
          <li key={axis} className="py-2.5">
            <p className="flex items-center justify-between gap-2 leading-snug text-muted">
              <span className="sr-only">{label.name}：</span>
              <Side label={label.first} percent={p} win={firstWins} />
              <Side label={label.second} percent={100 - p} win={!firstWins} />
            </p>
            <div aria-hidden="true" className="mt-2 flex h-3 gap-0.5 overflow-hidden rounded-md bg-line">
              <span className={firstWins ? "bg-type" : "bg-track"} style={{ width: `${p}%` }} />
              <span className={firstWins ? "bg-track" : "bg-type"} style={{ width: `${100 - p}%` }} />
            </div>
            {isClose(p) && (
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <span className="rounded-full bg-fg px-2.5 py-1.5 text-note font-black leading-none text-ink">僅差</span>
                {closeActions?.[axis]}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
