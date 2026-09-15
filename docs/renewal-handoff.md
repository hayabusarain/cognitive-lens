# リニューアル作業の引き継ぎメモ

想定読者：中断したリニューアル作業を再開する人（運営者と、このリポジトリで作業する AI）
更新日：2026-09-16

作業が途中で止まったら、このメモの「再開の手順」から始める。仕様は `docs/redesign-spec.md`、進捗の詳細は同じ文書の 8章にある。

## 今の状態

`renewal` ブランチ（GitHub にも push 済み）に、次のものが入っている。

| 済んだもの | 中身 |
|---|---|
| フェーズ2の文章 | 16タイプの文章、自己診断・相手診断の設問、脈あり度の設問と AI 文の API、ビンゴの改訂、恋愛コラム16本 |
| デザインの土台 | 暗色の「コレクションカード」案。`docs/design-system.md`、`app/components/`、`lib/og/`、見本ページ `/styleguide` |
| 結果ページ | `/ja/result/{TYPE}`、16タイプ一覧、OG 画像、9:16 結果画像（ブランチ `renewal-result` を取り込み済み） |

ページの作り直しは、ページごとに別の git 作業ツリーで進めている。終わったものから `renewal` に取り込む。

| 作業ツリー | ブランチ | 中身 | 状態（2026-09-16） |
|---|---|---|---|
| `D:/mbti_wt/result` | `renewal-result` | 結果ページ一式 | 取り込み済み |
| `D:/mbti_wt/diagnosis` | `renewal-diagnosis` | `/ja/test`、`/ja/target-diagnosis` | 作業中 |
| `D:/mbti_wt/bingo` | `renewal-bingo` | `/ja/bingo`、`/ja/bingo/{TYPE}`、カード画像 | 取り込み済み |
| `D:/mbti_wt/static` | `renewal-static` | トップ、運営者情報、免責事項、プライバシーポリシー、素材配布、robots.txt | 取り込み済み |
| `D:/mbti_wt/article` | `renewal-article` | `/ja/articles`、`/ja/article/{TYPE}`、`/ja/romance-checker` | 取り込み済み |
| `D:/mbti_wt/foundation` | `renewal-foundation` | デザインの土台 | 取り込み済み。消してよい |

## 再開の手順

1. 各作業ツリーで `git status` と `git log --oneline -3` を見る。コミットがあれば、そのブランチは作業を終えている。未コミットの変更だけなら途中で止まっているので、続きを作るか、変更を確かめてコミットする
2. 終わったブランチを `renewal` に取り込む：`git merge --no-edit renewal-XXX`。`assets/fonts/` が衝突したら、どちらかを選んだあと `npm run build:font` で作り直してコミットする（入力が同じなら結果も同じ）
3. すべて取り込んだら、下の「統合でやること」を行う
4. `.next/types` が古いと `tsc` が消したページの型で失敗する。`.next/types` を消してから `npx tsc --noEmit` を実行する

## 統合でやること（仕様書 3-5、3-10、3-13、3-16、3-21〜3-23）

- `lib/redirects.ts` の R1〜R6・R8・R9 を有効にし、`app/api/og` と `app/api/story-card` を消す。R8 の転送先は `/ja/result/{TYPE}/opengraph-image`（クエリなしでも 200 を確認済み）
- GA4 を配信する前に、管理画面の拡張計測で「ブラウザの履歴イベントに基づくページの変更」を無効にする（page_view はコードがクエリを外して送る。済み）。配信する日に privacy の `UPDATED_AT_WITH_GA4` を書き換える
- GA4 の共有イベントに `content_type: romance` が増えた。仕様書 3-7 とプライバシーポリシーの送信内容に足す
- `lib/og/page-image.tsx` の文字幅の見積もりが広く、ビンゴのハブの OG 画像で「の」が枠に触れている
- `app/sitemap.ts` を59件にし、lastmod を `TypeContent.updatedAt` と `ArticleContent.updatedAt` から取る
- 置き換え済みの旧データ（`lib/type-info.ts`、`lib/static-profiles.ts`、`lib/questions.ts`、`lib/article-data*.ts`、`lib/romance-data*.ts`、英語のデータ、`lib/data-provider.ts`、`lib/result-cache.ts` など）、`app/styleguide/`、使われなくなったパッケージ（`html-to-image` など）を消す
- `npm run check`、`npm run build`、`scripts/check-redirects.mjs`（ローカルの本番ビルドに向けて）、全ページのクロール（禁止語、「MBTI」の語、どこからもリンクされないページ、canonical）
- `renewal` を push し、Vercel のプレビューで同じ確認をする
- **`main` へのマージ（本番公開）は運営者の確認を取ってから行う**

## 決めたこと

委任を受けて AI が決めたこと（呼称を続ける、相性の決め方、タイプ説明に二人称を書かない、結果ページの title の書式など）は、`docs/redesign-spec.md` 9-3 の「運営者の委任で AI が判断したこと」にある。
