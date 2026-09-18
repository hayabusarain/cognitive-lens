# 幻獣版キャラクター画像のプロンプト

想定読者：画像を生成する運営者
作成日：2026-09-19　対象：`public/characters/{TYPE}.png` の16枚（仕様書 4-1、ステップ G-1）

現行の16枚は、既存の性格診断サイトのキャラクター画像を画像生成 AI で変換したものだった（`asset-credits.md` 1-1）。
作り直すときは、**参照画像を一切アップロードせず、下のテキストだけで生成する**。ここが今回の作り直しの目的なので、
「元の絵に寄せたい」という理由で画像を読み込ませると、やり直す意味がなくなる。

---

## 1. 共通のスタイル指示

16枚とも、この文をプロンプトの先頭に置く。絵柄をそろえるため、途中で文を変えない。

```
Full-body original character illustration, clean vector art style with flat shading and bold clean outlines,
soft cel-shaded highlights, no gradients on skin, slightly stylized proportions (about 6 heads tall),
standing upright and facing the viewer, feet fully visible, calm confident expression,
centered composition with generous empty margin on all four sides,
completely transparent background, no background elements, no ground, no shadow on the floor,
no text, no letters, no logo, no watermark, no frame, no border,
not holding any object, empty hands, no props, no tools, no weapons, no instruments,
no occupational clothing (no lab coat, no nurse uniform, no chef hat, no business suit, no armor),
simple modern casual clothing only,
vertical portrait format, 4:5 aspect ratio.
```

日本語での意味は次のとおり。全身のオリジナルキャラクターを、フラットな陰影と太めの輪郭線のベクターイラストで描く。
頭身は6頭身ほど、正面を向いて立ち、足まで入れる。四方に余白を広めに取り、背景は完全に透過。
影も地面も文字もロゴも入れない。**手には何も持たせない**。白衣・看護服・コック帽・スーツ・鎧のような、
職業が分かる服も着せない。服はふつうの私服にする。縦長の 4:5。

「何も持たせない」と「職業の服を着せない」は、仕様書 4-1 の受け入れ条件そのものなので削らない。
現行画像が 16Personalities を連想させた原因が、まさに持ち物（模型・白衣・演台・剣・看護服・コック帽・パレット）だった。

## 2. タイプごとの指示

共通の文の後ろに、そのタイプの1行をつなげる。幻獣そのものではなく、**幻獣の要素を1〜2点だけまとった人型**にする。
翼は「閉じている」「小さめ」と書いてあるものが多いが、これは横に広がると OG 画像やビンゴカードの枠からはみ出すため。

| タイプ | 呼称 | つなげる文 |
|---|---|---|
| ENFJ | フェニックス | `A young humanoid character with phoenix traits: feathered wings folded close to the back, hair that ends in soft flame-shaped tips. Main color #FF8A4C (warm orange).` |
| ENFP | ピクシー | `A young humanoid character with pixie traits: small translucent insect-like wings, pointed ears. Main color #FF78D2 (bright pink).` |
| ENTJ | ドラゴン | `A young humanoid character with dragon traits: two curved horns, scale texture along the forearms. Main color #FF5A5F (strong red).` |
| ENTP | キマイラ | `A young humanoid character with chimera traits: two mismatched horns of different shapes, one tufted tail. Main color #A6DD55 (yellow green).` |
| ESFJ | ドライアド | `A young humanoid character with dryad traits: a wreath of leaves in the hair, faint bark pattern on one shoulder. Main color #6FD66A (fresh green).` |
| ESFP | サラマンダー | `A young humanoid character with salamander traits: a crest of flame-like hair, a short lizard tail. Main color #E6DC4A (bright yellow).` |
| ESTJ | ケルベロス | `A young humanoid character with cerberus traits: pointed hound ears, a triple-buckled collar. Main color #D07CF5 (light purple).` |
| ESTP | ミノタウロス | `A young humanoid character with minotaur traits: thick curved bull horns, a nose ring. Main color #FF6E96 (coral pink).` |
| INFJ | ユニコーン | `A young humanoid character with unicorn traits: a single spiral horn on the forehead, a flowing mane-like hairstyle. Main color #B08CFF (soft violet).` |
| INFP | ペガサス | `A young humanoid character with pegasus traits: a pair of small feathered wings folded at the back, feather ornaments in the hair. Main color #62B0F5 (sky blue).` |
| INTJ | スフィンクス | `A young humanoid character with sphinx traits: a striped headdress, small folded wings behind the shoulders. Main color #3FCFC0 (teal).` |
| INTP | リヴァイアサン | `A young humanoid character with leviathan traits: fin-shaped ears, scale texture along the neck. Main color #6E95FF (periwinkle blue).` |
| ISFJ | グリフォン | `A young humanoid character with griffin traits: a feathered collar, small eagle wings folded at the back. Main color #F2C14E (golden yellow).` |
| ISFP | マーメイド | `A young humanoid character with mermaid traits: fin-shaped ears, a pearl ornament in the hair, wave-patterned trim on the clothes. Main color #45C3E0 (aqua blue).` |
| ISTJ | ゴーレム | `A young humanoid character with golem traits: stone-textured forearms, a small crystal embedded in one shoulder. Main color #45D492 (mint green).` |
| ISTP | フェンリル | `A young humanoid character with fenrir traits: wolf ears, a thick wolf tail. Main color #8E8EFF (lavender blue).` |

色は `lib/type-base.ts` のタイプ色と同じ。16色は色相が散るように決めてあるので（`docs/colors.md`）、
この指定を守れば「NT は紫、NF は緑」のようなグループごとの偏りは起きない。

## 3. 生成するときの決まり

- **参照画像をアップロードしない**。image-to-image も使わない
- 既存の性格診断サイトの名前や、特定の作品・作家の名前をプロンプトに入れない
- 16枚を続けて生成する。途中でスタイルの文を変えない。ツールにスタイル固定の機能（シードやスタイル参照）があれば使う
- 出力は透過 PNG。背景が残ったら、透過で出し直す（後から白を抜くと輪郭が汚れる）
- 1枚ずつ確認して、条件に合わないものだけ作り直す

## 4. 受け入れの確認（仕様書 4-1）

差し替える前に、この5つを確かめる。

1. 16枚すべてが 800×1000 で、アルファチャンネルを持つ（`node scripts/build-character-assets.mjs` が通れば形は正しい）
2. 職業を示す持ち物がない（模型・白衣・演台・剣・看護服・コック帽・パレット）
3. NT・NF・SJ・SP ごとに4枚を並べ、同じ色相に偏っていない
4. 翼などで横に広がった画像も、OG 画像・9:16 画像・ビンゴカードの枠に収まる（差し替え後に全生成画像を目で見る）
5. `docs/asset-credits.md` 1-2 に、ツール名・生成日・使ったプロンプトを書く

## 5. 差し替えの手順

1. 生成した16枚を `public/characters/{TYPE}.png` に上書きする（ファイル名は型コード。例：`INTJ.png`）
2. 大きさが 800×1000 でなければ、透過のまま余白込みでリサイズする
3. `npm run build` を実行する（`prebuild` の `build-character-assets.mjs` が切り詰め版を作り直す）
4. `npx next start -p 3200` を起動し、`npm run check:site -- http://localhost:3200` を実行する
5. 上の受け入れ確認を行う
6. `docs/asset-credits.md` 1-2 を埋め、1-1 の「使用終了日」に差し替えた日を書く
7. `app/[lang]/downloads/page.tsx` の `PAUSED` を `false` に戻すと、素材の配布ページが戻る
