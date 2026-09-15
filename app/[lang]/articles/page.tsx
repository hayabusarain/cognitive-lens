import type { Metadata } from "next";
import { TYPE_CODES } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { splitArticleTitle } from "@/lib/articles";
import { BASE_OPEN_GRAPH, canonical } from "@/lib/site";
import { ButtonLink } from "@/app/components/ui/Button";
import { Eyebrow, Heading, Latin } from "@/app/components/ui/Heading";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { TypeFrame } from "@/app/components/type/TypeFrame";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";

/**
 * 恋愛コラム一覧 /ja/articles（仕様書 3-5、7-2）
 * 16本を型コードのアルファベット順に並べる。カード全体が /ja/article/{TYPE} へのリンク
 */

const TITLE = "恋愛コラム一覧";
const DESCRIPTION =
  "16タイプ別の恋愛コラム。好きになるまでの流れ、好きな人への態度、すれ違いやすいところ、脈ありサイン5つを、タイプごとに読めます。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical("/ja/articles"),
  openGraph: { ...BASE_OPEN_GRAPH, title: TITLE, description: DESCRIPTION, url: "/ja/articles" },
};

/** スマートフォンで最初の画面に見えるカードの数（画像を先に読む） */
const EAGER_COUNT = 3;

export default function ArticlesPage() {
  return (
    <main className="mx-auto w-full max-w-page px-4 pb-16 pt-4 md:px-10">
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/ja" },
          { name: TITLE, href: "/ja/articles" },
        ]}
      />

      <Eyebrow className="mt-4">
        <Latin>16</Latin>タイプ別
      </Eyebrow>
      <Heading level={1} className="mt-2">
        {TITLE}
      </Heading>
      <p className="mt-3 max-w-prose text-muted">
        好きな人への態度、すれ違いやすいところ、脈ありサイン5つを、タイプごとにまとめました。
      </p>

      <ul className="mt-8 grid gap-3 md:grid-cols-2 md:gap-4">
        {TYPE_CODES.map((type, i) => {
          const { prefix, subtitle } = splitArticleTitle(type);
          return (
            <li key={type}>
              <TypeFrame
                type={type}
                size="sm"
                href={`/ja/article/${type}`}
                className="h-full [--frame-radius:16px] [--frame:5px]"
                innerClassName="flex-row items-center gap-3 p-2 pr-4"
              >
                <CharacterFigure
                  type={type}
                  sizes="96px"
                  loading={i < EAGER_COUNT ? "eager" : "lazy"}
                  className="w-20 shrink-0 md:w-24"
                />
                <span className="min-w-0 py-1">
                  {/* title の前半（INTJ（スフィンクス）の恋愛）を型コードと呼称の段に、副題を次の段に組む */}
                  <span className="flex flex-wrap items-baseline gap-x-2 leading-tight">
                    <span className="font-display text-lead tracking-[0.02em]">{type}</span>
                    <span className="text-note font-bold text-type">
                      {prefix ? `${TYPE_NAMES[type]}の恋愛` : TYPE_NAMES[type]}
                    </span>
                  </span>
                  <span className="text-phrase palt mt-1.5 block font-bold leading-snug md:text-lead">{subtitle}</span>
                </span>
              </TypeFrame>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="checker" className="mt-12 max-w-prose">
        <Heading level={2} id="checker" className="mb-3">
          相手の脈あり度を確かめる
        </Heading>
        <p>気になる相手のタイプを選び、そのタイプらしい行動12問に「はい」「いいえ」で答えます。</p>
        <ButtonLink href="/ja/romance-checker" variant="secondary" meta="12問" className="mt-4 w-full md:w-auto md:min-w-80">
          脈あり度チェック
        </ButtonLink>
      </section>
    </main>
  );
}
