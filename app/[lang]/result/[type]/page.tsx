import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { TYPE_CODES, isTypeCode, type TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { TYPE_CONTENT } from "@/lib/type-content";
import { TYPE_COMPATIBILITY } from "@/lib/type-compatibility";
import { CAREER_JOBS } from "@/lib/career-jobs";
import { BASE_OPEN_GRAPH, canonical } from "@/lib/site";
import { typeColorStyle, typeNumber } from "@/lib/type-display";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { Card } from "@/app/components/ui/Card";
import { Eyebrow, Heading } from "@/app/components/ui/Heading";
import { TypeFrame } from "@/app/components/type/TypeFrame";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";
import { ResultEyebrow, ResultPersonal } from "@/app/[lang]/result/_components/ResultPersonal";
import { ResultShare } from "@/app/[lang]/result/_components/ResultShare";
import { RESULT_EYEBROW_DEFAULT } from "@/app/[lang]/result/_components/labels";

/**
 * タイプ別の結果・解説ページ /ja/result/{TYPE}（仕様書 3-1〜3-4）
 * 16タイプをビルド時に静的生成する。lang は親の app/[lang]/layout.tsx から受け取る。
 * 利用者ごとに変わる個人スコア（?p=）と相手診断からの来訪（?from=target）は、<Suspense> の内側でクライアントが描く
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return TYPE_CODES.map((type) => ({ type }));
}

type Props = { params: Promise<{ lang: string; type: string }> };

async function resolveType(params: Props["params"]): Promise<TypeCode> {
  const { type } = await params;
  if (!isTypeCode(type)) notFound();
  return type;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const type = await resolveType(params);
  const { seo } = TYPE_CONTENT[type];
  const path = `/ja/result/${type}`;
  // seo.title は「| CognitiveLens」を含むので absolute で渡す。og:image・twitter:image は同じ区画の画像ファイルが出す
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: canonical(path),
    openGraph: { ...BASE_OPEN_GRAPH, title: seo.title, description: seo.description, url: path },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12 scroll-mt-4">
      <Heading level={2} id={id} className="mb-4">
        {title}
      </Heading>
      {children}
    </section>
  );
}

/** 本文の文字列を段落に分ける（TypeContent は改行で段落を区切る） */
function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`grid gap-3 ${className}`}>
      {text.split("\n").map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

/** 相性の相手のカード。枠と文字は相手のタイプ色で、相手の結果ページへリンクする */
function Partner({ label, partner, reason }: { label: string; partner: TypeCode; reason: string }) {
  return (
    <li>
      <TypeFrame type={partner} className="h-full" innerClassName="p-4">
        <p className="text-label font-bold text-muted">{label}</p>
        <Link href={`/ja/result/${partner}`} className="group mt-2 flex items-center gap-3 no-underline">
          <CharacterFigure type={partner} sizes="80px" className="w-20 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block font-display text-h2 leading-tight">{partner}</span>
            <span className="block text-lead font-black text-type underline decoration-2 underline-offset-4 group-hover:no-underline">
              {TYPE_NAMES[partner]}
            </span>
          </span>
          <ChevronRight aria-hidden="true" className="size-6 shrink-0 text-muted" />
        </Link>
        <p className="mt-3">{reason}</p>
      </TypeFrame>
    </li>
  );
}

export default async function ResultTypePage({ params }: Props) {
  const type = await resolveType(params);
  const name = TYPE_NAMES[type];
  const content = TYPE_CONTENT[type];
  const partners = TYPE_COMPATIBILITY[type];
  const jobs = CAREER_JOBS[type];

  const related = [
    { href: `/ja/bingo/${type}`, title: `偏見だらけの${type}ビンゴ`, note: "あるあるにいくつ当てはまるか、マスを埋めて数えられます。" },
    { href: `/ja/article/${type}`, title: `${type}の恋愛コラム`, note: "好きになったときの変化と、脈ありサインをまとめています。" },
    { href: "/ja/target-diagnosis", title: "気になる相手を診断する", note: "あの人について24問に答えると、近いタイプが分かります。" },
    { href: "/ja/result", title: "16タイプ一覧", note: "ほかの15タイプの呼称と特徴を見比べられます。" },
    { href: "/ja/test", title: "16タイプ診断をはじめる", note: "24問で、自分に近いタイプと4つの軸の割合が出ます。" },
  ];

  return (
    <main className="mx-auto w-full max-w-page px-4 pt-4 pb-4 md:px-10" style={typeColorStyle(type)}>
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/ja" },
          { name: "16タイプ一覧", href: "/ja/result" },
          { name: `${type}（${name}）`, href: `/ja/result/${type}` },
        ]}
      />

      {/* パソコン幅（lg）では型コードが 88px になり、ENFP などの幅の広い型コードが 344px のカードに収まらないので、カードを 400px にする */}
      <div className="mt-2 grid items-start gap-6 md:grid-cols-[minmax(0,344px)_1fr] lg:grid-cols-[400px_1fr] lg:gap-10">
        {/* 1. ヒーロー：型コードが主、呼称が副題（仕様書 3-4） */}
        <div className="mx-auto w-full max-w-[344px] md:mx-0 lg:max-w-[400px]">
          <Suspense fallback={<Eyebrow>{RESULT_EYEBROW_DEFAULT}</Eyebrow>}>
            <ResultEyebrow type={type} />
          </Suspense>
          <TypeFrame size="lg" className="mt-2 w-full" innerClassName="pb-3">
            <hgroup className="grid gap-1.5 px-4 pb-3 pt-3.5">
              <h1 className="font-display text-hero font-normal">{type}</h1>
              <p className="font-display text-h2 text-type">{name}</p>
            </hgroup>
            <CharacterFigure type={type} sizes="(min-width: 1024px) 376px, (min-width: 768px) 320px, 90vw" loading="eager" className="mx-3" />
            <p className="text-phrase mx-3 mt-3 rounded-chip border-l-4 border-type bg-canvas px-3.5 py-3 text-lead font-bold leading-relaxed">
              {content.tagline}
            </p>
            <p className="flex justify-between px-4 pt-2.5 text-label leading-none text-muted">
              <span>CognitiveLens</span>
              <span className="font-display text-fg">{typeNumber(type)} / 16</span>
            </p>
          </TypeFrame>
        </div>

        <div className="grid min-w-0 gap-6">
          {/* 2. 個人スコア欄（p が正しいときだけ）と 3. 共有。fallback は静的な HTML に入る（スコアなしの共有） */}
          <Suspense fallback={<ResultShare type={type} shareText={content.share.text} />}>
            <ResultPersonal type={type} shareText={content.share.text} />
          </Suspense>

          {/* 4. 要約 */}
          <section aria-labelledby="summary">
            <Heading level={2} id="summary" className="mb-4">
              どんなタイプか
            </Heading>
            <Paragraphs text={content.summary} />
            {/* 「MBTI」の語はこのページでこの1回だけ（仕様書 3-4、decisions N3・N11） */}
            <p className="mt-4 text-note text-muted">
              {name}は、MBTIでいう{type}のタイプです。
            </p>
          </section>
        </div>
      </div>

      {/* 5. 特徴3つ */}
      <Section id="traits" title={`${type}の特徴`}>
        <ol className="grid gap-3 md:grid-cols-3">
          {content.traits.map((trait, i) => (
            <Card key={trait.heading} as="li" accent="top">
              <span className="font-display text-note text-type">{String(i + 1).padStart(2, "0")}</span>
              <Heading level={3} className="mt-2">
                {trait.heading}
              </Heading>
              <p className="mt-2">{trait.body}</p>
            </Card>
          ))}
        </ol>
      </Section>

      {/* 6. 友人・仕事・恋愛 */}
      <Section id="relationships" title="友人・仕事・恋愛での傾向">
        <div className="grid gap-3 md:grid-cols-3">
          {(
            [
              ["友人", content.relationships.friends],
              ["仕事", content.relationships.work],
              ["恋愛", content.relationships.love],
            ] as const
          ).map(([label, body]) => (
            <Card key={label}>
              <Heading level={3}>{label}</Heading>
              <p className="mt-2">{body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 7. すれ違いやすい場面と対処 */}
      <Section id="frictions" title="すれ違いやすい場面と対処">
        <ul className="grid gap-3 md:grid-cols-2">
          {content.frictions.map((friction) => (
            <Card key={friction.scene} as="li">
              <p className="font-bold">{friction.scene}</p>
              <p className="mt-3 border-t border-line pt-3">
                <span className="mr-2 inline-block rounded-chip bg-type px-2 py-0.5 text-label font-bold leading-normal text-ink">対処</span>
                {friction.tip}
              </p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* 8. 相性 */}
      <Section id="compatibility" title={`${type}の相性`}>
        <ul className="grid gap-4 md:grid-cols-2">
          <Partner label="相性の良い相手" partner={partners.easy} reason={content.compatibility.easyReason} />
          <Partner label="すれ違いやすい相手" partner={partners.hard} reason={content.compatibility.hardReason} />
        </ul>
      </Section>

      {/* 9. 適職（職業名は lib/career-jobs.ts、説明は TypeContent.career） */}
      <Section id="career" title={`${type}の適職`}>
        <div className="grid gap-3 md:grid-cols-2">
          <Card accent="ring">
            <p className="text-label font-bold text-muted">向いている仕事</p>
            <Heading level={3} className="mt-1">
              {jobs.fit}
            </Heading>
            <p className="mt-2">{content.career.fitReason}</p>
          </Card>
          <Card>
            <p className="text-label font-bold text-muted">向かない仕事</p>
            <Heading level={3} className="mt-1">
              {jobs.avoid}
            </Heading>
            <p className="mt-2">{content.career.avoidReason}</p>
          </Card>
        </div>
        <Card className="mt-3">
          <Heading level={3}>面接で伝えるなら</Heading>
          <p className="mt-2">{content.career.interviewTip}</p>
        </Card>
      </Section>

      {/* 10. 関連ページ */}
      <Section id="related" title="あわせて読む">
        <ul className="grid gap-3 md:grid-cols-2">
          {related.map((item) => (
            <li key={item.href}>
              <Card href={item.href} className="h-full">
                <span className="block text-lead font-black">{item.title}</span>
                <span className="mt-1 block text-muted">{item.note}</span>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
