import type { Metadata } from "next";

/** サイトの正規の URL。metadataBase と sitemap の両方がこの値を読む（仕様書 1-5） */
export const SITE_URL = "https://www.cognitive-lens.com";

/** サイト名。title.template・openGraph.siteName・生成画像で使う */
export const SITE_NAME = "CognitiveLens";

/**
 * 全ページ共通の openGraph の値（app/layout.tsx）。
 * ページで openGraph を指定すると親の値は丸ごと置き換わる（generate-metadata.md の Merging）ので、
 * ページ側では `openGraph: { ...BASE_OPEN_GRAPH, title, description, url }` のように展開して使う
 */
export const BASE_OPEN_GRAPH = {
  siteName: SITE_NAME,
  locale: "ja_JP",
  type: "website",
} as const;

/** ページの canonical。path は "/ja/about" のようにサイト内のパスで渡し、metadataBase で絶対 URL になる */
export function canonical(path: string): Metadata["alternates"] {
  return { canonical: path };
}
