# CognitiveLens デザインシステム

想定読者：ページ（結果・診断・一覧・ビンゴなど）を実装する人
作成日：2026-09-16　元にしたもの：デザイン案「コレクションカード」のモック、`docs/redesign-spec.md` 3-3〜4-5、`docs/tone-guide.md`

16タイプの結果を、タイプ色の太い枠のトレーディングカードのように見せる。スクリーンショットで SNS に載せたくなる強さはカードと型コードで出し、本文は暗い面の上で読みやすく保つ。部品の見本ページ `/styleguide` はステップ 3-22 で削除した。部品の実際の使い方は、結果ページ `app/[lang]/result/[type]/page.tsx` などで見る。

---

## 1. 決まり

- 本文は 16px 以上。押せる部分は高さ 44px 以上
- 文字色と背景の組み合わせは WCAG AA（4.5:1）以上。タイプ色16色はどれも背景・面に対して 5.64 以上、タイプ色の面に `text-ink` を載せても同じ比になる
- フォーカスは全要素に白い 3px の輪（`app/globals.css`）。`outline-none` で消さない
- 動き（ホバーで浮く、押すと沈む）は `motion-safe:` か `prefers-reduced-motion: no-preference` の中だけに書く
- 絵文字は使わない。アイコンが要るときは Lucide（`lucide-react`）を `aria-hidden` で添える
- タイプ色は、そのタイプを表す場所（枠・台座・アクセント）にだけ使う。NT・NF・SJ・SP の4グループで塗り分けない
- 画面の文言は `docs/tone-guide.md` に従う。利用者への案内は敬体

## 2. トークン

値は `app/globals.css` の `@theme` にある。背景・面・本文・補足の4色は `lib/theme.ts` と同じ値で、生成画像はそちらを読む。変えるときは両方を直す。

| クラスの例 | 値 | 使う場所 |
|---|---|---|
| `bg-canvas` | #0E1016 | ページの背景（body に指定済み） |
| `bg-surface` | #181B23 | カード・パネル |
| `bg-surface-2` | #20242E | 面の上に重ねる面 |
| `border-line` | #2E3340 | 区切り線、副ボタンの枠 |
| `bg-track` | #3A3F4B | 割合バーの負けた側 |
| `text-fg` | #F1F2F5 | 本文 |
| `text-muted` | #A6ABB6 | 補足 |
| `text-ink` | #0E1016 | タイプ色や明るい面に載せる文字 |
| `bg-type`・`text-type`・`border-type`・`ring-type` | その場のタイプ色 | 枠、台座、見出しの棒、勝った側の割合 |

`type` は CSS 変数 `--tc` を読む。要素に `style={typeColorStyle("INTJ")}`（`lib/type-display.ts`）を付けると、その中の `bg-type` などがそのタイプの色になる。指定がない場所では本文の色（白）になるので、トップのような「タイプのない画面」の主ボタンは白い面になる。結果ページやビンゴでは、ページの外枠に一度だけ付ける。

## 3. 書体

| 用途 | 書体 | クラス |
|---|---|---|
| 本文・見出し | Zen Kaku Gothic New（400・700・900） | 既定（`font-sans`） |
| 型コード・数字・ロゴ・呼称の大きな表示 | Dela Gothic One（400 だけ） | `font-display`（見出しの中では `<Latin>`） |
| 生成画像のすべての文字 | Noto Sans JP のサブセット | `lib/og/assets.ts` の `OG_FONT_FAMILY` |

画面の2書体は `app/layout.tsx` の `next/font/google` がビルド時に取得し、自サイトから配信する。Dela Gothic One には太字がないので、`font-display` に `font-bold` などを重ねない（擬似的な太字は `font-synthesis-weight: none` で止めてある）。和文の見出しには `palt`（字詰め）、短い一文には `text-phrase`（文節の途中で折り返さない）を付ける。

## 4. 文字サイズの段階

見出しの4段階はパソコン幅（1024px 以上）で大きくなる。

