// ビルドしたサイトを sitemap.xml からたどって、全ページの head と本文を確かめる（仕様書 5-3、ステップ 3-18・3-21・3-23）
//
// 使い方:
//   npm run check:site -- http://localhost:3200
//   npm run check:site -- https://（プレビューの URL）
// Vercel の保護がかかったプレビューでは、環境変数 VERCEL_AUTOMATION_BYPASS_SECRET に
// 「Protection Bypass for Automation」の値を入れて実行する（ヘッダー x-vercel-protection-bypass で送る）。
//
// 確かめること（1つでも NG があれば終了コード 1）:
//   - sitemap.xml が59件（仕様書 1-5）で、各 URL が 200
//   - canonical が https://www.cognitive-lens.com から始まり、自分のパスと一致する
//   - title に「| CognitiveLens」が2回以上ない
//   - title・meta description・h1・og:site_name に「MBTI」がない（/ja/bingo だけ例外）
//   - 本文の見える文字（script・style を除く）の「MBTI」が1ページ1回まで（/ja/bingo は除く）
//   - og:image があり、https://www.cognitive-lens.com から始まる。Twitterbot として取ると 200 で画像が返る
//   - 16Personalities・Keirsey・現行サイトの型名とグループ名が、title・description・本文にない
//     （一般語と重なる語は警告にとどめる）
//   - どのページからもリンクされていない sitemap の URL がない。サイト内リンクの行き先が 4xx・5xx でない
//   - 存在しない URL が 404 になる
import { BANNED, categoryOf } from "./lib/banned-terms.mjs";
import { findBannedTerms } from "./lib/content-rules.mjs";

const SITE_URL = "https://www.cognitive-lens.com";
const EXPECTED_SITEMAP_COUNT = 59;
/** 「MBTI」を title や本文に使ってよいページ（tone-guide 5-4） */
const MBTI_ALLOWED = new Set(["/ja/bingo"]);
const NOT_FOUND_PATHS = ["/ja/result/XXXX", "/ja/bingo/XXXX", "/ja/article/XXXX", "/foo", "/ja/bingo/INTJ/card/zzzzzz"];

/** 本文で見る禁止語の分類（誇張語・流行語・現行サイトのタグラインは、コンテンツの検査 check-banned-terms.mjs に任せる） */
const PAGE_CATEGORIES = [
  "16Personalities の型名（英語）",
  "16Personalities の型名（日本語）",
  "16Personalities のグループ名・軸名",
  "現行サイトの型名",
  "現行サイトのグループ名",
  "Keirsey の型名・気質名",
];
/** 一般語と重なるので、当たっても警告にとどめる語 */
const GENERAL_WORDS = new Set([
  "建築家", "指揮官", "仲介者", "主人公", "管理者", "擁護者", "幹部", "領事", "巨匠", "冒険家", "起業家", "エンターテイナー",
  "分析家", "外交官", "番人", "探検家", "管理系",
  "Architect", "Commander", "Advocate", "Mediator", "Defender", "Executive", "Consul", "Virtuoso", "Adventurer", "Entrepreneur", "Entertainer",
  "Mind", "Energy", "Nature", "Tactics", "Identity", "Explorers", "Analysts",
  "Inventor", "Healer", "Counselor", "Champion", "Teacher", "Inspector", "Protector", "Supervisor", "Provider", "Crafter", "Composer", "Promoter", "Performer", "Rational", "Idealist", "Guardian", "Artisan",
]);
const PAGE_TERMS = PAGE_CATEGORIES.flatMap((c) => BANNED[c]);

const arg = process.argv.slice(2).find((a) => !a.startsWith("-"));
if (!arg) {
  console.error("使い方: npm run check:site -- http://localhost:3200");
  process.exit(2);
}
const base = new URL(arg);
const headers = { "user-agent": "Mozilla/5.0 (check-site)" };
if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) headers["x-vercel-protection-bypass"] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

const ng = [];
const warnings = [];
const bad = (path, message) => ng.push(`${path}：${message}`);

async function get(path) {
  const res = await fetch(new URL(path, base), { headers, redirect: "manual" });
  const type = res.headers.get("content-type") ?? "";
  const body = type.includes("text/") || type.includes("xml") ? await res.text() : (await res.arrayBuffer(), "");
  return { status: res.status, location: res.headers.get("location"), body };
}

