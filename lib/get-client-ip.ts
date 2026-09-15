/**
 * 信頼性の高いクライアントIPを抽出するユーティリティ
 *
 * 原則：Vercel が上書きするヘッダーだけを信用する。
 *
 * 取得優先順位:
 *   1. x-real-ip         — Vercel が実IPで上書きするヘッダ
 *   2. x-forwarded-for の最後の要素
 *      — Vercel が上書きする。念のため、クライアントが先頭に注入した値は読まない。
 *   3. fallback: "unknown"
 *
 * ⚠️ cf-connecting-ip は読まない。このサイトは Cloudflare を通っておらず、
 *    クライアントが付けた値がそのまま届くため、偽ればレートリミットを回避できた
 *    （2026-09-15 に公開サイトで確認）。
 * ⚠️ x-forwarded-for の先頭要素（split(",")[0]）は取得しない。
 */
export function getClientIp(
  headers: Headers | { get(name: string): string | null }
): string {
  // 1. X-Real-IP（Vercel が設定する実IP）
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  // 2. X-Forwarded-For の末尾要素
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  }

  return "unknown";
}
