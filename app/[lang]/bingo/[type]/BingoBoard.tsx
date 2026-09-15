"use client";

import { useState } from "react";
import type { TypeCode } from "@/lib/type-codes";
import {
  CELL_COUNT,
  cellToItem,
  cellsInCompletedLines,
  countLines,
  formatMask,
  formatTitle,
  isItemPressed,
  splitTitle,
  titleLevel,
  toggleItem,
} from "@/lib/bingo/board";
import { Card } from "@/app/components/ui/Card";
import { TypeFrame } from "@/app/components/type/TypeFrame";
import { ShareOnX } from "@/app/components/share/ShareOnX";
import { ShareImageButton } from "@/app/components/share/ShareImageButton";

/**
 * ビンゴの盤面と、揃ったライン数・称号・共有（仕様書 2-5、4-5。デザイン案「コレクションカード」の画面5）
 *
 * 押した状態は24ビットの mask で持ち、判定は lib/bingo/board.ts の関数で行う。
 * カード画像の URL（/ja/bingo/{TYPE}/card/{mask}）にも同じ mask を入れる。
 * タイプ色は外側（ページの main）で指定する。
 *   items …… BINGO_DATA[type] の24項目。左上から行ごとに、中央の FREE を飛ばして並べる
 *   titles … BINGO_TITLES の7段階（{type} を含む文）
 */
interface BingoBoardProps {
  type: TypeCode;
  items: readonly string[];
  titles: readonly string[];
  /** 共有するページの URL（https://www.cognitive-lens.com/ja/bingo/{TYPE}） */
  shareUrl: string;
  className?: string;
}

const CELL_BASE =
  "relative flex min-h-[68px] w-full items-center justify-center rounded-lg px-[3px] py-1 text-center text-[12px] leading-tight text-balance [overflow-wrap:anywhere] focus-visible:outline-offset-0 md:aspect-square md:min-h-0 md:p-2 md:text-[15px] md:leading-snug md:text-phrase";

export function BingoBoard({ type, items, titles, shareUrl, className = "" }: BingoBoardProps) {
  const [mask, setMask] = useState(0);

  const lines = countLines(mask);
  const lineCells = cellsInCompletedLines(mask);
  const title = formatTitle(titles[titleLevel(lines)], type);
  const { tag, name } = splitTitle(title);
  const maskText = formatMask(mask);
  const shareText = `偏見だらけの${type}ビンゴは${lines}ライン。称号は「${title}」でした。あなたは何ライン揃う？\n{url}\n#${type} #CognitiveLens`;

  return (
    <div className={`grid gap-6 lg:grid-cols-[minmax(0,600px)_1fr] lg:items-start lg:gap-x-12 ${className}`}>
      <TypeFrame className="w-full max-w-[600px] [--frame-radius:20px] [--frame:5px] md:[--frame:6px]" innerClassName="bg-canvas">
        <div role="group" aria-label={`${type}のビンゴの盤面`} className="grid grid-cols-5 gap-1 p-[5px] md:gap-1.5 md:p-1.5">
          {Array.from({ length: CELL_COUNT }, (_, cell) => {
            const item = cellToItem(cell);
            if (item === null) {
              return (
                <div key={cell} className={`${CELL_BASE} bg-type font-display text-[14px] text-ink md:text-[20px]`}>
                  FREE
                  <span className="sr-only">（はじめから押されています）</span>
                </div>
              );
            }
            const pressed = isItemPressed(mask, item);
            const inLine = lineCells.has(cell);
            const state = inLine
              ? "bg-type text-ink"
              : pressed
                ? "bg-type/15 text-fg shadow-[inset_0_0_0_2px_var(--tc)]"
                : "bg-surface text-fg shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1px_var(--color-muted)]";
            return (
              <button
                key={cell}
                type="button"
                aria-pressed={pressed}
                onClick={() => setMask((prev) => toggleItem(prev, item))}
                className={`${CELL_BASE} cursor-pointer font-bold motion-safe:transition motion-safe:active:scale-95 ${state}`}
              >
                {items[item]}
              </button>
            );
          })}
        </div>
      </TypeFrame>

      <div className="grid w-full max-w-[600px] gap-3 lg:sticky lg:top-6">
        <Card as="section" aria-labelledby="bingo-tally">
          <h2 id="bingo-tally" className="sr-only">
            結果
          </h2>
          <div className="flex items-center gap-4">
            <p className="font-display text-[56px] leading-none text-type">
              {lines}
              <span className="ml-1.5 text-lead text-muted">/ 12</span>
            </p>
            <p className="text-note font-bold leading-snug text-muted">
              ライン
              <br />
              揃った
            </p>
          </div>
          <p className="mt-3">
            {tag && <span className="block text-note font-black leading-snug text-type">{tag}</span>}
            <span className="block text-h2 font-black leading-snug">{name}</span>
          </p>
          {/* 読み上げでは、ライン数か称号が変わったときだけ伝える */}
          <p aria-live="polite" className="sr-only">
            {lines}ライン揃いました。称号は{title}です。
          </p>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <ShareOnX text={shareText} url={shareUrl} contentType="bingo" itemId={type} />
          <ShareImageButton
            imageUrl={`/ja/bingo/${type}/card/${maskText}`}
            fileName={`cognitivelens-bingo-${type}-${maskText}.png`}
            contentType="bingo"
            itemId={type}
            label="カード画像を保存"
          />
        </div>
      </div>
    </div>
  );
}
