import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BINGO_DATA, BINGO_TITLES } from "@/lib/bingo-data-ja";
import { BASE_OPEN_GRAPH, SITE_URL, canonical } from "@/lib/site";
import { TYPE_CODES, isTypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { typeColorStyle } from "@/lib/type-display";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { Card } from "@/app/components/ui/Card";
import { Heading, Latin } from "@/app/components/ui/Heading";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";
import { TypeFrame } from "@/app/components/type/TypeFrame";
import { BingoBoard } from "./BingoBoard";

/**
 * タイプ別のビンゴ /ja/bingo/{TYPE}（仕様書 2-5、3-5、ステップ 3-13・3-14）
 *
 * 16タイプをビルド時に生成し、ほかの値は 404。盤面の操作はクライアント（BingoBoard）。
 * このページは「あるある」に絞り、特徴の解説は結果ページへリンクする（仕様書 7-3）。
 * 「MBTI」の語は title・description・h1・本文のどこにも使わない（tone-guide 5-4 の例外はハブだけ）。
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return TYPE_CODES.map((type) => ({ type }));
}

interface PageProps {
  params: Promise<{ lang: string; type: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  if (!isTypeCode(type)) return {};
  const title = `偏見だらけの${type}ビンゴ`;
  const description = `${type}（${TYPE_NAMES[type]}）の「あるある」を24マスに並べたビンゴ。当てはまるマスを押すと、揃ったラインの数で称号が決まります。結果はカード画像で保存できます。`;
  const path = `/ja/bingo/${type}`;
  return {
    title,
    description,
    alternates: canonical(path),
    openGraph: { ...BASE_OPEN_GRAPH, title, description, url: path },
  };
}

export default async function BingoTypePage({ params }: PageProps) {
  const { type } = await params;
  if (!isTypeCode(type)) notFound();
  const name = TYPE_NAMES[type];

  return (
    <main className="mx-auto w-full max-w-page px-4 pt-4 md:px-10" style={typeColorStyle(type)}>
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/ja" },
          { name: "偏見だらけのビンゴ", href: "/ja/bingo" },
          { name: `${type}のビンゴ`, href: `/ja/bingo/${type}` },
        ]}
      />

      <div className="mt-4 flex items-center gap-3 md:gap-4">
        <TypeFrame size="sm" className="w-24 shrink-0">
          <CharacterFigure type={type} sizes="96px" loading="eager" />
        </TypeFrame>
        <Heading level={1}>
          <span className="inline-block">偏見だらけの</span>
          <span className="inline-block">
            <Latin>{type}</Latin> ビンゴ
          </span>
        </Heading>
      </div>
      <p className="text-phrase mt-4 max-w-prose text-muted">
        当てはまるマスを押してください。縦・横・斜めのどれかで5マス揃うと1ライン。揃ったラインが多いほど、称号が上がります。
      </p>

      <noscript>
        <p className="mt-4 rounded-panel border-l-4 border-muted bg-surface px-4 py-3 text-body">
          このビンゴには JavaScript が必要です。ブラウザの設定で JavaScript を有効にしてから、もう一度開いてください。
        </p>
      </noscript>
      <BingoBoard
        type={type}
        items={BINGO_DATA[type]}
        titles={BINGO_TITLES}
        shareUrl={`${SITE_URL}/ja/bingo/${type}`}
        className="mt-6"
      />

      <section aria-labelledby="bingo-next" className="mt-12">
        <Heading level={2} id="bingo-next" className="mb-4">
          あわせて読む
        </Heading>
        <ul className="grid gap-3 md:grid-cols-2">
          <li>
            <Card href={`/ja/result/${type}`} className="h-full">
              <span className="block text-lead font-black">
                <Latin>{type}</Latin>（{name}）の特徴
              </span>
              <span className="block text-muted">性格の傾向や相性の良い相手、向いている仕事をまとめています</span>
            </Card>
          </li>
          <li>
            <Card href="/ja/bingo" className="h-full">
              <span className="block text-lead font-black">ほかのタイプのビンゴ</span>
              <span className="block text-muted">16タイプから選べる。友達のタイプで試すのもおすすめです</span>
            </Card>
          </li>
          <li>
            <Card href="/ja/test" className="h-full">
              <span className="block text-lead font-black">16タイプ診断をはじめる</span>
              <span className="block text-muted">24問で、自分に近いタイプと4つの軸の割合が出ます</span>
            </Card>
          </li>
        </ul>
      </section>
    </main>
  );
}
