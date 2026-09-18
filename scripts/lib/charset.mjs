// 生成画像に出る可能性のある文字を集める（scripts/build-font-subset.mjs と scripts/check-content.mjs で共用）
import fs from "node:fs";
import path from "node:path";
import { loadTs } from "./ts-loader.mjs";
import { collectStrings } from "./content-rules.mjs";

/** 生成画像に出る可能性のある文字をすべて集める（多めに集める方針） */
export function collectCharset(rootDir) {
  const exists = (f) => fs.existsSync(path.join(rootDir, f));
  const texts = [];
  // 英数字・記号（ASCII の表示可能文字）と、よく使う全角記号
  for (let c = 0x20; c <= 0x7e; c++) texts.push(String.fromCharCode(c));
  texts.push("、。，．・：；？！「」『』（）【】〜ー…―％＆＋－＝×÷→←↑↓　");
  // サイト名と画像に入る固定文言（仕様書 4-2・4-3）
  texts.push("CognitiveLens www.cognitive-lens.com 外向・内向 感覚・直観 思考・感情 判断・知覚 偏見だらけのビンゴ 僅差 16タイプ");
  // 共通デザインの OG 画像に入れるページ名（仕様書 4-2。lib/og/page-image.tsx）
  texts.push("16タイプ性格診断 自己診断 相手診断 16タイプ一覧 偏見だらけのMBTIビンゴ 恋愛コラム一覧 脈あり度チェック");
  const files = [
    ["lib/type-names.ts", "TYPE_NAMES"],
    ["lib/bingo-data-ja.ts", "BINGO_DATA"],
    ["lib/bingo-data-ja.ts", "BINGO_TITLES"],
  ];
  for (const [file, name] of files) {
    if (!exists(file)) continue;
    texts.push(...collectStrings(loadTs(rootDir, file)[name] ?? {}).map((s) => s.value));
  }
  const contentDir = path.join(rootDir, "lib/type-content");
  if (fs.existsSync(contentDir)) {
    for (const f of fs.readdirSync(contentDir).filter((f) => /^[EI][SN][TF][JP]\.ts$/.test(f))) {
      texts.push(...collectStrings(loadTs(rootDir, `lib/type-content/${f}`).content ?? {}).map((s) => s.value));
    }
  }
  // コラムの OG 画像に title を入れる（仕様書 4-2）
  const articleDir = path.join(rootDir, "lib/articles");
  if (fs.existsSync(articleDir)) {
    for (const f of fs.readdirSync(articleDir).filter((f) => /^[EI][SN][TF][JP]\.ts$/.test(f))) {
      texts.push(loadTs(rootDir, `lib/articles/${f}`).article?.title ?? "");
    }
  }
  return [...new Set([...texts.join("")])].filter((ch) => ch !== "\n" && ch !== "\r").sort().join("");
}
