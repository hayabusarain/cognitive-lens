# CognitiveLens リニューアル仕様書

作成日：2026-09-15　更新日：2026-09-15（`docs/decisions.md` と、N1〜N12 の回答を反映。8章に進捗を追記）　状態：フェーズ1まで本番反映済み、フェーズ2を作業用ブランチで進行中

## 0. この文書について

`docs/current-site.md`（現状調査）を土台に、コグニティブレンズを作り直す仕様をまとめた。実装はまだ行わない。

初版の質問（Q1〜Q20）には、運営者が `docs/decisions.md` で回答した。この版はその回答を反映したもので、両者が食い違うときは `decisions.md` を正とする。本文の「Q番号」は初版の質問を指し、回答は `decisions.md` 2章にある。この版で新たに出た確認事項は「→ N番号」と書き、9-3 に集めた。N1〜N12 には運営者がチャットで回答し（2026-09-15）、本文に反映した。N13 は実装中に出た質問で、未回答。

### 0-1. 前提

| 項目 | 内容 | 出どころ |
|---|---|---|
| URL | 既存 URL は維持する。変更する場合は 301 リダイレクト表を添付する | 依頼 |
| ビンゴ | 「MBTIビンゴ」関連ページは資産。URL と見出しを保持し、ハブとして再設計する | 依頼 |
| 呼称・文章 | 16タイプの呼称・説明文・設問文は新規に作る。既存サイトと 16Personalities に由来する呼称は使わない。ビンゴの項目と称号だけは現行を残して部分改訂する | 依頼、Q7 |
| 画像 | 出典を記録できるものだけを使う | 依頼 |
| 言語 | 日本語のみ。英語版と i18n の仕組みは作らない。`/ja` の接頭辞は残す | decisions 0章 |
| 呼称 | 幻獣名（6章） | decisions 3章 |
| キャラクター画像 | 幻獣版に作り直す。実装中は現行の16枚を仮置きし、完成後に同じパスで差し替える | decisions 4章 |
| 画像の合成 | OG 画像・9:16 結果画像・ビンゴカード画像は `ImageResponse` で合成する（AI 生成ではない） | decisions 0章 |
| AI 生成機能 | `/skip-path` と `/chat-gen` は削除。脈あり度の AI 文（`/api/romance-ai`）だけ残す | Q10 |
| 想定読者 | 16〜24歳 | Q6 |

### 0-2. 前提から導いた設計方針

| 方針 | 理由 |
|---|---|
| 301 は `proxy.ts` から `NextResponse.redirect(URL, 301)` で返す | `next.config` の `redirects` は恒久転送が 308 固定で、301 を指定できない（同梱ドキュメント `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md` 30行目）。apex から www への転送も同じ仕組みで返す（Q18） |
| URL 中の型コードは大文字に統一する | 維持する `/ja/article/INTJ` が大文字のため |
| 16タイプを NT・NF・SJ・SP の4グループで見せない | 一覧の並び（Q4）と配色（Q20）で、16Personalities のグループ分けを再現しないと決まったため。呼称の系統名もサイトには出さない（6-2） |
| 生成画像に絵文字を使わない | `ImageResponse` は絵文字を既定で Twemoji から描画する（`image-response.md` 22行目）。出典記録の対象を増やさないため |
| 件数を型で固定する | 特徴の節やビンゴの項目が欠けると、画面と生成画像のレイアウトが崩れる。目視ではなく型チェックで見つけるため |
| 禁止語をスクリプトで検査する | 「由来する呼称を使わない」を、人の目視に頼らず毎回確かめるため |

---

## 1. サイトマップ

### 1-1. 新サイトのページ構成

| URL | 役割 | 描画 | 区分 |
|---|---|---|---|
| `/` | `/ja` へ転送 | 307（現行の `app/page.tsx` のまま） | 維持 |
| `/ja` | トップ。診断・一覧・ビンゴ・コラムへの入口 | SSG | 維持 |
| `/ja/test` | 自己診断（24問） | SSG（進行はクライアント） | 維持・設問新規 |
| `/ja/result` | 16タイプ一覧。キャラクター画像のカード一覧 | SSG | 維持・**役割変更**（現状は INTP の結果を表示） |
| `/ja/result/{TYPE}` | タイプ別の結果・解説 | SSG | **新規**（旧 `?type=` から 301） |
| `/ja/result/{TYPE}/opengraph-image` | OG 画像 1200×630 | ビルド時生成 | 新規 |
| `/ja/result/{TYPE}/share-image` | 9:16 結果画像（スコアなし） | ビルド時生成 | 新規 |
| `/ja/result/{TYPE}/share-image/{scores}` | 9:16 結果画像（スコアあり） | 初回アクセス時に生成してキャッシュ | 新規 |
| `/ja/target-diagnosis` | 相手診断（24問） | SSG（進行はクライアント） | 維持・設問新規 |
| `/ja/romance-checker` | 脈あり度チェック | SSG（進行と AI 文はクライアント） | 維持・設問新規 |
| `/ja/bingo` | ビンゴのハブ。16タイプのビンゴへの入口 | SSG | 維持（**URL・見出し保持**） |
| `/ja/bingo/{TYPE}` | タイプ別ビンゴ | SSG | 新規 |
| `/ja/bingo/{TYPE}/card/{mask}` | ビンゴカード画像 1080×1350 | 初回アクセス時に生成してキャッシュ | 新規 |
| `/ja/articles` | コラム一覧 | SSG | 維持 |
| `/ja/article/{TYPE}` | タイプ別の恋愛コラム | SSG | 維持・本文新規 |
| `/ja/about`、`/ja/disclaimer`、`/ja/privacy`、`/ja/downloads` | 運営者情報・免責・規約・素材配布 | SSG | 維持・文面更新 |
| `POST /api/romance-ai` | 脈あり度の AI 文 | 実行時 | 維持 |
| `/sitemap.xml`、`/robots.txt` | クローラー向け | 静的 | 維持・内容更新 |

`[lang]` の区画が受け付ける値は `ja` だけで、ほかは 404 にする（3-6）。`/` の転送は 307 のまま残す。将来 `/ko` を足すとき、振り分け先を変えられるようにするためだ。

### 1-2. 新旧 URL 対応表

`current-site.md` で確認した全 URL について、新サイトでの扱いを示す。

| 旧 URL | 新 URL | 扱い |
|---|---|---|
| `/` | `/ja` | 維持（307） |
| `/ja` | 同じ | 維持 |
| `/ja/test`、`/ja/target-diagnosis`、`/ja/romance-checker`、`/ja/bingo`、`/ja/articles`、`/ja/article/{TYPE}`、`/ja/about`、`/ja/disclaimer`、`/ja/privacy`、`/ja/downloads` | 同じ | 維持 |
| `/ja/result?type={TYPE}` | `/ja/result/{TYPE}` | **301** |
| `/ja/result`（type なし） | 同じ | 維持。中身を16タイプ一覧に変更 |
| `/ja/select` | `/ja/result` | **301** |
| `/ja/skip-path`、`/ja/chat-gen` | `/ja/test` | **301**（ページは削除） |
| `/en` と、`/en` 配下の全ページ | 対応する `/ja` のページ。上の行の変換も合わせて1回で転送 | **301**（英語版は削除） |
| `/ko` と、`/ko` 配下のページ | 対応する `/ja` のページ | **301** |
| `/test`、`/privacy` など言語なしのページパス | `/ja/…` | **301**（現状は壊れたトップを 200 で返す） |
| `/translate` など、先頭が言語でも既知のページでもないパス | — | **404**（現状は壊れたトップを 200 で返す） |
| `/ja/translate` | — | 404 のまま（2026-05-06 に削除済み） |
| `/ja/video-gen`、`/ja/video-preview`、`/ja/admin/*` | — | 404（2026-09-15 に反映済み） |
| `/api/og?type=&lang=` | `/ja/result/{TYPE}/opengraph-image` | **301** |
| `/api/story-card?type=&lang=` | `/ja/result/{TYPE}/share-image` | **301** |
| `/api/admin/seed-protocols`、`/api/weakness`、`/api/chat-script`、`/api/chat-og`、動画系の API 6つ | — | 404（2026-09-15 に削除済み。8章フェーズ0の調査結果） |
| `/api/result` | — | API は 2026-09-15 に削除済み。今は `[lang]` が `api` を言語として受け付け、INTP の結果ページを 200 で返す。ステップ 1-1 で 404 になる |
| `/api/romance-ai` | 同じ | 維持 |
| `https://cognitive-lens.com/*` | `https://www.cognitive-lens.com/*` | **301**（現状は Vercel のドメイン設定による 307） |

### 1-3. 301 リダイレクト一覧

`lib/redirects.ts` は、下表の規則を**適用順**に当てて URL を書き換える。1つでも書き換わったら、最後にできた URL へ1回だけ 301 で転送する。転送を2段以上つなげない。

規則の番号（R1〜R12）は初版からの通し番号で、適用順とは一致しない。

| 適用順 | # | 条件 | 書き換え | 例 |
|---|---|---|---|---|
| 1 | R10 | ホストが `cognitive-lens.com`（www なし） | ホストを `www.cognitive-lens.com` にする | `https://cognitive-lens.com/ja` → `https://www.cognitive-lens.com/ja` |
| 2 | R8 | パスが `/api/og` | `/ja/result/{TYPE}/opengraph-image`。`lang` は読まない。`type` が16タイプ以外なら `/ja/opengraph-image`（トップの OG 画像） | `/api/og?type=intj&lang=en` → `/ja/result/INTJ/opengraph-image` |
| 3 | R9 | パスが `/api/story-card` | `/ja/result/{TYPE}/share-image`。`type` が16タイプ以外なら `/ja/result` | `/api/story-card?type=INTJ` → `/ja/result/INTJ/share-image` |
| 4 | R11 | 先頭が `en` か `ko` で、続きが空か既知のパス | 先頭を `ja` にする | `/en/test` → `/ja/test`、`/ko` → `/ja` |
| 5 | R7 | 先頭に言語（`ja`、`en`、`ko`）がなく、パスが既知のパス | 先頭に `/ja` を足す | `/test` → `/ja/test` |
| 6 | R12 | `/ja/skip-path` か `/ja/chat-gen` | `/ja/test` | `/en/chat-gen` → `/ja/test` |
| 7 | R3 | `/ja/select` | `/ja/result` | `/select` → `/ja/result` |
| 8 | R1 | `/ja/result` に `type` があり、値が16タイプのいずれか（大文字小文字は問わない） | `/ja/result/{TYPE大文字}`。ほかのクエリは捨てる | `/ja/result?type=intj&a=EIIE…` → `/ja/result/INTJ` |
| 9 | R2 | `/ja/result` に `type` があり、値が16タイプ以外 | `/ja/result`（クエリを捨てる） | `/ja/result?type=XXXX` → `/ja/result` |
| 10 | R4・R5・R6 | `/ja/result/{type}`、`/ja/article/{type}`、`/ja/bingo/{type}` の型コードが大文字でない | 型コードを大文字にする | `/ja/article/Enfp` → `/ja/article/ENFP` |

既知のパスは次の16種類とする。`{type}` は大文字小文字を問わず16タイプのいずれかに限る。

`test`、`result`、`result/{type}`、`select`、`target-diagnosis`、`romance-checker`、`bingo`、`bingo/{type}`、`articles`、`article/{type}`、`about`、`disclaimer`、`privacy`、`downloads`、`skip-path`、`chat-gen`

複数の規則が重なる例を挙げる。`https://cognitive-lens.com/en/result?type=entp` は R10・R11・R1 が順に当たり、`https://www.cognitive-lens.com/ja/result/ENTP` へ1回で転送される。

R8 の転送先は、Next.js が生成画像の URL に付けるキャッシュ用クエリを含まない。クエリなしの `/ja/result/{TYPE}/opengraph-image` と `/ja/opengraph-image` が 200 を返すことを、ローカルの本番ビルドで確かめた（2026-09-16）。

### 1-4. 転送の実装方式

`lib/redirects.ts` に「URL を受け取り、転送先 URL か null を返す純粋な関数」を置く。規則ごとに有効・無効の定数を持ち、8章のステップで順に有効にする。無効の規則は書き換えを行わない。

`proxy.ts` はこの関数を呼び、結果があれば `NextResponse.redirect(転送先, 301)` を返すだけにする。`proxy.ts` はすべてのルートで実行される（`proxy.md` 202行目）。静的ファイル（`/_next/static`、`/_next/image`、拡張子付きのファイル）は matcher で除外し、`/api/og` と `/api/story-card` は対象に含める。Bot 判定とレートリミットは、転送の判定の後に `POST /api/romance-ai` だけに適用する（3-6）。

R10 を働かせるには、Vercel で `cognitive-lens.com` を「www への転送」ではなく、プロジェクトへ直接割り当てる。Vercel 側で転送すると、`proxy.ts` に届く前に 307 が返るためだ。設定の切り替えは、R10 を含む `proxy.ts` を公開した後に行う。順番が逆だと、www なしのドメインで同じページが転送されずに表示される期間ができる。

検証用に `scripts/check-redirects.mjs` を作る。1-3 の表と同じ内容をテストケースとして持ち、ステータスが 301 であること、`Location` の値、転送が1回で終わることを確かめる。ローカルの本番ビルドと公開サイトの両方に向けて実行でき、ローカルでは `Host` ヘッダーを変えて R10 を確かめる。

### 1-5. sitemap.xml と robots.txt