/** 画像を X のクローラーとして取りに行く（Bot 判定で 403 になる不具合が 0-3 であったため、その再発も見る） */
async function getImage(path) {
  const res = await fetch(new URL(path, base), {
    headers: { ...headers, "user-agent": "Twitterbot/1.0" },
    redirect: "manual",
  });
  await res.arrayBuffer();
  return { status: res.status, type: res.headers.get("content-type") ?? "" };
}

// ── HTML の読み取り（依存パッケージを増やさないため、Next.js が出す HTML の形に合わせた正規表現で読む） ──
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? m;
  });
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)].map(([, k, v]) => [k.toLowerCase(), decode(v)]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(([t]) => attrs(t));
const stripTags = (s) => decode(s.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

function readPage(html) {
  // title と meta は、ストリーミングで body 側に出る場合もあるので文書全体から探す。SVG の中の <title> は除く
  const head = html.replace(/<svg\b[\s\S]*?<\/svg>/gi, " ");
  const bodyHtml = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? "";
  const metas = tags(head, "meta");
  const meta = (key, value) => metas.filter((m) => m[key] === value).map((m) => m.content ?? "");
  return {
    titles: [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(([, t]) => decode(t).trim()),
    descriptions: meta("name", "description"),
    ogImages: meta("property", "og:image"),
    ogSiteNames: meta("property", "og:site_name"),
    canonicals: tags(head, "link").filter((l) => (l.rel ?? "").split(/\s+/).includes("canonical")).map((l) => l.href ?? ""),
    h1s: [...bodyHtml.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(([, t]) => stripTags(t)),
    text: stripTags(bodyHtml.replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")),
    links: tags(bodyHtml, "a").map((a) => a.href).filter(Boolean),
  };
}

/** サイト内のリンクなら、クエリとハッシュを外したパスを返す */
function internalPath(href) {
  let url;
  try {
    url = new URL(href, SITE_URL);
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(url.protocol)) return null;
  if (url.host !== new URL(SITE_URL).host && url.host !== base.host) return null;
  return url.pathname.replace(/(.)\/$/, "$1");
}

const countMbti = (s) => (s.match(/MBTI/gi) ?? []).length;

// ── sitemap.xml ─────────────────────────────────────────────────────
const sitemap = await get("/sitemap.xml");
if (sitemap.status !== 200) {
  console.error(`NG  /sitemap.xml が ${sitemap.status}`);
  process.exit(1);
}
const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, l]) => decode(l.trim()));
if (locs.length !== EXPECTED_SITEMAP_COUNT) bad("/sitemap.xml", `${locs.length} 件（${EXPECTED_SITEMAP_COUNT} 件のはず）`);
const paths = [];
for (const loc of locs) {
  if (!loc.startsWith(`${SITE_URL}/`)) bad("/sitemap.xml", `${loc} が ${SITE_URL} から始まらない`);
  const path = new URL(loc).pathname;
  if (paths.includes(path)) bad("/sitemap.xml", `${path} が重複している`);
  else paths.push(path);
}

// ── 各ページ ────────────────────────────────────────────────────────
const linkedFrom = new Map(); // パス → リンク元のパスの集合
const pageSet = new Set(paths);

async function checkPage(path) {
  const res = await get(path);
  if (res.status !== 200) {
    bad(path, `状態 ${res.status}${res.location ? `（→ ${res.location}）` : ""}`);
    return;
  }
  const page = readPage(res.body);
  const mbtiAllowed = MBTI_ALLOWED.has(path);

  // canonical
  if (page.canonicals.length !== 1) bad(path, `canonical が ${page.canonicals.length} 個`);
  for (const c of page.canonicals) {
    if (!c.startsWith(SITE_URL)) bad(path, `canonical「${c}」が ${SITE_URL} から始まらない`);
    else if (c !== `${SITE_URL}${path}`) bad(path, `canonical「${c}」が自分のパスと違う`);
  }

  // title
  if (page.titles.length !== 1) bad(path, `title が ${page.titles.length} 個`);
  const title = page.titles[0] ?? "";
  if (!title) bad(path, "title が空");
  if ((title.match(/\|\s*CognitiveLens/g) ?? []).length >= 2) bad(path, `title の「| CognitiveLens」が重なっている：${title}`);

  // description
  if (page.descriptions.length !== 1 || !page.descriptions[0]) bad(path, `meta description が ${page.descriptions.filter(Boolean).length} 個`);

  // 「MBTI」の語
  if (!mbtiAllowed) {
    if (countMbti(title)) bad(path, `title に「MBTI」：${title}`);
    for (const d of page.descriptions) if (countMbti(d)) bad(path, `meta description に「MBTI」：${d}`);
    for (const h of page.h1s) if (countMbti(h)) bad(path, `h1 に「MBTI」：${h}`);
    for (const s of page.ogSiteNames) if (countMbti(s)) bad(path, `og:site_name に「MBTI」：${s}`);
    const n = countMbti(page.text);
    if (n > 1) {
      const around = [...page.text.matchAll(/.{0,15}MBTI.{0,15}/gi)].map(([m]) => `「${m}」`).join("、");
      bad(path, `本文の「MBTI」が ${n} 回（1回まで）：${around}`);
    }
  }
  if (page.h1s.length !== 1) bad(path, `h1 が ${page.h1s.length} 個`);

  // og:image
  if (!page.ogImages.length) bad(path, "og:image がない");
  for (const img of page.ogImages) if (!img.startsWith(SITE_URL)) bad(path, `og:image「${img}」が ${SITE_URL} から始まらない`);
  // og:image が実際に取れるか。X や Discord のクローラーは、この URL を Bot 判定で 403 にされると画像を出せない
  for (const img of page.ogImages) {
    if (!img.startsWith(SITE_URL)) continue;
    const imagePath = img.slice(SITE_URL.length);
    const image = await getImage(imagePath);
    if (image.status !== 200) bad(path, `og:image ${imagePath} が状態 ${image.status}（Twitterbot として取得）`);
    else if (!image.type.startsWith("image/")) bad(path, `og:image ${imagePath} の content-type が ${image.type || "なし"}`);
  }

  // 禁止語
  for (const [where, text] of [["title", title], ["meta description", page.descriptions.join(" ")], ["本文", page.text]]) {
    for (const term of findBannedTerms(text, PAGE_TERMS)) {
      const i = text.search(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), /^[A-Za-z]/.test(term) ? "i" : ""));
      const around = i >= 0 ? `「${text.slice(Math.max(0, i - 15), i + term.length + 15)}」` : "";
      const line = `${where}に「${term}」（${categoryOf(term)}）${around}`;
      if (GENERAL_WORDS.has(term)) warnings.push(`${path}：${line}`);
      else bad(path, line);
    }
  }

  // リンク
  for (const href of page.links) {
    const target = internalPath(href);
    if (!target || target === path) continue;
    if (!linkedFrom.has(target)) linkedFrom.set(target, new Set());
    linkedFrom.get(target).add(path);
  }
}

