// lib/romance/items.ts の単体テスト（仕様書 2-4 の脈あり度と段階、ステップ 3-17 の確認「段階の境界 24/25、49/50、74/75」）
// items.ts は型だけを import するので、Node.js の型除去でそのまま読める
import { test } from "node:test";
import assert from "node:assert/strict";
import { ROMANCE, ROMANCE_STAGES, romanceScore, stageIndex } from "./items.ts";

test("段階の境界：各段階の下限を含む（0〜24、25〜49、50〜74、75〜100）", () => {
  const cases = [
    [0, 0], [24, 0],
    [25, 1], [49, 1],
    [50, 2], [74, 2],
    [75, 3], [100, 3],
  ];
  for (const [score, expected] of cases) assert.equal(stageIndex(score), expected, `脈あり度 ${score}`);
  assert.equal(ROMANCE_STAGES.length, 4);
});

test("脈あり度 = round(はいの数 ÷ 設問数 × 100)。12問なら 3・6・9 問の「はい」がちょうど境界に乗る", () => {
  const scores = Array.from({ length: 13 }, (_, yes) => romanceScore(yes, 12));
  assert.deepEqual(scores, [0, 8, 17, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100]);
  assert.deepEqual(scores.map(stageIndex), [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3]);
});

test("四捨五入で境界をまたぐ設問数でも、計算した脈あり度で段階を決める", () => {
  // 11問：3問は 27（段階2）、8問は 73（段階3）。7問：5問は 71、2問は 29
  assert.equal(romanceScore(3, 11), 27);
  assert.equal(stageIndex(romanceScore(3, 11)), 1);
  assert.equal(romanceScore(8, 11), 73);
  assert.equal(stageIndex(romanceScore(8, 11)), 2);
  // 8問：2問は 25 で段階2、6問は 75 で段階4
  assert.equal(stageIndex(romanceScore(2, 8)), 1);
  assert.equal(stageIndex(romanceScore(6, 8)), 3);
  // 設問数が0なら0
  assert.equal(romanceScore(0, 0), 0);
});

test("16タイプとも設問は1〜12問", () => {
  assert.equal(Object.keys(ROMANCE).length, 16);
  for (const [type, set] of Object.entries(ROMANCE)) {
    assert.ok(set.questions.length >= 1 && set.questions.length <= 12, `${type} は ${set.questions.length}問`);
  }
});