| 項目 | 新仕様 |
|---|---|
| ドメイン | `https://www.cognitive-lens.com`。`metadataBase` と同じ定数から読む（環境変数名の不一致を解消） |
| 収録 | 59 URL。トップ、test、result 一覧、result/{TYPE}×16、target-diagnosis、romance-checker、bingo、bingo/{TYPE}×16、articles、article/{TYPE}×16、about、disclaimer、privacy、downloads |
| 載せない | 画像 URL、転送元の URL、API |
| hreflang | 付けない（日本語のみ） |
| lastmod | ビルド時刻ではなく、コンテンツファイルに持たせた更新日。結果ページは `TypeContent.updatedAt`、コラムは `ArticleContent.updatedAt`。ほかのページと、タイプごとの更新日を持たないタイプ別ビンゴは、`app/sitemap.ts` に書いた固定の日付 |
| robots.txt | `GPTBot` と `ChatGPT-User` の拒否は現行どおり。`Sitemap:` 行を www 付きに直す |

---

## 2. 診断ロジック仕様

### 2-1. 自己診断 `/ja/test`

#### 設問の構成

設問は24問で、4つの軸に6問ずつ配る（Q11 で確定）。軸は E/I（外向・内向）、S/N（感覚・直観）、T/F（思考・感情）、J/P（判断・知覚）。

各軸の6問のうち3問は前の文字（E・S・T・J）の傾向を、残り3問は後の文字（I・N・F・P）の傾向を述べる文にする。どの文にも「あてはまる」と答えがちな人の回答が、片方の文字に偏らないようにするためだ。

表示順は全利用者で固定する。軸を E/I → S/N → T/F → J/P の順に1問ずつ巡回し、前の文字と後の文字の設問を交互に置く。利用者ごとのシャッフルはしない。同じ回答から同じ結果が出ることを保証し、テストを書けるようにするためだ。

画面には軸名も、選択肢に対応する文字も**出さない**（現状は出していて、結果を狙って選べる）。

#### 回答の尺度

中立を置かない6段階とする。値は「その設問が述べている傾向への同意の強さ」を表す。

| 表示 | 値 |
|---|---|
| とてもあてはまる | +3 |
| あてはまる | +2 |
| ややあてはまる | +1 |
| あまりあてはまらない | −1 |
| あてはまらない | −2 |
| まったくあてはまらない | −3 |

#### スコア計算

1. 設問ごとに、前の文字を述べる設問なら符号 +1、後の文字を述べる設問なら符号 −1 とする
2. 軸スコア S = Σ（符号 × 回答値）。6問なので S は −18〜+18 の整数になる
3. 前の文字の割合 p = round(50 + S × 50 ÷ 18)。丸めは JavaScript の `Math.round`。p は 0〜100 の整数
4. S > 0 なら前の文字、S < 0 なら後の文字を採用する
5. S = 0 なら、その軸の**決定設問**を追加で表示する（2択、中立なし）。選ばれた文字を採用し、p は 50 のままにする
6. 4軸の文字を E/I、S/N、T/F、J/P の順につなげたものがタイプになる

#### 境界値の扱い

| 軸スコア S | p | 採用する文字 | 結果画面の表示 |
|---|---|---|---|
| +4〜+18 | 61〜100 | 前の文字 | 通常 |
| +1〜+3 | 53〜58 | 前の文字 | **僅差** |
| 0 | 50 | 決定設問で選んだ文字 | **僅差**（決定設問で決まったと表示） |
| −1〜−3 | 42〜47 | 後の文字 | **僅差** |
| −4〜−18 | 0〜39 | 後の文字 | 通常 |

「僅差」は p が 42 以上 58 以下と定義する。僅差の軸があれば、結果画面にその軸の文字だけを入れ替えたタイプへのリンクを出す。p で定義するのは、回答数が変わる相手診断（2-3）でも同じ基準を使うためだ。

#### 進行と受け渡し

- 全問必須。未回答のまま次へ進めない
- 「戻る」で直前の回答を取り消せる。決定設問も取り消せ、その場合は回答し直すまで結果へ進まない
- 途中経過は `sessionStorage` のキー `cl:test:v1` に保存し、再読み込みで続きから再開する。完了時に削除する。設問セットを改訂したらキーの版を上げ、古い途中経過は捨てる
- 回答はサーバーにも GA4 にも送らない（3-7）
- 完了後は `/ja/result/{TYPE}?p={pE}-{pS}-{pT}-{pJ}` へ遷移する

#### 計算例

| 軸 | 前の文字を述べる3問の回答 | 後の文字を述べる3問の回答 | S | p | 判定 |
|---|---|---|---|---|---|
| E/I | +2、+1、−1 | +1、−2、−1 | (+2) − (−2) = +4 | 61 | E |
| S/N | −1、+1、−2 | +2、+1、+1 | (−2) − (+4) = −6 | 33 | N |
| T/F | +3、+2、+1 | −3、−2、+1 | (+6) − (−4) = +10 | 78 | T |
| J/P | +1、−1、+1 | +1、−1、+1 | (+1) − (+1) = 0 | 50 | 決定設問で P |

結果は ENTP で、遷移先は `/ja/result/ENTP?p=61-33-78-50`。J/P は僅差として表示される。

#### 結果ページ側での検証

結果ページは `p` を次の条件で検証し、1つでも満たさなければ個人スコア欄を出さない（エラー表示もしない）。

- 4つの値がすべて 0〜100 の整数
- 各軸で、p > 50 なら URL の型コードが前の文字、p < 50 なら後の文字である
- p = 50 はどちらの文字でもよい（決定設問）

### 2-2. 境界値のテストケース

診断ロジックは `lib/diagnosis/score.ts` に純粋な関数としてまとめ、次のケースを単体テストにする。

| # | 入力 | 期待する結果 |
|---|---|---|
| T1 | 24問すべて「とてもあてはまる」 | 全軸 S = 0。決定設問が4問出る。p は 50-50-50-50 |
| T2 | 前の文字を述べる設問に +3、後の文字を述べる設問に −3 | ESTJ、p = 100-100-100-100 |
| T3 | T2 の逆 | INFP、p = 0-0-0-0 |
| T4 | ある軸で S = +3 | その軸 p = 58、前の文字、僅差 |
| T5 | ある軸で S = +4 | その軸 p = 61、前の文字、通常 |
| T6 | ある軸で S = −3 と −4 | p = 42 で僅差、p = 39 で通常 |
| T7 | 決定設問に答えた後で戻る | 決定設問が未回答に戻り、結果へ進めない |
| T8 | 結果 URL `ENTP?p=61-33-78-50` | 個人スコア欄を表示 |
| T9 | 結果 URL `ENTP?p=40-33-78-50` | E なのに p < 50 で矛盾。個人スコア欄を出さない |
| T10 | 結果 URL `ENTP?p=abc`、`?p=101-0-0-0` | 個人スコア欄を出さない |

### 2-3. 相手診断 `/ja/target-diagnosis`

「あの人」についての24問。軸の配分、設問の向き、表示順、6段階の尺度は自己診断と同じにし、7つ目の選択肢として「わからない」を加える（Q11 で確定）。

| 項目 | 仕様 |
|---|---|
| 「わからない」 | 値 0。その軸の分母から除く |
| 軸の回答数 n | 「わからない」以外で答えた設問の数（0〜6） |
| p | round(50 + S × 50 ÷ (3 × n)) |
| 判定不能 | n < 3 の軸 |
| S = 0 かつ n ≥ 3 | 決定設問を出す（2択＋「わからない」）。「わからない」なら判定不能 |
| 僅差 | 自己診断と同じく p が 42〜58 |

判定不能の軸がある場合は、推測でタイプを決めない。

| 判定不能の軸数 | 画面の動き |
|---|---|
| 0 | `/ja/result/{TYPE}?p=…&from=target` へ遷移 |
| 1 | その軸の文字を入れ替えた2タイプを候補として並べ、各結果ページへリンクする |
| 2 | 4タイプを候補として並べる |
| 3以上 | 候補を出さず、「わからない」の多い設問から答え直すよう促す |

結果ページは `from=target` を読み、冒頭の見出しと二人称の文言を「あの人」向けに切り替える。クライアント側の表示だけで、canonical は変えない。現状は相手の診断結果にも「あなたの取り扱い説明書」と出ている。

### 2-4. 脈あり度 `/ja/romance-checker`

1. 相手のタイプを16個から選ぶ。わからなければ相手診断へのリンクを出す
2. そのタイプ用の設問 N 問に「はい」「いいえ」で答える。N は12以下（Q11）
3. 脈あり度 = round(はいの数 ÷ N × 100)

| 脈あり度 | 段階 |
|---|---|
| 0〜24 | 段階1 |
| 25〜49 | 段階2 |
| 50〜74 | 段階3 |
| 75〜100 | 段階4 |

各段階の下限を含む。段階ごとの説明文は新規に書く固定文とする。

AI 文は残す（Q10）。「はい」と答えた設問文を `POST /api/romance-ai` に送り、返ってきた文を段階の説明の下にクライアント側で表示する。AI 文の取得に失敗しても、脈あり度と段階の説明は表示する。AI への指示文は、トーンガイド（ステップ 2-1）に合わせて書き直す。

### 2-5. ビンゴ `/ja/bingo/{TYPE}`

| 項目 | 仕様 |
|---|---|
| マス | 5×5。中央は FREE で、常に押された状態 |
| 項目 | タイプごとに24個。現行の `lib/bingo-data-ja.ts` を残し、トーンガイドから外れる項目だけ差し替える（Q7） |
| 並び | 固定（現行どおり） |
| ライン | 縦5・横5・斜め2の12本 |
| 称号 | 揃ったライン数で7段階。しきい値は現行の 0／1／2〜3／4〜5／6〜8／9〜11／12。文言も現行を残し、トーンから外れるものだけ差し替える（Q7） |
| 盤面の記録 | FREE を除く24マスを左上から行ごとに並べ、押したマスを 1 とする24ビットの値。6桁の16進数（小文字、ゼロ埋め）で表す |

現行の称号には「【ガチ勢】筋金入りの{TYPE}」「【神の領域】歩く{TYPE}辞典」があり、流行語と 6-1 の誇張語「神」に当たる。最低段階の「【MBTI詐称疑惑】エセ{TYPE}」も、タイプ別ビンゴのページで本文の「MBTI」の回数を増やす（N3 の1回まで）。どれもステップ 2-9 の差し替え対象になる。

盤面の記録はカード画像の URL（`/card/{mask}`）に使う。`^[0-9a-f]{6}$` に合わない値は 404 にする。

### 2-6. 設問文の作成ルール

自己診断・相手診断・脈あり度の設問文はすべて新規に書く。書くときの条件は次のとおり。

- 1問で1つのことだけを尋ねる（「〜で、〜する」のように2つを混ぜない）
- 「〜なとき」と場面を具体的にする
- 前の文字を述べる文と後の文字を述べる文に、社会的な望ましさで差をつけない
- 45字以内。語調はトーンガイド（ステップ 2-1）に従う
- 現行サイトの `lib/questions.ts`・`lib/target-questions.ts` の設問と、16Personalities の設問に表現を似せない。現行設問とは文字列の類似度を機械的に比べ、16Personalities とは目視で比べる

---

## 3. 結果ページのレンダリング方式

### 3-1. 結論

`/ja/result/{TYPE}` は **SSG（ビルド時の静的生成）** にする。`app/[lang]/result/[type]/page.tsx` の `generateStaticParams` が16タイプを返し、`dynamicParams = false` で他の値を 404 にする。`lang` の値 `ja` は、親の `app/[lang]/layout.tsx` の `generateStaticParams` から受け取る（`generate-static-params.md` 380〜383行目）。

### 3-2. 根拠

| 観点 | SSG | SSR |
|---|---|---|
| 内容の決まり方 | 型コードの16通りで決まり、ビルド時に全部作れる | 利用者ごとに変わる情報がないので、SSR にする利点がない |
| 検索エンジンへの見え方 | 本文・h1 を含む完成した HTML を返す。現状の「解析中画面しか返らない」問題が解消する | 同じく返せるが、毎回サーバーで描画する |
| 速度と費用 | CDN から配信し、関数の実行がない | リクエストごとに関数を実行する |
| 不正な型コード | `dynamicParams = false` で 404（`generate-static-params.md` 376行目） | 自前で 404 を判定する |
| OG 画像 | 同じ区画の `opengraph-image` もビルド時に作られる（`opengraph-image.md` 91行目） | 実行時に作るか、別に静的化が要る |

利用者ごとに変わるのは個人スコア（`?p=`）だけで、これはクライアント側で描画する（3-3）。スコアを保存する機能もログインもないので、サーバーで描画する必要はない。

旧 URL の `?type=` 形式のままでは静的生成できない。ページがクエリを読むと、リクエスト時の処理になるからだ。そこで型コードをパスに移し、旧 URL は R1 で 301 転送する。

### 3-3. 個人スコアの表示

個人スコア欄は、`useSearchParams` で `p` と `from` を読むクライアントコンポーネントにし、`<Suspense>` で包む。静的に生成したページでも、Suspense 境界の内側だけがクライアント側で描画され、残りは HTML に含まれる（`use-search-params.md` 82〜86行目）。

| 状態 | 表示 |
|---|---|
| `p` なし | 個人スコア欄を出さない。一覧やコラムから来た人向けのタイプ解説として読める |
| `p` が正しい | 4軸の割合バーを表示（Q12）。僅差の軸には印と、入れ替えたタイプへのリンク |
| `p` が不正 | 個人スコア欄を出さない |

### 3-4. 結果ページの構成と metadata

ページの並びは次のとおり。各部の文章はすべて新規に書く（5-2 の `TypeContent`）。

1. ヒーロー：キャラクター画像、見出し、一行説明。見出しは `<hgroup>` に `<h1>` の型コードと `<p>` の呼称を入れ、型コードを主、呼称を副題にする（decisions 3章）
2. 個人スコア欄（`p` があるときだけ）
3. 共有：X への投稿、9:16 結果画像の保存
4. 要約
5. 特徴3項目
6. 友人・仕事・恋愛での傾向
7. すれ違いやすい場面と対処2つ
8. 相性の良い相手と、すれ違いやすい相手（理由つき）
9. 適職（Q9・N1）。どのタイプにどの職業を挙げるかは現行の `lib/career-data.ts` のまま残し、説明文だけを書き直す。「地獄の職業」「生存ルート」といった節の見出しも、トーンガイドに合わせて付け直す
10. 関連ページ：同タイプのビンゴ、同タイプのコラム、相手診断、16タイプ一覧

