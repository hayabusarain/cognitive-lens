import type { RefObject } from "react";
import { TYPE_CODES, type TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { ROMANCE } from "@/lib/romance/items";
import { typeColorStyle } from "@/lib/type-display";
import { ButtonLink } from "@/app/components/ui/Button";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";

/**
 * 脈あり度チェックの1段目：相手のタイプを16個から選ぶ（TypeCard を小さくしたボタン）。
 * 並びは一覧と同じアルファベット順。わからなければ相手診断へ案内する
 */

/** 設問数（タイプごとに12問以内。案内文には最も多い数を出す） */
const MAX_QUESTIONS = Math.max(...Object.values(ROMANCE).map((set) => set.questions.length));

/** スマートフォンで最初の画面に見えるボタンの数（画像を先に読む） */
const EAGER_COUNT = 4;

export function TypePicker({
  headingRef,
  onPick,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  onPick: (type: TypeCode) => void;
}) {
  return (
    <section aria-labelledby="pick-heading">
      <p className="mt-3 max-w-prose text-muted">
        相手のタイプを選び、そのタイプらしい行動{MAX_QUESTIONS}問に「はい」「いいえ」で答えると、脈あり度が0〜100%で出ます。
      </p>

      <h2 id="pick-heading" ref={headingRef} tabIndex={-1} className="palt mt-8 text-h2 font-black">
        相手のタイプを選んでください
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {TYPE_CODES.map((type, i) => (
          <li key={type}>
            <button
              type="button"
              onClick={() => onPick(type)}
              style={typeColorStyle(type)}
              className="group flex min-h-16 w-full cursor-pointer items-center gap-2.5 rounded-panel border-2 border-line bg-surface p-1.5 pr-2 text-left hover:border-type motion-safe:transition motion-safe:active:translate-y-0.5"
            >
              <CharacterFigure
                type={type}
                sizes="56px"
                loading={i < EAGER_COUNT ? "eager" : "lazy"}
                className="w-11 shrink-0 md:w-14"
              />
              <span className="min-w-0">
                <span className="block font-display text-lead leading-tight tracking-[0.02em]">{type}</span>
                <span className="block text-note font-bold leading-snug text-muted group-hover:text-fg">
                  {TYPE_NAMES[type]}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-10 max-w-prose rounded-panel border border-line p-4">
        <p className="font-bold">相手のタイプがわからないとき</p>
        <p className="mt-1 text-muted">相手の普段の様子について24問に答えると、近いタイプを推測できます。</p>
        <ButtonLink href="/ja/target-diagnosis" variant="secondary" meta="24問" className="mt-3 w-full md:w-auto md:min-w-80">
          相手のタイプを診断する
        </ButtonLink>
      </div>
    </section>
  );
}
