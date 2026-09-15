/**
 * Next.js 16 Proxy（旧 Middleware）
 *
 * Next.js 16 では middleware.ts は非推奨となり、proxy.ts に改名された。
 * エクスポート関数名も `middleware` → `proxy` に変更。
 *
 * 役割:
 *   1. IPレートリミット（/api/* 宛て: 1分間に10リクエスト上限）
 *   2. Bot User-Agent の遮断（/api/* 宛て）
 *
 * ※ proxy はEdgeランタイムで動作するため Node.js 固有APIは使用不可。
 *    インメモリ状態はサーバーレスインスタンス間で共有されないが、
 *    単一インスタンスへの集中攻撃には有効。
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClientIp } from "@/lib/get-client-ip";

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

// ── Proxy 本体 ────────────────────────────────────────────────
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // API ルート以外はスルー
  if (!pathname.startsWith("/api/")) {
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

  // ② IPレートリミット（偽造対策: cf-connecting-ip → x-real-ip → xff末尾 の優先順位）
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
export const config = {
  matcher: ["/api/:path*"],
};