共有を3番目に置くのは、診断を終えた直後に画像を保存できるようにするためだ。

行動プロトコル（現行の `AccordionSection`）を載せるかは保留になっている（Q9）。ステップ 3-2 で INTJ のページができた時点で、運営者が分量を見て決める。

| metadata | 値 |
|---|---|
| title | `TypeContent.seo.title` |
| description | `TypeContent.seo.description` |
| canonical | `https://www.cognitive-lens.com/ja/result/{TYPE}`（クエリなし） |
| og:image / twitter:image | 同じ区画の `opengraph-image.tsx` と `twitter-image.tsx` |
| twitter:card | `summary_large_image` |

検索結果に出る title・description・h1 には「MBTI」を入れない。本文で触れる場合は、「MBTIでいうINTJ」のような説明として1回までにする（N3・N11）。

X への投稿に入れる URL にはクエリを付けない。カードは型ごとの静的な OG 画像になり、個人スコアが第三者のタイムラインに出ることもない。

### 3-5. 他のページの描画方式

| ページ | 方式 | 補足 |
|---|---|---|
| `/ja` | SSG | — |
| `/ja/test`、`/ja/target-diagnosis`、`/ja/romance-checker` | SSG | 画面の骨組みと設問データを HTML に含め、進行はクライアント |
| `/ja/result` | SSG | 16枚のカード。絞り込みはクライアント（4-4） |
| `/ja/bingo`、`/ja/bingo/{TYPE}` | SSG | 盤面の操作はクライアント |
| `/ja/articles`、`/ja/article/{TYPE}` | SSG | 現行どおり |
| 規約・運営者・素材配布 | SSG | — |
| スコア付き 9:16 画像、ビンゴカード画像 | 初回アクセス時に生成してキャッシュ | 4-3、4-5 |
| `POST /api/romance-ai` | 実行時 | AI 生成で残る唯一の API |

### 3-6. 基盤の変更

全ページに関わるため、ページ制作より先に行う。初版で予定していたルートレイアウトの `app/[lang]/layout.tsx` への移動と `global-not-found` は、英語版をやめたので行わない。`app/layout.tsx` の `<html lang="ja">` が、そのまま全ページで正しくなるためだ。

| 変更 | 内容 | 根拠 |
|---|---|---|
| 言語の区画を `ja` だけにする | `app/[lang]/layout.tsx`（ルートではないレイアウト）を新設し、`generateStaticParams` が `[{ lang: 'ja' }]` を返すようにして `dynamicParams = false` を指定する。`/foo` や `/foo/test` が 404 になる。実行時に描画するページ（`/[lang]/result`）には `dynamicParams` が効かなかったので、レイアウトでも `lang` が `ja` 以外なら `notFound()` を呼ぶ（2026-09-15 確認） | `dynamicParams.md` 17行目 |
| 404 ページ | `app/not-found.tsx` を置く。ルートの `not-found` は一致しない URL 全体を扱い、404 には `noindex` が自動で付く | `not-found.md` 131行目、185行目 |
| 手書きの `<head>` を Metadata API へ | サイト確認の meta を `verification.google` で出す | `layout.md` 141行目、`generate-metadata.md` 756行目 |
| Bot 判定とレートリミットの範囲 | `POST /api/romance-ai` だけにする。画像のルートと全ページからは外す。ルート内の `isBotUserAgent` の判定も残す。OG 画像が X などのクローラーに 403 を返していた件は、ステップ 0-3 で直した。0-8 の削除で、proxy の判定を受ける API は `POST /api/romance-ai` だけになっている。実装（2026-09-16）では、proxy はパスが `/api/romance-ai` のときだけ判定し、メソッドは問わない（GET はルートが 405 を返す） | `current-site.md` 6-4 |
| 型エラーでビルドを止める | `next.config.ts` の `typescript.ignoreBuildErrors: true` を外す。`tsc` で出ている既存の型エラー1件（`app/api/og/route.tsx` 127行目、`catch` の中の `lang`）を先に直す | — |

### 3-7. 計測（GA4）

GA4 を入れ、次の3つのイベントを送る（Q16）。

| イベント | 送るとき | パラメーター |
|---|---|---|
| `diagnosis_complete` | 自己診断か相手診断で、結果ページへ遷移する直前 | `type`（型コード）、`mode`（`self` か `target`） |
| `share` | X への投稿ボタンを押したとき | `method`（`x`）、`content_type`（`result`・`bingo`・`romance`）、`item_id`（型コード。`romance` は脈あり度チェックで選んだ相手のタイプ） |
| `save_image` | 保存の流れ（4-3）で共有シートかダウンロードが成功したとき、または長押しの案内を表示したとき | `method`（`share_sheet`、`download`、`long_press`）、`content_type`、`item_id` |

長押しの案内では、実際に保存したかは取得できない。案内を表示した時点で送る。回答内容と各軸の割合、脈あり度の数字は送らない。`romance` は脈あり度チェックの結果にある X への投稿ボタンで、画像の保存はないので `save_image` には出てこない（2026-09-16 に追加）。

Cookie 同意バナー（利用を続けると同意とみなす方式）は 2026-09-15 に外した。同意ボタンは置かない。GA4 を使うことと送る情報は、プライバシーポリシーで公表する（Q16、日本の外部送信規律への対応）。GA4 の配信とポリシーの公表は同じステップで公開する（ステップ 3-19）。

---

## 4. 画像

### 4-1. キャラクター画像

#### 作り直しの方針

キャラクター画像は幻獣版に作り直す（decisions 4章）。

| 項目 | 内容 |
|---|---|
| コンセプト | 幻獣そのものではなく、幻獣をまとった人型キャラクター。角・翼・鱗・毛皮など幻獣の要素を1〜2点入れる |
| 仕様 | 800×1000、透過 PNG（現行と同じ。後段のスクリプトを変えない） |
| 作り方 | 1本のスタイル指示で16枚を続けて生成し、絵柄のばらつきを防ぐ |
| 記録 | `docs/asset-credits.md` にツール名・日付・プロンプトを残す |
| 進め方 | 実装は現行画像で進める。画像はパスで参照しているので、完成後にファイルを置き換える |

作り直すのは、現行画像の持ち物と衣装の色が 16Personalities を連想させるからだ（Q3）。INTJ は建物の模型、INTP は白衣とフラスコ、ENTP は演台とマイク、ENFJ は剣とマント、ISFJ は看護服、ESFJ はコック帽とケーキ、ISFP は絵の具のパレットを持つ。衣装の色も NT は紫、NF は緑、SJ は青、SP は黄・茶に、おおむね分かれている。

新しい画像を受け入れるときは、次を確かめる。

| 確認項目 | 方法 |
|---|---|
| 大きさと透過 | 16枚すべてが 800×1000 で、アルファチャンネルを持つ（スクリプトで確認） |
| 職業を示す持ち物がない | 上に挙げた模型、白衣、演台、剣、看護服、コック帽、パレットのような持ち物がないか目視 |
| 4グループで色が揃っていない | NT・NF・SJ・SP ごとに4枚を並べ、同じ色相に偏っていないか目視 |
| 生成画像の枠に収まる | 翼などで横に広がった画像も、4-2〜4-5 の枠に収まるか。差し替え後に全生成画像を目視 |
| 記録 | `docs/asset-credits.md` にツール名・日付・プロンプトがある |

#### 出典の記録

`docs/asset-credits.md` を新設し、サイトで使うすべての画像・フォント・アイコンの出典を記録する。記録がないものはサイトに載せない。

| 項目 | 記録内容 |
|---|---|
| ファイル | `public/characters/{TYPE}.png` の16枚 |
| 形式 | PNG、800×1000、透過あり |
| 作成者 | 運営者 |
| 作成方法 | AI 生成。ツール名・時期・プロンプトは運営者が記入する（Q2）。現行画像と幻獣版の両方について書く |
| 権利 | 運営者（2026-09-15 に運営者が申告） |
| 現行画像の履歴 | リポジトリへの追加は 2026-04-19、コミット `5880e2b`。差し替え後も台帳から消さず、使用終了日を書く |

#### 派生ファイル

| ファイル | 作り方 | 用途 |
|---|---|---|
| `public/characters/{TYPE}.png` | 元画像のまま | ページ表示（`next/image` が最適化）、素材配布ページ |
| `assets/characters/trimmed/{TYPE}.png` | `scripts/build-character-assets.mjs` が sharp で透過の余白を切り詰める（現行の INTJ は 800×1000 → 565×862） | OG 画像、9:16 画像、ビンゴカード画像の生成 |

sharp は `package.json` に書かれていないが、`node_modules` に 0.34.5 が入っている。スクリプトで直接使うので `devDependencies` に明記する。画像を差し替えたら、このスクリプトを実行し直すだけでよい。

#### 使う場所ごとの仕様

背景は暗色で統一し、タイプ色（ステップ 2-3 で定義する16色。Q20）は面の一部に使う。

| 場所 | 使うファイル | 表示サイズの目安 | 背景 | alt |
|---|---|---|---|---|
| 16タイプ一覧 `/ja/result` のカード | 元画像 | 縦横比 4:5 の枠いっぱい | 暗色の地にタイプ色の面 | `{TYPE}（{呼称}）のキャラクター` |
| 結果ページのヒーロー | 元画像 | 4:5、最大 320px 幅 | 同上 | 同上 |
| ビンゴのハブ `/ja/bingo` | 元画像 | 一覧と同じカード部品 | 同上 | 同上 |
| ビンゴ `/ja/bingo/{TYPE}` | 元画像 | 盤面の見出し横に 96px | 暗色の盤面 | 同上 |
| OG 画像 1200×630 | 切り詰め版 | 高さ 560px・幅 540px の枠 | 左側がタイプ色、右側が暗色 | —（画像内） |
| 9:16 結果画像 | 切り詰め版 | 高さ 820px（スコアありは 680px）・幅 920px の枠 | 暗色の地にタイプ色の面 | — |
| ビンゴカード画像 | 切り詰め版 | 高さ 240px の枠 | 暗色 | — |

生成画像では、キャラクターを枠の中に縦横比を保って収める。高さだけで大きさを決めると、翼のある画像が横にはみ出すためだ。

### 4-2. 動的 OG 画像

#### 方式

Next.js のファイル規約 `opengraph-image.tsx` を使う。`app/[lang]/result/[type]/opengraph-image.tsx` を置き、ビルド時に16枚を生成する（`opengraph-image.md` 91行目、221行目）。当初は親の `generateStaticParams` に従うと考えていたが、画像のルートは親を引き継がず、ファイルの中で `generateStaticParams` を書かないと実行時の生成になった（2026-09-16 のビルドで確認）。そのため画像のルートごとに `generateStaticParams` を書いている。Node.js ランタイムでフォントと画像をファイルから読む（同 417行目）。

`/api/` の下に置かないので、Bot 判定を受けない。3-6 の変更で Bot 判定は `POST /api/romance-ai` だけになり、二重に守られる。

同じ規約で、ページごとに OG 画像を用意する。

| ページ | OG 画像の内容 |
|---|---|
| `/ja/result/{TYPE}` | キャラクター、型コード、呼称、短文 |
| `/ja/article/{TYPE}` | キャラクター、型コード、コラムの見出し |
| `/ja/bingo/{TYPE}` | キャラクター、「偏見だらけの{TYPE}ビンゴ」 |
| `/ja`、`/ja/test`、`/ja/result`、`/ja/bingo`、`/ja/articles`、`/ja/target-diagnosis`、`/ja/romance-checker` | キャラクター4体を並べた共通デザインに、ページ名を入れる |

#### 1200×630 のレイアウト（結果ページ）

| 位置 | 内容 | 文字サイズ |
|---|---|---|
| 左 45% | タイプ色の面に、切り詰め版キャラクターを下揃えで配置（高さ 560px・幅 540px の枠） | — |
| 右上 | 型コード | 150px、Black |
| 右中 | 呼称 | 64px、Bold |
| 右中下 | `TypeContent.og.catch`（24字以内、2行まで） | 34px |
| 右下 | 「CognitiveLens」と `www.cognitive-lens.com` | 24px |

外周に 60px の余白を取る。絵文字は使わない。

#### フォント

Noto Sans JP（SIL Open Font License 1.1）の静的ウェイトを使う。`ImageResponse` が読めるのは TTF・OTF・WOFF だけで、WOFF2 は使えない（`image-response.md` 52行目）。実装では notofonts/noto-cjk の `Sans/SubsetOTF/JP` にある静的な OTF（CFF）を使い、3ウェイトとも描画できることを確かめた（2026-09-15、ステップ 1-6）。取得元と版は `docs/asset-credits.md` にある。

- 取得元の URL、版、ライセンスを `docs/asset-credits.md` に記録する
- `import` で同梱せず `readFile` で読む。`ImageResponse` のバンドル上限 500KB の対象から外すため（同 51行目）
- 生成画像に出る文字（コンテンツ全体、画面の固定文言、英数字）だけを残すサブセットを、ビルド前のスクリプトで作る。使うサブセット化ツールは実装時に選び、そのライセンスも記録する
- 実行時に画像を作るルート（4-3、4-5）では、フォントと切り詰め版画像を `outputFileTracingIncludes` で出力に含める（`output.md` 80行目）

#### 確認方法

- ビルド出力に16枚の OG 画像ルートが静的生成として出る
- 生成画像が 1200×630 の PNG である
- 次の User-Agent で取得して、すべて 200 と `image/png` が返る：通常のブラウザ、`Twitterbot/1.0`、Slackbot、Discordbot、Googlebot、`facebookexternalhit`
- HTML の `og:image` が www 付きの絶対 URL である
- X に実際に投稿して、カードに画像が出る（運営者の操作）