const queue = [...paths];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const path = queue.shift();
      try {
        await checkPage(path);
      } catch (e) {
        bad(path, `取得に失敗（${e.message}）`);
      }
    }
  }),
);

// どこからもリンクされていない sitemap の URL
for (const path of paths) if (!linkedFrom.has(path)) bad(path, "sitemap にあるが、どのページからもリンクされていない");

// sitemap にないリンク先が 4xx・5xx でないか（画像の保存先など）
for (const target of [...linkedFrom.keys()].filter((t) => !pageSet.has(t))) {
  const res = await get(target);
  if (res.status >= 400) bad(target, `リンク先が ${res.status}（リンク元：${[...linkedFrom.get(target)].slice(0, 3).join("、")}）`);
}

// 404 になるべき URL
for (const path of NOT_FOUND_PATHS) {
  const res = await get(path);
  if (res.status !== 404) bad(path, `404 のはずが ${res.status}${res.location ? `（→ ${res.location}）` : ""}`);
}

// ── 結果 ────────────────────────────────────────────────────────────
console.log(`check-site: ${base.origin}  sitemap ${locs.length} 件、サイト内リンクの行き先 ${linkedFrom.size} 種、404 の確認 ${NOT_FOUND_PATHS.length} 件`);
if (warnings.length) {
  console.log(`\n警告 ${warnings.length} 件（一般語と重なる語。文脈を見て判断する）`);
  for (const w of warnings) console.log(`  注意  ${w}`);
}
if (ng.length) {
  console.log(`\nNG ${ng.length} 件`);
  for (const line of ng) console.log(`  NG  ${line}`);
  process.exit(1);
}
console.log("\nNG なし");
