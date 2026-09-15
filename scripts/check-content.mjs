// コンテンツの件数・向き・文字数・段落の長さを検査する（仕様書 docs/redesign-spec.md 5-3）
// 実行：node scripts/check-content.mjs（npm run build の前に prebuild から走る）
//
// まだ書かれていないファイルは飛ばす。ステップが進んでファイルができた時点から検査が効く。
//
// 1つだけを検査するとき：--only INTJ（そのタイプの文章とコラム）、--only romance、--only bingo
import fs from "node:fs";
import path from "node:path";
import { loadTs } from "./lib/ts-loader.mjs";
import { LIMITS, length, checkProse, collectStrings } from "./lib/content-rules.mjs";
import { collectCharset } from "./lib/charset.mjs";
import { contrastRatio, hue, hueArc, hueDistance } from "./lib/color.mjs";

const root = process.cwd();
const exists = (f) => fs.existsSync(path.join(root, f));
const load = (f) => loadTs(root, f);
const problems = [];
const notes = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);
const ONLY = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : null;
/** --only のときは、指定したものに関係する検査だけを行う */
const runs = (target) => !ONLY || ONLY === target;

// ── 1. 型コード ──────────────────────────────────────────────
const { TYPE_CODES } = load("lib/type-codes.ts");
const TYPE_TARGETS = ONLY && TYPE_CODES.includes(ONLY) ? [ONLY] : ONLY ? [] : TYPE_CODES;
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
if (runs("items")) {
  checkItems("lib/diagnosis/items.ts", "ITEMS", "TIEBREAKERS");
  checkItems("lib/target/items.ts", "TARGET_ITEMS", "TARGET_TIEBREAKERS");
}

