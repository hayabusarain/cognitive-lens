// scripts/lib/content-rules.mjs の単体テスト
import { test } from "node:test";
import assert from "node:assert/strict";
import { splitSentences, checkProse, findBannedTerms, collectStrings } from "./content-rules.mjs";

test("文はかぎ括弧の中の句点では分けない", () => {
  assert.deepEqual(splitSentences("「いいよ。」と言う。次の文！"), ["「いいよ。」と言う。", "次の文！"]);
});

test("1文45字・1段落120字・3文までを検査する", () => {
  assert.deepEqual(checkProse("短い文。もう一つ。三つ目。"), []);
  assert.equal(checkProse("一。二。三。四。").length, 1);
  assert.equal(checkProse("あ".repeat(46) + "。").length, 1);
  assert.equal(checkProse("あ".repeat(45) + "。").length, 1); // 句点を含めて46字
  assert.deepEqual(checkProse("あ".repeat(44) + "。"), []);
  assert.equal(checkProse(("あ".repeat(40) + "。").repeat(3)).length, 1); // 123字の段落
  assert.deepEqual(checkProse("一段落目。\n二段落目。"), []);
});

test("禁止語：英字は単語単位、1字の漢字は熟語を除き、ほかは部分一致", () => {
  assert.deepEqual(findBannedTerms("The Architect type", ["Architect"]), ["Architect"]);
  assert.deepEqual(findBannedTerms("architecture", ["Architect"]), []);
  assert.deepEqual(findBannedTerms("まさに神", ["神"]), ["神"]);
  assert.deepEqual(findBannedTerms("精神的に強い", ["神"]), []);
  assert.deepEqual(findBannedTerms("建築家タイプ", ["建築家"]), ["建築家"]);
  assert.deepEqual(findBannedTerms("INTJ-A の人", []), ["-A・-T の表記"]);
});

test("文字列を場所つきで取り出す", () => {
  assert.deepEqual(collectStrings({ a: "x", b: [{ c: "y" }] }), [{ path: "a", value: "x" }, { path: "b[0].c", value: "y" }]);
});
