/**
 * API レスポンスのサーバーサイド・インメモリキャッシュ
 *
 * - profile API（ストリーミング）: type + answers をキーに生成済み全文をキャッシュ
 * - translate API: sanitized message + types をキーにJSONレスポンスをキャッシュ
 *
 * TTL: 1時間（3600秒）
 * 上限: 500エントリ（超えたら最古のものをLRU的に削除）
 *
 * キー生成: 入力全体の SHA-256 ハッシュを使用
 * - 先頭80文字切り捨てによる衝突リスクを解消
 * - 異なるユーザー入力が同一キャッシュを参照する問題を防止
 */

import { createHash } from "crypto";

const TTL_MS = 60 * 60 * 1000; // 1時間
const MAX_ENTRIES = 500;

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class TtlCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() >= entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    // 上限を超えたら最古エントリを削除
    if (this.store.size >= MAX_ENTRIES) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, { value, expiresAt: Date.now() + TTL_MS });
  }

  /** 期限切れエントリを一括削除（定期清掃用） */
  purgeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now >= entry.expiresAt) this.store.delete(key);
    }
  }

  get size(): number {
    return this.store.size;
  }
}

// ── globalThis を使ってサーバーインスタンス間でキャッシュを共有 ──
// （開発時のホットリロードでも意図せず再生成されないよう保護）
const g = globalThis as typeof globalThis & {
  _profileCache?: TtlCache<string>;
  _translateCache?: TtlCache<string>;
  _resultCache?: TtlCache<string>;
  _deathgameCache?: TtlCache<string>;
  _cacheCleanupTimer?: ReturnType<typeof setInterval>;
};

function getProfileCache(): TtlCache<string> {
  if (!g._profileCache) g._profileCache = new TtlCache<string>();
  return g._profileCache;
}

function getTranslateCache(): TtlCache<string> {
  if (!g._translateCache) g._translateCache = new TtlCache<string>();
  return g._translateCache;
}

function getResultCache(): TtlCache<string> {
  if (!g._resultCache) g._resultCache = new TtlCache<string>();
  return g._resultCache;
}

function getDeathgameCache(): TtlCache<string> {
  if (!g._deathgameCache) g._deathgameCache = new TtlCache<string>();
  return g._deathgameCache;
}

// 10分ごとに期限切れエントリを清掃
if (!g._cacheCleanupTimer && typeof setInterval !== "undefined") {
  g._cacheCleanupTimer = setInterval(() => {
    g._profileCache?.purgeExpired();
    g._translateCache?.purgeExpired();
    g._resultCache?.purgeExpired();
    g._deathgameCache?.purgeExpired();
  }, 10 * 60 * 1000);
}

// ── ハッシュユーティリティ ──────────────────────────────────────

/**
 * 文字列全体の SHA-256 ハッシュ（hex）を生成する。
 * 入力全体を対象にすることで先頭 N 文字切り捨てによる衝突を防ぐ。
 */
function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

// ── Public API ─────────────────────────────────────────────────

/** profile API 用キャッシュキーを生成する（入力全体のハッシュ） */
export function profileCacheKey(type: string, answers: string): string {
  return `profile:${type}:${sha256(answers)}`;
}

/** translate API 用キャッシュキーを生成する（入力全体のハッシュ） */
export function translateCacheKey(
  message: string,
  senderType: string,
  receiverType: string
): string {
  const payload = `${senderType}|${receiverType}|${message}`;
  return `translate:${sha256(payload)}`;
}

export function getProfileCacheEntry(key: string): string | undefined {
  return getProfileCache().get(key);
}

export function setProfileCacheEntry(key: string, text: string): void {
  getProfileCache().set(key, text);
}

export function getTranslateCacheEntry(key: string): string | undefined {
  return getTranslateCache().get(key);
}

export function setTranslateCacheEntry(key: string, json: string): void {
  getTranslateCache().set(key, json);
}

// ── /api/result (ショートカット) 用 ──────────────────────────

/** result API 用キャッシュキーを生成する（failurePattern 全体のハッシュ） */
export function resultCacheKey(type: string, failurePattern: string): string {
  return `result:${type}:${sha256(failurePattern)}`;
}

export function getResultCacheEntry(key: string): string | undefined {
  return getResultCache().get(key);
}

export function setResultCacheEntry(key: string, text: string): void {
  getResultCache().set(key, text);
}

// ── /api/deathgame (相性デスゲーム) 用 ──────────────────────────

/** deathgame API 用キャッシュキーを生成する */
export function deathgameCacheKey(type1: string, type2: string, userG: string, targetG: string): string {
  return `deathgame:${type1}:${type2}:${userG}:${targetG}`;
}

export function getDeathgameCacheEntry(key: string): string | undefined {
  return getDeathgameCache().get(key);
}

export function setDeathgameCacheEntry(key: string, text: string): void {
  getDeathgameCache().set(key, text);
}