// ── 3. タイプごとの文章 ──────────────────────────────────────────
const writtenTypes = [];
for (const code of TYPE_TARGETS) {
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

// 検索結果に出る要素（title・description）に「MBTI」を使わず、本文でも1ページ1回まで（decisions N3・N11）。
// 本文の1回は、ページの部品側の固定文（「MBTIでいう{TYPE}」）で使う。コンテンツのファイルには書かない
const TYPE_NAMES = exists("lib/type-names.ts") ? load("lib/type-names.ts").TYPE_NAMES : {};
const countMbti = (texts) => texts.join("\n").match(/MBTI/gi)?.length ?? 0;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
function checkSearchSnippet(file, { title, description, updatedAt }, all) {
  for (const [key, value] of [["title", title], ["description", description]]) {
    if (/MBTI/i.test(value ?? "")) fail(file, `${key} に「MBTI」がある（検索結果に出る要素には使わない）`);
  }
  if (length(description ?? "") > LIMITS.description) fail(file, `description が${length(description)}字（上限${LIMITS.description}）`);
  const mbti = countMbti(all);
  if (mbti > 0) fail(file, `「MBTI」が${mbti}回ある（1ページ1回の枠はページの部品側で使うので、コンテンツには書かない）`);
  if (!DATE.test(updatedAt ?? "")) fail(file, `updatedAt が YYYY-MM-DD ではない（${updatedAt}）`);
}

for (const code of writtenTypes) {
  const file = `lib/type-content/${code}.ts`;
  const content = load(file).content;
  if (!content) continue;
  const prefix = `${code}（${TYPE_NAMES[code]}）`;
  const title = content.seo?.title ?? "";
  if (!title.startsWith(prefix)) fail(file, `seo.title が「${prefix}」で始まっていない`);
  if (!title.endsWith(" | CognitiveLens")) fail(file, "seo.title が「 | CognitiveLens」で終わっていない");
  // 「{TYPE} 恋愛」はコラムのキーワード（仕様書 7-3）。結果ページの title では取り合わない
  if (title.includes("恋愛")) fail(file, "seo.title に「恋愛」がある（コラム /ja/article/{TYPE} のキーワード）");
  checkSearchSnippet(file, { ...content.seo, updatedAt: content.updatedAt }, collectStrings(content).map((s) => s.value));
}

// 文章を書いたタイプには、相性の相手の型コード（lib/type-compatibility.ts）が要る。理由の文には相手の呼称を入れる
if (writtenTypes.length) {
  const { TYPE_COMPATIBILITY } = exists("lib/type-compatibility.ts") ? load("lib/type-compatibility.ts") : {};
  for (const code of writtenTypes) {
    const pair = TYPE_COMPATIBILITY?.[code];
    if (!pair) fail("lib/type-compatibility.ts", `${code} の相性の相手がない`);
    else if (!TYPE_CODES.includes(pair.easy) || !TYPE_CODES.includes(pair.hard) || pair.easy === code || pair.hard === code || pair.easy === pair.hard) fail("lib/type-compatibility.ts", `${code} の相性の相手が不正（easy ${pair.easy}、hard ${pair.hard}）`);
    else {
      const reasons = load(`lib/type-content/${code}.ts`).content?.compatibility ?? {};
      if (!reasons.easyReason?.includes(TYPE_NAMES[pair.easy])) fail(`lib/type-content/${code}.ts`, `compatibility.easyReason に相手の呼称「${TYPE_NAMES[pair.easy]}」（${pair.easy}）がない`);
      if (!reasons.hardReason?.includes(TYPE_NAMES[pair.hard])) fail(`lib/type-content/${code}.ts`, `compatibility.hardReason に相手の呼称「${TYPE_NAMES[pair.hard]}」（${pair.hard}）がない`);
    }
  }
  if (TYPE_COMPATIBILITY) {
    for (const [code, pair] of Object.entries(TYPE_COMPATIBILITY)) {
      for (const key of ["easy", "hard"]) {
        if (TYPE_COMPATIBILITY[pair[key]]?.[key] !== code) fail("lib/type-compatibility.ts", `${code} の ${key} が ${pair[key]} なのに、${pair[key]} の ${key} が ${code} ではない（対称にする）`);
      }
    }
  }
}

// ── 3-2. 恋愛コラム（仕様書 3-16） ─────────────────────────────────────
const writtenArticles = [];
for (const code of TYPE_TARGETS) {
  const file = `lib/articles/${code}.ts`;
  if (!exists(file)) continue;
  writtenArticles.push(code);
  const article = load(file).article;
  if (!article) { fail(file, "article をエクスポートしていない"); continue; }
  for (const { path: where, value } of collectStrings(article)) {
    if (!value.trim()) fail(file, `${where} が空`);
    if (where === "updatedAt") continue;
    for (const p of checkProse(value)) fail(file, `${where}：${p}`);
  }
  const prefix = `${code}（${TYPE_NAMES[code]}）の恋愛`;
  if (!article.title?.startsWith(prefix)) fail(file, `title が「${prefix}」で始まっていない`);
  if (length(article.title ?? "") > LIMITS.articleTitle) fail(file, `title が${length(article.title)}字（上限${LIMITS.articleTitle}）`);
  if (article.sections?.length !== 4) fail(file, "sections が4件ではない");
  if (article.signs?.length !== 5) fail(file, "signs が5件ではない");
  checkSearchSnippet(file, article, collectStrings(article).map((s) => s.value));
}
notes.push(`恋愛コラム：${writtenArticles.length}/16 件`);

// ── 4. 脈あり度の設問 ────────────────────────────────────────────
if (!runs("romance")) {
  // --only で別のものを検査している
} else if (exists("lib/romance/items.ts")) {
  const { ROMANCE, ROMANCE_STAGES } = load("lib/romance/items.ts");
  for (const code of TYPE_CODES) {
    const questions = ROMANCE?.[code]?.questions ?? [];
    const n = questions.length;
    if (n < 1 || n > LIMITS.romanceQuestionsMax) fail("lib/romance/items.ts", `${code} の設問が${n}問（1〜${LIMITS.romanceQuestionsMax}問）`);
    if (new Set(questions).size !== n) fail("lib/romance/items.ts", `${code} に同じ設問がある`);
    questions.forEach((q, i) => {
      if (!q?.trim()) fail("lib/romance/items.ts", `${code} の設問${i + 1}が空`);
      else if (length(q) > LIMITS.question) fail("lib/romance/items.ts", `${code} の設問${i + 1}が${length(q)}字（上限${LIMITS.question}）`);
    });
  }
  if (!Array.isArray(ROMANCE_STAGES) || ROMANCE_STAGES.length !== 4) fail("lib/romance/items.ts", "ROMANCE_STAGES が4件ではない");
  else ROMANCE_STAGES.forEach((stage, i) => {
    if (!stage?.title?.trim() || !stage?.body?.trim()) fail("lib/romance/items.ts", `ROMANCE_STAGES[${i}] の title か body が空`);
    for (const p of checkProse(stage?.body ?? "")) fail("lib/romance/items.ts", `ROMANCE_STAGES[${i}].body：${p}`);
  });
} else notes.push("lib/romance/items.ts はまだない");

// ── 5. 適職の職業名（decisions N1・N9） ────────────────────────────
// 旧 lib/career-data.ts との照合（仕様書 5-3）は、旧ファイルを消したステップ 3-22 で外した。消す直前（2026-09-16）の照合は通っていた
if (ONLY && !TYPE_TARGETS.length) {
  // --only romance・bingo のときは職業名を検査しない
} else if (exists("lib/career-jobs.ts")) {
  const { CAREER_JOBS } = load("lib/career-jobs.ts");
  for (const code of TYPE_CODES) {
    for (const key of ["avoid", "fit"]) if (!CAREER_JOBS?.[code]?.[key]?.trim()) fail("lib/career-jobs.ts", `${code}.${key} が空`);
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
if (runs("bingo")) {
  const mod = load("lib/bingo-data-ja.ts");
  for (const code of TYPE_CODES) {
    const n = mod.BINGO_DATA?.[code]?.length ?? 0;
    if (n !== 24) fail("lib/bingo-data-ja.ts", `${code} の項目が${n}件（24件のはず）`);
  }
  if (mod.BINGO_TITLES && mod.BINGO_TITLES.length !== 7) fail("lib/bingo-data-ja.ts", "BINGO_TITLES が7件ではない");
}

// ── 7. 生成画像用フォントのサブセットの収録漏れ ─────────────────────
if (ONLY) {
  // フォントの収録漏れは全体の検査でだけ見る
} else if (exists("assets/fonts/charset.txt")) {
  const included = new Set([...fs.readFileSync(path.join(root, "assets/fonts/charset.txt"), "utf8").replace(/[\r\n]/g, "")]);
  const missing = [...collectCharset(root)].filter((ch) => !included.has(ch));
  if (missing.length) fail("assets/fonts", `サブセットにない文字が ${missing.length} 字ある（${missing.slice(0, 20).join("")}…）。node scripts/build-font-subset.mjs を実行してコミットする`);
} else notes.push("assets/fonts/charset.txt はまだない");

// ── 8. タイプ色（decisions Q20、仕様書ステップ 2-3） ─────────────────────
if (ONLY) {
  // タイプ色は全体の検査でだけ見る
} else if (exists("lib/type-base.ts") && exists("lib/theme.ts")) {
  const { TYPE_BASE } = load("lib/type-base.ts");
  const { THEME } = load("lib/theme.ts");
  for (const code of TYPE_CODES) {
    const color = TYPE_BASE[code]?.color;
    if (!/^#[0-9A-Fa-f]{6}$/.test(color ?? "")) { fail("lib/type-base.ts", `${code} の色が #RRGGBB ではない`); continue; }
    for (const [name, bg] of [["background", THEME.background], ["surface", THEME.surface]]) {
      const ratio = contrastRatio(color, bg);
      if (ratio < 4.5) fail("lib/type-base.ts", `${code} の色 ${color} と ${name} のコントラスト比が ${ratio.toFixed(2)}（4.5 以上）`);
    }
  }
  // 16Personalities の4グループ配色を再現しないよう、同じグループの4色を色相環の90°以内に固めない
  const groupOf = (code) => (code[1] === "N" ? "N" + code[2] : "S" + code[3]);
  for (const group of ["NT", "NF", "SJ", "SP"]) {
    const members = TYPE_CODES.filter((code) => groupOf(code) === group);
    const arc = hueArc(members.map((code) => hue(TYPE_BASE[code].color)));
    if (arc <= 90) fail("lib/type-base.ts", `${group} の4色が色相環の ${arc.toFixed(0)}° に固まっている（90° を超えて散らす）`);
  }
  const hues = TYPE_CODES.map((code) => [code, hue(TYPE_BASE[code].color)]);
  for (let i = 0; i < hues.length; i++) for (let j = i + 1; j < hues.length; j++) {
    if (TYPE_BASE[hues[i][0]].color.toLowerCase() === TYPE_BASE[hues[j][0]].color.toLowerCase()) fail("lib/type-base.ts", `${hues[i][0]} と ${hues[j][0]} が同じ色`);
    else if (hueDistance(hues[i][1], hues[j][1]) < 10) notes.push(`タイプ色：${hues[i][0]} と ${hues[j][0]} の色相差が ${hueDistance(hues[i][1], hues[j][1]).toFixed(0)}°（見分けにくい）`);
  }
} else notes.push("lib/type-base.ts はまだない");

// ── 結果 ────────────────────────────────────────────────────────
for (const n of notes) console.log(`・${n}`);
if (problems.length) {
  console.error(`\ncheck-content: ${problems.length} 件の問題`);
  for (const p of problems) console.error(`  NG ${p}`);
  process.exit(1);
}
console.log("check-content: 問題なし");
