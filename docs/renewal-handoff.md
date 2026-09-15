# リニューアル作業の引き継ぎメモ

想定読者：リニューアルの本番公開を判断する運営者と、このリポジトリで作業を続ける AI
更新日：2026-09-16

## 今の状態：統合済み。プレビューの確認と本番公開の判断待ち

ページごとの作り直しをすべて `renewal` ブランチに取り込み、統合の作業（仕様書 3-5、3-10、3-13、3-16、3-21、3-22）も終えた。GitHub に push 済みで、Vercel のプレビューのビルドも成功している。`main` にはまだ何も入れていない。

ステップごとの状態とコミット、確かめたことは、`docs/redesign-spec.md` 8章の「進捗」にある。統合でのローカルの本番ビルドに対する確認結果は次のとおり。

| 確認 | 結果 |
|---|---|
| `npm run check` | tsc、内容検査、禁止語検査、単体テスト61件がすべて合格 |
| `npm run build` | 結果・ビンゴ・コラムの各16ページと、それぞれの OG 画像が静的生成（SSG） |
| `npm run check:redirects -- http://localhost:3200` | 37件すべて OK（www なしの R10 を含む） |
| `npm run check:site -- http://localhost:3200` | NG なし。警告は ENTJ の適職「起業家」の1件（decisions N9 で職業名として残すと決めた語） |
| スクリーンショット | トップ・結果（INTJ）・自己診断・ビンゴ（INTJ）を幅390と1280で撮り、崩れなし |

作業用の git 作業ツリー（`D:/mbti_wt/` の6つ）とブランチ `renewal-*` は、すべて `renewal` に取り込まれていることを確かめてから削除した。

## プレビュー

Vercel のプレビューには Vercel Authentication（ログインの保護）がかかっていて、ログインしていない自動の検査からは見られない。`check:site` をプレビューに向けるには、Vercel の管理画面で「Protection Bypass for Automation」の値を発行し、次のように実行する。

```
VERCEL_AUTOMATION_BYPASS_SECRET=（発行した値） npm run check:site -- https://（プレビューの URL）
```

プレビューの URL は、GitHub のコミットの Vercel の表示か、`https://api.github.com/repos/hayabusarain/cognitive-lens/deployments?sha=（コミット）` の statuses にある `environment_url` で分かる。

## 本番公開の前に運営者が確かめること

コードの検査では確かめられないものを残している。上から順に見るとよい。

1. **プレビューを実際に触る**。自己診断を最後まで答えて結果ページに移る、相手診断で「わからない」を選ぶ、脈あり度チェックで AI 文が出る、ビンゴでマスを押す
2. **画像の保存を実機で試す**（仕様書 4-3 の端末表）。iPhone の Safari、Android の Chrome、X と LINE のアプリ内ブラウザで、結果画像とビンゴのカード画像を保存する
3. **行動プロトコルを結果ページに載せないことでよいか**（Q9）。今は載せていない。旧データ `lib/protocols-*.ts` は削除したが、git の履歴から戻せる
4. **GA4 を公開と同時に始めるか**。始めるなら、Vercel の本番の環境変数に `NEXT_PUBLIC_GA_MEASUREMENT_ID` を入れる前に、GA4 の管理画面の拡張計測で「ブラウザの履歴イベントに基づくページの変更」を無効にする。`app/[lang]/privacy/page.tsx` の `UPDATED_AT_WITH_GA4` を公開の日付に書き換える
5. **リポジトリに `..env.local.swp` が入っている**（2026-04-15 のコミット `74af475`、1KB）。`.env.local` を vim で開いたときの一時ファイルで、公開リポジトリから誰でも読める。中身は統合の作業では開いていない（秘密情報を表示しないため）。キーが含まれていれば、そのキーを作り直してからファイルを消す

## 本番公開の手順（運営者の確認が取れてから）

1. `main` に `renewal` をマージして push する（`git checkout main`、`git merge --no-ff renewal`、`git push origin main`）
2. Vercel の本番のビルドが成功したら、公開サイトに `npm run check:redirects -- https://www.cognitive-lens.com` と `npm run check:site -- https://www.cognitive-lens.com` を実行する（仕様書 4-1）
3. X に結果ページの URL を投稿し、カードに OG 画像が出るか見る（3-4）
4. Vercel で `cognitive-lens.com` を「www への転送」からプロジェクトへの直接の割り当てに切り替え、`curl -I https://cognitive-lens.com/ja` が 301 になるか見る（ステップ 1-4 の残り）
5. Search Console でサイトマップを送信する（4-2）

## 作業を再開するとき

1. `git status` と `git log --oneline -5` で、`renewal` に未コミットの変更がないか見る
2. `.next/types` が古いと `tsc` が消したページの型で失敗する。`.next/types` を消してから `npx tsc --noEmit` を実行する
3. ローカルで確かめるときは `npm run build` の後に `npx next start -p 3200` を起動し、`check:redirects` と `check:site` を向ける。`next dev` に `check:site` を向けると、同時に多くのページをコンパイルして開発サーバーが 500 を返すことがあった（2026-09-16）ので、本番ビルドで確かめる

## 決めたこと

委任を受けて AI が決めたこと（呼称を続ける、相性の決め方、タイプ説明に二人称を書かない、結果ページの title の書式など）は、`docs/redesign-spec.md` 9-3 の「運営者の委任で AI が判断したこと」にある。
