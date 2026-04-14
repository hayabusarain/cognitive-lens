/**
 * 信頼性の高いクライアントIPを抽出するユーティリティ
 *
 * 取得優先順位:
 *   1. cf-connecting-ip  — Cloudflare が付与する検証済みヘッダ（偽造不可）
 *   2. x-real-ip         — Nginx / Vercel 等のリバースプロキシが付与するヘッダ
 *   3. x-forwarded-for の最後の要素
 *      — 信頼できるプロキシ（Vercel等）が末尾に実IPを付記する形式に準拠。
 *        クライアントが先頭に偽造IPを注入しても、プロキシ付与分は末尾に残る。
 *   4. fallback: "unknown"
 *
 * ⚠️ x-forwarded-for の先頭要素（split(",")[0]）は取得しない。
 *    クライアントが任意の偽造IPを先頭に追加できるため信頼性がない。
 */
export function getClientIp(
  headers: Headers | { get(name: string): string | null }
): string {
  // 1. Cloudflare Connecting-IP（偽造不可）
  const cf = headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;

  // 2. X-Real-IP（リバースプロキシが設定する実IP）
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  // 3. X-Forwarded-For の末尾要素（プロキシが最後に付記した実IP）
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return last;
  }

  return "unknown";
}
