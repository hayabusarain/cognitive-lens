// 使わない名称（仕様書 docs/redesign-spec.md 6-1）がコンテンツに出ていないかを検査する
// 実行：node scripts/check-banned-terms.mjs（npm run build の前に prebuild から走る）
//
// 呼称・見出し・タグラインなど目立つ場所は、当たったら失敗にする。
// 本文は一般語（「管理者」「主人公」など）と重なるので、当たっても警告として一覧に出すだけにする。
// lib/career-jobs.ts は職業名のデータなので対象外（decisions N9）。
import fs from "node:fs";
import path from "node:path";
import { loadTs } from "./lib/ts-loader.mjs";
import { findBannedTerms, collectStrings } from "./lib/content-rules.mjs";

const root = process.cwd();
const exists = (f) => fs.existsSync(path.join(root, f));
const load = (f) => loadTs(root, f);
const legacy = JSON.parse(fs.readFileSync(path.join(root, "scripts/lib/legacy-type-names.json"), "utf8"));

export const BANNED = {
  "16Personalities の型名（英語）": ["Architect", "Logician", "Commander", "Debater", "Advocate", "Mediator", "Protagonist", "Campaigner", "Logistician", "Defender", "Executive", "Consul", "Virtuoso", "Adventurer", "Entrepreneur", "Entertainer"],
  "16Personalities の型名（日本語）": ["建築家", "論理学者", "指揮官", "討論者", "提唱者", "仲介者", "主人公", "広報運動家", "管理者", "擁護者", "幹部", "領事", "巨匠", "冒険家", "起業家", "エンターテイナー"],
  "16Personalities のグループ名・軸名": ["Analysts", "Diplomats", "Sentinels", "Explorers", "分析家", "外交官", "番人", "探検家", "Mind", "Energy", "Nature", "Tactics", "Identity"],
  "現行サイトの型名": legacy.names,
  "現行サイトのタグライン": legacy.taglines,
  "現行サイトのグループ名": ["分析系", "理想主義系", "管理系", "探索系", "Idealists"],
  "Keirsey の型名・気質名": ["Mastermind", "Inventor", "Fieldmarshal", "Healer", "Counselor", "Champion", "Teacher", "Inspector", "Protector", "Supervisor", "Provider", "Crafter", "Composer", "Promoter", "Performer", "Rational", "Idealist", "Guardian", "Artisan"],
  "誇張語": ["最強", "天才", "神", "完璧"],
  // トーンガイド（docs/tone-guide.md 5-1）の流行語・若者言葉
  "流行語": ["ヤバい", "ヤバ", "ガチ", "ガチ勢", "マジ", "エモい", "エモ", "沼る", "沼", "蛙化", "ぴえん", "それな", "草", "陰キャ", "陽キャ", "メンヘラ", "無理ゲー", "詰んだ", "秒で", "爆速", "エグい", "ワンチャン", "知らんけど", "神対応", "神機能", "チート", "デフォ", "アプデ", "裏アカ", "量産型", "限界突破"],
};
const ALL_TERMS = Object.values(BANNED).flat();
const categoryOf = (term) => Object.entries(BANNED).find(([, list]) => list.includes(term))?.[0] ?? "表記";

const errors = [];
const warnings = [];
function scan(where, text, strict) {
  for (const term of findBannedTerms(text, ALL_TERMS)) {
    const line = `${where}：「${term}」（${categoryOf(term)}）… ${text.slice(0, 40)}`;
    (strict ? errors : warnings).push(line);
  }
}

// 呼称
if (exists("lib/type-names.ts")) {
  for (const [code, name] of Object.entries(load("lib/type-names.ts").TYPE_NAMES ?? {})) {
    scan(`呼称 ${code}`, name, true);
    // 職業名・役職名らしい語尾（仕様書 6-1「職業名・役職名全般」）
    if (/[家者官師士員長係]$/.test(name)) warnings.push(`呼称 ${code}：「${name}」が職業名・役職名らしい語尾で終わる`);
  }
}

// タイプごとの文章。tagline・og.catch・特徴の見出し・seo.title は厳しく、ほかは警告
const STRICT_PATHS = [/^tagline$/, /^og\.catch$/, /^traits\[\d\]\.heading$/, /^seo\.title$/];
for (const code of load("lib/type-codes.ts").TYPE_CODES) {
  const file = `lib/type-content/${code}.ts`;
  if (!exists(file)) continue;
  for (const { path: p, value } of collectStrings(load(file).content ?? {})) {
    scan(`${file} ${p}`, value, STRICT_PATHS.some((re) => re.test(p)));
  }
}

// 設問・脈あり度（本文扱い）
for (const [file, names] of [["lib/diagnosis/items.ts", ["ITEMS", "TIEBREAKERS"]], ["lib/target/items.ts", ["TARGET_ITEMS", "TARGET_TIEBREAKERS"]], ["lib/romance/items.ts", ["ROMANCE", "ROMANCE_STAGES"]]]) {
  if (!exists(file)) continue;
  const mod = load(file);
  for (const name of names) for (const { path: p, value } of collectStrings(mod[name] ?? {})) scan(`${file} ${name}${p ? "." + p : ""}`, value, false);
}

// ビンゴ：称号は見出し扱い、項目は本文扱い
{
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
