import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BASE_OPEN_GRAPH, canonical } from "@/lib/site";
import { TYPE_BASE } from "@/lib/type-base";
import { TYPE_CODES, type TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { TYPE_TAGLINES } from "@/lib/type-content";
import { typeNumber } from "@/lib/type-display";
import { ButtonLink } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Heading, Latin } from "@/app/components/ui/Heading";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";
import { TypeCard } from "@/app/components/type/TypeCard";
import { TypeFrame } from "@/app/components/type/TypeFrame";

/**
 * トップ /ja（仕様書 1-1、ステップ 3-18。デザイン案「コレクションカード」の画面1）
 *
 * サーバーコンポーネントだけで組み、クライアントの JS を足さない。
 * 1-1 のページのうち、トップから入るもの（自己診断・相手診断・一覧・ビンゴ・脈あり度・コラム一覧）にすべてリンクする。
 * アンカーテキストは 7-2 のキーワードに揃える。「MBTI」はビンゴのハブの名前にだけ使う（tone-guide 5-4）
 */

// title は app/layout.tsx の既定「CognitiveLens | 16タイプ性格診断」を使う
export const metadata: Metadata = {
  description:
    "無料・登録なしの16タイプ性格診断。24問で近いタイプと4つの軸の割合がわかり、結果はカード画像で保存できます。相手の性格タイプ診断、脈あり度チェック、タイプ別のビンゴと恋愛コラムもあります。",
  alternates: canonical("/ja"),
  openGraph: { ...BASE_OPEN_GRAPH, url: "/ja" },
};

/** 最初の画面で扇形に重ねる3枚（飾り。読み上げでは読まない） */
const FAN: readonly { type: TypeCode; className: string }[] = [
  { type: "ISFJ", className: "top-[30px] -translate-x-[112%] -rotate-8 lg:top-10 lg:-translate-x-[118%] lg:-rotate-10" },
  { type: "INTJ", className: "top-2.5 z-10 -translate-x-1/2" },
  { type: "ENFP", className: "top-[30px] translate-x-[12%] rotate-8 lg:top-10 lg:rotate-10" },
];

/** 一覧への導線で見せる4枚。扇形の3枚と重ねず、色が近くならない組み合わせにした */
const PICKUP: readonly TypeCode[] = ["ENTJ", "ESFP", "INFP", "ISTP"];

// ── 入口のカードの小さな図（飾り） ──────────────────────────────
const GLYPH_BOX = "grid size-14 shrink-0 rounded-chip bg-canvas";

function GlyphTypes() {
  return (
    <div aria-hidden="true" className={`${GLYPH_BOX} grid-cols-[repeat(4,10px)] content-center justify-center gap-[3px]`}>
      {TYPE_CODES.map((type) => (
        <span key={type} className="size-2.5 rounded-[2px]" style={{ backgroundColor: TYPE_BASE[type].color }} />
      ))}
    </div>
  );
}

// 5×5 の盤面。1 が押したマス
const BINGO_MARKS = [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1];

function GlyphBingo() {
  return (
    <div aria-hidden="true" className={`${GLYPH_BOX} grid-cols-[repeat(5,7px)] content-center justify-center gap-0.5`}>
      {BINGO_MARKS.map((on, i) => (
        <span key={i} className={`size-[7px] rounded-[1px] ${on ? "bg-fg" : "bg-track"}`} />
      ))}
    </div>
  );
}

function GlyphMeter() {
  return (
    <div aria-hidden="true" className={`${GLYPH_BOX} place-items-center`}>
      <span className="block h-2 w-9 overflow-hidden rounded bg-track">
        <span className="block h-full w-[70%] bg-fg" />
      </span>
    </div>
  );
}

function GlyphColumn() {
  return (
    <div aria-hidden="true" className={`${GLYPH_BOX} content-center justify-items-start gap-[5px] pl-3`}>
      <span className="h-1 w-[22px] rounded-sm bg-fg" />
      <span className="h-1 w-[30px] rounded-sm bg-track" />
      <span className="h-1 w-[30px] rounded-sm bg-track" />
    </div>
  );
}

