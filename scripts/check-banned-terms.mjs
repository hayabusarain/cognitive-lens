// 使わない名称（仕様書 docs/redesign-spec.md 6-1）がコンテンツに出ていないかを検査する
// 実行：node scripts/check-banned-terms.mjs（npm run build の前に prebuild から走る）
//
// 呼称・見出し・タグラインなど目立つ場所は、当たったら失敗にする。
// 本文は一般語（「管理者」「主人公」など）と重なるので、当たっても警告として一覧に出すだけにする。
// lib/career-jobs.ts は職業名のデータなので対象外（decisions N9）。
// 1つだけを検査するとき：--only INTJ（そのタイプの文章とコラム）、--only romance、--only bingo
import fs from "node:fs";
import path from "node:path";
import { loadTs } from "./lib/ts-loader.mjs";
import { findBannedTerms, collectStrings } from "./lib/content-rules.mjs";
import { BANNED, categoryOf } from "./lib/banned-terms.mjs";

// 語の一覧は scripts/lib/banned-terms.mjs（scripts/check-site.mjs と共有）
export { BANNED };

const root = process.cwd();
const exists = (f) => fs.existsSync(path.join(root, f));
const load = (f) => loadTs(root, f);
const ALL_TERMS = Object.values(BANNED).flat();

const ONLY = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
const runs = (target) => !ONLY || ONLY === target;
const errors = [];
const warnings = [];
function scan(where, text, strict) {
  for (const term of findBannedTerms(text, ALL_TERMS)) {
    const line = `${where}：「${term}」（${categoryOf(term)}）… ${text.slice(0, 40)}`;
    (strict ? errors : warnings).push(line);
  }
}

// 呼称
if (!ONLY && exists("lib/type-names.ts")) {
  for (const [code, name] of Object.entries(load("lib/type-names.ts").TYPE_NAMES ?? {})) {
    scan(`呼称 ${code}`, name, true);
    // 職業名・役職名らしい語尾（仕様書 6-1「職業名・役職名全般」）
    if (/[家者官師士員長係]$/.test(name)) warnings.push(`呼称 ${code}：「${name}」が職業名・役職名らしい語尾で終わる`);
  }
}

// タイプごとの文章。tagline・og.catch・特徴の見出し・seo.title は厳しく、ほかは警告
const STRICT_PATHS = [/^tagline$/, /^og\.catch$/, /^traits\[\d\]\.heading$/, /^seo\.title$/];
for (const code of load("lib/type-codes.ts").TYPE_CODES) {
  if (!runs(code)) continue;
  const file = `lib/type-content/${code}.ts`;
  if (!exists(file)) continue;
  for (const { path: p, value } of collectStrings(load(file).content ?? {})) {
    scan(`${file} ${p}`, value, STRICT_PATHS.some((re) => re.test(p)));
  }
}

// 恋愛コラム。title と節の見出しは厳しく、ほかは警告
const ARTICLE_STRICT_PATHS = [/^title$/, /^sections\[\d\]\.heading$/];
for (const code of load("lib/type-codes.ts").TYPE_CODES) {
  if (!runs(code)) continue;
  const file = `lib/articles/${code}.ts`;
  if (!exists(file)) continue;
  for (const { path: p, value } of collectStrings(load(file).article ?? {})) {
    scan(`${file} ${p}`, value, ARTICLE_STRICT_PATHS.some((re) => re.test(p)));
  }
}

// 設問・脈あり度（本文扱い）
for (const [file, names] of [["lib/diagnosis/items.ts", ["ITEMS", "TIEBREAKERS"]], ["lib/target/items.ts", ["TARGET_ITEMS", "TARGET_TIEBREAKERS"]], ["lib/romance/items.ts", ["ROMANCE", "ROMANCE_STAGES"]]]) {
  if (!exists(file) || (ONLY && !(ONLY === "romance" && file.includes("romance")))) continue;
  const mod = load(file);
  for (const name of names) for (const { path: p, value } of collectStrings(mod[name] ?? {})) scan(`${file} ${name}${p ? "." + p : ""}`, value, false);
}

// ビンゴ：称号は見出し扱い、項目は本文扱い
if (runs("bingo")) {
  const mod = load("lib/bingo-data-ja.ts");
  for (const [i, title] of (mod.BINGO_TITLES ?? []).entries()) scan(`lib/bingo-data-ja.ts BINGO_TITLES[${i}]`, title, true);
  for (const { path: p, value } of collectStrings(mod.BINGO_DATA ?? {})) scan(`lib/bingo-data-ja.ts BINGO_DATA.${p}`, value, false);
}

if (warnings.length) {
  console.log(`check-banned-terms: 警告 ${warnings.length} 件（本文など。文脈を見て判断する）`);
  for (const w of warnings) console.log(`  注意 ${w}`);
}
if (errors.length) {
  console.error(`check-banned-terms: ${errors.length} 件の違反（呼称・見出し・タグライン）`);
  for (const e of errors) console.error(`  NG ${e}`);
  process.exit(1);
}
console.log("check-banned-terms: 違反なし");