| クラス | スマートフォン | パソコン | 使う場所 |
|---|---|---|---|
| `text-hero` | 64px | 88px | 結果ページの型コード |
| `text-title` | 36px | 56px | トップの大見出し |
| `text-h1` | 28px | 40px | ページの見出し |
| `text-h2` | 22px | 24px | 節の見出し |
| `text-h3` | 18px | 18px | カードの中の見出し |
| `text-lead` | 18px | 18px | リード文、呼称 |
| `text-body` | 16px | 16px | 本文（body の既定） |
| `text-note` | 14px | 14px | 補足の注記、パンくず、フッター |
| `text-label` | 13px | 13px | 絞り込みの見出し、通し番号。本文には使わない |

## 5. 余白・角丸・幅

余白は Tailwind の既定（4px 刻み）を使い、モックの段階 4・8・12・16・24・32・48・72px に当たる `1・2・3・4・6・8・12・18` を中心にする。節と節の間は `mt-12`、見出しの下は `mb-4`、カードの内側は `p-4`。

角丸は `rounded-chip`（6px、キャラクターの窓・小さな札）、`rounded-panel`（12px、ボタン・パネル）、`rounded-card`（20px）。タイプ色の枠の角丸は `TypeFrame` が持つ。

ページの幅は `max-w-page`（1120px）、文章だけの段は `max-w-prose`（672px）。左右の余白はスマートフォン 16px、768px 以上で 40px。

## 6. 部品

置き場所はすべて `app/components/`。props の詳細は各ファイルの冒頭のコメントにある。

| 部品 | 主な props | 使う場所 |
|---|---|---|
| `ui/Button` の `ButtonLink`・`Button` | `variant`（`primary`・`secondary`）、`size`（`md` 52px・`lg` 64px）、`meta`（右端の「24問」など）、`external`（新しいタブ） | 診断の開始、共有、送信。主ボタンは1画面に1〜2個 |
| `ui/Heading` の `Heading`・`Eyebrow`・`Latin` | `level`（1〜3）、`marker`（h2 の棒） | ページと節の見出し |
| `ui/Card` | `accent`（`top`・`ring`）、`href`、`as` | 特徴の3項目（`top`）、向く仕事（`ring`）、トップの入口（`href`） |
| `ui/Breadcrumbs` | `items`（先頭から現在のページまで） | 結果・コラム・ビンゴなど下層のページ。BreadcrumbList の JSON-LD も出る |
| `ui/Notice` | `title` | 免責の一言、保存の案内 |
| `type/TypeFrame` | `type`、`size`（枠 4・6・8px）、`href` | 結果ページのヒーロー、相性の相手、ビンゴの盤面の枠 |
| `type/CharacterFigure` | `type`、`sizes`、`loading` | 4:5 のキャラクターの窓。alt は「INTJ（スフィンクス）のキャラクター」 |
| `type/TypeCard` | `type`、`href`、`description` | 16タイプのカード1枚 |
| `type/TypeGrid` | `hrefPattern`（`/ja/result/{TYPE}` など）、`descriptions`（16件）、`filter` | 一覧 `/ja/result` とビンゴのハブ。16枚を HTML に出し、絞り込みは `hidden` の切り替え |
| `type/TypeFilter` | `value`、`onChange` | `TypeGrid` の中で使う。単独で使うときは `useState` の更新関数を渡す |
| `type/ScoreBars` | `type`、`scores`（p と同じ順の4値）、`closeActions`（僅差の軸に置くリンク） | 結果ページの個人スコア欄。URL の検証は置く側で行う |
| `share/ShareOnX` | `text`（`{url}` の位置に URL が入る）、`url`、`contentType`、`itemId` | 結果とビンゴの共有。押すと GA4 の `share` |
| `share/ShareImageButton` | `imageUrl`、`fileName`、`contentType`、`itemId`、`label` | 9:16 結果画像とビンゴカード画像の保存。4段階の流れと `save_image` は部品の中 |
| `layout/SiteHeader`・`layout/Footer` | なし | `app/layout.tsx` が全ページに出す。ページ側で置かない |

一行説明は `lib/type-content` の `TYPE_TAGLINES` をそのまま `descriptions` に渡せる。16タイプの文章は `TYPE_CONTENT` で引く。

## 7. ページの骨組み

