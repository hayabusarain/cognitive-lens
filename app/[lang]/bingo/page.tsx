import type { Metadata } from "next";
import Link from "next/link";
import { BASE_OPEN_GRAPH, canonical } from "@/lib/site";
import { TYPE_TAGLINES } from "@/lib/type-content";
import { ButtonLink } from "@/app/components/ui/Button";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { Heading } from "@/app/components/ui/Heading";
import { TypeGrid } from "@/app/components/type/TypeGrid";

/**
 * ビンゴのハブ /ja/bingo（仕様書 3-5、ステップ 3-12）
 *
 * title・h1・解説の見出し3つは、現行ページの文言を保持する（仕様書 9-4。h3 は h2 に上げた。Q8）。
 * 「MBTI」の語を title・h1 に使ってよいのは、サイトでこのページだけ（tone-guide 5-4）。本文は注意書きの1回だけ。
 * 解説の本文は現行のものを残し、トーンガイドから外れる語（誇張、根拠のない言い切り、短所を弱点と呼ぶ言い方）だけを直した。
 */

const TITLE = "偏見だらけのMBTIビンゴ";
const DESCRIPTION =
  "16タイプ別の「あるある」を24マスに並べたビンゴ。自分のタイプを選んで当てはまるマスを押すと、揃ったラインの数で称号が決まり、カード画像で保存できます。";

export const metadata: Metadata = {
  // 9-4 で保持する title。テンプレートの「| CognitiveLens」と重ならないよう absolute で渡す
  title: { absolute: `${TITLE} | CognitiveLens` },
  description: DESCRIPTION,
  alternates: canonical("/ja/bingo"),
  openGraph: { ...BASE_OPEN_GRAPH, title: TITLE, description: DESCRIPTION, url: "/ja/bingo" },
};

export default function BingoHubPage() {
  return (
    <main className="mx-auto w-full max-w-page px-4 pt-4 md:px-10">
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/ja" },
          // 本文の「MBTI」は注意書きの1回に留める（tone-guide 5-4）。パンくずはタイプ別のページと同じ名前にする
          { name: "偏見だらけのビンゴ", href: "/ja/bingo" },
        ]}
      />

      <div className="mt-4 md:flex md:items-end md:justify-between md:gap-8">
        <div>
          {/* 9-4：「偏見だらけの」の後で改行する */}
          <Heading level={1}>
            偏見だらけの
            <br />
            MBTIビンゴ
          </Heading>
          <p className="text-phrase mt-3 max-w-prose text-lead text-muted">
            タイプを選ぶと、そのタイプの「あるある」を集めた24マスのビンゴが開きます。
          </p>
        </div>
        <ButtonLink href="/ja/test" variant="secondary" meta="24問" className="mt-5 w-full md:mt-0 md:w-auto md:shrink-0">
          タイプが分からない方は診断へ
        </ButtonLink>
      </div>

      <section aria-label="タイプを選ぶ" className="mt-8">
        <TypeGrid hrefPattern="/ja/bingo/{TYPE}" descriptions={TYPE_TAGLINES} />
      </section>

      <div className="mt-12 grid max-w-prose gap-12">
        <section aria-labelledby="about-bingo">
          <Heading level={2} id="about-bingo" className="mb-4">
            偏見だらけの16タイプビンゴとは？
          </Heading>
          <div className="grid gap-4">
            <p>
              「偏見だらけの16タイプビンゴ」は、当サイトが作った遊びのページです。各タイプにありがちな「ステレオタイプ（偏見）」と「あるある行動」を、24マスに並べました。
            </p>
            <p>
              心理学の用語は使っていません。SNS でよく語られる、極端な「あるある」を集めました。自分がどれだけそのタイプらしいか、押して数えるだけで分かります。
            </p>
          </div>
        </section>

        <section aria-labelledby="why-accurate">
          <Heading level={2} id="why-accurate" className="mb-4">
            「え、なんでこんなに当たるの…？」の理由
          </Heading>
          <div className="grid gap-4">
            <p>
              「当たってる」と感じる理由のひとつは、バーナム効果です。誰にでも当てはまることを、自分にだけ当てはまると思い込む心理をいいます。
            </p>
            <p>
              もうひとつは、項目の作り方にあります。ユングの心理学的類型論には「8つの認知機能」という考え方があります。無意識の選択やストレス時の反応に出やすいとされる部分です。
            </p>
            <p>
              このビンゴでは、その考え方を日常の行動に置き換えました。「連絡の遅さ」「単独行動の多さ」「無駄なことへの執着」などです。
            </p>
          </div>
        </section>

        <section aria-labelledby="how-to-use">
          <Heading level={2} id="how-to-use" className="mb-4">
            ビンゴ結果の活用法と注意点
          </Heading>
          <div className="grid gap-4">
            <p>
              ビンゴがたくさん揃っても、「優れた人間」という意味ではありません。項目の多くは、人付き合いで出てしまう癖を集めたものです。
            </p>
            <p>
              「無意識にこんな印象を与えていたのか」と気づくための道具くらいに考えてください。
            </p>
            <p className="text-note text-muted">
              ※当サイトの診断とビンゴは、ユングの認知機能モデルをもとに独自に作ったものです。公式の MBTI® テストとは関係ありません。
            </p>
            <p className="text-note text-muted">
              MBTI® は The Myers-Briggs Company の登録商標です。詳しくは
              <Link href="/ja/disclaimer" className="underline underline-offset-4 hover:text-fg">
                免責事項
              </Link>
              をご覧ください。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
