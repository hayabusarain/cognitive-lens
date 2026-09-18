# リニューアル作業の引き継ぎメモ

想定読者：リニューアルの本番公開を判断する運営者と、このリポジトリで作業を続ける AI
更新日：2026-09-19

## 今の状態：統合済み。プレビューの確認と本番公開の判断待ち

ページごとの作り直しをすべて `renewal` ブランチに取り込み、統合の作業（仕様書 3-5、3-10、3-13、3-16、3-21、3-22）も終えた。`main` にはまだ何も入れていない。

ステップごとの状態とコミット、確かめたことは、`docs/redesign-spec.md` 8章の「進捗」にある。

2026-09-18 に、ローカルの本番ビルドで全ページを触って確かめ直し、8つの観点でコードと文章を見直した。そこで見つかった問題を直している（下の表）。

### 2026-09-18〜19 に直したこと

| 直したこと | 場所 |
|---|---|
| GA4 の share・save_image・diagnosis_complete に、結果ページの URL がクエリごと載っていた。ポリシーの「割合は送らない」と食い違うので、クエリを外した URL を明示する | `lib/analytics.ts` |
| Vercel Web Analytics にも同じ割合が渡っていた。`beforeSend` でクエリを落とす | `app/components/analytics/VercelAnalytics.tsx`（新規） |
| 壊れた Host ヘッダー（`[[[` など）を送ると、全ページが 500 になった。読めなければ Host を使わない | `proxy.ts` |
| 途中経過に設問より多い履歴が入っていると、診断の画面が例外で開けなくなった。長さを先に確かめる | `lib/diagnosis/flow.ts`、テストを1件追加 |
| 自分で診断していない訪問者にも「わたしのタイプは」の投稿文が出ていた。文面とラベルを替え、診断への入口を足した | `app/[lang]/result/_components/ResultShare.tsx` |
| 画像の取得に失敗しても「長押しで保存」と案内し、中身のない画面が出た。取れなかったことを伝え、GA4 にも送らない | `app/components/share/ShareImageButton.tsx` |
| 例外のときに素の画面が出ていた。`unstable_retry` で読み直せる案内を置いた | `app/error.tsx`（新規） |
| 結果・ビンゴ・コラムの48ページから、自己診断への導線が1つもなかった | 各ページの関連リンク |
| ビンゴの盤面が再読み込みで消え、白紙に戻す手段もなかった | `app/[lang]/bingo/[type]/BingoBoard.tsx` |
| 診断の途中から最初に戻る手段がなかった（「戻る」を17回押すしかない） | `app/[lang]/_diagnosis/QuestionScreen.tsx` |
| 脈あり度チェックの結果から、最後の設問に戻れなかった | `app/[lang]/romance-checker/ResultStep.tsx` |
| MBTI® と書きながら、商標の持ち主をどこにも書いていなかった | `app/[lang]/disclaimer/page.tsx`、`app/[lang]/bingo/page.tsx` |
| 結果画像を保存すると割合がサーバーに届くことを、ポリシーに書いていなかった | `app/[lang]/privacy/page.tsx` |
| サブセットしたフォントに OFL の文書を添えていなかった（OFL 1.1 の条件） | `assets/fonts/LICENSE`、`scripts/build-font-subset.mjs` |
| ビンゴのハブの解説だけ、1文96〜130字でトーンガイドから外れていた | `app/[lang]/bingo/page.tsx` |
| JavaScript が動かないと、診断とビンゴが無言で反応しない画面になった | 4ページに `<noscript>` |
| 診断2ページだけパンくずがなく、検索結果のパンくず表示も出なかった | `app/[lang]/test`、`app/[lang]/target-diagnosis` |
| トップに WebSite と Organization の構造化データがなかった | `app/[lang]/page.tsx` |
| X の投稿先が `twitter.com/intent/tweet` のままだった | `app/components/share/ShareOnX.tsx` |
| `npm run lint` が通らなかった（Node 用スクリプトにブラウザ向けの規則が当たっていた） | `eslint.config.mjs` |
| README が create-next-app の雛形のままだった | `README.md` |
| リンクを共有できるのが X だけで、LINE や TikTok へ送る口がなかった | `app/components/share/ShareLink.tsx`（新規。結果・ビンゴ・脈あり度の3か所） |
| 16タイプの投稿文が全部同じで、ハッシュタグもなかった | `lib/type-content/*.ts` の16本と `ResultShare.tsx` |
| コラム16本の title が長く、検索結果で「脈ありサイン」が切れていた | `lib/articles/*.ts` |
| 現行のキャラクター画像に元画像があると分かったので、再配布を止めた | `app/[lang]/downloads/page.tsx`、`app/[lang]/disclaimer/page.tsx`、`docs/asset-credits.md` |

