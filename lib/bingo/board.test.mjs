// lib/bingo/board.ts の単体テスト（仕様書 docs/redesign-spec.md 2-5）
// 実行：npm test（Node.js 23.6 以降の型除去で .ts を読む）
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BINGO_LINES,
  FREE_CELL,
  FULL_MASK,
  cellToItem,
  cellsInCompletedLines,
  countLines,
  formatMask,
  formatTitle,
  isCellPressed,
  isItemPressed,
  itemToCell,
  parseMask,
  splitTitle,
  titleLevel,
  toggleItem,
} from "./board.ts";

// lib/bingo-data-ja.ts の BINGO_TITLES と同じ文（テストは値を import しないので複製する）
const TITLES = [
  "【自称疑惑】エセ{type}",
  "【見習いレベル】駆け出しの{type}",
  "【標準装備】よくいる{type}",
  "【本格派】筋金入りの{type}",
  "【純度100%】生粋の{type}",
  "【無意識レベル】息をするように{type}",
  "【殿堂入り】歩く{type}辞典",
];

/** マスの番号の並びを順に押した mask（FREE は飛ばす） */
const pressCells = (cells) => cells.reduce((mask, cell) => (cell === FREE_CELL ? mask : toggleItem(mask, cellToItem(cell))), 0);
/** 行（0〜4）をまとめて押した mask */
const pressRows = (rows) => pressCells(rows.flatMap((r) => [0, 1, 2, 3, 4].map((c) => r * 5 + c)));

test("ラインは横5・縦5・斜め2の12本で、どれも5マス", () => {
  assert.equal(BINGO_LINES.length, 12);
  for (const line of BINGO_LINES) assert.equal(new Set(line).size, 5);
  assert.deepEqual(BINGO_LINES[0], [0, 1, 2, 3, 4]);
  assert.deepEqual(BINGO_LINES[5], [0, 5, 10, 15, 20]);
  assert.deepEqual(BINGO_LINES[10], [0, 6, 12, 18, 24]);
  assert.deepEqual(BINGO_LINES[11], [4, 8, 12, 16, 20]);
});

test("項目とマスの番号は FREE を飛ばして対応する", () => {
  assert.equal(itemToCell(0), 0);
  assert.equal(itemToCell(11), 11);
  assert.equal(itemToCell(12), 13);
  assert.equal(itemToCell(23), 24);
  assert.equal(cellToItem(FREE_CELL), null);
  for (let item = 0; item < 24; item++) assert.equal(cellToItem(itemToCell(item)), item);
});

test("mask は左上を最上位ビットにした6桁の小文字16進数", () => {
  assert.equal(formatMask(0), "000000");
  assert.equal(formatMask(toggleItem(0, 0)), "800000");
  assert.equal(formatMask(toggleItem(0, 23)), "000001");
  assert.equal(formatMask(toggleItem(0, 12)), "000800"); // FREE の右隣
  assert.equal(formatMask(FULL_MASK), "ffffff");
  for (const value of ["000000", "0a1b2c", "800001", "ffffff"]) assert.equal(formatMask(parseMask(value)), value);
});

test("形の違う mask は null", () => {
  for (const value of ["zzzzzz", "1234567", "12345", "FFFFFF", "00000g", "", " 12345", "12345\n"]) {
    assert.equal(parseMask(value), null, JSON.stringify(value));
  }
});

test("押す・外す", () => {
  let mask = 0;
  mask = toggleItem(mask, 5);
  assert.equal(isItemPressed(mask, 5), true);
  assert.equal(isCellPressed(mask, itemToCell(5)), true);
  mask = toggleItem(mask, 7);
  assert.equal(formatMask(mask), "050000");
  mask = toggleItem(mask, 5);
  assert.equal(isItemPressed(mask, 5), false);
  assert.equal(isItemPressed(mask, 7), true);
  mask = toggleItem(mask, 7);
  assert.equal(mask, 0);
  // 範囲外の項目は変えない
  assert.equal(toggleItem(0, 24), 0);
  assert.equal(toggleItem(0, -1), 0);
  // FREE は何も押していなくても押された状態
  assert.equal(isCellPressed(0, FREE_CELL), true);
});

test("ラインの数", () => {
  assert.equal(countLines(0), 0);
  // 1行目だけ
  assert.equal(countLines(pressRows([0])), 1);
  // 真ん中の行は FREE を含むので4マスで揃う
  assert.equal(countLines(pressCells([10, 11, 13, 14])), 1);
  // 斜めも4マスで揃う
  assert.equal(countLines(pressCells([0, 6, 18, 24])), 1);
  // 4マスのうち1つを外すと揃わない
  assert.equal(countLines(toggleItem(pressCells([0, 6, 18, 24]), cellToItem(24))), 0);
  assert.equal(countLines(pressRows([0, 1])), 2);
  assert.equal(countLines(pressRows([0, 1, 3])), 3);
  // 1・2・4・5行目：4行と、FREE を含む縦の3列目、斜め2本で7本
  assert.equal(countLines(pressRows([0, 1, 3, 4])), 7);
  // 全部押すと12本
  assert.equal(countLines(FULL_MASK), 12);
  assert.equal(cellsInCompletedLines(FULL_MASK).size, 25);
  // 1マスだけ外すと、そのマスを通るラインが消える（角は横・縦・斜めの3本、角以外の外周は2本）
  assert.equal(countLines(toggleItem(FULL_MASK, 0)), 9);
  assert.equal(countLines(toggleItem(FULL_MASK, 1)), 10);
});

test("揃ったラインのマス", () => {
  const cells = cellsInCompletedLines(pressCells([0, 6, 18, 24, 3]));
  assert.deepEqual([...cells].sort((a, b) => a - b), [0, 6, 12, 18, 24]);
});

test("称号の段階は 0／1／2〜3／4〜5／6〜8／9〜11／12", () => {
  const expected = [0, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6];
  for (let lines = 0; lines <= 12; lines++) assert.equal(titleLevel(lines), expected[lines], `${lines}本`);
  assert.equal(formatTitle(TITLES[titleLevel(countLines(0))], "INTJ"), "【自称疑惑】エセINTJ");
  assert.equal(formatTitle(TITLES[titleLevel(countLines(pressRows([0])))], "INTJ"), "【見習いレベル】駆け出しのINTJ");
  assert.equal(formatTitle(TITLES[titleLevel(countLines(pressRows([0, 1, 3, 4])))], "ENFP"), "【純度100%】生粋のENFP");
  assert.equal(formatTitle(TITLES[titleLevel(countLines(FULL_MASK))], "ISTP"), "【殿堂入り】歩くISTP辞典");
});

test("称号を札と本体に分ける", () => {
  assert.deepEqual(splitTitle("【見習いレベル】駆け出しのINTJ"), { tag: "【見習いレベル】", name: "駆け出しのINTJ" });
  assert.deepEqual(splitTitle("歩くINTJ辞典"), { tag: "", name: "歩くINTJ辞典" });
});
