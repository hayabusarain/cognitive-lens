/**
 * Next.js 16 Proxy（旧 Middleware）
 *
 * Next.js 16 では middleware.ts は非推奨となり、proxy.ts に改名された。
 * エクスポート関数名も `middleware` → `proxy` に変更。
 *
 * 役割:
 *   0. 旧 URL の 301 転送（全ページ宛て。判定は lib/redirects.ts）
 *   1. Bot User-Agent の遮断（/api/romance-ai 宛てだけ）
 *   2. IPレートリミット（/api/romance-ai 宛てだけ: 1分間に10リクエスト上限）
 *   ページと画像（OG 画像など）は対象にしない。X や Discord などのクローラーが取得できるようにするため（仕様書 3-6）。
 *   旧 API の /api/og と /api/story-card は、⓪ の転送（R8・R9）で画像のルートへ送る。
 *
 * ※ proxy は Node.js ランタイムで動作する（Next.js 16 の既定）。
 *    インメモリ状態はサーバーレスインスタンス間で共有されないが、
 *    単一インスタンスへの集中攻撃には有効。
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClientIp } from "@/lib/get-client-ip";
import { resolveRedirect } from "@/lib/redirects";

// ── レートリミット設定 ──────────────────────────────────────────
const WINDOW_MS = 60 * 1000; // 1分
const MAX_REQUESTS = 10;     // 上限リクエスト数

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// globalThis でサーバーインスタンスごとのインメモリ状態を保持
const g = globalThis as typeof globalThis & {
  _rlMap?: Map<string, RateLimitEntry>;
};

function getRlMap(): Map<string, RateLimitEntry> {
  if (!g._rlMap) g._rlMap = new Map();
  return g._rlMap;
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const map = getRlMap();
  const now = Date.now();
  const entry = map.get(ip);

  // エントリがないか、ウィンドウが切れていれば新規カウント
  if (!entry || now > entry.resetAt) {
    map.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // 定期的にキャッシュを清掃（10,000エントリを超えたとき）
  if (map.size > 10_000) {
    for (const [key, val] of map) {
      if (now > val.resetAt) map.delete(key);
    }
  }

  return { allowed: true, retryAfter: 0 };
}

// ── Bot User-Agent パターン ────────────────────────────────────
const BOT_PATTERNS: RegExp[] = [
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
  /(?<!bot)bot(?!tle)/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
];

function isBot(ua: string | null): boolean {
  if (!ua || ua.trim().length === 0) return true;
  return BOT_PATTERNS.some((p) => p.test(ua));
}

// ── Bot 判定とレートリミットをかける API（AI 文を生成する1本だけ） ──
const GUARDED_API = "/api/romance-ai";

// ── Proxy 本体 ────────────────────────────────────────────────
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // ⓪ 旧 URL の 301 転送（仕様書 docs/redesign-spec.md 1-3）
  // www なしの判定（R10）のため、ホスト名は要求の Host ヘッダーから取る。
  // request.nextUrl はローカルの next start で Host ヘッダーを反映しなかった（2026-09-15 確認）
  const current = new URL(request.nextUrl.href);
  const host = request.headers.get("host");
  if (host) {
    // host に値だけを入れると元のポートが残るので、ホスト名とポートを別々に設定する。
    // 壊れた Host ヘッダー（"[[[" や "a b c"、範囲外のポートなど）では URL が例外を投げて
    // 全ページが 500 になるため、読めなければ Host を使わず nextUrl のホストのまま進める
    try {
      const parsed = new URL(`http://${host}`);
      current.hostname = parsed.hostname;
      current.port = parsed.port;
    } catch {
      // Host が読めないときは、転送の判定を nextUrl のホストで行う
    }
  }
  const redirectTo = resolveRedirect(current);
  if (redirectTo) {
    return NextResponse.redirect(redirectTo, 301);
  }

  // AI 文の API 以外はスルー
  if (pathname !== GUARDED_API) {
    return NextResponse.next();
  }

  const ua = request.headers.get("user-agent");

  // ① Bot遮断
  if (isBot(ua)) {
    return new NextResponse(
      JSON.stringify({
        error: "Forbidden",
        message: "Automated access is not permitted.",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }

  // ② IPレートリミット（IP は Vercel が上書きする x-real-ip → xff 末尾の順で取る）
  const ip = getClientIp(request.headers);

  const { allowed, retryAfter } = checkRateLimit(ip);

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message:
          "アクセスが集中しています。しばらく経ってから再度お試しください。",
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(MAX_REQUESTS),
          "X-RateLimit-Window": "60",
        },
      }
    );
  }

  // ③ 通過：レートリミット残数をヘッダーに付与
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));
  return response;
}

// Proxy を適用するパスのマッチャー
// 転送の判定のため全ページに適用し、Next.js の静的ファイルと拡張子付きのファイルは除く
export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
