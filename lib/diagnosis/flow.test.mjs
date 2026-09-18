// lib/diagnosis/flow.ts の単体テスト（仕様書 2-1・2-3 の進行。T1・T7、途中経過の復元、相手診断の判定不能 0・1・2・3以上）
import { test } from "node:test";
import assert from "node:assert/strict";
import { diagnose, candidateTypes } from "./score.ts";
import { INITIAL_FLOW, flowReducer, flowView, canGoBack, resultHref, serializeFlow, restoreFlow } from "./flow.ts";
import { ITEMS } from "./items.ts";
import { TARGET_ITEMS } from "../target/items.ts";

const SELF = { items: ITEMS, allowUnknown: false, diagnose, candidateTypes };
const TARGET = { items: TARGET_ITEMS, allowUnknown: true, diagnose, candidateTypes };
const POLES = { EI: ["E", "I"], SN: ["S", "N"], TF: ["T", "F"], JP: ["J", "P"] };
const isFirst = (item) => POLES[item.axis][0] === item.keyed;

/** 操作を順に当てる */
function run(config, actions, state = INITIAL_FLOW) {
  return actions.reduce((s, action) => flowReducer(s, action, config), state);
}
/** 全問を fn(item) の値で答える操作 */
const answerAll = (config, fn) => config.items.map((item) => ({ type: "answer", value: fn(item) }));
const choose = (value) => ({ type: "choose", value });
const back = { type: "back" };

/** 前の文字の設問に +3、後の文字の設問に −3（全軸 S=+18） */
const strongFirst = (item) => (isFirst(item) ? 3 : -3);

/** ある軸だけ S=0 にし、ほかの軸は S=+18 にする回答 */
const zeroOn = (axis) => (item) => (item.axis === axis ? 3 : strongFirst(item));

test("最初は1問目を出し、戻れない", () => {
  const view = flowView(INITIAL_FLOW, SELF);
  assert.equal(view.kind, "item");
  assert.equal(view.item.id, "q01");
  assert.deepEqual(view.progress, { phase: "items", current: 1, total: 24 });
  assert.equal(view.selected, undefined);
  assert.equal(canGoBack(INITIAL_FLOW), false);
  assert.equal(flowReducer(INITIAL_FLOW, back, SELF), INITIAL_FLOW);
});

test("設問は ITEMS の順に1問ずつ進む", () => {
  let state = INITIAL_FLOW;
  for (const [i, item] of ITEMS.entries()) {
    const view = flowView(state, SELF);
    assert.equal(view.kind, "item");
    assert.equal(view.item.id, item.id);
    assert.equal(view.progress.current, i + 1);
    state = flowReducer(state, { type: "answer", value: 2 }, SELF);
  }
});

test("全問必須：自己診断は「わからない」や尺度にない値を受け付けず、設問の画面で決定設問の答えも受け付けない", () => {
  for (const action of [{ type: "answer", value: null }, { type: "answer", value: 0 }, { type: "answer", value: 4 }, { type: "answer", value: "3" }, choose("E"), { type: "revise" }]) {
    assert.equal(flowReducer(INITIAL_FLOW, action, SELF), INITIAL_FLOW, JSON.stringify(action));
  }
});

test("T1：24問すべて「とてもあてはまる」なら決定設問が4問出て、答えると 50-50-50-50 で完了", () => {
  let state = run(SELF, answerAll(SELF, () => 3));
  const expected = [["EI", "I"], ["SN", "N"], ["TF", "F"], ["JP", "P"]];
  for (const [k, [axis, pick]] of expected.entries()) {
    const view = flowView(state, SELF);
    assert.equal(view.kind, "tiebreaker", `${k + 1}問目の決定設問`);
    assert.equal(view.axis, axis);
    assert.deepEqual(view.progress, { phase: "tiebreakers", current: k + 1, total: 4 });
    // 設問への回答や、その軸にない文字は受け付けない
    assert.equal(flowReducer(state, { type: "answer", value: 3 }, SELF), state);
    assert.equal(flowReducer(state, choose(axis === "EI" ? "S" : "E"), SELF), state);
    assert.equal(flowReducer(state, choose(null), SELF), state);
    state = flowReducer(state, choose(pick), SELF);
  }
  assert.deepEqual(flowView(state, SELF), { kind: "complete", type: "INFP", scores: "50-50-50-50" });
});

test("S が 0 の軸がなければ、決定設問を出さずに完了（T2）", () => {
  const state = run(SELF, answerAll(SELF, strongFirst));
  assert.deepEqual(flowView(state, SELF), { kind: "complete", type: "ESTJ", scores: "100-100-100-100" });
});

