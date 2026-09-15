# 素材台帳

サイトで使う画像・フォント・アイコンの出典を記録する。**ここに記録がない素材はサイトに載せない**（`redesign-spec.md` 4-1）。
素材を足す・替えるときは、同じコミットでこの台帳を更新する。

最終更新：2026-09-15

---

## 1. キャラクター画像

### 1-1. 現行の16枚（実装中の仮置き）

| 項目 | 内容 |
|---|---|
| ファイル | `public/characters/{TYPE}.png` の16枚 |
| 形式 | PNG、800×1000、透過あり |
| 作成者 | 運営者 |
| 作成方法 | AI 生成 |
| 生成ツール | **未記入**（運営者が記入。Q2） |
| 生成時期 | **未記入**（運営者が記入。Q2） |
| プロンプト | **未記入**（運営者が記入。Q2） |
| 権利 | 運営者（2026-09-15 に運営者が申告） |
| リポジトリへの追加 | 2026-04-19、コミット `5880e2b` |
| 埋め込みメタデータ | 作者・生成ツール・プロンプトの記録なし。C2PA もなし（2026-09-15 確認） |
| 使っている場所 | トップ、結果、コラム、ビンゴ、素材配布ページ、インスタ用カード |
| 使用終了日 | 幻獣版に差し替えた日を記入する |

### 1-2. 幻獣版の16枚（未作成）

完成したら、この表を埋めてから `public/characters/` を差し替える（`redesign-spec.md` ステップ G-1）。

| 項目 | 内容 |
|---|---|
| ファイル | `public/characters/{TYPE}.png` の16枚（現行と同じパス） |
| 形式 | PNG、800×1000、透過あり |
| 作成者 | 運営者 |
| 作成方法 | AI 生成。1本のスタイル指示で16枚を続けて生成 |
| 生成ツール | |
| 生成日 | |
| スタイル指示（全タイプ共通） | |
| タイプ別の指示 | タイプごとに記入 |
| 権利 | 運営者 |

---

## 2. アイコン

| 項目 | 内容 |
|---|---|
| 名前 | Lucide（npm パッケージ `lucide-react`） |
| 版 | 1.7.0（`node_modules/lucide-react/package.json` で確認） |
| ライセンス | ISC License（`node_modules/lucide-react/LICENSE` で確認）。著作権表示は「Copyright (c) 2026 Lucide Icons and Contributors」 |
| 使っている場所 | 画面のアイコン全般（矢印、ハート、共有など） |

---

## 3. フォント

### 3-1. サイト本体

外部フォントは使っていない。`next/font` も Google Fonts の読み込みもなく、端末のシステムフォントで表示している（2026-09-15、コード上で確認）。

### 3-2. 新しい生成画像用（Noto Sans JP のサブセット）

仕様書 4-2〜4-5 の OG 画像・9:16 結果画像・ビンゴカード画像で使う。ステップ 1-6 で用意し、まだどのページでも使っていない。

| 項目 | 内容 |
|---|---|
| フォント | Noto Sans JP（Regular・Bold・Black の3ウェイト） |
| 取得元 | `https://raw.githubusercontent.com/notofonts/noto-cjk/165c01b46ea533872e002e0785ff17e44f6d97d8/Sans/SubsetOTF/JP/NotoSansJP-{ウェイト}.otf`（リポジトリ notofonts/noto-cjk。2021-04-30 のコミットに固定） |
| 形式 | OTF（CFF）。`ImageResponse` は TTF・OTF・WOFF を読める（`image-response.md` 52行目）。仕様書 4-2 の「TTF」から変えた |
| ライセンス | SIL Open Font License 1.1（固定したコミットのリポジトリ直下の `LICENSE` で確認。予約フォント名の指定はない） |
| 元ファイルの SHA-256 | Regular `dff723ba59d57d136764a04b9b2d03205544f7cd785a711442d6d2d085ac5073`、Bold `1b0edfb500b73a4fa8a4fcaae1bbbd403994e08e73e3e0da37e70d3853f42c5f`、Black `3aa30b0956510f4205f759ab3079a5b658310ebcda2577f290466ea51c948819` |
| リポジトリに置くもの | サブセットだけ（`assets/fonts/NotoSansJP-*.subset.otf`、各約240KB）と収録文字の一覧 `assets/fonts/charset.txt`。元ファイルは `.cache/fonts/`（git の管理外） |
| サブセット化 | `scripts/build-font-subset.mjs`（`npm run build:font`）。道具は subset-font 2.7.0（BSD-3-Clause）と、その中で使う harfbuzzjs 0.10.3（MIT） |
| 収録文字 | 2026-09-15 時点で641字。コンテンツの文字が増えたら作り直す。漏れは `scripts/check-content.mjs` がビルド前に検出する |
| 確認 | 3ウェイトで日本語・英数字・記号を `ImageResponse` で描画できた（2026-09-15） |

### 3-3. キャラクター画像の切り詰め版の生成

`scripts/build-character-assets.mjs` が、sharp 0.34.5（Apache-2.0）で `public/characters/` の透過の余白を切り詰め、`assets/characters/trimmed/` に書き出す。ビルドの直前（`predev`・`prebuild`）に毎回作り直し、git には入れない。元画像と同じ素材なので、出典は 1 章のとおり。

### 3-4. 現行の生成画像（OG 画像・インスタ用カード）

`/api/og` と `/api/story-card` は `next/og` の `ImageResponse` で画像を作り、`fontFamily: "sans-serif"` だけを指定している。

| 項目 | 内容 |
|---|---|
| 同梱の欧文フォント | Geist Regular（`node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf`）。同梱ファイルにフォントのライセンス表記はなく、**ライセンスは未確認** |
| 日本語の字形 | `next/og` が実行時に外部から取得しているとみられる。**取得先とライセンスは未確認** |

どちらも、仕様書 4-2 で Noto Sans JP（SIL Open Font License 1.1）に置き換える予定。置き換えたら、この節に取得元の URL・版・ライセンスを記録する。

---

## 4. 絵文字

| 項目 | 内容 |
|---|---|
| 使っている場所 | `/api/story-card`（インスタ用カード）の文面にある 👇 と 🔍 |
| 描画元 | `ImageResponse` の既定の Twemoji（`image-response.md` 22行目） |
| ライセンス | Twemoji のグラフィックは CC BY 4.0 とされる（**この台帳を書いた時点では配布元で未確認**）。帰属表示が要るライセンスだが、サイトに表記はない |

新しい生成画像では絵文字を使わない（仕様書 0-2）。インスタ用カードを 9:16 結果画像（仕様書 4-3）に置き換えた時点で、この節は削除する。

---

## 5. サイトで使っていないファイル

`public/file.svg`、`public/globe.svg`、`public/next.svg`、`public/vercel.svg`、`public/window.svg` の5つは create-next-app の雛形由来で、どこからも参照していない（2026-09-15、コード上で確認）。サイトに表示されないので台帳の対象外とし、仕様書ステップ 3-22 で削除する。
