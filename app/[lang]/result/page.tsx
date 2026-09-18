import type { Metadata } from "next";
import { TYPE_TAGLINES } from "@/lib/type-content";
import { BASE_OPEN_GRAPH, canonical } from "@/lib/site";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { ButtonLink } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Heading, Latin } from "@/app/components/ui/Heading";
import { TypeGrid } from "@/app/components/type/TypeGrid";

/**
 * 16タイプ一覧 /ja/result（仕様書 4-4）
 * 16枚のカードを HTML に出し、絞り込みは TypeGrid の中でクライアントが hidden を切り替える。
 * 旧 URL の /ja/result?type= と /ja/select は、統合時に R1・R2・R3 の 301 で振り分ける
 */
const DESCRIPTION =
  "16タイプの呼称とキャラクター、ひと言で分かる特徴を一覧にしました。タイプを選ぶと、性格の特徴・相性・適職の解説を読めます。";

export const metadata: Metadata = {
  title: "16タイプ一覧",
  description: DESCRIPTION,
  alternates: canonical("/ja/result"),
  openGraph: { ...BASE_OPEN_GRAPH, title: "16タイプ一覧 | CognitiveLens", description: DESCRIPTION, url: "/ja/result" },
};

export default function ResultListPage() {
  return (
    <main className="mx-auto w-full max-w-page px-4 pt-4 pb-4 md:px-10">
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/ja" },
          { name: "16タイプ一覧", href: "/ja/result" },
        ]}
      />
      <Heading level={1} className="mt-2">
        <Latin>16</Latin>タイプ一覧
      </Heading>
      <p className="mt-3 max-w-prose text-muted">カードを選ぶと、そのタイプの特徴・相性・適職を読めます。</p>

      <TypeGrid hrefPattern="/ja/result/{TYPE}" descriptions={TYPE_TAGLINES} className="mt-6" />

      <section aria-labelledby="start" className="mt-12">
        <Heading level={2} id="start" className="mb-4">
          自分のタイプを調べる
        </Heading>
        <p className="max-w-prose">24問に答えると、近いタイプと4つの軸の割合が出ます。</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <ButtonLink href="/ja/test" size="lg" meta="24問">
            16タイプ診断をはじめる
          </ButtonLink>
          <ButtonLink href="/ja/target-diagnosis" size="lg" variant="secondary" meta="24問">
            気になる相手を診断する
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="more" className="mt-12">
        <Heading level={2} id="more" className="mb-4">
          タイプ別に楽しむ
        </Heading>
        <ul className="grid gap-3 md:grid-cols-2">
          <li>
            <Card href="/ja/bingo" className="h-full">
              <span className="block text-lead font-black">偏見だらけの16タイプビンゴ</span>
              <span className="mt-1 block text-muted">タイプごとのあるある24マスに、いくつ当てはまるか数えられます。</span>
            </Card>
          </li>
          <li>
            <Card href="/ja/articles" className="h-full">
              <span className="block text-lead font-black">恋愛コラム一覧</span>
              <span className="mt-1 block text-muted">好きになったときの変化と脈ありサインを、タイプ別に読めます。</span>
            </Card>
          </li>
        </ul>
      </section>
    </main>
  );
}
