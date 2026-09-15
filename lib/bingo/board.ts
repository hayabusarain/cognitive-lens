/**
 * ビンゴの盤面の判定（仕様書 docs/redesign-spec.md 2-5）
 *
 * 画面（app/[lang]/bingo/[type]/BingoBoard.tsx）とカード画像（app/[lang]/bingo/[type]/card/[mask]/route.tsx）で共用する純粋な関数。
 * 単体テストは board.test.mjs。Node.js の型除去（node --test）でも読めるよう、このファイルは他のファイルを import しない。
 *
 * 盤面は 5×5 の25マス。マスの番号（cell）は左上を 0 として行ごとに数え、中央の 12 が FREE。
 * 項目の番号（item）は FREE を除いた24マスを同じ順に数えた 0〜23 で、BINGO_DATA の並びと一致する。
 * 押した状態は24ビットの整数（mask）で持つ。項目 0（左上）を最上位ビットにし、6桁の16進数（小文字、ゼロ埋め）で URL に入れる。
 *   例：左上だけ押す → 800000、右下だけ押す → 000001、全部押す → ffffff
 */

export const BOARD_SIZE = 5;
export const CELL_COUNT = 25;
export const ITEM_COUNT = 24;
/** 中央の FREE のマス。常に押された状態 */
export const FREE_CELL = 12;
/** 24マスすべてを押した mask */
export const FULL_MASK = 0xffffff;

/** 揃ったかを数えるライン（横5・縦5・斜め2の12本）。値はマスの番号 */
export const BINGO_LINES: readonly (readonly number[])[] = [
  ...Array.from({ length: BOARD_SIZE }, (_, row) => Array.from({ length: BOARD_SIZE }, (_, col) => row * BOARD_SIZE + col)),
  ...Array.from({ length: BOARD_SIZE }, (_, col) => Array.from({ length: BOARD_SIZE }, (_, row) => row * BOARD_SIZE + col)),
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

/** 項目の番号 → マスの番号（FREE の位置を飛ばす） */
export function itemToCell(item: number): number {
  return item < FREE_CELL ? item : item + 1;
}

/** マスの番号 → 項目の番号。FREE は null */
export function cellToItem(cell: number): number | null {
  if (cell === FREE_CELL) return null;
  return cell < FREE_CELL ? cell : cell - 1;
}

const bitOf = (item: number) => 1 << (ITEM_COUNT - 1 - item);

/** その項目が押されているか */
export function isItemPressed(mask: number, item: number): boolean {
  return (mask & bitOf(item)) !== 0;
}

/** そのマスが押されているか。FREE は常に真 */
export function isCellPressed(mask: number, cell: number): boolean {
  const item = cellToItem(cell);
  return item === null || isItemPressed(mask, item);
}

/** 項目を押す・外す（押していれば外し、外していれば押す） */
export function toggleItem(mask: number, item: number): number {
  if (!Number.isInteger(item) || item < 0 || item >= ITEM_COUNT) return mask;
  return (mask ^ bitOf(item)) & FULL_MASK;
}

/** mask を URL 用の6桁の16進数（小文字、ゼロ埋め）にする */
export function formatMask(mask: number): string {
  return (mask & FULL_MASK).toString(16).padStart(6, "0");
}

/** URL の6桁の16進数を mask に戻す。形が違えば null（カード画像のルートは 404 にする） */
export function parseMask(value: string): number | null {
  return /^[0-9a-f]{6}$/.test(value) ? parseInt(value, 16) : null;
}

/** 揃ったライン（マスの番号の配列）を、BINGO_LINES の順で返す */
export function completedLines(mask: number): (readonly number[])[] {
  return BINGO_LINES.filter((line) => line.every((cell) => isCellPressed(mask, cell)));
}

/** 揃ったラインの本数（0〜12） */
export function countLines(mask: number): number {
  return completedLines(mask).length;
}

/** 揃ったラインに含まれるマスの番号 */
export function cellsInCompletedLines(mask: number): Set<number> {
  return new Set(completedLines(mask).flat());
}

/**
 * 称号の段階（BINGO_TITLES の添字）。しきい値は仕様書 2-5 の 0／1／2〜3／4〜5／6〜8／9〜11／12
 */
export function titleLevel(lines: number): number {
  if (lines <= 0) return 0;
  if (lines === 1) return 1;
  if (lines <= 3) return 2;
  if (lines <= 5) return 3;
  if (lines <= 8) return 4;
  if (lines <= 11) return 5;
  return 6;
}

/** 称号の文を型コードで埋める（例：「【見習いレベル】駆け出しの{type}」→「【見習いレベル】駆け出しのINTJ」） */
export function formatTitle(template: string, type: string): string {
  return template.replaceAll("{type}", type);
}

/** 称号を【】の札と本体に分ける（画面とカード画像で2段に組むため）。【】がなければ札は空 */
export function splitTitle(title: string): { tag: string; name: string } {
  const match = /^(【[^】]*】)(.*)$/.exec(title);
  return match ? { tag: match[1], name: match[2] } : { tag: "", name: title };
}