### 4-3. 9:16 結果画像の保存機能

#### URL の設計

| URL | 内容 | 生成 |
|---|---|---|
| `/ja/result/{TYPE}/share-image` | スコアなし | `generateStaticParams` でビルド時に16枚 |
| `/ja/result/{TYPE}/share-image/{scores}` | スコアあり。`{scores}` は `61-33-78-50` の形 | 初回アクセス時に生成してキャッシュ |

スコアはクエリではなくパスに入れる。Route Handler がクエリを読むとリクエスト時の処理になり、キャッシュが効かなくなるためだ。`generateStaticParams` が空配列を返すと、初回アクセス時に描画し、以降は静的に配信される（`generate-static-params.md` 290〜292行目、`route.md` 339行目）。

`{scores}` は 2-1 の結果ページ側と同じ条件で検証し、満たさなければ 404 を返す。

#### 1080×1920 のレイアウト

Instagram ストーリーズでは、画面の上下に操作用の表示が重なる。上端 250px と下端 340px には、切れて困る情報を置かない。この数値は設計上の目安で、実機で確かめる。左右の余白は 80px で、内容の幅は 920px になる。

主役はキャラクター画像と呼称で、各軸の割合は小さく出す（Q12）。そのため、呼称を型コードより大きくした。OG 画像（4-2）は型コードを大きくしたままで、ここだけ逆になる。呼称の最長は「リヴァイアサン」の7字で、128px なら 896px と幅 920px に1行で収まる。

| 内容 | スコアなし（上端からの px） | スコアあり（上端からの px） |
|---|---|---|
| 「CognitiveLens」（40px） | 250〜310 | 250〜310 |
| 切り詰め版キャラクター | 350〜1170（枠の高さ 820） | 340〜1020（枠の高さ 680） |
| 呼称（128px） | 1190〜1330 | 1030〜1170 |
| 型コード（64px） | 1340〜1410 | 1180〜1250 |
| 一行説明（36px、24字以内） | 1430〜1480 | 1265〜1310 |
| 4軸の割合。1行 40px（軸名 24px とバー 12px）、行の間隔 6px。軸名は「外向・内向」「感覚・直観」「思考・感情」「判断・知覚」 | なし | 1330〜1508 |
| `www.cognitive-lens.com/ja/result/{TYPE}`（28px） | 1530〜1570 | 1535〜1575 |

どちらも内容は 1580px までに収まる。数値は設計の初期値で、実装時に実機の表示を見て調整する。

#### 保存の流れ

結果ページの「結果画像を保存」ボタンは、クライアントコンポーネント `ShareImageButton` が次の順で処理する。

1. 表示中の URL から画像 URL を組み立て、PNG を取得して `File` にする
2. `navigator.canShare({ files: [file] })` が真なら `navigator.share` で共有シートを開く。利用者はそこから「画像を保存」を選べる
3. 共有シートが使えず、パソコンのブラウザなら、`<a download>` でダウンロードする
4. どれも失敗したら、画像を全画面で表示して「長押しで保存」と案内する

ブラウザの種類を文字列で判定せず、機能の有無と例外で分岐する。X や LINE のアプリ内ブラウザは、ダウンロードや共有を独自に制限していることがあるためだ。各分岐の終わりで GA4 の `save_image` を送る（3-7）。

| 環境 | 期待する動き | 確認 |
|---|---|---|
| iPhone Safari | 共有シートから写真に保存 | 実機 |
| Android Chrome | 共有シートから保存 | 実機 |
| パソコンの Chrome・Edge | ダウンロード | 実機 |
| X のアプリ内ブラウザ | 共有シート、だめなら長押し案内 | 実機 |
| LINE のアプリ内ブラウザ | 同上 | 実機 |

### 4-4. 16タイプ一覧ページ `/ja/result`

| 項目 | 仕様 |
|---|---|
| h1 | 「16タイプ一覧」 |
| 並び | 型コードのアルファベット順（Q4）。ENFJ、ENFP、ENTJ、ENTP、ESFJ、ESFP、ESTJ、ESTP、INFJ、INFP、INTJ、INTP、ISFJ、ISFP、ISTJ、ISTP |
| 列数 | 4列（スマートフォンは2列） |
| 絞り込み | 2つの切り替えを置く。「すべて・外向（E）・内向（I）」と「すべて・判断（J）・知覚（P）」（Q4） |
| 絞り込みの実装 | 16枚すべてを HTML に出し、クライアント側で `hidden` を切り替える。URL のクエリは変えず、同じ内容の URL を増やさない |
| カード | `TypeCard` 部品。キャラクター画像、型コード、呼称、一行説明。カード全体が `/ja/result/{TYPE}` へのリンク |
| 画像の読み込み | 最初に見える4枚は `priority`、残りは遅延読み込み。`sizes` はスマートフォン 50vw、パソコン 25vw |
| カード以外の内容 | 診断への導線、ビンゴのハブとコラム一覧へのリンク |

`TypeCard` と絞り込みはビンゴのハブでも使い、リンク先だけを差し替える。

### 4-5. ビンゴカード画像

`/ja/bingo/{TYPE}/card/{mask}` で 1080×1350 の PNG を返す。X と Instagram のフィード投稿で切れにくい縦横比 4:5 にする。

生成方式は 4-3 と同じ（初回生成してキャッシュ）で、保存の流れも `ShareImageButton` を共用する。リニューアル前はブラウザ上で DOM を画像にしていた（`html-to-image`。ステップ 3-22 で削除）。サーバー生成に変えたのは、端末やブラウザによってフォントや画像が抜ける差をなくすためだ。`{mask}` は24マスの押した状態を表す6桁の16進数（小文字）で、形が違えば 404 を返す（`lib/bingo/board.ts`）。

---

## 5. コンテンツのデータ構造

初版のこの章は i18n の設計（日英の辞書、`next-intl` との比較、日英の一致検査）だった。日本語のみとする決定（decisions 5章の1）で、それらはすべて削除した。画面の固定文言はコンポーネントに直接書く（Q19）。

この章には、16タイプの文章や設問の件数と形を、型で検査するための構造だけを残す。

### 5-1. 置き場所

実装で作ったファイルに合わせて更新した（2026-09-16、統合の後）。

```
lib/
  tuple.ts               長さ固定の配列型 Tuple
  type-codes.ts          16の型コード（アルファベット順）と TypeCode 型
  type-names.ts          呼称16件（6-2）
  type-base.ts           画像パスとタイプ色
  type-display.ts        タイプ色の CSS 変数と通し番号（画面の部品が使う）
  type-compatibility.ts  相性の相手の型コード
  theme.ts               背景・面・文字の色
  career-jobs.ts         適職の職業名（旧 lib/career-data.ts に 5-2 の書き換え表を当てたもの）
  site.ts                サイトの URL 定数と canonical()
  redirects.ts           1-3 の転送の判定
  analytics.ts           GA4 の3イベント（3-7）
  bot-guard.ts・get-client-ip.ts  /api/romance-ai の Bot 判定と IP の取得
  type-content/
    schema.ts・index.ts  TypeContent 型と16件をまとめた TYPE_CONTENT
    ENFJ.ts … ISTP.ts    タイプごとの文章（16ファイル）
  articles/
    schema.ts・index.ts  ArticleContent 型と16件をまとめた ARTICLES
    ENFJ.ts … ISTP.ts    タイプ別の恋愛コラム（16ファイル）
  diagnosis/
    types.ts             軸・文字・設問・決定設問の型と尺度
    items.ts             自己診断の設問・決定設問
    score.ts             2-1〜2-3 の計算（純粋な関数）
    flow.ts              診断の進行（reducer）と途中経過の保存形式
  target/
    items.ts             相手診断の設問・決定設問
  romance/
    items.ts             タイプ別の設問（12問以内）と段階別の説明文
    ai-text.ts           AI 文の応答の読み替えと共有文
  bingo/
    board.ts             盤面の判定と mask の形式（4-5）
  bingo-data-ja.ts       タイプ別の24項目と称号（現行ファイルに型を付けて部分改訂）
  og/                    生成画像の素材読み込み・色・ページ用の共通デザイン
scripts/
  check-content.mjs          件数・文字数・段落・相性・職業名・フォントの収録・色を検査
  check-banned-terms.mjs     6-1 の名称とトーンガイドの流行語を検査（語の一覧は lib/banned-terms.mjs）
  check-redirects.mjs        実際のサーバーの 301 を検査
  check-site.mjs             sitemap の全ページの head・本文・リンクと 404 を検査（5-3）
  check-question-similarity.mjs  新旧の設問の類似度（旧設問を 3-22 で消したので、今は比べる相手がなく何もしない）
  build-character-assets.mjs キャラクターの切り詰め版（predev・prebuild で毎回）
  build-font-subset.mjs      生成画像用フォントのサブセット（npm run build:font）
```

Node.js の型除去（`node --test`）で読むファイル（`redirects.ts`・`diagnosis/score.ts`）は、値の import をしない。Next.js は拡張子なしの import を、Node.js は拡張子付きを求めて両立しないためだ。

タイプごとにファイルを分けるのは、1タイプずつ書いてレビューする（ステップ 2-4、2-5）ためだ。置き換えが済んだ現行ファイル（`lib/type-info.ts`、`lib/static-profiles.ts`、`lib/questions.ts` など）は、ステップ 3-22 でまとめて削除した（2026-09-16）。現行サイトの型名とタグラインは、禁止語の検査のため `scripts/lib/legacy-type-names.json` に写してある。

### 5-2. 型の定義

```ts
// lib/tuple.ts
export type Tuple<T, N extends number, R extends T[] = []> =
  R['length'] extends N ? R : Tuple<T, N, [...R, T]>;

// lib/type-codes.ts
export const TYPE_CODES = [
  'ENFJ', 'ENFP', 'ENTJ', 'ENTP', 'ESFJ', 'ESFP', 'ESTJ', 'ESTP',
  'INFJ', 'INFP', 'INTJ', 'INTP', 'ISFJ', 'ISFP', 'ISTJ', 'ISTP',
] as const;
export type TypeCode = (typeof TYPE_CODES)[number];

// lib/type-names.ts
export const TYPE_NAMES = {
  ENFJ: 'フェニックス',
  // … 16件（6-2 の表）
} as const satisfies Record<TypeCode, string>;

// lib/type-base.ts
export interface TypeBase {
  image: { src: string; trimmed: string; width: 800; height: 1000 };
  color: string;                                  // タイプ色。1タイプ1色（Q20）
  compatibility: { easy: TypeCode; hard: TypeCode };
}
export const TYPE_BASE = { /* 16件 */ } satisfies Record<TypeCode, TypeBase>;

// lib/type-content/schema.ts
interface Section { heading: string; body: string }
interface Friction { scene: string; tip: string }

export interface TypeContent {
  tagline: string;                                // 24字以内
  summary: string;
  traits: Tuple<Section, 3>;
  relationships: { friends: string; work: string; love: string };
  frictions: Tuple<Friction, 2>;
  compatibility: { easyReason: string; hardReason: string };
  career: { avoidReason: string; fitReason: string; interviewTip: string };  // 職業名は career-jobs.ts
  og: { catch: string };                          // 24字以内
  share: { text: string };                        // {name} と {url} を含む
  seo: { title: string; description: string };
}
```

呼称は `type-names.ts` に1か所だけ置き、`TypeContent` には持たせない。alt は `{TYPE}（{呼称}）のキャラクター` の形で組み立てる。

適職は、職業名と説明文を別のファイルに分ける（N1）。職業名は変えないデータなので、書き直す文章と混ぜないためだ。

```ts
// lib/career-jobs.ts
export const CAREER_JOBS = {
  ENFJ: { avoid: '…', fit: '…' },   // 現行の hellJob と survivalRoute の値をそのまま入れる
  // … 16件
} as const satisfies Record<TypeCode, { avoid: string; fit: string }>;
```

現行の `hellReason`・`survivalReason`・`cheatCode` に当たる文は、`TypeContent.career` に新しく書く。

職業名は残すが、トーン違反で職業を見下す言い回しは中立な職業名に直す（N9）。直す対象と直した後の案は次のとおり。「ゴリゴリ営業」「下っ端の事務」は運営者の指定で、残りの8件は同じ基準で筆者が選んだ。ステップ 2-4 で運営者がレビューする。

| TYPE | 項目 | 現行 | 直した後（案） |
|---|---|---|---|
| ENTJ | 向かない職業 | ルーチンワーク・下っ端の事務 | 定型業務が中心の事務職 |
| ENTP | 向かない職業 | お堅い公務員・銀行員 | 公務員・銀行員 |
| INFJ | 向かない職業 | ノルマ第一のゴリゴリ営業 | ノルマの厳しい営業職 |
| INFP | 向かない職業 | クレーム処理・体育会系の職場 | クレーム対応・上下関係の厳しい職場 |
| ENFJ | 向かない職業 | 一日中PCと向き合う孤独な作業 | 一日中ひとりで進めるPC作業 |
| ISFJ | 向かない職業 | 成果主義で蹴落とし合う外資系 | 成果主義の強い外資系企業 |
| ESTJ | 向かない職業 | ルールがないフリーランス | 決まった手順のないフリーランス |
| ESFJ | 向かない職業 | 完全リモート・誰とも話さない仕事 | フルリモートで人と話す機会が少ない仕事 |
| ISFP | 向かない職業 | スピードと効率重視のブラック企業 | スピードと効率を最優先する職場 |
| ESFP | 向かない職業 | データ分析・孤独な作業 | データ分析・ひとりで進める作業 |

ほかの22件（向いている職業16件と、向かない職業の残り6件）は現行の値のまま移す。ENTJ の向いている職業「起業家・プロジェクトマネージャー」も、職業名としてそのまま残す。

