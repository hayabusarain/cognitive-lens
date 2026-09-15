// 部品の見本ページ。ページの作り直しが終わったら、ステップ 3-22 で削除する
import type { Metadata } from "next";
import Link from "next/link";
import { TYPE_CODES } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { TYPE_CONTENT, TYPE_TAGLINES } from "@/lib/type-content";
import { SITE_URL } from "@/lib/site";
import { typeColorStyle, typeNumber } from "@/lib/type-display";
import { Button, ButtonLink } from "@/app/components/ui/Button";
import { Eyebrow, Heading, Latin } from "@/app/components/ui/Heading";
import { Card } from "@/app/components/ui/Card";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { Notice } from "@/app/components/ui/Notice";
import { TypeFrame } from "@/app/components/type/TypeFrame";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";
import { TypeGrid } from "@/app/components/type/TypeGrid";
import { ScoreBars } from "@/app/components/type/ScoreBars";
import { ShareOnX } from "@/app/components/share/ShareOnX";
import { ShareImageButton } from "@/app/components/share/ShareImageButton";

export const metadata: Metadata = {
  title: "部品の見本",
  robots: { index: false, follow: false },
};

const TOKENS = [
  { name: "canvas", value: "#0E1016", note: "ページの背景" },
  { name: "surface", value: "#181B23", note: "カード・パネル" },
  { name: "surface-2", value: "#20242E", note: "面の上の面" },
  { name: "line", value: "#2E3340", note: "区切り線" },
  { name: "track", value: "#3A3F4B", note: "バーの負けた側" },
  { name: "fg", value: "#F1F2F5", note: "本文" },
  { name: "muted", value: "#A6ABB6", note: "補足" },
] as const;

