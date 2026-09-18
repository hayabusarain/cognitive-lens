# CognitiveLens

16タイプの性格診断サイト（[www.cognitive-lens.com](https://www.cognitive-lens.com)）のリポジトリ。
24問の自己診断、気になる相手の診断、タイプ別のビンゴと恋愛コラム、脈あり度チェックを載せている。
Next.js 16 の App Router と Tailwind CSS 4 で作り、Vercel に置いている。

このサイトは MBTI® の公式の検査とは関係がない。16タイプの呼称・設問・文章は独自に作っている。

## 動かす

```bash
npm install
npm run dev     # http://localhost:3000
```

見た目や転送を確かめるときは、開発サーバーではなく本番ビルドを使う。
開発サーバーは、多くのページを同時にコンパイルすると 500 を返すことがある。

```bash
npm run build
npx next start -p 3200
npm run check:redirects -- http://localhost:3200
npm run check:site -- http://localhost:3200
```

## npm スクリプト

| コマンド | 何をするか |
|---|---|
| `npm run check` | 型・コンテンツ・禁止語・単体テストをまとめて実行する（コミット前に通す） |
| `npm run build` | 本番ビルド。前に内容と禁止語の検査が走る |
| `npm run lint` | ESLint |
| `npm run check:redirects -- <URL>` | 旧 URL の 301 転送を1件ずつ確かめる |
| `npm run check:site -- <URL>` | sitemap から全ページをたどり、title・canonical・OG 画像・禁止語・リンク切れを見る |
| `npm run build:font` | 生成画像用のフォントのサブセットを作り直す（収録文字が増えたとき） |

## 環境変数（`.env.local`）

| 名前 | 用途 |
|---|---|
| `OPENAI_API_KEY` | 脈あり度チェックの AI 文（`/api/romance-ai`）。なければ AI 文だけ出ない |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 の測定 ID（`G-` で始まる）。設定したビルドだけ GA4 を読み込む |

## ドキュメント

| ファイル | 中身 |
|---|---|
| `AGENTS.md` | このリポジトリで作業するときの決まり。**コードを書く前に必ず読む** |
| `docs/redesign-spec.md` | 仕様書。8章に実装順序と進捗、9章に決めたことと未解決の質問 |
| `docs/renewal-handoff.md` | 引き継ぎメモ。今の状態と残作業 |
| `docs/decisions.md` | 運営者が決めたこと |
| `docs/tone-guide.md` | 文章のトーン。字数の決まりは検査で守る |
| `docs/design-system.md` / `docs/colors.md` | 画面の作りとタイプ色 |
| `docs/asset-credits.md` | 画像・フォント・アイコンの出典（ここに記録がない素材は載せない） |
| `docs/current-site.md` | リニューアル前のサイトの調査 |