```ts
// lib/diagnosis/items.ts
export const AXES = ['EI', 'SN', 'TF', 'JP'] as const;
export type Axis = (typeof AXES)[number];
export type Pole = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface Item {
  id: string;     // q01〜q24。途中経過の保存と単体テストで使う
  axis: Axis;
  keyed: Pole;    // この設問が述べている傾向の文字
  text: string;   // 45字以内
}

export const SCALE: Tuple<{ label: string; value: 3 | 2 | 1 | -1 | -2 | -3 }, 6> = [ /* 2-1 の表 */ ];
export const ITEMS: Tuple<Item, 24> = [ /* 表示順に24件 */ ];
export const TIEBREAKERS: Record<Axis, { prompt: string; first: string; second: string }> = { /* 4件 */ };

// lib/romance/items.ts
export interface RomanceSet { questions: string[] }  // 1〜12問。check-content.mjs で確かめる
export const ROMANCE = { /* 16件 */ } satisfies Record<TypeCode, RomanceSet>;
export const ROMANCE_STAGES: Tuple<string, 4> = [ /* 段階1〜4の説明文 */ ];

// lib/bingo-data-ja.ts
export const BINGO_DATA = { /* 16件 */ } satisfies Record<TypeCode, Tuple<string, 24>>;
```

相手診断の `lib/target/items.ts` は、自己診断と同じ `Item` 型と `Tuple<Item, 24>` を使う。ビンゴの称号7段階は、現行では `app/[lang]/bingo/BingoClient.tsx` の関数 `getBingoTitle` に全タイプ共通の文として書かれている。これを `{type}` を含む文の `Tuple<string, 7>` として `lib/bingo-data-ja.ts` へ移す。

### 5-3. 検査の仕組み

| 検査 | 方法 | 実行するとき |
|---|---|---|
| キーと件数 | `satisfies Record<TypeCode, …>` と `Tuple` 型による型チェック | `tsc` |
| 設問の向き | 各軸で、前の文字を述べる設問が3問、後の文字が3問ある | `scripts/check-content.mjs` |
| 空文字 | 空の値がない | 同上 |
| 文字数 | 設問45字以内、`tagline` と `og.catch` は24字以内 | 同上 |
| 脈あり度の設問数 | 各タイプ1〜12問 | 同上 |
| 置換変数 | `share.text` に `{name}` と `{url}` がある | 同上 |
| 適職の職業名 | `CAREER_JOBS` の値が、現行 `lib/career-data.ts` の `hellJob`・`survivalRoute` に 5-2 の書き換え表を当てたものと一致する（現行ファイルを消すステップ 3-22 まで）。3-22 で照合を外し、今は空の値がないことだけを見る。外す直前（2026-09-16）の照合は通っていた | 同上 |
| 職業名の転用 | `CAREER_JOBS` の職業名（「・」で区切った各語）が、呼称と `tagline` に含まれていない（N9） | 同上 |
| 段落と文の長さ | 1段落120字以内かつ3文以内、1文45字以内（N4）。段落は改行で、文は「。」「！」「？」で区切って数える | 同上 |
| 禁止語 | 6-1 の名称と、トーンガイドに載せる流行語・誇張語。`lib/career-jobs.ts` は対象外（N9） | `scripts/check-banned-terms.mjs` |
| 「MBTI」の語 | ビルドした HTML を取得し、`/ja/bingo` 以外の title・meta description・h1・`og:site_name` に「MBTI」がない。本文での出現が1ページ1回まで（N3・N11） | `scripts/check-site.mjs`（`npm run check:site -- <URL>`）。同じスクリプトで、canonical、title の重なり、og:image、16Personalities・Keirsey・現行サイトの型名とグループ名、どこからもリンクされないページ、404 も見る |

`npm run check` でこの3つ（`tsc`、`check-content`、`check-banned-terms`）と単体テスト（`npm test`）を実行する。`next build` の前に走らせ、失敗したらビルドを止める。3-6 のとおり `ignoreBuildErrors` も外す。

---

## 6. 16タイプの呼称

### 6-1. 使わない名称

`scripts/check-banned-terms.mjs` に登録し、コンテンツと画面文言に出てこないことを機械的に確かめる。

| 分類 | 名称 |
|---|---|
| 16Personalities の型名（英語） | Architect、Logician、Commander、Debater、Advocate、Mediator、Protagonist、Campaigner、Logistician、Defender、Executive、Consul、Virtuoso、Adventurer、Entrepreneur、Entertainer |
| 16Personalities の型名（日本語） | 建築家、論理学者、指揮官、討論者、提唱者、仲介者、主人公、広報運動家、管理者、擁護者、幹部、領事、巨匠、冒険家、起業家、エンターテイナー |
| 16Personalities のグループ名・軸名 | Analysts、Diplomats、Sentinels、Explorers、分析家、外交官、番人、探検家、Mind、Energy、Nature、Tactics、Identity、`-A`・`-T` の表記 |
| 現行サイトの型名 | 「通知全オフのガチ勢スマホ」など `lib/type-info.ts` の16件と、各タグライン（ファイルは 3-22 で削除し、`scripts/lib/legacy-type-names.json` に写した） |
| 現行サイトのグループ名 | 分析系、理想主義系、管理系、探索系、Idealists |
| Keirsey の型名・気質名 | Mastermind、Inventor、Fieldmarshal、Healer、Counselor、Champion、Teacher、Inspector、Protector、Supervisor、Provider、Crafter、Composer、Promoter、Performer、Rational、Idealist、Guardian、Artisan |
| 職業名・役職名全般 | 絵柄の持ち物と結びつき、16Personalities の型名に近づくため（4-1） |
| 誇張語 | 最強、天才、神、完璧 |

Keirsey の名称は依頼の対象外だが、同じ理由（既存の型分類で広く知られた名前）で避ける。検査対象の文字列は日本語の一般語（「管理者」「主人公」など）と重なるため、呼称・見出し・タグラインの項目だけを検査し、本文は警告として一覧に出す。

この表は decisions の指示どおり初版から変えていない。トーンガイドで決める流行語は、別の一覧として同じスクリプトに登録する（ステップ 2-1）。

### 6-2. 決定した呼称

呼称は幻獣名に決まった（decisions 3章）。初版の案A・B・C は破棄した。表は型コードのアルファベット順に並べ替えている。

| TYPE | 呼称 | 由来（命名の内部メモ。サイトには出さない） |
|---|---|---|
| ENFJ | フェニックス | 人を照らし立ち直らせる |
| ENFP | ピクシー | いたずらな火花、巻き込む |
| ENTJ | ドラゴン | 群れを率いる |
| ENTP | キマイラ | 異物の組み合わせ、予測不能 |
| ESFJ | ドライアド | 森の集まる場所、世話役 |
| ESFP | サラマンダー | 火のまわりに人が集まる |
| ESTJ | ケルベロス | 門番、秩序 |
| ESTP | ミノタウロス | 考える前に突進 |
| INFJ | ユニコーン | 稀少、真実を見抜く |
| INFP | ペガサス | 自分の空を飛ぶ |
| INTJ | スフィンクス | 謎を出す側、動かず先を読む |
| INTP | リヴァイアサン | 深海に潜む巨大な思考 |
| ISFJ | グリフォン | 宝を守る番人 |
| ISFP | マーメイド | 感性、自分の海で歌う |
| ISTJ | ゴーレム | 命じられたことを崩さず守る |
| ISTP | フェンリル | 一匹狼、一撃で終わらせる |

表記は幻獣名だけにし、「〜型」は付けない。結果ページの h1 は型コードで、呼称は副題に置く（3-4）。検索は型コードで受け、呼称はシェアで広める役割になる。

系統（NT＝古代の怪物、NF＝光る生き物、SJ＝番人、SP＝野生）は、命名の内部方針として扱いサイトには出さない。「番人」は 6-1 の禁止語（16Personalities の日本語グループ名）に当たる。系統名を出すと、Q4・Q20 で避けた4グループの区分も画面に現れてしまう。表示しないことは N2 で確定した。

由来の列の文言も、そのままタグラインや見出しには使わない。ISFJ の由来にある「番人」が禁止語に当たるためだ。

### 6-3. 決定後に行う確認

decisions 3章の順で行う。

1. 16件を `scripts/check-banned-terms.mjs` にかける（ステップ 1-5 でスクリプトを作った後）
2. 同じ名前を性格タイプの呼称として使うサイトやサービスがないか、ウェブで調べる（AI が行う）
3. 特許庁の商標検索（J-PlatPat）で、関連する区分に同名の登録がないか調べる（運営者が行う）
4. 1〜3 の結果を `docs/naming-check.md` に記録する

この版を書いた時点では、1〜3 のどれも実施していない。

---

## 7. 新規獲得を狙うキーワードと対応ページ

### 7-1. 前提

検索回数と競合の強さは**まだ調べていない**。運営者が次の2つを用意し、`docs/` に置く（Q14・N5）。1つは Search Console の検索クエリ CSV。もう1つは、ラッコキーワードの無料枠で出した「16タイプ」「MBTI」「{呼称}」のサジェスト一覧の CSV だ。Google キーワードプランナーは、Google 広告のアカウントが要るので使わない。サジェストの CSV が届いていれば、ステップ 2-4 以降で title と description を書くときにも参照する。

「MBTI」の語は Q14・N3・N11 の回答に従う。検索結果に出る要素（title・description・h1）とサイト名には使わず、例外はビンゴのハブだけ。本文では「MBTIでいうINTJ」のような説明として、1ページ1回まで書いてよい。ほかのページのキーワードは「16タイプ」で組む。運営者の判断では、商標の面で避けたいのは公式を装う見せ方で、説明のための1回の言及は問題になりにくい。16Personalities に由来する語（「建築家型」「INTJ-A」など）は狙わない。

### 7-2. キーワードと対応ページ

`{TYPE}` は16タイプそれぞれに、`{呼称}` は 6-2 の16件それぞれに展開する。

| 分類 | キーワード | 検索意図 | 対応ページ | 現状 |
|---|---|---|---|---|
| 診断 | 16タイプ診断、16タイプ 診断 無料、性格診断 16タイプ | 自分のタイプを知りたい | `/ja/test` | 既存。title が既定文のまま |
| 診断 | 相手 性格タイプ 診断、好きな人 性格タイプ | 相手のタイプを推測したい | `/ja/target-diagnosis` | 既存。title が既定文のまま |
| 診断 | 脈あり 診断、脈ありチェック | 好意の有無を知りたい | `/ja/romance-checker` | 既存 |
| 一覧 | 16タイプ 一覧、性格タイプ 一覧 | 全体を見比べたい | `/ja/result` | 役割変更 |
| タイプ別 | {TYPE} 特徴、{TYPE} 性格 | タイプを理解したい | `/ja/result/{TYPE}` | 新規 URL |
| タイプ別 | {TYPE} 相性 | 合う相手を知りたい | `/ja/result/{TYPE}` の相性の節 | 新規 URL |
| タイプ別 | {TYPE} 適職 | 仕事選びの参考にしたい | `/ja/result/{TYPE}` の適職の節 | 現行も結果ページ内にある（Q9 で残すと決定） |
| タイプ別 | {TYPE} 恋愛、{TYPE} 脈ありサイン | 恋愛での傾向を知りたい | `/ja/article/{TYPE}` | 既存。本文を新規に |
| タイプ別 | {TYPE} あるある、{TYPE} ビンゴ | 共感して遊びたい | `/ja/bingo/{TYPE}` | 新規 |
| ハブ | MBTIビンゴ、16タイプ ビンゴ、性格タイプ あるある | 遊びたい、共有したい | `/ja/bingo` | 既存 |
| 指名 | {呼称} 診断（主）。{呼称} MBTI は、本文の1回の言及で拾えれば拾う程度 | シェアで呼称を見て調べる | `/ja/result/{TYPE}` | 新規 |

### 7-3. ページ同士で取り合わないためのルール

- 1つのキーワードに対応するページは1つにする
- 相性と適職は結果ページに集約する。コラムでは詳しく書かず、結果ページの該当の節へリンクする
- コラムは恋愛に絞る。タイプ全般の特徴は結果ページへリンクする
- ビンゴのページは「あるある」に絞り、特徴の解説は結果ページへリンクする
- 内部リンクのアンカーテキストは、対応ページのキーワードに揃える

---

## 8. 実装順序

1ステップで変わるページを1つか、見た目を変えない基盤作業1つに限った。各ステップの「確認」がすべて通ってから次へ進む。

確認には、本番ビルドをローカルで起動して取得した結果を使う（`next dev` の表示では判断しない）。公開サイトで確かめると書いたステップは、反映後に公開サイトでも確認する。ページの削除と転送の追加は、必ず同じステップに入れた。どの時点で公開しても、旧 URL が 404 にならないようにするためだ。

本番へ反映する単位は、フェーズごとに次のとおり（N6）。

| フェーズ | 反映の単位 | 理由 |
|---|---|---|
| 0 | ステップごとに、すぐ本番へ | 公開中の不具合と危険を直すため |
| 1 | ステップごとに本番へ | 見た目が変わらず、転送は `check-redirects.mjs` で確かめられる |
| 2〜3 | 作業用ブランチにまとめ、Vercel のプレビューで確認して一括公開 | 途中で出すと旧型名と幻獣名がサイト内に混在し、利用者にも検索エンジンにも中途半端な状態を見せる |
| 4 | ステップごとに本番へ | 公開後の確認と調整のため |

フェーズ2〜3のブランチは、フェーズ1がすべて本番に出てから main で作る。作業中に main へ修正が入ったら（0-2 の連絡先の差し替えなど）、ブランチに main を取り込む。プレビューでの確認では、`check-redirects.mjs` とクロールをプレビューの URL に向けて実行する。R10 はホスト名が違うので対象から外す。プレビューに Vercel の保護がかかっていれば、自動化用のバイパス（Protection Bypass for Automation）を使う。

### 進捗（2026-09-18 時点）

フェーズ0・1 は `main` から本番に出した。フェーズ2〜3 は作業用ブランチ `renewal` で進め、3-22 までを統合した。残りは 3-23（プレビューでの確認と一括公開）で、`main` へのマージは運営者の確認を取ってから行う。

