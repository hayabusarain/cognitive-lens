/**
 * 301 転送の判定（仕様書 docs/redesign-spec.md 1-3）
 *
 * URL を受け取り、転送先の URL か null を返す純粋な関数。proxy.ts から呼ぶ。
 * 規則を適用順に当てて URL を書き換え、1つでも書き換わったら最後の URL へ1回だけ転送する。
 *
 * Node.js の型除去（node --test）でもそのまま読めるよう、このファイルは他のファイルを import しない。
 */

export type RuleId = "R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7" | "R8" | "R9" | "R10" | "R11" | "R12";

/** 規則ごとの有効・無効。仕様書 8章のステップで順に true にする */
export const ENABLED_RULES: Readonly<Record<RuleId, boolean>> = {
  R1: false, // /ja/result?type=有効 → /ja/result/{TYPE}（ステップ 3-5）
  R2: false, // /ja/result?type=無効 → /ja/result（ステップ 3-10）
  R3: false, // /ja/select → /ja/result（ステップ 3-10）
  R4: false, // /ja/result/{type} の大文字化（ステップ 3-5）
  R5: false, // /ja/article/{type} の大文字化（ステップ 3-16）
  R6: false, // /ja/bingo/{type} の大文字化（ステップ 3-13）
  R7: true, // 言語なしの既知パス → /ja/…（ステップ 1-1）
  R8: false, // /api/og → OG 画像（ステップ 3-5）
  R9: false, // /api/story-card → 9:16 画像（ステップ 3-7）
  R10: false, // www なし → www（ステップ 1-4）
  R11: true, // /en・/ko → /ja（ステップ 1-1）
  R12: true, // /ja/skip-path・/ja/chat-gen → /ja/test（ステップ 1-1）
};

export const CANONICAL_HOST = "www.cognitive-lens.com";
const APEX_HOST = "cognitive-lens.com";

// lib/type-codes.ts と同じ16件（このファイルは import しない方針のため複製している）
const TYPES = new Set([
  "ENFJ", "ENFP", "ENTJ", "ENTP", "ESFJ", "ESFP", "ESTJ", "ESTP",
  "INFJ", "INFP", "INTJ", "INTP", "ISFJ", "ISFP", "ISTJ", "ISTP",
]);
const LANGS = new Set(["ja", "en", "ko"]);
const SINGLE_PAGES = new Set([
  "test", "select", "target-diagnosis", "romance-checker", "articles",
  "about", "disclaimer", "privacy", "downloads", "skip-path", "chat-gen",
]);

/** 大文字小文字を問わず16タイプなら大文字の型コードを返す */
function toType(value: string | null | undefined): string | null {
  if (!value) return null;
  const upper = value.toUpperCase();
  return TYPES.has(upper) ? upper : null;
}

/** 言語を除いたパスの区切りが、既知のページか */
function isKnownPath(segments: string[]): boolean {
  if (segments.length === 1 && (SINGLE_PAGES.has(segments[0]) || segments[0] === "result" || segments[0] === "bingo")) return true;
  if (segments.length === 2 && ["result", "bingo", "article"].includes(segments[0]) && toType(segments[1]) !== null) return true;
  return false;
}

export function resolveRedirect(input: URL, enabled: Readonly<Record<RuleId, boolean>> = ENABLED_RULES): string | null {
  const url = new URL(input.href);
  let segments = url.pathname.split("/").filter(Boolean);
  let changed = false;
  const setPath = (next: string[], clearQuery: boolean) => {
    segments = next;
    if (clearQuery) url.search = "";
    changed = true;
  };

  // R10: www なし → www
  if (enabled.R10 && url.hostname === APEX_HOST) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    changed = true;
  }

  const path = "/" + segments.join("/");

  // R8: /api/og → OG 画像
  if (enabled.R8 && path === "/api/og") {
    const type = toType(url.searchParams.get("type"));
    setPath(type ? ["ja", "result", type, "opengraph-image"] : ["ja", "opengraph-image"], true);
  }
  // R9: /api/story-card → 9:16 結果画像
  else if (enabled.R9 && path === "/api/story-card") {
    const type = toType(url.searchParams.get("type"));
    setPath(type ? ["ja", "result", type, "share-image"] : ["ja", "result"], true);
  }

  // R11: /en・/ko → /ja（空か既知のパスのとき）
  if (enabled.R11 && segments.length >= 1 && (segments[0] === "en" || segments[0] === "ko")) {
    const rest = segments.slice(1);
    if (rest.length === 0 || isKnownPath(rest)) setPath(["ja", ...rest], false);
  }

  // R7: 言語なしの既知パス → /ja/…
  if (enabled.R7 && segments.length >= 1 && !LANGS.has(segments[0]) && isKnownPath(segments)) {
    setPath(["ja", ...segments], false);
  }

  if (segments[0] === "ja") {
    const page = segments[1];

    // R12: 削除した AI 生成ページ → 自己診断
    if (enabled.R12 && segments.length === 2 && (page === "skip-path" || page === "chat-gen")) {
      setPath(["ja", "test"], true);
    }
    // R3: /ja/select → 16タイプ一覧
    else if (enabled.R3 && segments.length === 2 && page === "select") {
      setPath(["ja", "result"], true);
    }
    // R1・R2: /ja/result?type=
    else if (segments.length === 2 && page === "result" && url.searchParams.has("type")) {
      const type = toType(url.searchParams.get("type"));
      if (type && enabled.R1) setPath(["ja", "result", type], true);
      else if (!type && enabled.R2) setPath(["ja", "result"], true);
    }

    // R4・R5・R6: 型コードの大文字化
    if (segments.length >= 3) {
      const type = toType(segments[2]);
      const rule = ({ result: "R4", article: "R5", bingo: "R6" } as const)[segments[1] as "result" | "article" | "bingo"];
      if (rule && enabled[rule] && type && segments[2] !== type) {
        setPath(["ja", segments[1], type, ...segments.slice(3)], false);
      }
    }
  }

  if (!changed) return null;
  url.pathname = "/" + segments.join("/");
  return url.href;
}