const TYPE_SCALE = [
  { token: "text-hero", sample: "INTJ", style: "font-display" },
  { token: "text-title", sample: "あなたは、16枚のどれを引く？", style: "palt font-black" },
  { token: "text-h1", sample: "16タイプ一覧", style: "palt font-black" },
  { token: "text-h2", sample: "どんなタイプか", style: "palt font-black" },
  { token: "text-h3", sample: "動く前に、道筋を全部並べる", style: "palt font-black" },
  { token: "text-lead", sample: "24問に答えると、近いタイプと4つの軸の割合が出ます。", style: "text-muted" },
  { token: "text-body", sample: "口数は少ないのに、気づけば話の結論を握っている。", style: "" },
  { token: "text-note", sample: "選ぶと次の設問に進みます", style: "text-muted" },
  { token: "text-label", sample: "外向・内向", style: "font-bold text-muted" },
] as const;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <Heading level={2} id={id} className="mb-4">
        {title}
      </Heading>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  const intj = TYPE_CONTENT.INTJ;

  return (
    <main className="mx-auto w-full max-w-page px-4 pt-4 md:px-10">
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/ja" },
          { name: "部品の見本", href: "/styleguide" },
        ]}
      />
      <Eyebrow className="mt-4">開発用（検索に出さない）</Eyebrow>
      <Heading level={1} className="mt-2">
        部品の見本
      </Heading>
      <p className="mt-3 max-w-prose text-muted">使い方と決まりは docs/design-system.md にあります。</p>

      <Section id="sg-color" title="色">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {TOKENS.map((t) => (
            <li key={t.name} className="flex items-center gap-3">
              <span className="size-11 shrink-0 rounded-chip border border-line" style={{ backgroundColor: t.value }} />
              <span className="leading-snug">
                <span className="block font-bold">{t.name}</span>
                <span className="block text-note text-muted">{t.note}</span>
              </span>
            </li>
          ))}
        </ul>
        <ul className="mt-6 grid grid-cols-4 gap-2 md:grid-cols-8">
          {TYPE_CODES.map((type) => (
            <li
              key={type}
              className="rounded-chip bg-type px-2 py-1.5 text-center font-display text-note text-ink"
              style={typeColorStyle(type)}
            >
              {type}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sg-type" title="書体と文字サイズ">
        <ul className="divide-y divide-line">
          {TYPE_SCALE.map((row) => (
            <li key={row.token} className="grid gap-1 py-3 md:grid-cols-[8rem_1fr] md:items-baseline">
              <code className="text-note text-muted">{row.token}</code>
              <span className={`${row.token} ${row.style}`}>
                {row.sample}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-h1 font-black palt">
          <Latin>16</Latin>タイプ一覧（Latin で数字だけ表示用の書体）
        </p>
      </Section>

      <Section id="sg-button" title="ボタン">
        <div className="flex flex-wrap gap-3">
          <Button>主ボタン</Button>
          <Button variant="secondary">副ボタン</Button>
          <Button aria-disabled="true" disabled>
            押せない状態
          </Button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <ButtonLink href="/ja/test" size="lg" meta="24問">
            自己診断をはじめる
          </ButtonLink>
          <ButtonLink href="/ja/target-diagnosis" size="lg" variant="secondary" meta="24問">
            気になる相手を診断する
          </ButtonLink>
        </div>
        <div className="mt-4 flex flex-wrap gap-3" style={typeColorStyle("INTJ")}>
          <ButtonLink href="/ja/result/INTJ">タイプ色の中の主ボタン</ButtonLink>
          <ButtonLink href="https://x.com/CognitiveLens_" external variant="secondary">
            外部サイトへのリンク
          </ButtonLink>
        </div>
      </Section>

      <Section id="sg-card" title="カードと注意書き">
        <div className="grid gap-3 md:grid-cols-3" style={typeColorStyle("INTJ")}>
          <Card>
            <Heading level={3}>ふつうのカード</Heading>
            <p className="mt-1">暗い面に本文を置きます。</p>
          </Card>
          <Card accent="top" as="article">
            <span className="font-display text-note text-type">01</span>
            <Heading level={3} className="mt-2">
              {intj.traits[0].heading}
            </Heading>
            <p className="mt-1">{intj.traits[0].body}</p>
          </Card>
          <Card accent="ring">
            <Heading level={3}>対の片方を目立たせる</Heading>
            <p className="mt-1">向く仕事など。</p>
          </Card>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Card href="/ja/bingo">
            <span className="block text-lead font-black">偏見だらけのビンゴ</span>
            <span className="block text-muted">リンクのカード。全体が押せます</span>
          </Card>
          <Notice title="性格タイプは傾向を楽しむためのものです">
            結果は本人を決めつけるものではありません。詳しくは免責事項をご覧ください。
          </Notice>
        </div>
      </Section>

      <Section id="sg-breadcrumbs" title="パンくず">
        <Breadcrumbs
          items={[
            { name: "トップ", href: "/ja" },
            { name: "16タイプ一覧", href: "/ja/result" },
            { name: "INTJ（スフィンクス）", href: "/ja/result/INTJ" },
          ]}
        />
      </Section>

      <Section id="sg-grid" title="16タイプのカードと絞り込み">
        <TypeGrid hrefPattern="/ja/result/{TYPE}" descriptions={TYPE_TAGLINES} />
      </Section>

      <Section id="sg-frame" title="タイプの枠（結果ページのヒーローの組み方）">
        <div className="grid items-start gap-6 md:grid-cols-[minmax(0,344px)_1fr]" style={typeColorStyle("INTJ")}>
          <TypeFrame size="lg" className="w-full max-w-[344px]" innerClassName="pb-3">
            <hgroup className="grid gap-1.5 px-4 pb-3 pt-3.5">
              <p className="font-display text-hero">INTJ</p>
              <p className="font-display text-h2 text-type">{TYPE_NAMES.INTJ}</p>
            </hgroup>
            <CharacterFigure type="INTJ" sizes="320px" className="mx-3" />
            <p className="text-phrase mx-3 mt-3 rounded-chip border-l-4 border-type bg-canvas px-3.5 py-3 text-lead font-bold leading-relaxed">
              {intj.tagline}
            </p>
            <p className="flex justify-between px-4 pt-2.5 text-label leading-none text-muted">
              <span>CognitiveLens</span>
              <span className="font-display text-fg">{typeNumber("INTJ")} / 16</span>
            </p>
          </TypeFrame>

          <div className="grid gap-6">
            <Card aria-labelledby="sg-score" as="section">
              <Heading level={3} id="sg-score" className="mb-2">
                あなたの割合（ENTP、p=61-33-78-50 の例）
              </Heading>
              <div style={typeColorStyle("ENTP")}>
                <ScoreBars
                  type="ENTP"
                  scores={[61, 33, 78, 50]}
                  closeActions={{
                    JP: (
                      <Link href="/ja/result/ENTJ" className="inline-flex min-h-11 items-center font-bold underline underline-offset-4">
                        <span className="mr-1 font-display font-normal">ENTJ</span>（{TYPE_NAMES.ENTJ}）も読む
                      </Link>
                    ),
                  }}
                />
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <ShareOnX
                text={intj.share.text.replace("{name}", TYPE_NAMES.INTJ)}
                url={`${SITE_URL}/ja/result/INTJ`}
                contentType="result"
                itemId="INTJ"
              />
              <ShareImageButton
                imageUrl="/ja/opengraph-image"
                fileName="cognitivelens-sample.png"
                contentType="result"
                itemId="INTJ"
              />
            </div>

            <div className="flex items-center gap-3">
              <TypeFrame type="INTJ" size="sm" className="w-24 shrink-0">
                <CharacterFigure type="INTJ" sizes="96px" />
              </TypeFrame>
              <p className="palt text-h2 font-black">
                <span className="inline-block">偏見だらけの</span>
                <span className="inline-block">
                  <Latin>INTJ</Latin> ビンゴ
                </span>
              </p>
            </div>
          </div>
        </div>
      </Section>

    </main>
  );
}