2026-09-18 に、ローカルの本番ビルドで全ページを触って確かめ直し、8つの観点（シェア導線・検索・日本語・画面と操作・コードの欠陥・権利・アクセシビリティ・データ）でコードと文章を見直した。見つかった問題のうち、方針の判断が要らないものを直している。直した内容と、運営者の判断のために残したものは `docs/renewal-handoff.md` にまとめた。検査も2つ増やした。`scripts/check-content.mjs` が `app/` に直接書いた本文の文長を測るようになり（それまで `lib/` のデータしか見ていなかった）、`scripts/check-site.mjs` が og:image を Twitterbot として実際に取りに行くようになった。

| ステップ | 状態 | コミット | 確認したこと |
|---|---|---|---|
| 0-1 | 完了 | `21df36f` | 下の表のとおり |
| 0-2 | 共有 URL は完了。連絡先は Q17 待ち | `4d61ac6` | 同上 |
| 0-3 | 完了 | `bec1a2b` | 同上 |
| 0-4 | 完了（生成ツール等は Q2 待ち） | `35a214b` | `docs/asset-credits.md` にキャラクター・アイコン・フォント・絵文字を記録 |
| 0-5 | 完了 | `ff75333` | 単体テストで 1-3 の全例が期待どおり |
| 0-6〜0-8 | 完了 | `51d0fc3`・`973cbec`・`2d75491` | 下の表のとおり |
| 1-1 | 完了 | `992c75f` | 公開サイトで `/en/test` などが1回の 301、`/foo`・`/api/result`・`/ads.txt` が 404。sitemap は26件で英語 URL なし。ページの title・h1 は変化なし |
| 1-2 | 完了 | `e567a9a` | 公開サイトでサイト確認の meta が1つ |
| 1-3 | 完了 | `ba34e87` | 公開サイトの全ページに www 付きの canonical。sitemap の26件すべて www 付き |
| 1-4 | コードは完了。**Vercel の設定変更が残っている** | `110146a` | ローカルで www なしが1回の 301。公開サイトでは Vercel が先に 307 を返す（設定変更で解消） |
| 1-5 | 完了 | `cf9002c` | わざと件数・文字数・禁止語・型を壊すと、検査とビルドが止まる。Vercel のビルドも成功 |
| 1-6 | 完了 | `f6ce06c` | 16枚の切り詰め版、フォント3ウェイトのサブセット。Vercel のビルドも成功 |
| 2-1 | 完了（運営者の委任で AI が採用を判断） | `renewal`：`cf93695` | `docs/tone-guide.md`。流行語31語を検査に登録 |
| 2-2 | 禁止語検査とウェブ調査は完了。呼称は続ける（N13）。**J-PlatPat は運営者の宿題** | `renewal`：`966ece7` | `docs/naming-check.md` |
| 2-3 | 完了（案のまま採用） | `renewal`：`b13ef8d` | `docs/colors.md`。コントラスト比の最小 5.64、グループの弧 173〜231° |
| 2-4・2-5 | 完了。16タイプの文章 | `renewal`：`b1296d5`・`f7afe1f` | 16件が長さ・禁止語・title の書式・相性の呼称の検査を通る。INTJ・INFP・ENFJ は AI のレビュー指摘を反映し、全タイプをまたいで同じ場面や言い回しの重なりを直した |
| 2-6・2-7 | 作成 | `renewal`：`87f41f7`・`aa48d8b` | 件数・向き・並び・45字の検査が通る。現行設問との類似度は最大 0.34 |
| 2-8 | 完了 | `renewal`：`4c5c44a` | 16タイプ×12問。旧設問との類似度は最大 0.40。AI 文を3タイプで生成し、禁止語・「MBTI」・「彼」は出なかった。「〜ようです」「かもしれません」のぼかしは残る（gpt-4o-mini の限界） |
| 2-9 | 完了 | `renewal`：`071127f` | 項目26件と称号4つを差し替え。一覧は `docs/bingo-revisions.md` |
| 3-1 | 完了 | `renewal`：`481db77` | T1〜T10 と相手診断のテストが合格 |
| 3-2・3-3 | 完了。行動プロトコルは載せていない（**Q9 は運営者の確認待ち**） | `renewal`：`6838532` | ビルド出力で `/ja/result/{TYPE}` の16件が SSG。INTJ のページに h1「INTJ」と副題「スフィンクス」、本文、canonical がある。`/ja/result/XXXX` が 404。旧 `lib/protocols-*.ts` は 3-22 で削除した（載せると決めたら git の履歴から戻す） |
| 3-4 | 完了。X への実投稿は運営者の確認待ち | `renewal`：`6838532` | OG 画像16枚が SSG。4-2 の6種の User-Agent で 200・`image/png`・1200×630。`og:image` が www 付きの絶対 URL |
| 3-5 | 完了 | `renewal`：`32acf61` | `check-redirects` で R1・R4・R8 の例が1回の 301 になり、転送先は 200。R8 の転送先はクエリなし |
| 3-6 | 完了 | `renewal`：`6838532` | `/ja/result/{TYPE}/share-image` が SSG で 1080×1920 の PNG。INTP の画像で「リヴァイアサン」が1行に収まり、上端 250px と下端 340px に文字がないことを目で確かめた |
| 3-7 | コードは完了。**4-3 の端末表（実機）が残る** | `renewal`：`6838532`・`32acf61` | スコアあり画像はビルド時に作らず初回生成。型と矛盾するスコア（`INTJ/share-image/61-33-78-50`）は 404。R9 が1回の 301 |
| 3-8 | コードは完了 | `renewal`：`ba31b97` | `lib/diagnosis/flow.test.mjs`（T1 で決定設問が4問出る、戻る T7、途中経過の直列化と復元）が合格。画面での手操作と、再読み込みからの再開は、統合では確かめ直していない |
| 3-9 | 完了 | `renewal`：`6838532` | `p` と `from` を Suspense の内側で読む。T8〜T10 の表示はクライアント側の描画で、統合では確かめ直していない |
| 3-10 | 完了 | `renewal`：`6838532`・`32acf61` | HTML に16枚がアルファベット順。`/ja/select` と `/ja/result?type=XXXX` が1回の 301。絞り込み9通りの枚数は、統合では確かめ直していない |
| 3-11 | コードは完了 | `renewal`：`ba31b97` | `flow.test.mjs` で判定不能 0・1・2・3以上の分岐が合格 |
| 3-12 | 完了 | `renewal`：`bf1e9ab` | title・h1・解説の見出し3つが 9-4 の文言と一致（ローカルの本番ビルドの HTML で比較） |
| 3-13・3-14 | 完了 | `renewal`：`bf1e9ab`・`32acf61` | 16件が SSG で 200。R6 が1回の 301。`lib/bingo/board.test.mjs` が合格。X の共有文に「MBTI」がない |
| 3-15 | コードは完了。**実機での保存確認が残る** | `renewal`：`bf1e9ab` | `card/ffffff` が 1080×1350 の PNG。`card/1000000` と `card/zzzzzz` が 404 |
| 3-16 | 完了 | `renewal`：`29b2ea3`・`ab4f229`・`f4ca343`・`32acf61` | 16件が SSG。title・h1 に禁止語と「MBTI」がない（`check-site`）。R5 が1回の 301 |
| 3-17 | 完了 | `renewal`：`f4ca343` | 段階の境界（24/25、49/50、74/75）と、AI 文の取得に失敗したときの単体テストが合格。description に「MBTI」がない |
| 3-18 | 完了 | `renewal`：`2978430` | どのページからもリンクされない sitemap の URL が0（`check-site`） |
| 3-19 | コードは完了。**測定 ID の設定と GA4 の管理画面の操作が残る** | `renewal`：`35f8e77`・`da69be2`・`33ef732`・`e155c2c` | 測定 ID があるビルドだけで GA4 とポリシーの GA4 の節を出す。page_view はクエリを外して送る。共有の `content_type` に `romance` を足した（3-7）。リアルタイム表示での確認は、測定 ID を設定してから |
| 3-20 | 完了 | `renewal`：`2978430` | 最終更新日は 2026-09-16。連絡先は X のアカウントにした |
| 3-21 | 完了 | `renewal`：`db214cf`・`2978430` | sitemap が59件で、全 URL が 200（`check-site`）。robots.txt の `Sitemap:` 行が www 付き |
| 3-22 | 完了 | `renewal`：`be7b618` | ページ・ルート・proxy・scripts・テストから import をたどり、届かないファイルが0。`npm run check` とビルドが通る。npm パッケージ5つを外した（`lucide-react` は使っているので残した） |

3-22 までの統合（2026-09-16）では、ほかに次のことを行った。ページ用 OG 画像のページ名が傾いたカードの枠に触れていたので、1行の最大幅を 380px にした（`e155c2c`）。全ページの検査を `scripts/check-site.mjs` にまとめた（`152b583`）。ローカルの本番ビルドに向けた結果は、`check-redirects` が37件すべて OK、`check-site` が NG なし（警告は ENTJ の適職「起業家」の1件で、N9 で残すと決めた職業名）。トップ・結果（INTJ）・自己診断・ビンゴ（INTJ）を幅390と1280で撮り、崩れはなかった。

AdSense をやめたので、関係する記述と広告枠を 2026-09-15 に削除した（`d1d565f`・`bcd8428`）。旧ステップ 3-23 はなくなり、一括公開は 3-23 に繰り上がった。

### フェーズ0：着手前の修正と準備

0-1〜0-3 はリニューアルとは別のコミットにし、先に公開サイトへ反映する（decisions 1章）。

| # | 作業 | 変わるもの | 確認 | 待つもの |
|---|---|---|---|---|
| 0-1 | 動画機能の削除（84ファイル削除・6ファイル修正）と `/api/admin/seed-protocols` の削除を、1つのコミットにして push する（N7）。削除できずに残った未追跡ファイル（`remotion/FourSplitReactionVideo.tsx`、`scripts/` の5件など）はコミットに含めない | 公開サイト | **完了**（2026-09-15、コミット `21df36f`）。ローカルと Vercel のビルドが成功。公開サイトで `/ja/video-gen`、`/ja/video-preview`、`/ja/admin` とその配下2ページが 404。削除した API 7つも 404（下の調査結果） | — |
| 0-2 | ビンゴの X 共有 URL を `https://cognitivelens.com/{lang}/bingo` から `https://www.cognitive-lens.com/{lang}/bingo` に直す（`app/[lang]/bingo/BingoClient.tsx` 294行目）。運営者情報の `contact@cognitivelens.com`（`app/[lang]/about/page.tsx` 50〜54行目）は、新しい連絡先が決まってから同じ手順で差し替える | ビンゴ、運営者情報 | 共有 URL は**完了**（2026-09-15、コミット `4d61ac6`）。公開サイトの `/ja/bingo` が読み込む JS に `cognitivelens.com` がなく、`www.cognitive-lens.com/` がある | 連絡先は宿題 Q17 |
| 0-3 | `proxy.ts` の Bot 判定とレートリミットから、画像を返す GET・HEAD の API（`/api/og`、`/api/story-card`、`/api/chat-og`）を外す | API | **完了**（2026-09-15、コミット `bec1a2b`）。公開サイトで、4-2 の6種の User-Agent から `/api/og` と `/api/story-card` を取得してすべて 200 と `image/png`。Twitterbot で15回続けて取得しても 429 にならない。curl の User-Agent からの `POST /api/romance-ai` は 403 のまま | — |
| 0-4 | `docs/asset-credits.md` を作り、現行のキャラクター16枚とアイコン（`lucide-react`）を登録する | 文書 | 16枚の行がある。ツール名・時期・プロンプトは記入待ちと明記されている | 宿題 Q2 |
| 0-5 | `lib/redirects.ts` と単体テスト、`scripts/check-redirects.mjs` を作る。規則はすべて無効のまま | コードのみ | 全規則を有効にした状態のテストで、1-3 の全例が期待どおり | — |
| 0-6 | 未使用の `/api/weakness` を削除する（N10） | API | **完了**（2026-09-15、コミット `51d0fc3`）。公開サイトで POST が 404 | — |
| 0-7 | `lib/get-client-ip.ts` が `cf-connecting-ip` を信用しないようにし、`x-real-ip` を最優先にする（N12。Vercel が上書きするヘッダーだけを信用する） | API | **完了**（2026-09-15、コミット `973cbec`）。公開サイトで `cf-connecting-ip` を毎回変えて `/api/romance-ai` に12回送り、11回目から proxy の 429 | — |
| 0-8 | 入口のないページ専用の API（`/api/result`、`/api/chat-script`、`/api/chat-og`）を削除する（N12）。ページ本体 `/ja/skip-path`・`/ja/chat-gen` は、R12 を有効にするステップ 1-1 で消す | API | **完了**（2026-09-15）。`/api/chat-script` と `/api/chat-og` が 404。`/api/result` は 200 だが、中身は INTP の結果ページの HTML（`[lang]` が `api` を受け付けるため。1-1 で解消）。3本のファイル削除は、手順の誤りでコミット `973cbec` に入り、`2d75491` は `proxy.ts` の1行だけになった。公開される中身は意図どおりなので、履歴は書き換えていない | — |

0-3 でレートリミットも外すのは、コード上は同じ IP から1分に11回目のアクセスで 429 を返すからだ。クローラーが画像を続けて取得すると、この上限に当たる。

#### 書き込みを伴う API の調査（2026-09-15）

N7 の回答を受けて、公開中だったコミット `47470c9` の全ルートと、`21df36f` の後に残る全ルートを調べた。見たのは、データベースやファイルへの書き込み、外部コマンドの実行、外部 API の呼び出しと、それぞれの保護。Server Actions（`use server`）はどちらのコミットにもない。

`47470c9` で書き込みや外部呼び出しが起きていた API は次の7つで、すべて `21df36f` で削除した。Vercel 上で実際に動いていたかは未確認。