検査そのものも2つ強化した。`scripts/check-content.mjs` は `app/` に直接書いた本文の文長を測るようになり（これまで `lib/` のデータしか見ていなかった）、`scripts/check-site.mjs` は og:image を Twitterbot として実際に取りに行くようになった。

### 確かめたこと（2026-09-18、ローカルの本番ビルド）

| 確認 | 結果 |
|---|---|
| `npm run check` | tsc、内容検査、禁止語検査、単体テスト61件がすべて合格 |
| `npm run lint` | 問題なし |
| `npm run build` | 結果・ビンゴ・コラムの各16ページと、それぞれの OG 画像が静的生成（SSG） |
| `npm run check:redirects` | 37件すべて OK |
| `npm run check:site` | NG なし。警告は ENTJ の適職「起業家」の1件（decisions N9 で職業名として残すと決めた語） |
| 自己診断 | 24問＋追加の設問3問に答えて ESTJ の結果ページへ。割合が 50-50 の軸には「追加の2択で決まりました」と出る |
| 相手診断 | 24問すべて「わからない」で「まだタイプを絞り込めません」の案内。「戻る」で前の答えが復元される |
| 脈あり度チェック | INTJ で12問に答えて 83%・段階4。AI 文も生成された |
| ビンゴ | マスを押すとライン数と称号が変わる。全マスで12/12ライン「殿堂入り 歩くINTJ辞典」 |
| 16タイプ一覧 | 絞り込み9通りの枚数が合う（内向×判断で4タイプ） |
| 途中で再読み込み | 4問目から再開する |
| 画像 | 9:16 の結果画像（スコアあり・なし）、ビンゴカード、OG 画像がすべて 200 で PNG |

## 公開の前に片付けること

### 1. キャラクター画像16枚の差し替え（最優先）

2026-09-19 に、現行の16枚が**既存の性格診断サイトのキャラクター画像を画像生成 AI に読み込ませて変換したもの**だと分かった（運営者の申告）。元の画像に依拠しているため、次の3つが同時には成り立たない。

- `/ja/downloads` が第三者に画像を配り、「画像の権利は運営者にあります」と書いている
- 同じページが「AI の学習に使うこと」を禁じている
- 免責が「性格診断サイトの 16Personalities とも関係のない、独立したサイトです」と書いている

当面の手当てとして、配布ページの `PAUSED` を true にして再配布を止めた。免責の「オリジナルの画像です」も外し、絵柄が仮であることを書いた。ただし画像そのものは、いまも全ページに出ている。

**幻獣版16枚を、既存の画像を一切参照せずに作り直すのが本筋**（仕様書 G-1、`docs/asset-credits.md` 1-2）。作り直すときは、生成ツール・時期・プロンプトを台帳に記録する。差し替えるまで公開を待つか、この状態で出すかは運営者の判断になる。法的な線引きが要るなら、専門家に一度見てもらうのが確実。

### 2. 呼称16件の J-PlatPat 検索

呼称は全タイプの h1・OG 画像・9:16 画像・共有文に入る。`docs/naming-check.md` 3章の表が「未実施」のまま。ドラゴン・ピクシー・スフィンクス・ユニコーン・フェニックス・マーメイド・ペガサスは、集英社 SPUR の占いと同名だと分かっている。

### 3. 実機での画像保存（仕様書 4-3 の端末表）

iPhone の Safari、Android の Chrome、X と LINE のアプリ内ブラウザで、結果画像とビンゴのカード画像を保存する。ここだけはコードから確かめられない。

### 4. 判断だけで済むもの

