// 新しい設問が、現行サイトの設問に似ていないかを確かめる（仕様書 2-6、ステップ 2-6・2-7）
// 実行：node scripts/check-question-similarity.mjs
//
// 文字の2字組（バイグラム）の Dice 係数で比べ、新しい設問ごとに一番近い現行の文を出す。
// 0.5 以上を「似ている」として失敗にする。16Personalities の設問との比較は目視で行う（手元に本文がないため）。
// 現行の設問ファイルはステップ 3-22 で削除する。削除後は比べる相手がないので何もしない。
import fs from "node:fs";
import path from "node:path";
import { loadTs } from "./lib/ts-loader.mjs";
import { collectStrings } from "./lib/content-rules.mjs";

const root = process.cwd();
const exists = (f) => fs.existsSync(path.join(root, f));
const THRESHOLD = 0.5;

const normalize = (s) => s.replace(/[\s、。，．・「」『』（）()！？!?…ー〜]/g, "");
const bigrams = (s) => {
  const t = normalize(s);
  const set = new Map();
  for (let i = 0; i < t.length - 1; i++) set.set(t.slice(i, i + 2), (set.get(t.slice(i, i + 2)) ?? 0) + 1);
  return set;
};
export function dice(a, b) {
  const x = bigrams(a);
  const y = bigrams(b);
  let overlap = 0;
  let total = 0;
  for (const [k, n] of x) { overlap += Math.min(n, y.get(k) ?? 0); total += n; }
  for (const n of y.values()) total += n;
  return total ? (2 * overlap) / total : 0;
}

const old = [];
for (const [file, name] of [["lib/questions.ts", "QUESTIONS"], ["lib/target-questions.ts", "TARGET_QUESTIONS"]]) {
  if (!exists(file)) continue;
  for (const { path: p, value } of collectStrings(loadTs(root, file)[name] ?? [])) {
    if (/[぀-ヿ一-鿿]/.test(value) && value.length >= 6) old.push({ where: `${file} ${p}`, text: value });
  }
}
if (!old.length) {
  console.log("check-question-similarity: 比べる現行の設問がない");
  process.exit(0);
}

const fresh = [];
for (const [file, names] of [["lib/diagnosis/items.ts", ["ITEMS", "TIEBREAKERS"]], ["lib/target/items.ts", ["TARGET_ITEMS", "TARGET_TIEBREAKERS"]]]) {
  if (!exists(file)) continue;
  const mod = loadTs(root, file);
  for (const name of names) {
    for (const { path: p, value } of collectStrings(mod[name] ?? {})) {
      if (/\.(id|axis|keyed)$/.test(p)) continue;
      fresh.push({ where: `${file} ${name}${p ? "." + p : ""}`, text: value });
    }
  }
}

let ng = 0;
let maxScore = 0;
const rows = fresh.map((f) => {
  let best = { score: 0, text: "" };
  for (const o of old) {
    const score = dice(f.text, o.text);
    if (score > best.score) best = { score, text: o.text };
  }
  if (best.score >= THRESHOLD) ng++;
  maxScore = Math.max(maxScore, best.score);
  return { ...f, best };
});
rows.sort((a, b) => b.best.score - a.best.score);
console.log(`新しい設問 ${fresh.length} 件 × 現行の文 ${old.length} 件。似ている順に上位10件：`);
for (const r of rows.slice(0, 10)) console.log(`  ${r.best.score.toFixed(2)}  ${r.text}  ⇔  ${r.best.text}`);
if (ng) {
  console.error(`check-question-similarity: ${THRESHOLD} 以上が ${ng} 件`);
  process.exit(1);
}
console.log(`check-question-similarity: 最大 ${maxScore.toFixed(2)}（基準 ${THRESHOLD} 未満）`);