| API | メソッド | 処理 | 保護 |
|---|---|---|---|
| `/api/admin/seed-protocols` | GET | Supabase の `protocols` テーブルを全件削除して入れ直す | なし |
| `/api/batch-generate` | POST | YouTube 動画の検索と取得、文字起こしと AI 解析（import 名から判断）、ファイル削除 | なし（Basic 認証の対象外） |
| `/api/render-video` | POST | ファイル書き込みと、`git commit`・`git push` の実行 | Basic 認証。ID とパスワードは公開リポジトリの `proxy.ts` に直書き |
| `/api/render-images` | POST | ファイル書き込み、zip 作成 | 同上 |
| `/api/video-gen/script` | POST | OpenAI で台本を生成 | 同上 |
| `/api/video-gen/tts` | POST | OpenAI で音声を合成してファイルに書き込む | 同上 |
| `/api/youtube-dl` | POST | `yt-dlp.exe` を実行してファイルに書き込む | 同上 |

公開サイトへの反映は、`/ja/video-gen` が 404 に変わったことで確かめた。その後に7つへ POST を送り、すべて 404 だった。seed-protocols は GET しか持たないので、仮にルートが残っていても POST は 405 で止まる。OPTIONS は存在しないパスにも 204 を返すため、ルートの有無の確認には使えない。

`21df36f` の後に残る API は次のとおり。データベースやファイルへの書き込みは残っていない。

| API | メソッド | 処理 | 保護 |
|---|---|---|---|
| `/api/romance-ai` | POST | OpenAI で文章を生成 | Bot 判定（proxy とルート内）、proxy で IP ごと1分10回、ルート内で10分5回 |
| `/api/og`、`/api/story-card` | GET | 画像を返す | なし（0-3 で外した） |

調べた時点では `/api/weakness`・`/api/result`・`/api/chat-script`・`/api/chat-og` もあったが、N10 と N12 の回答で削除した（ステップ 0-6・0-8）。OpenAI を呼ぶのは `/api/romance-ai` の1本だけになった。

Supabase を使うコードは、どこからも import されていない `utils/supabase/client.ts` だけになった。ビルドした `.next/static` に「supabase」の文字列はなく、ブラウザには接続先も鍵も渡っていない。`protocols` テーブルを読むコードもないので、テーブルが消えていても画面の表示は変わらない。本番のテーブルが実際に消されたことがあるかは未確認。

#### OpenAI API のレートリミットの確認（2026-09-15）

N10 の回答を受けて、残る3本のリミットを公開サイトで確かめた。型コードを「XXXX」にして送り、入力チェックで 400 を返させたので、OpenAI は呼ばれていない。どのリミットも、入力チェックより前で回数を数えている。

| 確認 | 送り方 | 結果 |
|---|---|---|
| proxy の1分10回 | `/api/chat-script` に12回 | 11回目から 429。効いている |
| `/api/result` の10分3回 | 5回 | 4回目から 429。効いている |
| `/api/romance-ai` の10分5回 | 7回 | 6回目から 429。効いている |
| `cf-connecting-ip` の偽装 | `/api/result` の上限に達した後に2回。`/api/chat-script` に毎回値を変えて12回 | どちらもすべて 400。**回避できる** |
| `x-forwarded-for` の偽装 | `/api/romance-ai` の上限に達した後に1回 | 429。回避できない |
| `x-real-ip` の偽装 | `/api/chat-script` に毎回値を変えて12回 | 11回目から 429。回避できない |

回避できる原因は `lib/get-client-ip.ts` にある。この関数は `cf-connecting-ip` を最優先で信用する。しかしサイトは Cloudflare を通っていないので、利用者が付けた値がそのまま届く。`x-forwarded-for` と `x-real-ip` は、上の結果のとおり Vercel が上書きするので偽装できない。

影響を受けるのは、`getClientIp` を使う proxy のリミットと `/api/result` のリミットだ。`/api/chat-script` にはルート内のリミットがなく、ヘッダーを偽れば回数の制限なく OpenAI を呼べる。`/api/romance-ai` のルート内リミットは `x-forwarded-for` で数えているので効いている。

N12 の回答を受けて、ステップ 0-7 で `cf-connecting-ip` を読まないように直し、0-8 で `/api/result`・`/api/chat-script`・`/api/chat-og` を削除した。修正後に、`cf-connecting-ip` を毎回変えて `/api/romance-ai` に12回送った結果は次のとおり。

`400 400 400 400 400 429(ルート内) 429(ルート内) 400 400 400 429(proxy) 429(proxy)`

proxy は偽のヘッダーに惑わされず実 IP で数え、11回目から 429 を返した。修正は効いている。

一方で、ルート内リミットは6・7回目で 429 を返した後、8〜10回目を通した。どちらのリミットもインスタンスごとのメモリで数えるので、途中から別のインスタンスに振り分けられたと考えられる。つまり、メモリで数えるリミットは確実な上限にならない。請求額の上限は、OpenAI の管理画面で月の利用上限を設定して別に確保する（9-2 の宿題）。

#### git 履歴の秘密情報チェック（2026-09-15）

リポジトリ `hayabusarain/cognitive-lens` は公開設定なので（GitHub API で `"visibility": "public"` を確認）、ファイルから消したものも過去のコミットから誰でも読める。そこで、全ブランチの104コミットの差分とコミットメッセージを検索した。値は出力せず、種類・先頭4文字・長さ・コミットだけを記録した。

検索した種類は、OpenAI のキー、GitHub のトークン、Supabase のキー（JWT 形式と新形式）、Google の API キー、Basic 認証のパスワード、URL に埋め込んだ認証情報、Bearer トークン、Slack・Vercel・npm のトークン、秘密鍵のブロック、キーやパスワードらしき代入。あわせて、`.env` などの秘密情報を入れがちなファイルが過去にコミットされていないかも見た。

| 見つかったもの | 場所 | 状態 |
|---|---|---|
| Basic 認証の ID とパスワード（管理画面用） | `middleware.ts`（コミット `7e41e86`、2026-04-21）と `proxy.ts`（`c17373a`、同日） | `21df36f` で削除済み。守っていた管理画面と API も同じコミットで消えたので、この値で開けるものはサイトに残っていない。ただし過去のコミットからは読める |

OpenAI・GitHub・Supabase・Google のキーやトークンは、どのコミットにも見つからなかった。`.env` などのファイルがコミットされたこともない。

同じパスワードをほかのサービス（Vercel、GitHub、Supabase、OpenAI など）で使い回しているなら、そちらは変更が要る。使い回しの有無は運営者にしか分からない（9-2 の宿題）。

### フェーズ1：基盤（画面の見た目は変えない）

ステップごとに本番へ反映し、公開サイトに向けても `check-redirects.mjs` を実行する。

| # | 作業 | 変わるもの | 確認 | 待つもの |
|---|---|---|---|---|
| 1-1 | `app/[lang]/layout.tsx` を作って `[lang]` を `ja` だけにし、`app/not-found.tsx` を置く。`/ja/skip-path` と `/ja/chat-gen` のページを削除する（API は 0-8 で削除済み）。同じステップで R7・R11・R12 を有効にする | 未知のパス、英語版と韓国語版の URL、2ページ | `/foo`、`/foo/test`、`/translate`、`/api/result` が 404 で `noindex`。`/en`、`/en/test`、`/ko`、`/test` が1回の 301 で `/ja` の対応ページへ。`/ja/skip-path` と `/en/chat-gen` が1回の 301 で `/ja/test` へ。`/ja` 配下の見た目が変わらない | — |
| 1-2 | 手書きの `<head>` タグを Metadata API へ移す | head | サイト確認の meta が出ている | — |
| 1-3 | `metadataBase` を www 付きにし、canonical を出す共通関数を作る | head | 全ページに www 付きの canonical が出る（クロールで確認） | — |
| 1-4 | R10 を有効にして公開し、その後 Vercel で `cognitive-lens.com` をプロジェクトへ直接割り当てる（順番の理由は 1-4 節） | ドメイン | 公開サイトで `curl -I https://cognitive-lens.com/ja` が 301 で、`Location` が www。`https://cognitive-lens.com/en/test` も1回で `https://www.cognitive-lens.com/ja/test` へ | Vercel の管理画面での操作 |
| 1-5 | 5-2 の型定義、`check-content.mjs`、`check-banned-terms.mjs` を作る。既存の型エラーを直し、`ignoreBuildErrors` を外す | コードのみ | わざと件数を1つ減らすと `npm run check` が失敗する。型エラーでビルドが止まる | — |
| 1-6 | キャラクターの切り詰め版を作るスクリプトと、フォントのサブセットを作るスクリプト | 生成物 | 16枚の切り詰め版ができる。フォントの出典が台帳に載る | — |

### フェーズ2：コンテンツとデザインの確定

ここからフェーズ3の 3-23 までは作業用ブランチで進め、本番には出さない。

| # | 作業 | 変わるもの | 確認 | 待つもの |
|---|---|---|---|---|
| 2-1 | `docs/tone-guide.md` を作る（decisions 2-1 の内容）。流行語と誇張語を `check-banned-terms.mjs` に登録する | 文書・検査 | 運営者のレビューが通る。「3行以上の段落を作らない」が、1段落120字以内かつ3文以内、1文45字以内に置き換わっている（N4） | — |
| 2-2 | 呼称16件を `lib/type-names.ts` に登録し、6-3 の確認を行う | 文書・コード | `docs/naming-check.md` に禁止語検査・ウェブ調査・J-PlatPat の結果がある | 宿題 Q5（J-PlatPat） |
| 2-3 | タイプ色16色と暗色の背景色を決める（Q20） | コードのみ | 文字に使う色は背景色とのコントラスト比が 4.5:1 以上。NT・NF・SJ・SP の同じグループの4色が、同じ色相に集まっていない | — |
| 2-4 | INTJ の `TypeContent` を見本として書く。同じステップで `lib/career-jobs.ts` を現行データから作る | コンテンツ | 運営者のレビューが通る。`npm run check` が通り、職業名が 5-2 の書き換え表どおりになっている。書き換え後の職業名は、元の言い回しの毒が抜けすぎて無味になっていないかを見る。全部が「成果主義の強い外資系企業」の調子だと、適職欄が求人票になる（N9） | — |
| 2-5 | 残り15タイプを書く | コンテンツ | `npm run check` が通る | — |
| 2-6 | 自己診断の設問24問と決定設問4問を書く | コンテンツ | 各軸で前の文字3問・後の文字3問。45字以内。現行設問との類似度を確認 | — |
| 2-7 | 相手診断の設問24問と決定設問4問を書く | コンテンツ | 2-6 と同じ | — |
| 2-8 | 脈あり度の設問（1タイプ12問以内）と段階別の説明文を書き、`/api/romance-ai` の指示文をトーンガイドに合わせる | コンテンツ・API | `npm run check` が通る。AI 文を数回生成し、禁止語と流行語が出ない | — |
| 2-9 | ビンゴ24項目×16タイプと称号のうち、トーンガイドから外れるものを差し替える | コンテンツ | 差し替えた項目の一覧（旧→新）を運営者がレビューする。件数が変わっていない | — |

### フェーズ3：ページ（1ページずつ）

| # | 作業 | 変わるページ | 確認 | 待つもの |
|---|---|---|---|---|
| 3-1 | 診断ロジック `lib/diagnosis/score.ts` と 2-2 のテスト | なし | T1〜T10 が合格 | — |
| 3-2 | `/ja/result/INTJ` だけを生成する | 1ページ | ビルド出力に静的生成として出る。HTML に `hgroup` の h1（INTJ）と副題（スフィンクス）、本文、canonical がある。運営者が分量を見て、行動プロトコルを載せるか決める（Q9 の保留） | — |
| 3-3 | 16タイプに広げる | 16ページ | 16 URL が 200。`/ja/result/XXXX` が 404 | — |
| 3-4 | 結果ページの OG 画像 | 16枚 | 4-2 の確認方法をすべて満たす。R8 の転送先を実 URL で確定 | — |
| 3-5 | R1・R4・R8 の 301 を有効にする | 旧 URL | `check-redirects` で該当ケースが 301 と正しい `Location` | — |
| 3-6 | 9:16 画像（スコアなし） | 16枚 | 1080×1920 の PNG。上下の安全域に重要な情報がない。「リヴァイアサン」が1行に収まる | — |
| 3-7 | 9:16 画像（スコアあり）と保存ボタン、R9 の 301 | 結果ページ | 4-3 の端末表を実機で確認 | — |
| 3-8 | 自己診断 `/ja/test` を新設問に置き換える | 1ページ | T1 を手で操作して決定設問が4問出る。途中で再読み込みして続きから再開できる | — |
| 3-9 | 結果ページの個人スコア欄 | 結果ページ | T8〜T10 の URL で表示・非表示が期待どおり | — |
| 3-10 | 16タイプ一覧 `/ja/result` と、R2・R3 の 301 | 1ページ | 16枚のカードが HTML にあり、アルファベット順。絞り込みの全9通りで枚数が正しい（16・8・4）。`/ja/select` が 301 | — |
| 3-11 | 相手診断を新設問と判定不能の処理に置き換える | 1ページ | 判定不能の軸数が 0・1・2・3以上の各ケース | — |
| 3-12 | ビンゴのハブ `/ja/bingo` を作り直す | 1ページ | 旧 HTML と新 HTML の見出しの文言を比べるスクリプトで差分なし（9-4）。h3 から h2 への変更は差分に数えない（Q8） | — |
| 3-13 | `/ja/bingo/INTJ` を作り、R6 を有効にする | 1ページ | 盤面操作、称号の段階、ハブからのリンク。X の共有文で、サイトを「MBTI診断サイト」と呼んでいない（現行は「Z世代向けの辛口MBTI診断サイト」。N3 の「サイト名に使わない」に合わせる） | — |
| 3-14 | タイプ別ビンゴを16タイプに広げる | 16ページ | 16 URL が 200 | — |
| 3-15 | ビンゴカード画像と保存 | 画像 | 不正な `mask` が 404。端末表で保存を確認 | — |
| 3-16 | コラム `/ja/article/{TYPE}` の本文を1タイプずつ新規に書き、R5 を有効にする | 1ページずつ | title・h1 に禁止語がない。相性と適職は結果ページへのリンクになっている | — |
| 3-17 | 脈あり度チェックを新設問に置き換え、description を書き直す | 1ページ | 段階の境界（24/25、49/50、74/75）。AI 文の取得に失敗しても脈あり度が表示される。description から「MBTIタイプと脈あり度を逆算」の「MBTI」が消えている（N11） | — |
| 3-18 | トップページの導線を更新する | 1ページ | 内部リンクを抽出して、どこからもリンクされないページが0 | — |
| 3-19 | GA4 を入れ、プライバシーポリシーに GA4 の利用を書く | 全ページ、`/ja/privacy` | GA4 のリアルタイム表示に3イベントが届く。回答と割合が送られていない | 宿題：GA4 の測定 ID |
| 3-20 | 運営者情報・免責・素材配布を更新する | 3ページ | 最終更新日、連絡先、素材の出典表記が正しい | 宿題 Q17 |
| 3-21 | sitemap.xml と robots.txt を更新する | 2ファイル | sitemap が59件で、全 URL が 200 | — |
| 3-22 | 英語のデータと辞書、`LanguageSwitcher`、置き換え済みの現行データ、使われなくなったライブラリ（`lib/result-cache.ts` など）を削除する | コード | `npm run check` とビルドが通る。削除したファイルを import している箇所がない | — |
| 3-23 | プレビューで 3-1〜3-22 の確認をまとめてやり直し、ブランチを main にマージして一括公開する | サイト全体 | プレビューで `npm run check`、`check-redirects.mjs`（R10 を除く）、クロール（`check-site.mjs`。禁止語、「MBTI」の語、どこからもリンクされないページ）が通る。旧型名と幻獣名が混在していない | — |