- **行動プロトコルを結果ページに載せるか**（Q9）。今は載せていない。旧データ `lib/protocols-*.ts` は削除したが、git の履歴から戻せる
- **GA4 を公開と同時に始めるか**。始めるなら、本番の環境変数に `NEXT_PUBLIC_GA_MEASUREMENT_ID` を入れる前に、GA4 の管理画面の拡張計測で「ブラウザの履歴イベントに基づくページの変更」を無効にする。`app/[lang]/privacy/page.tsx` の `UPDATED_AT_WITH_GA4` を公開の日付に書き換える
- **OpenAI と Vercel に利用の上限を置く**。カード画像（2.6億通りの URL）と 9:16 画像は、形が合えば初回のアクセスで1枚ずつ生成する。Vercel の Spend Management で費用の天井を作っておく

`..env.local.swp` は、コミット `a16dbd4`（2026-09-16）でリポジトリから外し、`*.swp` を `.gitignore` に足した。中身は1024バイトの vim のヘッダーだけで、キーやトークンの形の文字列は入っていない（2026-09-18 に、値を表示せず出現数だけ数えて確認）。手元に残っているのは追跡していないファイルなので、消してかまわない。

## プレビュー

`renewal` の最新のコミットのプレビュー URL は、GitHub のコミットの Vercel の表示か、`https://api.github.com/repos/hayabusarain/cognitive-lens/deployments?sha=（コミット）` の statuses にある `environment_url` で分かる。コミットごとに変わるので、ここには貼らない。

プレビューには Vercel Authentication（ログインの保護）がかかっていて、ログインしていない自動の検査からは見られない。`check:site` をプレビューに向けるには、Vercel の管理画面で「Protection Bypass for Automation」の値を発行し、次のように実行する。

```
VERCEL_AUTOMATION_BYPASS_SECRET=（発行した値） npm run check:site -- https://（プレビューの URL）
```

## 本番公開の手順（運営者の確認が取れてから）

1. `main` に `renewal` をマージして push する（`git checkout main`、`git merge --no-ff renewal`、`git push origin main`）
2. Vercel の本番のビルドが成功したら、公開サイトに `npm run check:redirects -- https://www.cognitive-lens.com` と `npm run check:site -- https://www.cognitive-lens.com` を実行する（仕様書 4-1）
3. X に結果ページの URL を投稿し、カードに OG 画像が出るか見る（3-4）
4. Vercel で `cognitive-lens.com` を「www への転送」からプロジェクトへの直接の割り当てに切り替え、`curl -I https://cognitive-lens.com/ja` が 301 になるか見る（ステップ 1-4 の残り）
5. Search Console でサイトマップを送信する（4-2）

## 直さずに残したこと（公開後の候補）

どれも今の動きを壊さないので、公開を待つ必要はない。運営者の好みが出るものと、作り込みが要るものを残した。

- **自分と友達のタイプを並べる画面**。2人以上で遊べるのは相手診断と脈あり度だけで、どちらも自分のタイプを使わない。4文字の一致数で5本の文章を書けば作れる
- **`robots.txt` が GPTBot と ChatGPT-User を拒否している**。AI 検索からの流入を捨てる選択になっている。ほかの AI クローラー（PerplexityBot、ClaudeBot など）は指定がなく、扱いも揃っていない

## 作業を再開するとき

1. `git status` と `git log --oneline -5` で、`renewal` に未コミットの変更がないか見る
2. `.next/types` が古いと `tsc` が消したページの型で失敗する。`.next/types` を消してから `npx tsc --noEmit` を実行する
3. ローカルで確かめるときは `npm run build` の後に `npx next start -p 3200` を起動し、`check:redirects` と `check:site` を向ける。`next dev` に `check:site` を向けると、同時に多くのページをコンパイルして開発サーバーが 500 を返すことがあった（2026-09-16）ので、本番ビルドで確かめる
4. 画面の文章を `app/` に直接書いたときも、`npm run check` が文の長さを測る（2026-09-18 に追加）。長い文はビルドが止まる

## 決めたこと

委任を受けて AI が決めたこと（呼称を続ける、相性の決め方、タイプ説明に二人称を書かない、結果ページの title の書式など）は、`docs/redesign-spec.md` 9-3 の「運営者の委任で AI が判断したこと」にある。
