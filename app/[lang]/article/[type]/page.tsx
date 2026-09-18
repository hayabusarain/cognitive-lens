import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { TYPE_CODES, isTypeCode, type TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { ARTICLES, splitArticleTitle } from "@/lib/articles";
import { ROMANCE } from "@/lib/romance/items";
import { BASE_OPEN_GRAPH, canonical } from "@/lib/site";
import { typeColorStyle } from "@/lib/type-display";
import { ButtonLink } from "@/app/components/ui/Button";
import { Heading, Latin } from "@/app/components/ui/Heading";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { TypeFrame } from "@/app/components/type/TypeFrame";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";

/**
 * タイプ別の恋愛コラム /ja/article/{TYPE}（仕様書 3-16、7-2・7-3）
 * 本文は lib/articles/{TYPE}.ts。相性・適職・特徴全般は詳しく書かず、結果ページの該当の節へリンクする。
 * 型コードは大文字だけを生成する。小文字の URL は lib/redirects.ts の R5 が大文字へ 301 で転送する
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return TYPE_CODES.map((type) => ({ type }));
}

type Props = { params: Promise<{ lang: string; type: string }> };

/** 4節の役割（lib/articles/schema.ts の sections の順）。節の見出しの上に小さく出す */
const SECTION_LABELS = ["好きになるまで", "好きな人への態度", "すれ違いやすいところ", "距離を縮めるには"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  if (!isTypeCode(type)) return {};
  const article = ARTICLES[type];
  const path = `/ja/article/${type}`;
  return {
    // title は「| CognitiveLens」を含まないので、レイアウトの template で「{title} | CognitiveLens」になる
    title: article.title,
    description: article.description,
    alternates: canonical(path),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "article",
      title: article.title,
      description: article.description,
      url: path,
      modifiedTime: article.updatedAt,
    },
  };
}

/** 2026-09-15 → 2026年9月15日 */
function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

function RelatedLinks({ type }: { type: TypeCode }) {
  // アンカーテキストは、リンク先のページが狙うキーワードに揃える（仕様書 7-3）。
  // 相性と適職の節の id（compatibility・career）は、結果ページ側で同じ値を付ける
  const links = [
    { href: `/ja/result/${type}`, label: `${type}の特徴`, note: "恋愛以外の性格と、友人・仕事での傾向" },
    { href: `/ja/result/${type}#compatibility`, label: `${type}の相性`, note: "付き合いやすい相手と、すれ違いやすい相手" },
    { href: `/ja/result/${type}#career`, label: `${type}の適職`, note: "向く仕事と向かない仕事" },
    { href: `/ja/bingo/${type}`, label: `偏見だらけの${type}ビンゴ`, note: "あるある24マスで、何ライン揃うか試す" },
    { href: "/ja/romance-checker", label: "脈あり度チェック", note: "相手のタイプを選んで、はい・いいえで答える" },
    { href: "/ja/test", label: "16タイプ診断", note: "24問で、自分に近いタイプと4つの軸の割合を出す" },
  ];
  return (
    <ul className="mt-3 divide-y divide-line border-y border-line">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="group flex min-h-14 items-center justify-between gap-3 py-3 no-underline">
            <span className="min-w-0">
              <span className="block font-bold underline decoration-line decoration-2 underline-offset-4 group-hover:decoration-type">
                {link.label}
              </span>
              <span className="text-phrase block text-note text-muted">{link.note}</span>
            </span>
            <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted group-hover:text-fg" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { type } = await params;
  if (!isTypeCode(type)) notFound();
  const article = ARTICLES[type];
  const name = TYPE_NAMES[type];
  const { prefix, subtitle } = splitArticleTitle(type);

  return (
    <main className="mx-auto w-full max-w-page px-4 pb-16 pt-4 md:px-10" style={typeColorStyle(type)}>
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/ja" },
          { name: "恋愛コラム一覧", href: "/ja/articles" },
          { name: prefix || `${type}の恋愛`, href: `/ja/article/${type}` },
        ]}
      />

      {/* スマートフォンは「タイプ → 本文 → 関連ページ」の1列。パソコンは本文を左、タイプと関連ページを右に置く */}
      <div className="mt-2 lg:grid lg:grid-cols-[minmax(0,42rem)_17.5rem] lg:grid-rows-[auto_1fr] lg:justify-between lg:gap-x-12">
        <div className="flex items-center gap-4 lg:col-start-2 lg:row-start-1 lg:mt-2 lg:flex-col lg:items-stretch lg:gap-3">
          <TypeFrame size="sm" className="w-20 shrink-0 lg:w-full lg:[--frame-radius:18px] lg:[--frame:6px]">
            <CharacterFigure type={type} sizes="(min-width: 1024px) 270px, 72px" loading="eager" />
          </TypeFrame>
          <p className="grid gap-1.5">
            <span className="font-display text-h2 leading-none tracking-[0.02em] lg:text-h1">{type}</span>
            <span className="font-display text-lead leading-tight text-type">{name}</span>
          </p>
        </div>

        <article className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <header className="mt-6 lg:mt-2">
            <h1 className="palt text-phrase font-black">
              {prefix && (
                <span className="block text-lead leading-snug text-type">
                  {prefix}
                  <span className="sr-only">：</span>
                </span>
              )}
              <span className="mt-1 block text-h1">{subtitle}</span>
            </h1>
            <p className="mt-5 text-lead">{article.lead}</p>
            <p className="mt-3 text-note text-muted">
              <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>更新
            </p>
          </header>

          {article.sections.map((section, i) => (
            <section key={section.heading} aria-labelledby={`section-${i + 1}`} className="mt-12">
              <p className="mb-2 flex items-center gap-2 text-label font-bold text-muted">
                <span className="font-display text-note font-normal text-type">{String(i + 1).padStart(2, "0")}</span>
                {SECTION_LABELS[i]}
              </p>
              <Heading level={2} id={`section-${i + 1}`} className="mb-4">
                {section.heading}
              </Heading>
              <div className="grid gap-4">
                {section.body.split("\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section aria-labelledby="signs" className="mt-12">
            <Heading level={2} id="signs" className="mb-4">
              <Latin>{type}</Latin>の脈ありサイン
            </Heading>
            <ol className="grid gap-3">
              {article.signs.map((sign, i) => (
                <li key={sign} className="flex items-baseline gap-3 rounded-panel bg-surface px-4 py-3">
                  <span aria-hidden="true" className="w-5 shrink-0 font-display text-lead leading-none text-type">
                    {i + 1}
                  </span>
                  <span>{sign}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6">
              相手が{name}なら、そのタイプらしい行動{ROMANCE[type].questions.length}問に答えて、脈あり度を確かめられます。
            </p>
            <ButtonLink
              href="/ja/romance-checker"
              meta={`${ROMANCE[type].questions.length}問`}
              className="mt-3 w-full md:w-auto md:min-w-80"
            >
              脈あり度をチェックする
            </ButtonLink>
          </section>
        </article>

        <aside aria-labelledby="related" className="mt-12 lg:col-start-2 lg:row-start-2 lg:mt-8">
          <Heading level={2} id="related">
            関連ページ
          </Heading>
          <RelatedLinks type={type} />
        </aside>
      </div>
    </main>
  );
}