test("T7：決定設問に答えた後で戻ると未回答に戻り、答え直すまで結果へ進まない", () => {
  const answered = run(SELF, [...answerAll(SELF, zeroOn("JP")), choose("P")]);
  assert.deepEqual(flowView(answered, SELF), { kind: "complete", type: "ESTP", scores: "100-100-100-50" });

  const undone = flowReducer(answered, back, SELF);
  const view = flowView(undone, SELF);
  assert.equal(view.kind, "tiebreaker");
  assert.equal(view.axis, "JP");
  assert.equal(view.selected, "P", "取り消した答えに印だけ付ける");
  assert.equal(diagnose(ITEMS, Object.fromEntries(undone.steps.filter((s) => s.kind === "item").map((s) => [s.id, s.value])), {}).type, null);

  const redone = flowReducer(undone, choose("J"), SELF);
  assert.deepEqual(flowView(redone, SELF), { kind: "complete", type: "ESTJ", scores: "100-100-100-50" });
});

test("T7：4問の決定設問の途中で戻ると、直前の決定設問だけが未回答になる", () => {
  const state = run(SELF, [...answerAll(SELF, () => 3), choose("E"), choose("S"), back]);
  const view = flowView(state, SELF);
  assert.equal(view.kind, "tiebreaker");
  assert.equal(view.axis, "SN");
  assert.deepEqual(view.progress, { phase: "tiebreakers", current: 2, total: 4 });
  // さらに戻ると最初の決定設問、もう一度戻ると24問目
  const twice = flowReducer(state, back, SELF);
  assert.equal(flowView(twice, SELF).axis, "EI");
  const thrice = flowReducer(twice, back, SELF);
  const itemView = flowView(thrice, SELF);
  assert.equal(itemView.kind, "item");
  assert.equal(itemView.item.id, "q24");
  assert.equal(itemView.selected, 3);
});

test("戻ったあとに設問を答え直すと、決定設問の要否も答え直した内容で決まる", () => {
  // JP の最後の設問（q24）を変えて S≠0 にすると、決定設問を出さずに完了する
  const state = run(SELF, [...answerAll(SELF, zeroOn("JP")), back, { type: "answer", value: -3 }]);
  const view = flowView(state, SELF);
  assert.equal(view.kind, "complete");
  assert.equal(view.type, "ESTJ");
});

test("途中経過：直列化して復元すると、同じ画面から続けられる", () => {
  const cases = [
    run(SELF, answerAll(SELF, () => 2).slice(0, 10)),
    run(SELF, [...answerAll(SELF, () => 3), choose("E")]),
    run(SELF, [...answerAll(SELF, () => 3), choose("E"), back]),
  ];
  for (const state of cases) {
    const raw = serializeFlow(state);
    const restored = restoreFlow(raw, SELF);
    assert.deepEqual(restored, state);
    assert.deepEqual(flowView(restored, SELF), flowView(state, SELF));
  }
  // 復元した状態から最後まで答えられる
  const restored = restoreFlow(serializeFlow(cases[1]), SELF);
  const done = run(SELF, [choose("N"), choose("T"), choose("J")], restored);
  assert.deepEqual(flowView(done, SELF), { kind: "complete", type: "ENTJ", scores: "50-50-50-50" });
});

test("途中経過：画面の進行で作れない値は捨てる", () => {
  const ok = JSON.parse(serializeFlow(run(SELF, answerAll(SELF, () => 2).slice(0, 3))));
  const variants = {
    空: null,
    "JSON でない": "{",
    版が違う: JSON.stringify({ ...ok, v: 2 }),
    "steps が配列でない": JSON.stringify({ ...ok, steps: {} }),
    知らない設問: JSON.stringify({ ...ok, steps: [["q99", 2]] }),
    順番が飛んでいる: JSON.stringify({ ...ok, steps: [["q01", 2], ["q03", 2]] }),
    尺度にない値: JSON.stringify({ ...ok, steps: [["q01", 0]] }),
    自己診断のわからない: JSON.stringify({ ...ok, steps: [["q01", null]] }),
    全問前の決定設問: JSON.stringify({ ...ok, steps: [["q01", 3], ["tb:EI", "E"]] }),
    要らない決定設問: serializeFlow(run(SELF, answerAll(SELF, strongFirst).slice(0, 23))).replace("]]", `],["q24",-3],["tb:EI","E"]]`),
    軸にない文字: serializeFlow(run(SELF, answerAll(SELF, () => 3))).replace("]]", `],["tb:EI","S"]]`),
    完了した状態: JSON.stringify({ v: 1, steps: ITEMS.map((item) => [item.id, strongFirst(item)]), revise: null, undone: null }),
    設問より多い: JSON.stringify({ v: 1, steps: [...ITEMS.map((item) => [item.id, 2]), ["q24", 2]], revise: null, undone: null }),
  };
  for (const [name, raw] of Object.entries(variants)) {
    assert.equal(restoreFlow(raw, SELF), null, name);
  }
  // 別の設問セット（相手診断）の途中経過は読まない
  assert.equal(restoreFlow(JSON.stringify(ok), TARGET), null);
});

