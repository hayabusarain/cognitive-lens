// 実際のサーバーが lib/redirects.ts の判定どおりに 301 を返すかを確かめる（仕様書 1-4）
//
// 使い方:
//   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-redirects.mjs http://localhost:3000
//   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/check-redirects.mjs https://www.cognitive-lens.com
//
// 期待値は lib/redirects.ts の ENABLED_RULES（いま有効な規則）から計算する。
// 期待が「転送なし」の URL では、301 が返らないことだけを確かめる。
import http from "node:http";
import https from "node:https";
import { resolveRedirect, CANONICAL_HOST, ENABLED_RULES } from "../lib/redirects.ts";

const base = new URL(process.argv[2] ?? "http://localhost:3000");
const isLocal = ["localhost", "127.0.0.1"].includes(base.hostname);
const APEX = "cognitive-lens.com";
const UA = "Mozilla/5.0 (check-redirects)";

const PATHS = [
  "/ja", "/ja/test", "/ja/result", "/ja/result?type=intj&a=EIIE", "/ja/result?type=XXXX", "/ja/select",
  "/ja/result/intj", "/ja/article/Enfp", "/ja/article/INTJ", "/ja/bingo/istp",
  "/test", "/select", "/result?type=ENTP", "/privacy", "/article/intj",
  "/api/og?type=intj&lang=en", "/api/story-card?type=INTJ",
  "/en", "/en/test", "/en/result?type=entp", "/en/select", "/en/chat-gen", "/en/article/intj", "/ko", "/ko/test",
  "/ja/skip-path", "/ja/chat-gen", "/skip-path",
  "/foo", "/translate", "/en/foo", "/api/romance-ai",
];
// R10 用。本番では apex のドメインへ直接、ローカルでは Host ヘッダーを変えて送る
const APEX_PATHS = ["/ja", "/en/result?type=entp"];

function get(target, hostHeader) {
  const url = new URL(target);
  const lib = url.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.request(url, { method: "GET", headers: { host: hostHeader ?? url.host, "user-agent": UA } }, (res) => {
      res.resume();
      resolve({ status: res.statusCode, location: res.headers.location ?? null });
    });
    req.on("error", reject);
    req.end();
  });
}

// ローカルでは、仮想ホスト名の URL をローカルサーバーへの要求に置き換える
function toRequest(absolute) {
  const u = new URL(absolute);
  if (!isLocal) return [u.href, u.host];
  return [`${base.origin}${u.pathname}${u.search}`, u.host];
}

const results = [];
async function check(path, host) {
  const virtual = `${isLocal ? base.protocol : "https:"}//${host}${path}`;
  const expected = resolveRedirect(new URL(virtual));
  const [target, hostHeader] = toRequest(virtual);
  const res = await get(target, hostHeader);
  let ok;
  let note = "";
  if (expected) {
    const location = res.location ? new URL(res.location, virtual).href : null;
    ok = res.status === 301 && location === expected;
    if (ok) {
      const [next, nextHost] = toRequest(location);
      const second = await get(next, nextHost);
      if (second.status >= 300 && second.status < 400) { ok = false; note = `転送が2回目も続く（${second.status} → ${second.location}）`; }
      else note = `転送先は ${second.status}`;
    } else note = `実際 ${res.status} ${res.location ?? ""}`;
  } else {
    ok = res.status !== 301;
    note = `${res.status}`;
  }
  results.push({ ok, host, path, expected: expected ?? "（転送なし）", note });
}

for (const p of PATHS) await check(p, isLocal ? CANONICAL_HOST : base.host);
// R10 が無効のあいだは、Vercel のドメイン設定が apex を先に 307 で転送し proxy に届かないので確かめない
if (ENABLED_RULES.R10) for (const p of APEX_PATHS) await check(p, APEX);
else console.log("（R10 が無効のため、www なしのドメインは確かめていない）");

for (const r of results) console.log(`${r.ok ? "OK" : "NG"}  ${r.host}${r.path}  →  ${r.expected}  （${r.note}）`);
const ng = results.filter((r) => !r.ok).length;
console.log(`\n${results.length} 件中 ${results.length - ng} 件 OK、${ng} 件 NG`);
process.exit(ng ? 1 : 0);
