// lib/diagnosis/score.ts の単体テスト（仕様書 2-2 の T1〜T10 と、2-3 の相手診断）
import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreAxis, diagnose, candidateTypes, parseScores } from "./score.ts";

// 仕様書 2-1 の並び：軸を E/I → S/N → T/F → J/P の順に巡回し、前の文字と後の文字を交互に置く
const AXES = ["EI", "SN", "TF", "JP"];
const POLES = { EI: ["E", "I"], SN: ["S", "N"], TF: ["T", "F"], JP: ["J", "P"] };
const ITEMS = Array.from({ length: 24 }, (_, i) => {
  const axis = AXES[i % 4];
  const round = Math.floor(i / 4);
  return { id: `q${String(i + 1).padStart(2, "0")}`, axis, keyed: POLES[axis][round % 2] };
});
const answerAll = (fn) => Object.fromEntries(ITEMS.map((item) => [item.id, fn(item)]));
const isFirst = (item) => POLES[item.axis][0] === item.keyed;

/** ある軸だけ S を指定値にし、ほかの軸は S = +18 にする回答を作る */
function answersWithS(targetAxis, s) {
  const answers = answerAll((item) => (isFirst(item) ? 3 : -3));
  const onAxis = ITEMS.filter((i) => i.axis === targetAxis);
  // 前の文字3問を a、後の文字3問を b とし、S = Σa − Σb。0 を使えないので ±1〜±3 で組む
  const combos = [];
  const vals = [3, 2, 1, -1, -2, -3];
  for (const a1 of vals) for (const a2 of vals) for (const a3 of vals) for (const b1 of vals) for (const b2 of vals) for (const b3 of vals) {
    if (a1 + a2 + a3 - (b1 + b2 + b3) === s) { combos.push([a1, a2, a3, b1, b2, b3]); break; }
  }
  const [a1, a2, a3, b1, b2, b3] = combos[0];
  const firsts = onAxis.filter(isFirst);
  const seconds = onAxis.filter((i) => !isFirst(i));
  [a1, a2, a3].forEach((v, k) => (answers[firsts[k].id] = v));
  [b1, b2, b3].forEach((v, k) => (answers[seconds[k].id] = v));
  return answers;
}

test("設問の並びは各軸で前の文字3問・後の文字3問", () => {
  for (const axis of AXES) {
    const onAxis = ITEMS.filter((i) => i.axis === axis);
    assert.equal(onAxis.filter(isFirst).length, 3);
    assert.equal(onAxis.filter((i) => !isFirst(i)).length, 3);
  }
});

test("T1：24問すべて「とてもあてはまる」なら全軸 S=0 で決定設問が4問", () => {
  const r = diagnose(ITEMS, answerAll(() => 3));
  assert.deepEqual(r.axes.map((a) => a.s), [0, 0, 0, 0]);
  assert.deepEqual(r.axes.map((a) => a.p), [50, 50, 50, 50]);
  assert.deepEqual(r.pendingTiebreakers, ["EI", "SN", "TF", "JP"]);
  assert.equal(r.type, null);
  const decided = diagnose(ITEMS, answerAll(() => 3), { EI: "I", SN: "N", TF: "F", JP: "P" });
  assert.equal(decided.type, "INFP");
  assert.equal(decided.scores, "50-50-50-50");
  assert.ok(decided.axes.every((a) => a.decidedByTiebreaker && a.close));
});

test("T2：前の文字に +3、後の文字に −3 なら ESTJ、p=100-100-100-100", () => {
  const r = diagnose(ITEMS, answerAll((item) => (isFirst(item) ? 3 : -3)));
  assert.equal(r.type, "ESTJ");
  assert.equal(r.scores, "100-100-100-100");
});

test("T3：T2 の逆なら INFP、p=0-0-0-0", () => {
  const r = diagnose(ITEMS, answerAll((item) => (isFirst(item) ? -3 : 3)));
  assert.equal(r.type, "INFP");
  assert.equal(r.scores, "0-0-0-0");
});

test("T4〜T6：境界値（S=+3 は 58 で僅差、+4 は 61 で通常、−3 は 42 で僅差、−4 は 39 で通常）", () => {
  const cases = [[3, 58, "E", true], [4, 61, "E", false], [-3, 42, "I", true], [-4, 39, "I", false], [1, 53, "E", true], [-1, 47, "I", true], [18, 100, "E", false], [-18, 0, "I", false]];
  for (const [s, p, letter, close] of cases) {
    const a = scoreAxis("EI", ITEMS, answersWithS("EI", s));
    assert.equal(a.s, s, `S=${s}`);
    assert.equal(a.p, p, `S=${s} の p`);
    assert.equal(a.letter, letter, `S=${s} の文字`);
    assert.equal(a.close, close, `S=${s} の僅差`);
  }
});

