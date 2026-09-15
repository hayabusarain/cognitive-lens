// 生成画像（OG 画像・9:16 結果画像・ビンゴカード画像）用に、Noto Sans JP のサブセットを作る（仕様書 4-2、ステップ 1-6）
//
// 実行：node scripts/build-font-subset.mjs
//   コンテンツの文字が増えたら実行し直し、assets/fonts/ の変更をコミットする。
//   収録漏れは scripts/check-content.mjs が検出してビルドを止める。
//
// 取得元：notofonts/noto-cjk の Sans/SubsetOTF/JP（SIL Open Font License 1.1）。コミットを固定して取得する。
// 元のフォントは .cache/fonts/ に置き、git には入れない。サブセットだけを assets/fonts/ に置く。
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import subsetFont from "subset-font";
import { collectCharset } from "./lib/charset.mjs";

const root = process.cwd();
export const NOTO_COMMIT = "165c01b46ea533872e002e0785ff17e44f6d97d8";
export const WEIGHTS = ["Regular", "Bold", "Black"];
const cacheDir = path.join(root, ".cache/fonts");
const outDir = path.join(root, "assets/fonts");
fs.mkdirSync(cacheDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

async function download(weight) {
  const file = path.join(cacheDir, `NotoSansJP-${weight}.otf`);
  if (fs.existsSync(file)) return file;
  const url = `https://raw.githubusercontent.com/notofonts/noto-cjk/${NOTO_COMMIT}/Sans/SubsetOTF/JP/NotoSansJP-${weight}.otf`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} の取得に失敗（${res.status}）`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/").replace(/^([A-Za-z]):/, "/$1:")}`) {
  const charset = collectCharset(root);
  fs.writeFileSync(path.join(outDir, "charset.txt"), charset + "\n");
  const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
  for (const weight of WEIGHTS) {
    const source = fs.readFileSync(await download(weight));
    const subset = await subsetFont(source, charset, { targetFormat: "sfnt" });
    const out = path.join(outDir, `NotoSansJP-${weight}.subset.otf`);
    fs.writeFileSync(out, subset);
    console.log(`${weight}: 元 ${(source.length / 1e6).toFixed(1)}MB（sha256 ${sha(source).slice(0, 12)}…）→ サブセット ${(subset.length / 1e3).toFixed(0)}KB`);
  }
  console.log(`build-font-subset: ${[...charset].length} 字を収録（assets/fonts/charset.txt）`);
}