### 画像の差し替え（幻獣版が完成したとき）

どのフェーズの途中でも行える。画像はパスで参照しているので、コードは変えない。フェーズ2〜3の途中で完成したらブランチに入れ、一括公開の後なら単独で本番へ反映する。

| # | 作業 | 確認 | 待つもの |
|---|---|---|---|
| G-1 | `public/characters/{TYPE}.png` の16枚を幻獣版に置き換え、`build-character-assets.mjs` を実行し直す。`docs/asset-credits.md` に記録する | 4-1 の受け入れ確認をすべて満たす。その時点で作ってある OG 画像・9:16 画像・ビンゴカード画像を全部生成し、目視で崩れがない | 宿題：幻獣版16枚の生成、Q2 |

### フェーズ4：公開後

3-23 の一括公開の後に、ステップごとに本番へ反映する。

| # | 作業 | 確認 | 待つもの |
|---|---|---|---|
| 4-1 | 公開サイトに `check-redirects.mjs` とクロールを実行する | 全ケースが期待どおり | — |
| 4-2 | Search Console でサイトマップを送信し、旧 URL の転送を確認する | 送信済みで、エラーがない | — |
| 4-3 | Search Console の CSV とラッコキーワードのサジェスト一覧で、7-2 のキーワードに優先順位を付ける | 7-2 に、Search Console の表示回数と、サジェストに出るかどうかの列が加わる | 宿題 Q14・N5 |

フェーズ4では、次の2つを再検討の候補として残す（decisions 5章の11）。1つは `/chat-gen` にあった「2タイプの LINE 風会話画像」を作り直すかどうか。もう1つは韓国語版で、作るなら R11 から `ko` を外し、`/ko` を独立したページに戻す。

---

## 9. 確認事項

### 9-1. 初版の質問（Q1〜Q20）の反映先

すべて `decisions.md` 2章で回答済みで、この版の本文に反映した。

| Q | 反映した箇所 |
|---|---|
| Q1 | ステップ 0-1 |
| Q2 | 4-1、ステップ 0-4・G-1 |
| Q3 | 4-1 |
| Q4 | 4-4、ステップ 3-10 |
| Q5 | 6章、ステップ 2-2 |
| Q6 | 0-1、ステップ 2-1 |
| Q7 | 2-5、ステップ 2-9 |
| Q8 | 9-4、ステップ 3-12 |
| Q9 | 3-4、7-2、ステップ 3-2・3-16 |
| Q10 | 1-2、2-4、ステップ 3-22 |
| Q11 | 2-1、2-3、2-4 |
| Q12 | 3-3、4-3 |
| Q13 | 1-3 の R11 |
| Q14 | 7章、ステップ 4-3 |
| Q15 | 取り下げ（2026-09-15） |
| Q16 | 3-7、ステップ 3-19 |
| Q17 | ステップ 0-2・3-20 |
| Q18 | 1-3 の R10、1-4、ステップ 1-4 |
| Q19 | 5章 |
| Q20 | 4-1、ステップ 2-3 |

### 9-2. 運営者の宿題

`decisions.md` 6章の宿題に、この版で1件（GA4 の測定 ID）を加えた。

| 宿題 | 待っているステップ |
|---|---|
| Q2：画像の生成ツール名・時期・プロンプト（現行と幻獣版の両方） | 0-4、G-1 |
| Q5：呼称16件の J-PlatPat 検索 | 2-2 |
| Q14：Search Console の検索クエリ CSV | 4-3 |
| N5：ラッコキーワードの無料枠で「16タイプ」「MBTI」「{呼称}」のサジェスト一覧を CSV に出し、`docs/` に置く | 2-4 以降の title・description、4-3 |
| Q17：`contact@cognitivelens.com` の受信確認と、新しい連絡先の決定 | 0-2 の連絡先部分、3-20 |
| 幻獣版キャラクター画像16枚の生成 | G-1 |
| GA4 のプロパティ作成と測定 ID（この版で追加） | 3-19 |
| OpenAI の管理画面で、月の利用上限を設定する。レートリミットに穴が開いても請求額の天井になる | なし（すぐ行う） |
| 公開リポジトリの履歴に残る Basic 認証のパスワードを、ほかのサービスで使い回していないか確かめ、使い回していれば変更する | なし（すぐ行う） |
| Vercel の Domains 設定で、`cognitive-lens.com` を「www への転送」から「プロジェクトへ直接割り当て」に切り替える（2026-09-15 追加） | 1-4 の仕上げ。R10 のコードは公開済み |
| `docs/tone-guide.md` のレビュー。流行語の一覧と、タイプ説明を常体で書く解釈（2026-09-15 追加。`renewal` ブランチ） | 2-1、2-5、2-8、2-9 |
| `docs/colors.md` のタイプ色のレビュー（2026-09-15 追加。`renewal` ブランチ） | 2-3、3-2 以降のデザイン |
| `lib/type-content/INTJ.ts` の見本文章と職業名の書き換え表のレビュー（2026-09-15 追加。`renewal` ブランチ） | 2-4、2-5 |

### 9-3. この版で新たに出た質問

#### 回答済み（2026-09-15、チャットで回答）

| # | 質問 | 回答 | 反映した箇所 |
|---|---|---|---|
| N1 | 適職の文面を残すか、新規に書くか | 適職は残す。職業の対応（どのタイプにどの職業か）はそのままにし、説明文だけをトーンガイドに合わせて書き直す | 3-4、5-1〜5-3、ステップ 2-4 |
| N2 | 呼称の系統名をサイトに表示するか | 表示しない | 6-2 |
| N3 | 「{呼称} MBTI」を狙うなら、結果ページに「MBTI」を入れてよいか | Q14 を優先する。title・h1・サイト名には使わない（ビンゴのハブは例外）。本文では「MBTIでいうINTJ」のような説明として1回まで。指名検索は「{呼称} 診断」を主にし、「{呼称} MBTI」は本文の1回で拾えれば拾う程度 | 2-5、3-4、5-3、7-1、7-2、ステップ 3-13 |
| N4 | トーンガイドの「3行以上の段落を作らない」の「行」は何で数えるか | スマートフォンの行数は端末で変わり検査できないので、文字数で定義し直す。1段落120字以内かつ3文以内、1文45字以内 | 5-3、ステップ 2-1 |
| N5 | キーワードツールでの調査は誰が行うか | 運営者が行う。ラッコキーワードの無料枠で「16タイプ」「MBTI」「{呼称}」のサジェスト一覧を CSV に出し、`docs/` に置く。キーワードプランナーは Google 広告のアカウントが要るので使わない | 7-1、ステップ 4-3、9-2 |
| N6 | 各ステップを1つずつ本番へ出すか、ブランチでまとめるか | フェーズ0は即本番、フェーズ1はステップごとに本番、フェーズ2〜3はブランチでまとめてプレビュー確認後に一括公開、フェーズ4はステップごと | 8章の冒頭、ステップ 3-23 |
| N7 | seed-protocols をフェーズ0で先に削除するか | すぐ削除し、0-1 の push と同じコミットに入れる。認証なしで書き込みが起きる API をほかにも調べる | ステップ 0-1（完了）、フェーズ0の調査結果 |
| N8 | 取り下げ（2026-09-15） | — | — |
| N9 | 適職の職業名に「起業家」や、くだけた言い回しがあるが、このまま残すか | 職業名は残し、言い回しだけ直す。「起業家」は職業リストに職業名として入っているだけで、16Personalities が独占できる語でもないので問題ない。禁止語検査は `lib/career-jobs.ts` を対象外にし、代わりに「職業名が呼称・タグラインに使われていないこと」を検査する。「ゴリゴリ営業」「下っ端の事務」はトーン違反で職業を見下す表現なので、中立な職業名に書き直す | 5-2、5-3、ステップ 2-4 |
| N10 | `/api/weakness` をフェーズ0で先に削除するか | すぐ削除する。残る3本の OpenAI API も、ページごと消すまでの間レートリミットが効いているか確認する | ステップ 0-6（完了）、フェーズ0の調査結果 |
| N11 | meta description は title と本文のどちらの扱いか | title と同じ扱い。検索結果に出る要素（title・description・h1）は「MBTI」を使わず、本文は1回まで。`/ja/romance-checker` の description は書き直す | 3-4、5-3、7-1、ステップ 3-17 |
| N12 | `cf-connecting-ip` を信用しない修正を今すぐ出すか | 出す。Vercel が上書きするヘッダーだけを信用する。`/api/chat-script` はリミットを足すより消す方が早いので、同じ理由で `/api/chat-og`・`/api/result` も API だけ先に消す。ページ本体は 301 のステップで消す | ステップ 0-7・0-8（完了）、1-1 |

#### 運営者の委任で AI が判断したこと（2026-09-15）

運営者から「自律的に最善だと思うものを作ってほしい」と任されたので、次のように決めた。

| 件 | 判断 | 理由 |
|---|---|---|
| N13 | 呼称は幻獣名のまま続ける | 重なりは一般名詞の名前だけで、SPUR は生年月日の占いなので型との対応もない。呼称は `lib/type-names.ts` の1か所で変えられる。J-PlatPat の確認は運営者の宿題に残す |
| 2-1・2-3 のレビュー | トーンガイドとタイプ色は案のまま採用 | — |
| タイプ説明の二人称 | 本文に「あなた」「あの人」を書かない | 相手診断から来た結果ページ（2-3）でも、同じ文を自然に読めるようにするため |
| 相性の相手 | easy は E/I と J/P を入れ替えたタイプ、hard は4文字すべてを入れ替えたタイプ | 全タイプ同じ規則にし、組が対称になるようにした（`lib/type-compatibility.ts`） |
| 結果ページの title | 「{TYPE}（{呼称}）の性格と特徴・相性・適職 \| CognitiveLens」に統一 | 「{TYPE} 恋愛」はコラムのキーワード（7-3）なので、結果ページの title に「恋愛」を入れない |
| 「MBTI」の1回 | コンテンツのファイルには書かず、ページの部品側の固定文で使う | 検査を単純にするため（`check-content.mjs`） |
| 脈あり度の API | 入力を `{ type, answers: boolean[] }` に変える | 利用者の文を AI への指示に混ぜられないようにするため。ページ側（3-17）はこの形で送る |

#### 以前の質問（N13 は上で判断済み）

| # | 質問 | この回答で決まること |
|---|---|---|
| N13 | 呼称をこのまま幻獣名で続けるか。ウェブ調査で、集英社 SPUR の占い「みみた先生のファンタジーフォーチュン」（2024年）が、生年月日から性格を幻獣などのキャラクターで分けていることが分かった。10種類のうちドラゴン・ピクシー・スフィンクス・ユニコーン・フェニックスの5つが私たちの呼称と同じ名前で、人魚もマーメイドと同じ生き物。個性心理學研究所の「動物キャラナビ」もペガサスを使っている（`docs/naming-check.md`） | 呼称の維持か変更、2-5 以降のすべての文章 |

### 9-4. ビンゴで保持する見出し

ステップ 3-12 の比較に使う。文言は現行のページから取得したもの。h3 を h2 に上げるのは可（Q8）。英語版を作らないので、英語の見出しは保持の対象から外した。

| 場所 | 文言 |
|---|---|
| title | 偏見だらけのMBTIビンゴ \| CognitiveLens |
| h1 | 偏見だらけの MBTIビンゴ（「偏見だらけの」の後で改行） |
| 解説の見出し1 | 偏見だらけの16タイプビンゴとは？ |
| 解説の見出し2 | 「え、なんでこんなに当たるの…？」の理由 |
| 解説の見出し3 | ビンゴ結果の活用法と注意点 |
| トップのカード見出し | 偏見だらけのMBTIビンゴ |
| カード上の見出し（新 `/ja/bingo/{TYPE}` の h1 に使う） | 偏見だらけの{TYPE} ビンゴ |

トップのカード見出しにも「MBTI」が入るが、ビンゴのハブの名前なので Q14 の例外として残す。
