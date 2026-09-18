// lib/redirects.ts の単体テスト（仕様書 docs/redesign-spec.md 1-3 の表）
// 実行：node --test lib/redirects.test.mjs（Node.js 23.6 以降の型除去で .ts を読む）
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveRedirect, ENABLED_RULES } from "./redirects.ts";

const ALL = Object.fromEntries(["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11", "R12"].map((r) => [r, true]));
const only = (...ids) => Object.fromEntries(Object.keys(ALL).map((r) => [r, ids.includes(r)]));
const W = "https://www.cognitive-lens.com";
const run = (path, rules, host = W) => resolveRedirect(new URL(path, host), rules);

// [入力, 期待する転送先（null は転送なし）]
const ALL_CASES = [
  // 仕様書 1-3 の例
  ["/ja/result?type=intj&a=EIIE", `${W}/ja/result/INTJ`],
  ["/ja/result?type=XXXX", `${W}/ja/result`],
  ["/ja/select", `${W}/ja/result`],
  ["/ja/result/intj", `${W}/ja/result/INTJ`],
  ["/ja/article/Enfp", `${W}/ja/article/ENFP`],
  ["/ja/bingo/istp", `${W}/ja/bingo/ISTP`],
  ["/test", `${W}/ja/test`],
  ["/select", `${W}/ja/result`],
  ["/result?type=ENTP", `${W}/ja/result/ENTP`],
  ["/api/og?type=intj&lang=en", `${W}/ja/result/INTJ/opengraph-image`],
  ["/api/og?type=zzz", `${W}/ja/opengraph-image`],
  ["/api/story-card?type=INTJ", `${W}/ja/result/INTJ/share-image`],
  ["/api/story-card", `${W}/ja/result`],
  ["/en/test", `${W}/ja/test`],
  ["/ko", `${W}/ja`],
  ["/en", `${W}/ja`],
  ["/en/chat-gen", `${W}/ja/test`],
  ["/ja/skip-path", `${W}/ja/test`],
  // 規則の組み合わせ
  ["/en/result?type=entp", `${W}/ja/result/ENTP`],
  ["/en/article/intj", `${W}/ja/article/INTJ`],
  ["/ko/test", `${W}/ja/test`],
  ["/skip-path", `${W}/ja/test`],
  ["/result/entp", `${W}/ja/result/ENTP`],
  ["/ja/result/intj/share-image", `${W}/ja/result/INTJ/share-image`],
  // 転送しない
  ["/", null],
  ["/ja", null],
  ["/ja/test", null],
  ["/ja/result", null],
  ["/ja/result?foo=1", null],
  ["/ja/result/INTJ", null],
  ["/ja/result/XXXX", null],
  ["/ja/article/INTJ", null],
  ["/api/romance-ai", null],
  ["/api/result", null],
  ["/foo", null],
  ["/translate", null],
  ["/en/foo", null],
  ["/en/article/XXXX", null],
  ["/sitemap.xml", null],
  ["/ja/test/", null],
];

test("全規則を有効にしたとき、1-3 の表どおりに転送する", () => {
  for (const [path, expected] of ALL_CASES) {
    assert.equal(run(path, ALL), expected, path);
  }
});

test("いまの設定（ENABLED_RULES）は全規則が有効で、既定の引数でも 1-3 の表どおりに転送する", () => {
  assert.deepEqual(ENABLED_RULES, ALL);
  for (const [path, expected] of ALL_CASES) {
    assert.equal(resolveRedirect(new URL(path, W)), expected, path);
  }
  assert.equal(resolveRedirect(new URL("/en/result?type=entp", "http://cognitive-lens.com")), `${W}/ja/result/ENTP`);
});

test("R10：www なしは https の www へ。ほかの規則と合わせて1回で最終形にする", () => {
  const apex = "http://cognitive-lens.com";
  assert.equal(run("/ja", ALL, apex), `${W}/ja`);
  assert.equal(run("/en/result?type=entp", ALL, apex), `${W}/ja/result/ENTP`);
  assert.equal(run("/ja/test?x=1", ALL, apex), `${W}/ja/test?x=1`);
  assert.equal(run("/ja", only("R11"), apex), null);
});

test("一部の規則だけ有効（フェーズ1の R7・R11・R12）なら、無効の規則を当てない", () => {
  const phase1 = only("R7", "R11", "R12");
  assert.equal(run("/en/result?type=entp", phase1), `${W}/ja/result?type=entp`);
  assert.equal(run("/en/select", phase1), `${W}/ja/select`);
  assert.equal(run("/select", phase1), `${W}/ja/select`);
  assert.equal(run("/en/chat-gen", phase1), `${W}/ja/test`);
  assert.equal(run("/ja/result?type=intj", phase1), null);
  assert.equal(run("/api/og?type=INTJ", phase1), null);
  assert.equal(run("/ja/article/intj", phase1), null);
});

test("すべて無効なら、どの URL も転送しない", () => {
  const none = only();
  for (const [path] of ALL_CASES) assert.equal(run(path, none), null, path);
  assert.equal(run("/ja", none, "https://cognitive-lens.com"), null);
});