test("T7：決定設問の答えを取り消すと、未回答に戻り結果へ進めない", () => {
  const answers = answersWithS("JP", 0);
  const answered = diagnose(ITEMS, answers, { JP: "P" });
  assert.equal(answered.type, "ESTP");
  const undone = diagnose(ITEMS, answers, {});
  assert.equal(undone.type, null);
  assert.deepEqual(undone.pendingTiebreakers, ["JP"]);
});

test("仕様書 2-1 の計算例は ENTP で p=61-33-78-50", () => {
  const answers = {};
  const set = (axis, firsts, seconds) => {
    const onAxis = ITEMS.filter((i) => i.axis === axis);
    onAxis.filter(isFirst).forEach((item, k) => (answers[item.id] = firsts[k]));
    onAxis.filter((i) => !isFirst(i)).forEach((item, k) => (answers[item.id] = seconds[k]));
  };
  set("EI", [2, 1, -1], [1, -2, -1]);
  set("SN", [-1, 1, -2], [2, 1, 1]);
  set("TF", [3, 2, 1], [-3, -2, 1]);
  set("JP", [1, -1, 1], [1, -1, 1]);
  const r = diagnose(ITEMS, answers, { JP: "P" });
  assert.equal(r.type, "ENTP");
  assert.equal(r.scores, "61-33-78-50");
  assert.deepEqual(r.axes.filter((a) => a.close).map((a) => a.axis), ["JP"]);
});

test("T8〜T10：結果 URL の p の検証", () => {
  assert.deepEqual(parseScores("ENTP", "61-33-78-50"), [61, 33, 78, 50]); // T8
  assert.equal(parseScores("ENTP", "40-33-78-50"), null); // T9：E なのに p<50
  assert.equal(parseScores("ENTP", "abc"), null); // T10
  assert.equal(parseScores("ENTP", "101-0-0-0"), null); // T10
  assert.equal(parseScores("ENTP", null), null);
  assert.deepEqual(parseScores("ESTJ", "50-50-50-50"), [50, 50, 50, 50]); // p=50 はどちらの文字でもよい
  assert.equal(parseScores("XXXX", "61-33-78-50"), null);
  assert.equal(parseScores("ENTP", "61-33-78"), null);
});

test("相手診断：「わからない」は分母から除き、3問未満の軸は判定不能", () => {
  // E/I は2問だけ答えて判定不能、ほかは全問 E・S・T・J 寄り
  const answers = answerAll((item) => (isFirst(item) ? 3 : -3));
  const ei = ITEMS.filter((i) => i.axis === "EI");
  ei.slice(2).forEach((item) => (answers[item.id] = null));
  const r = diagnose(ITEMS, answers);
  assert.deepEqual(r.undeterminedAxes, ["EI"]);
  assert.equal(r.type, null);
  assert.deepEqual(candidateTypes(r.axes).sort(), ["ESTJ", "ISTJ"]);

  // 3問だけ答えた軸：p = round(50 + S×50÷(3n))。前の文字2問に+3、後の文字1問に+3 → S=3、n=3 → p=67
  const partial = answerAll((item) => (isFirst(item) ? 3 : -3));
  const sn = ITEMS.filter((i) => i.axis === "SN");
  const snFirst = sn.filter(isFirst);
  const snSecond = sn.filter((i) => !isFirst(i));
  partial[snFirst[0].id] = 3; partial[snFirst[1].id] = 3; partial[snFirst[2].id] = null;
  partial[snSecond[0].id] = 3; partial[snSecond[1].id] = null; partial[snSecond[2].id] = null;
  const a = scoreAxis("SN", ITEMS, partial);
  assert.equal(a.s, 3);
  assert.equal(a.p, 67);
  assert.equal(a.letter, "S");
});

test("相手診断：判定不能の軸数ごとの候補（0→1、1→2、2→4、3以上→なし）", () => {
  const axis = (ax, letter) => ({ axis: ax, letter, p: letter ? 70 : null });
  assert.deepEqual(candidateTypes([axis("EI", "I"), axis("SN", "N"), axis("TF", "T"), axis("JP", "J")]), ["INTJ"]);
  assert.equal(candidateTypes([axis("EI", null), axis("SN", "N"), axis("TF", "T"), axis("JP", "J")]).length, 2);
  assert.deepEqual(candidateTypes([axis("EI", null), axis("SN", "N"), axis("TF", null), axis("JP", "J")]).sort(), ["ENFJ", "ENTJ", "INFJ", "INTJ"]);
  assert.deepEqual(candidateTypes([axis("EI", null), axis("SN", null), axis("TF", null), axis("JP", "J")]), []);
});

test("相手診断：S=0 の決定設問で「わからない」を選ぶと判定不能", () => {
  const answers = answersWithS("TF", 0);
  const r = diagnose(ITEMS, answers, { TF: null });
  assert.deepEqual(r.undeterminedAxes, ["TF"]);
  assert.deepEqual(candidateTypes(r.axes).sort(), ["ESFJ", "ESTJ"]);
});