```tsx
<main className="mx-auto w-full max-w-page px-4 pt-4 md:px-10" style={typeColorStyle(type)}>
  <Breadcrumbs items={[{ name: "トップ", href: "/ja" }, …]} />
  {/* 最初の画面：見出しかヒーロー、主な操作 */}
  <section aria-labelledby="traits" className="mt-12">
    <Heading level={2} id="traits" className="mb-4">特徴</Heading>
    …
  </section>
</main>
```

- `<main>` はページが持つ。ヘッダーとフッターはレイアウトが出す
- h1 は1ページに1つ。結果ページは `<hgroup>` に h1（型コード、`font-display text-hero`）と `<p>`（呼称）を入れる（仕様書 3-4）。組み方は `app/[lang]/result/[type]/page.tsx` のヒーローにある
- スマートフォンは1列で、上から「何のページか → 主な操作 → 本文」。パソコンで2列にするのは、結果ページのヒーローと本文のように左右で役割が違うときだけ
- 一覧・結果・ビンゴの画像は `next/image`（`CharacterFigure`）。最初の画面に見えるものだけ `loading="eager"` にする。Next.js 16 で `priority` は非推奨になった（`image.md`）
- 文言に「MBTI」を入れない（例外は `/ja/bingo`。tone-guide 5-4）

### metadata

- title は `app/layout.tsx` の template で「{title} | CognitiveLens」になる。`TypeContent.seo.title` はすでに「| CognitiveLens」を含むので、`title: { absolute: content.seo.title }` で渡す。既存ページの title に残る「| CognitiveLens」も、作り直すときに外す
- ページで `openGraph` を書くと、レイアウトの値は丸ごと置き換わる。`openGraph: { ...BASE_OPEN_GRAPH, … }`（`lib/site.ts`）の形で書く
- canonical は `canonical("/ja/…")`（`lib/site.ts`）

## 8. 生成画像で揃える要素

OG 画像・9:16 結果画像・ビンゴカード画像は `lib/og/` を使い、画面と次の要素を揃える。

| 要素 | 揃え方 |
|---|---|
| 色 | `lib/og/theme.ts` の `OG_COLORS`（`lib/theme.ts` の4色と線・窓の地）と `ogTypeColor(type)` |
| カード | タイプ色の枠、暗い内面、4:5 の窓に下からタイプ色の台座、型コードは Black（900） |
| キャラクター | 切り詰め版を `loadTrimmedCharacter(type)` で読み、`fitInBox` で縦横比を保って枠に収める（仕様書 4-1） |
| 文字 | `loadOgFonts()` の Noto Sans JP サブセットだけ。サブセットにない文字は描けない。固定文言は `assets/fonts/charset.txt` の文字で書き、足りなければ `scripts/lib/charset.mjs` に足して `npm run build:font` を実行する |
| サイト表記 | 「Cognitive」＋補足色の「Lens」と `www.cognitive-lens.com` |
| 絵文字 | 使わない |

タイプに依らないページは `renderPageOgImage({ title })`（`lib/og/page-image.tsx`）で、キャラクター4体のカードとページ名の画像になる。トップの `app/[lang]/opengraph-image.tsx` が使い方の見本。

画像のルート（`opengraph-image.tsx` や Route Handler）は、レイアウトの `generateStaticParams` を引き継がない。ファイルの中で `generateStaticParams` を書かないと、ビルド時に作られず実行時の生成になる（2026-09-16 のビルドで確認。仕様書 4-2 の「親に従ってビルド時に16枚」とは違った）。実行時に画像を作るルート（4-3・4-5）は、`next.config.ts` の `outputFileTracingIncludes` に `assets/fonts` と `assets/characters/trimmed` を足す。

## 9. 計測

イベントは `lib/analytics.ts` の3つの関数だけで送る。`trackDiagnosisComplete(type, mode)` は結果ページへ遷移する直前に呼ぶ。共有と保存は部品の中で送るので、ページ側では呼ばない。回答と割合は送らない。

GA4 は環境変数 `NEXT_PUBLIC_GA_MEASUREMENT_ID` があるときだけ読み込む。プライバシーポリシーでの公表と同じステップ（3-19）まで、本番に値を設定しない。
