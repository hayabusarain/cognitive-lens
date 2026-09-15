// コンテンツの件数・向き・文字数・段落の長さを検査する（仕様書 docs/redesign-spec.md 5-3）
// 実行：node scripts/check-content.mjs（npm run build の前に prebuild から走る）
//
// まだ書かれていないファイルは飛ばす。ステップが進んでファイルができた時点から検査が効く。
import fs from "node:fs";
import path from "node:path";
import { loadTs } from "./lib/ts-loader.mjs";
import { LIMITS, length, checkProse, collectStrings } from "./lib/content-rules.mjs";
import { collectCharset } from "./lib/charset.mjs";

const root = process.cwd();
const exists = (f) => fs.existsSync(path.join(root, f));
const load = (f) => loadTs(root, f);
const problems = [];
const notes = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);

// ── 1. 型コード ──────────────────────────────────────────────
const { TYPE_CODES } = load("lib/type-codes.ts");
if (TYPE_CODES.length !== 16 || new Set(TYPE_CODES).size !== 16) fail("lib/type-codes.ts", "16個の重複しない型コードではない");
const redirectTypes = fs.readFileSync(path.join(root, "lib/redirects.ts"), "utf8").match(/const TYPES = new Set\(\[([\s\S]*?)\]\)/)?.[1].match(/[A-Z]{4}/g) ?? [];
if ([...redirectTypes].sort().join() !== [...TYPE_CODES].sort().join()) fail("lib/redirects.ts", "TYPES が lib/type-codes.ts と一致しない");

// ── 2. 自己診断・相手診断の設問 ─────────────────────────────────
function checkItems(file, itemsName, tiebreakersName) {
  if (!exists(file)) return notes.push(`${file} はまだない`);
  const mod = load(file);
  const { POLES, AXES } = load("lib/diagnosis/types.ts");
  const items = mod[itemsName];
  if (!Array.isArray(items) || items.length !== 24) return fail(file, `${itemsName} が24件ではない`);
  if (new Set(items.map((i) => i.id)).size !== 24) fail(file, "設問 ID が重複している");
  for (const axis of AXES) {
    const [first, second] = POLES[axis];
    const onAxis = items.filter((i) => i.axis === axis);
    const firstCount = onAxis.filter((i) => i.keyed === first).length;
    const secondCount = onAxis.filter((i) => i.keyed === second).length;
    if (onAxis.length !== 6 || firstCount !== 3 || secondCount !== 3) fail(file, `${axis} 軸が「前の文字3問・後の文字3問」になっていない（${firstCount}・${secondCount}）`);
  }
  items.forEach((item, i) => {
    if (item.axis !== AXES[i % 4]) fail(file, `${item.id} の軸の並びが E/I → S/N → T/F → J/P の巡回になっていない`);
    if (!item.text?.trim()) fail(file, `${item.id} の設問文が空`);
    else if (length(item.text) > LIMITS.question) fail(file, `${item.id} の設問文が${length(item.text)}字（上限${LIMITS.question}）`);
  });
  const tiebreakers = mod[tiebreakersName];
  for (const axis of AXES) {
    const t = tiebreakers?.[axis];
    if (!t?.prompt?.trim() || !t?.first?.trim() || !t?.second?.trim()) fail(file, `${tiebreakersName}.${axis} が空か欠けている`);
  }
}
checkItems("lib/diagnosis/items.ts", "ITEMS", "TIEBREAKERS");
checkItems("lib/target/items.ts", "TARGET_ITEMS", "TARGET_TIEBREAKERS");

// ── 3. タイプごとの文章 ──────────────────────────────────────────
const writtenTypes = [];
for (const code of TYPE_CODES) {
  const file = `lib/type-content/${code}.ts`;
  if (!exists(file)) continue;
  writtenTypes.push(code);
  const content = load(file).content;
  if (!content) { fail(file, "content をエクスポートしていない"); continue; }
  for (const { path: where, value } of collectStrings(content)) {
    if (!value.trim()) fail(file, `${where} が空`);
    for (const p of checkProse(value)) fail(file, `${where}：${p}`);
  }
  if (length(content.tagline ?? "") > LIMITS.tagline) fail(file, `tagline が${length(content.tagline)}字（上限${LIMITS.tagline}）`);
  if (length(content.og?.catch ?? "") > LIMITS.ogCatch) fail(file, `og.catch が${length(content.og.catch)}字（上限${LIMITS.ogCatch}）`);
  for (const variable of ["{name}", "{url}"]) {
    if (!content.share?.text?.includes(variable)) fail(file, `share.text に ${variable} がない`);
  }
}
notes.push(`タイプごとの文章：${writtenTypes.length}/16 件（${writtenTypes.join("・") || "なし"}）`);