const ENTRIES: readonly { href: string; title: string; description: string; glyph: ReactNode }[] = [
  {
    href: "/ja/result",
    title: "16タイプ一覧",
    description: "16枚のカードを並べて、特徴を見比べられます",
    glyph: <GlyphTypes />,
  },
  {
    // 見出しの文言はビンゴのハブの名前として保持する（仕様書 9-4「トップのカード見出し」）
    href: "/ja/bingo",
    title: "偏見だらけのMBTIビンゴ",
    description: "タイプ別の「あるある」25マスで、何ライン揃うか試せます",
    glyph: <GlyphBingo />,
  },
  {
    href: "/ja/romance-checker",
    title: "脈あり度チェック",
    description: "相手のタイプ別の質問に、はい・いいえで答える脈あり診断",
    glyph: <GlyphMeter />,
  },
  {
    href: "/ja/articles",
    title: "恋愛コラム",
    description: "タイプ別に、好きになり方と脈ありサインを読めます",
    glyph: <GlyphColumn />,
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-page px-4 pt-4 md:px-10">
      {/* 最初の画面：何のサイトか → 診断の入口 → カードの扇 */}
      <section className="grid gap-6 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:pt-12">
        <div>
          <hgroup>
            <h1 className="text-label font-bold tracking-[0.08em] text-muted">CognitiveLens　16タイプ性格診断</h1>
            {/* 「引く？」だけが3行目に落ちないよう、幅390px未満（36pxだと収まらない）と1024〜1279px（左の段が狭い）で一段小さくする */}
            <p className="palt text-phrase mt-2 text-title font-black max-[390px]:text-[2rem] lg:text-[3rem] xl:text-title">
              あなたは、
              <br />
              <span className="text-[1.12em] leading-none">
                <Latin>16</Latin>
              </span>
              枚のどれを引く？
            </p>
          </hgroup>
          <p className="text-phrase mt-4 text-lead text-muted">
            24問に答えると、近いタイプと4つの軸の割合が出ます。結果は
            <strong className="text-fg">カード画像にして保存</strong>
            でき、登録はいりません。
          </p>
          {/* パソコン幅の左の段では2列にすると文言が折り返すので、1列に戻す */}
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:max-w-md lg:grid-cols-1">
            <ButtonLink href="/ja/test" size="lg" meta="24問">
              16タイプ診断をはじめる
            </ButtonLink>
            <ButtonLink href="/ja/target-diagnosis" size="lg" variant="secondary" meta="24問">
              相手の性格タイプを診断
            </ButtonLink>
          </div>
        </div>

        <div aria-hidden="true" className="relative mx-auto h-[290px] w-full max-w-[420px] lg:h-[420px] lg:max-w-none">
          {FAN.map(({ type, className }) => (
            <TypeFrame
              key={type}
              type={type}
              className={`absolute left-1/2 w-36 [--frame-radius:14px] [--frame:5px] lg:w-[46%] ${className}`}
            >
              <div className="flex items-center justify-between gap-1.5 px-2.5 pb-1.5 pt-2">
                <span className="font-display text-lg leading-tight tracking-[0.02em] lg:text-[1.625rem]">{type}</span>
                <span className="rounded-[4px] bg-type px-1 py-1 font-display text-label leading-none text-ink">
                  {typeNumber(type)}
                </span>
              </div>
              <CharacterFigure type={type} sizes="(min-width: 1024px) 200px, 134px" loading="eager" className="mx-2" />
              <p className="px-2.5 pb-2.5 pt-1.5 text-lead font-black leading-snug">{TYPE_NAMES[type]}</p>
            </TypeFrame>
          ))}
        </div>
      </section>

      <nav aria-label="主な入口" className="mt-12">
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {ENTRIES.map((entry) => (
            <li key={entry.href}>
              <Card href={entry.href} className="h-full lg:min-h-45 lg:p-6">
                <div className="grid min-h-14 grid-cols-[56px_1fr] items-center gap-4 lg:grid-cols-1 lg:content-start">
                  {entry.glyph}
                  <div className="grid gap-0.5">
                    <h2 className="palt text-phrase text-h3 font-black">{entry.title}</h2>
                    <p className="leading-relaxed text-muted">{entry.description}</p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="top-types" className="mt-12 lg:mt-18">
        <Heading level={2} id="top-types" className="mb-2">
          タイプ別の特徴・相性・適職
        </Heading>
        <p className="mb-5 text-muted">カードを選ぶと、そのタイプの性格や相性、向く仕事を読めます。</p>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {PICKUP.map((type) => (
            <li key={type}>
              <TypeCard type={type} href={`/ja/result/${type}`} description={TYPE_TAGLINES[type]} />
            </li>
          ))}
        </ul>
        <ButtonLink href="/ja/result" variant="secondary" className="mt-6 w-full md:w-auto">
          16タイプ一覧ですべて見る
        </ButtonLink>
      </section>
    </main>
  );
}