test("結果ページの URL", () => {
  assert.equal(resultHref("ENTP", "61-33-78-50", "self"), "/ja/result/ENTP?p=61-33-78-50");
  assert.equal(resultHref("ENTP", "61-33-78-50", "target"), "/ja/result/ENTP?p=61-33-78-50&from=target");
  assert.equal(resultHref("ENTP", null, "target"), "/ja/result/ENTP?from=target");
});

// ── 相手診断 ──────────────────────────────────────────

/** axes の軸で、設問を4問「わからない」にする（回答数2で判定不能）。ほかは S=+18 */
const unknownOn = (...axes) => {
  const counts = {};
  return (item) => {
    if (!axes.includes(item.axis)) return strongFirst(item);
    counts[item.axis] = (counts[item.axis] ?? 0) + 1;
    return counts[item.axis] <= 4 ? null : strongFirst(item);
  };
};

test("相手診断：判定不能 0 なら完了し、p 付きの URL へ進める", () => {
  // 各軸2問ずつ「わからない」でも回答数4なら判定できる。p = round(50 + S×50÷(3n))
  const counts = {};
  const state = run(TARGET, answerAll(TARGET, (item) => {
    counts[item.axis] = (counts[item.axis] ?? 0) + 1;
    return counts[item.axis] <= 2 ? null : strongFirst(item);
  }));
  const view = flowView(state, TARGET);
  assert.deepEqual(view, { kind: "complete", type: "ESTJ", scores: "100-100-100-100" });
  assert.equal(resultHref(view.type, view.scores, "target"), "/ja/result/ESTJ?p=100-100-100-100&from=target");
});

test("相手診断：「わからない」を選べ、戻ると印が残る", () => {
  const state = run(TARGET, [{ type: "answer", value: null }, back]);
  const view = flowView(state, TARGET);
  assert.equal(view.item.id, "t01");
  assert.equal(view.selected, null);
});

test("相手診断：判定不能 1 なら候補2つ", () => {
  const view = flowView(run(TARGET, answerAll(TARGET, unknownOn("EI"))), TARGET);
  assert.equal(view.kind, "candidates");
  assert.deepEqual(view.types, ["ESTJ", "ISTJ"]);
  assert.deepEqual(view.undeterminedAxes, ["EI"]);
  assert.equal(view.unknownCount, 4);
  assert.equal(resultHref(view.types[1], null, "target"), "/ja/result/ISTJ?from=target");
});

test("相手診断：判定不能 2 なら候補4つ", () => {
  const view = flowView(run(TARGET, answerAll(TARGET, unknownOn("SN", "JP"))), TARGET);
  assert.equal(view.kind, "candidates");
  assert.deepEqual(view.types, ["ESTJ", "ESTP", "ENTJ", "ENTP"]);
  assert.equal(view.unknownCount, 8);
});

test("相手診断：判定不能 3以上なら候補を出さずに答え直しを促す", () => {
  for (const axes of [["EI", "SN", "TF"], ["EI", "SN", "TF", "JP"]]) {
    const view = flowView(run(TARGET, answerAll(TARGET, unknownOn(...axes))), TARGET);
    assert.equal(view.kind, "retry", axes.join(","));
    assert.deepEqual(view.undeterminedAxes, axes);
    assert.equal(view.unknownCount, axes.length * 4);
  }
});

test("相手診断：決定設問は「わからない」を選べ、選ぶとその軸は判定不能", () => {
  const state = run(TARGET, answerAll(TARGET, zeroOn("TF")));
  assert.equal(flowView(state, TARGET).kind, "tiebreaker");
  const view = flowView(flowReducer(state, choose(null), TARGET), TARGET);
  assert.equal(view.kind, "candidates");
  assert.deepEqual(view.types, ["ESTJ", "ESFJ"]);
  assert.equal(view.unknownCount, 1);
});

test("相手診断：答え直しは「わからない」と答えた設問を順に出し、答え終えると判定し直す", () => {
  const start = run(TARGET, answerAll(TARGET, unknownOn("EI", "SN", "TF")));
  let state = flowReducer(start, { type: "revise" }, TARGET);
  const ids = [];
  for (let k = 0; k < 12; k++) {
    const view = flowView(state, TARGET);
    assert.equal(view.kind, "item");
    assert.equal(view.selected, null, "前の答え（わからない）に印");
    assert.deepEqual(view.progress, { phase: "revise", current: k + 1, total: 12 });
    ids.push(view.item.id);
    // EI の4問だけ答え、ほかはもう一度「わからない」
    state = flowReducer(state, { type: "answer", value: view.item.axis === "EI" ? strongFirst(view.item) : null }, TARGET);
  }
  assert.deepEqual(ids, TARGET_ITEMS.filter((item) => ["EI", "SN", "TF"].includes(item.axis)).filter((item, i, list) => list.filter((x) => x.axis === item.axis).indexOf(item) < 4).map((item) => item.id));
  const view = flowView(state, TARGET);
  assert.equal(view.kind, "candidates", "判定不能が2軸に減って候補4つ");
  assert.deepEqual(view.undeterminedAxes, ["SN", "TF"]);
  assert.equal(state.revise, null);
});

