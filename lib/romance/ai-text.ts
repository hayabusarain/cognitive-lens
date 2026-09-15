/**
 * 脈あり度チェックの AI 文を、画面で扱う形に読み替える（仕様書 2-4、ステップ 3-17）
 *
 * API（app/api/romance-ai/route.ts）の応答は、成功なら { feelings, nextAction, caution }、
 * 失敗なら 400（「はい」が0件など）・403・429・500・503 と { error }。
 * 取得に失敗しても、画面は脈あり度と段階の説明を出したまま、AI 文の欄だけを差し替える。
 *
 * Node.js の型除去（node --test）でそのまま読めるよう、このファイルは他のファイルを import しない。
 */

export interface RomanceAiText {
  /** 相手が抱いていそうな気持ち */
  feelings: string | null;
  /** 次にできること */
  nextAction: string | null;
  /** 今は避けたいこと */
  caution: string | null;
}

export type RomanceAiResult =
  | { kind: "ok"; text: RomanceAiText }
  /** rate_limit …… 回数の上限（429）。すぐに再読み込みしても通らない
   *  failed …… ネットワークの失敗、サーバーの失敗、中身のない応答。もう一度読み込めば通ることがある */
  | { kind: "error"; reason: "rate_limit" | "failed" };

/** API が文を作れなかった欄に入れる固定文（route.ts の FALLBACK と同じ） */
export const AI_FALLBACK_TEXT = "分析できませんでした。";

function readField(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text && text !== AI_FALLBACK_TEXT ? text : null;
}

/**
 * fetch の結果を読み替える。
 *   status …… HTTP のステータス。ネットワークの失敗（fetch が例外を投げた）なら null
 *   body ……… 応答の JSON。読めなかったら null
 */
export function readRomanceAiResponse(status: number | null, body: unknown): RomanceAiResult {
  if (status === 429) return { kind: "error", reason: "rate_limit" };
  if (status === null || status < 200 || status >= 300 || typeof body !== "object" || body === null) {
    return { kind: "error", reason: "failed" };
  }
  const record = body as Record<string, unknown>;
  const text: RomanceAiText = {
    feelings: readField(record.feelings),
    nextAction: readField(record.nextAction),
    caution: readField(record.caution),
  };
  // 3つとも空なら、表示できる文がないので失敗として扱う
  if (!text.feelings && !text.nextAction && !text.caution) return { kind: "error", reason: "failed" };
  return { kind: "ok", text };
}

/** AI 文を取りに行くか。「はい」が0件だと API は 400 を返すので、呼ばない */
export function shouldRequestAiText(answers: readonly boolean[]): boolean {
  return answers.some(Boolean);
}

/**
 * X に投稿する文面。相手を特定できる情報（タイプ・呼称・設問の中身）は入れず、脈あり度の数字だけを入れる。
 * {url} の位置に ShareOnX が URL を入れる
 */
export function romanceShareText(score: number, questionCount: number): string {
  return `気になる人の脈あり度をチェックしたら、${score}%でした。相手のタイプ別に、行動${questionCount}問で確かめられます。\n{url}`;
}