// ── 4. 脈あり度の設問 ────────────────────────────────────────────
if (exists("lib/romance/items.ts")) {
  const { ROMANCE, ROMANCE_STAGES } = load("lib/romance/items.ts");
  for (const code of TYPE_CODES) {
    const n = ROMANCE?.[code]?.questions?.length ?? 0;
    if (n < 1 || n > LIMITS.romanceQuestionsMax) fail("lib/romance/items.ts", `${code} の設問が${n}問（1〜${LIMITS.romanceQuestionsMax}問）`);
  }
  if (!Array.isArray(ROMANCE_STAGES) || ROMANCE_STAGES.length !== 4) fail("lib/romance/items.ts", "ROMANCE_STAGES が4件ではない");
} else notes.push("lib/romance/items.ts はまだない");

// ── 5. 適職の職業名（decisions N1・N9） ────────────────────────────
// 仕様書 5-2 の書き換え表。見下す言い回しだけを中立な職業名に直し、ほかは現行の値のまま
const CAREER_REWRITES = {
  "ルーチンワーク・下っ端の事務": "定型業務が中心の事務職",
  "お堅い公務員・銀行員": "公務員・銀行員",
  "ノルマ第一のゴリゴリ営業": "ノルマの厳しい営業職",
  "クレーム処理・体育会系の職場": "クレーム対応・上下関係の厳しい職場",
  "一日中PCと向き合う孤独な作業": "一日中ひとりで進めるPC作業",
  "成果主義で蹴落とし合う外資系": "成果主義の強い外資系企業",
  "ルールがないフリーランス": "決まった手順のないフリーランス",
  "完全リモート・誰とも話さない仕事": "フルリモートで人と話す機会が少ない仕事",
  "スピードと効率重視のブラック企業": "スピードと効率を最優先する職場",
  "データ分析・孤独な作業": "データ分析・ひとりで進める作業",
};
if (exists("lib/career-jobs.ts")) {
  const { CAREER_JOBS } = load("lib/career-jobs.ts");
  if (exists("lib/career-data.ts")) {
    const { CAREER_DATA } = load("lib/career-data.ts");
    for (const code of TYPE_CODES) {
      const expected = { avoid: CAREER_REWRITES[CAREER_DATA[code].hellJob] ?? CAREER_DATA[code].hellJob, fit: CAREER_REWRITES[CAREER_DATA[code].survivalRoute] ?? CAREER_DATA[code].survivalRoute };
      for (const key of ["avoid", "fit"]) {
        if (CAREER_JOBS?.[code]?.[key] !== expected[key]) fail("lib/career-jobs.ts", `${code}.${key} が「${expected[key]}」ではない（現行データと書き換え表から計算）`);
      }
    }
  }
  // 職業名が呼称とタグラインに使われていないこと
  const names = exists("lib/type-names.ts") ? Object.values(load("lib/type-names.ts").TYPE_NAMES ?? {}) : [];
  const taglines = writtenTypes.map((code) => load(`lib/type-content/${code}.ts`).content?.tagline ?? "");
  const jobWords = [...new Set(Object.values(CAREER_JOBS ?? {}).flatMap((j) => [j.avoid, j.fit]).flatMap((s) => s.split("・")).map((s) => s.trim()).filter((s) => length(s) >= 2))];
  for (const word of jobWords) {
    for (const text of [...names, ...taglines]) if (text.includes(word)) fail("職業名の転用", `「${word}」が呼称かタグライン「${text}」に使われている`);
  }
} else notes.push("lib/career-jobs.ts はまだない");

// ── 6. ビンゴ ────────────────────────────────────────────────────
{
  const mod = load("lib/bingo-data-ja.ts");
  for (const code of TYPE_CODES) {
    const n = mod.BINGO_DATA?.[code]?.length ?? 0;
    if (n !== 24) fail("lib/bingo-data-ja.ts", `${code} の項目が${n}件（24件のはず）`);
  }
  if (mod.BINGO_TITLES && mod.BINGO_TITLES.length !== 7) fail("lib/bingo-data-ja.ts", "BINGO_TITLES が7件ではない");
}

// ── 7. 生成画像用フォントのサブセットの収録漏れ ─────────────────────
if (exists("assets/fonts/charset.txt")) {
  const included = new Set([...fs.readFileSync(path.join(root, "assets/fonts/charset.txt"), "utf8").replace(/[\r\n]/g, "")]);
  const missing = [...collectCharset(root)].filter((ch) => !included.has(ch));
  if (missing.length) fail("assets/fonts", `サブセットにない文字が ${missing.length} 字ある（${missing.slice(0, 20).join("")}…）。node scripts/build-font-subset.mjs を実行してコミットする`);
} else notes.push("assets/fonts/charset.txt はまだない");

// ── 結果 ────────────────────────────────────────────────────────
for (const n of notes) console.log(`・${n}`);
if (problems.length) {
  console.error(`\ncheck-content: ${problems.length} 件の問題`);
  for (const p of problems) console.error(`  NG ${p}`);
  process.exit(1);
}
console.log("check-content: 問題なし");