test("相手診断：答え直しの途中で戻ると1つ前の設問、最初で戻ると案内の画面に戻る", () => {
  const start = run(TARGET, answerAll(TARGET, unknownOn("EI", "SN", "TF")));
  const first = flowReducer(start, { type: "revise" }, TARGET);
  const second = flowReducer(first, { type: "answer", value: 2 }, TARGET);
  assert.equal(flowView(second, TARGET).progress.current, 2);
  const backOnce = flowReducer(second, back, TARGET);
  const view = flowView(backOnce, TARGET);
  assert.equal(view.progress.current, 1);
  assert.equal(view.selected, 2, "答え直した値は残る");
  // t01 に答えたので E/I は判定でき、判定不能が2軸に減って候補の画面になる
  const backTwice = flowReducer(backOnce, back, TARGET);
  assert.equal(backTwice.revise, null);
  assert.equal(flowView(backTwice, TARGET).kind, "candidates");
  assert.equal(canGoBack(backTwice), true);
  // 何も変えずに最初で戻れば、案内の画面のまま
  assert.equal(flowView(flowReducer(first, back, TARGET), TARGET).kind, "retry");
});

test("相手診断：答え直しで S=0 になった軸は決定設問を出し、S≠0 になった軸の決定設問は外す", () => {
  // TF は S=0 で決定設問「わからない」、EI は判定不能
  const eiUnknown = unknownOn("EI");
  const base = run(TARGET, [...answerAll(TARGET, (item) => (item.axis === "TF" ? 3 : eiUnknown(item))), choose(null)]);
  assert.equal(flowView(base, TARGET).kind, "candidates");
  let state = flowReducer(base, { type: "revise" }, TARGET);
  // 答え直しは EI の4問、そのあと TF の決定設問。EI は t17（+3）と t21（+3）に合わせて S=0 になるように答える
  const revised = { t01: -3, t05: 3, t09: 3, t13: 3 };
  const order = [];
  for (let guard = 0; guard < 30; guard++) {
    const view = flowView(state, TARGET);
    if (view.progress?.phase !== "revise") break;
    order.push(view.kind === "item" ? view.item.id : `tb:${view.axis}`);
    state = flowReducer(state, view.kind === "item" ? { type: "answer", value: revised[view.item.id] } : choose("F"), TARGET);
  }
  assert.deepEqual(order, ["t01", "t05", "t09", "t13", "tb:TF"]);
  // EI は S=0 になったので、決定設問が出る
  const view = flowView(state, TARGET);
  assert.equal(view.kind, "tiebreaker");
  assert.equal(view.axis, "EI");
  state = flowReducer(state, choose("I"), TARGET);
  assert.deepEqual(flowView(state, TARGET), { kind: "complete", type: "ISFJ", scores: "50-100-50-100" });

  // TF の設問を答え直して S≠0 にすると、TF の決定設問は回答から外れる
  const pruned = run(TARGET, [{ type: "revise" }], base);
  const withoutTf = flowReducer({ ...pruned, revise: { keys: ["t03"], index: 0 } }, { type: "answer", value: -3 }, TARGET);
  assert.equal(withoutTf.steps.some((s) => s.kind === "tiebreaker"), false);
});

test("相手診断：答え直しの途中経過も復元できる", () => {
  const start = run(TARGET, answerAll(TARGET, unknownOn("EI", "SN", "TF")));
  const state = run(TARGET, [{ type: "revise" }, { type: "answer", value: 1 }], start);
  const restored = restoreFlow(serializeFlow(state), TARGET);
  assert.deepEqual(restored, state);
  assert.deepEqual(flowView(restored, TARGET), flowView(state, TARGET));
  // 判定不能の案内の画面も復元できる
  assert.deepEqual(restoreFlow(serializeFlow(start), TARGET), start);
  // 答え直しの位置が範囲外なら捨てる
  const broken = JSON.parse(serializeFlow(state));
  broken.revise.index = 99;
  assert.equal(restoreFlow(JSON.stringify(broken), TARGET), null);
});

test("やり直すと最初の設問に戻る", () => {
  const state = run(TARGET, [...answerAll(TARGET, unknownOn("EI")), { type: "reset" }]);
  assert.deepEqual(state, INITIAL_FLOW);
});
