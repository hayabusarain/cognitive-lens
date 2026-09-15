"use client";

import Link from "next/link";
import { useId, type ReactNode } from "react";
import type { TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { AXES, POLES, type Axis } from "@/lib/diagnosis/types";
import { isClose } from "@/lib/diagnosis/score";
import { Card } from "@/app/components/ui/Card";
import { Eyebrow, Heading } from "@/app/components/ui/Heading";
import { ScoreBars } from "@/app/components/type/ScoreBars";
import { ResultShare } from "@/app/[lang]/result/_components/ResultShare";
import { useResultQuery, type ResultScores } from "@/app/[lang]/result/_components/use-result-query";
import { RESULT_EYEBROW_DEFAULT } from "@/app/[lang]/result/_components/labels";

/** ヒーロー上の小さな文言。診断から来たら「あなたのタイプ」、相手診断から来たら「あの人のタイプ」 */
export function ResultEyebrow({ type, className }: { type: TypeCode; className?: string }) {
  const { scores, target } = useResultQuery(type);
  const label = scores ? (target ? "あの人のタイプ" : "あなたのタイプ") : RESULT_EYEBROW_DEFAULT;
  return <Eyebrow className={className}>{label}</Eyebrow>;
}

/** その軸の文字だけを入れ替えた型コード */
function swapLetter(type: TypeCode, axisIndex: number): TypeCode {
  const [first, second] = POLES[AXES[axisIndex]];
  const letter = type[axisIndex] === first ? second : first;
  return (type.slice(0, axisIndex) + letter + type.slice(axisIndex + 1)) as TypeCode;
}

/** 僅差の軸に置くもの：入れ替えたタイプの結果ページへのリンク。割合が 50 なら決定の2択で決まったことも添える（仕様書 2-1） */
function closeActionsFor(type: TypeCode, scores: ResultScores): Partial<Record<Axis, ReactNode>> {
  const actions: Partial<Record<Axis, ReactNode>> = {};
  AXES.forEach((axis, i) => {
    if (!isClose(scores[i])) return;
    const other = swapLetter(type, i);
    actions[axis] = (
      <span className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3">
        {scores[i] === 50 && <span className="text-note text-muted">追加の2択で決まりました</span>}
        <Link href={`/ja/result/${other}`} className="inline-flex min-h-11 items-center font-bold underline underline-offset-4">
          <span className="mr-1 font-display font-normal">{other}</span>（{TYPE_NAMES[other]}）も読む
        </Link>
      </span>
    );
  });
  return actions;
}

/**
 * 個人スコア欄と共有（仕様書 3-3・3-4 の2・3番目）。
 * p が正しいときだけ4軸の割合を出し、不正ならエラーも出さずに欄ごと省く。共有はいつも出す
 */
export function ResultPersonal({ type, shareText }: { type: TypeCode; shareText: string }) {
  const { scores, target } = useResultQuery(type);
  const headingId = useId();

  return (
    <>
      {scores && (
        <Card as="section" aria-labelledby={headingId}>
          <Heading level={2} id={headingId} className="mb-1">
            {target ? "あの人の割合" : "あなたの割合"}
          </Heading>
          <ScoreBars type={type} scores={scores} closeActions={closeActionsFor(type, scores)} />
        </Card>
      )}
      <ResultShare type={type} shareText={shareText} scores={scores} target={target} />
    </>
  );
}
