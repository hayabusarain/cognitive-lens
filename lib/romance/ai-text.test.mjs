// lib/romance/ai-text.ts の単体テスト（脈あり度チェックの AI 文の読み替え。API は呼ばない）
import { test } from "node:test";
import assert from "node:assert/strict";
import { AI_FALLBACK_TEXT, readRomanceAiResponse, romanceShareText, shouldRequestAiText } from "./ai-text.ts";

const OK_BODY = { feelings: "気持ちの文", nextAction: "次の一歩の文", caution: "注意の文" };

test("200 と3つの文なら、そのまま表示する", () => {
  assert.deepEqual(readRomanceAiResponse(200, OK_BODY), { kind: "ok", text: OK_BODY });
});

test("API が作れなかった欄（固定文・空・文字列以外）は null にし、3つとも空なら失敗", () => {
  const partial = readRomanceAiResponse(200, { feelings: AI_FALLBACK_TEXT, nextAction: " 次の一歩 ", caution: 3 });
  assert.deepEqual(partial, { kind: "ok", text: { feelings: null, nextAction: "次の一歩", caution: null } });
  const empty = readRomanceAiResponse(200, { feelings: AI_FALLBACK_TEXT, nextAction: "", caution: AI_FALLBACK_TEXT });
  assert.deepEqual(empty, { kind: "error", reason: "failed" });
});

test("失敗：ネットワーク（status なし）、400、403、500、503、JSON が読めない", () => {
  for (const status of [null, 400, 403, 500, 503]) {
    assert.deepEqual(readRomanceAiResponse(status, { error: "x" }), { kind: "error", reason: "failed" }, `status ${status}`);
  }
  assert.deepEqual(readRomanceAiResponse(200, null), { kind: "error", reason: "failed" });
});

test("429 は回数の上限として分ける", () => {
  assert.deepEqual(readRomanceAiResponse(429, { error: "上限" }), { kind: "error", reason: "rate_limit" });
});

test("「はい」が0件なら AI 文を取りに行かない（API は 400 を返すため）", () => {
  assert.equal(shouldRequestAiText([false, false, false]), false);
  assert.equal(shouldRequestAiText([false, true, false]), true);
});

test("共有の文面に、脈あり度の数字は入り、相手のタイプは入らない", () => {
  const text = romanceShareText(58, 12);
  assert.match(text, /58%/);
  assert.match(text, /\{url\}/);
  assert.doesNotMatch(text, /[EI][SN][TF][JP]/);
});
