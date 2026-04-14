/**
 * Bot・自動化ツール判定ユーティリティ
 * proxy.ts と各APIルートで共有する
 */

/** ブロック対象のUser-Agentパターン */
const BOT_UA_PATTERNS: RegExp[] = [
  /curl\//i,
  /python-requests\//i,
  /PostmanRuntime\//i,
  /wget\//i,
  /^java\//i,
  /go-http-client\//i,
  /axios\//i,
  /node-fetch\//i,
  /undici\//i,
  /httpx\//i,
  /libcurl\//i,
  /okhttp\//i,
  /RestSharp\//i,
  /bot(?!tle)/i,      // "bottle"は除外
  /crawler/i,
  /spider/i,
  /scraper/i,
];

/**
 * User-Agent 文字列がBotかどうかを判定する
 * - null / 空文字列 → Bot とみなす
 * - 既知の自動化ツールパターンにマッチ → Bot
 */
export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua || ua.trim().length === 0) return true;
  return BOT_UA_PATTERNS.some((pattern) => pattern.test(ua));
}

/** Bot判定時に返すレスポンスボディ */
export const BOT_FORBIDDEN_RESPONSE = JSON.stringify({
  error: "Forbidden",
  message: "Automated access is not permitted.",
});
