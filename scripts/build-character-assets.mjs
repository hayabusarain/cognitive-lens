// キャラクター画像の透過の余白を切り詰め、生成画像用の派生ファイルを作る（仕様書 4-1、ステップ 1-6）
//
// 入力：public/characters/{TYPE}.png（800×1000、透過 PNG）
// 出力：assets/characters/trimmed/{TYPE}.png（git の管理外。ビルドの直前に毎回作り直す）
//
// 画像を差し替えたときに作り直し忘れが起きないよう、predev と prebuild から毎回実行する。
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const TYPES = ["ENFJ", "ENFP", "ENTJ", "ENTP", "ESFJ", "ESFP", "ESTJ", "ESTP", "INFJ", "INFP", "INTJ", "INTP", "ISFJ", "ISFP", "ISTJ", "ISTP"];
const srcDir = path.join(root, "public/characters");
const outDir = path.join(root, "assets/characters/trimmed");
// これ以下の不透明度の画素は余白とみなす（0〜255）
const ALPHA_MIN = 8;
fs.mkdirSync(outDir, { recursive: true });

const problems = [];
for (const type of TYPES) {
  const src = path.join(srcDir, `${type}.png`);
  if (!fs.existsSync(src)) { problems.push(`${type}.png がない`); continue; }
  const meta = await sharp(src).metadata();
  // 元画像の受け入れ条件（仕様書 4-1）：800×1000 でアルファチャンネルを持つ
  if (meta.width !== 800 || meta.height !== 1000) problems.push(`${type}.png が ${meta.width}×${meta.height}（800×1000 のはず）`);
  if (!meta.hasAlpha) problems.push(`${type}.png に透過（アルファチャンネル）がない`);
  // 不透明度が ALPHA_MIN を超える画素を囲む範囲で切り出す。
  // sharp の trim() は左上の画素を背景の基準にするため、角にほぼ透明な画素があると切り詰められなかった（ISTJ）
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > ALPHA_MIN) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  if (right < 0) { problems.push(`${type}.png が全面透明`); continue; }
  const box = { left, top, width: right - left + 1, height: bottom - top + 1 };
  const out = path.join(outDir, `${type}.png`);
  await sharp(src).extract(box).png().toFile(out);
  console.log(`${type}: ${meta.width}×${meta.height} → ${box.width}×${box.height}`);
}

if (problems.length) {
  console.error(`build-character-assets: ${problems.length} 件の問題`);
  for (const p of problems) console.error(`  NG ${p}`);
  process.exit(1);
}
console.log(`build-character-assets: ${TYPES.length} 枚を ${path.relative(root, outDir)} に書き出した`);
