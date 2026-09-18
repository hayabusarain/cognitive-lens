"use client";

import type { TypeCode } from "@/lib/type-codes";
import {
  CELL_COUNT,
  cellToItem,
  cellsInCompletedLines,
  countLines,
  formatMask,
  formatTitle,
  isItemPressed,
  parseMask,
  splitTitle,
  titleLevel,
  toggleItem,
} from "@/lib/bingo/board";
import { Card } from "@/app/components/ui/Card";
import { TypeFrame } from "@/app/components/type/TypeFrame";
import { ShareOnX } from "@/app/components/share/ShareOnX";
import { ShareLink } from "@/app/components/share/ShareLink";
import { ShareImageButton } from "@/app/components/share/ShareImageButton";
import { useStoredString } from "@/app/components/use-stored-string";

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
  // 押した状態は sessionStorage に残す。カード画像を保存する前に、再読み込みや
  // 別アプリからの復帰で24マスの操作が消えないようにする（値は URL と同じ6桁の16進数）
  const [stored, setStored] = useStoredString(`cl:bingo:${type}:v1`);
  const mask = stored ? (parseMask(stored) ?? 0) : 0;
  const setMask = (next: number) => setStored(formatMask(next));

  const lines = countLines(mask);
  const lineCells = cellsInCompletedLines(mask);
  const title = formatTitle(titles[titleLevel(lines)], type);
  const { tag, name } = splitTitle(title);
  const maskText = formatMask(mask);
  // 共有シートには URL を別に渡すので、本文だけを分けて持つ
  const shareBody = `偏見だらけの${type}ビンゴは${lines}ライン。称号は「${title}」でした。あなたは何ライン揃う？`;
  const shareText = `${shareBody}\n{url}\n#${type} #CognitiveLens`;

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
                onClick={() => setMask(toggleItem(mask, item))}
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
          <ShareLink title={`偏見だらけの${type}ビンゴ`} text={shareBody} url={shareUrl} contentType="bingo" itemId={type} />
          <ShareImageButton
            className="col-span-2"
            imageUrl={`/ja/bingo/${type}/card/${maskText}`}
            fileName={`cognitivelens-bingo-${type}-${maskText}.png`}
            contentType="bingo"
            itemId={type}
            label="カード画像を保存"
          />
        </div>
        {mask !== 0 && (
          <p className="mt-2 text-center">
            <button
              type="button"
              onClick={() => setStored(null)}
              className="inline-flex min-h-11 cursor-pointer items-center px-2 text-note text-muted underline underline-offset-4 hover:text-fg"
            >
              盤面を消す
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
