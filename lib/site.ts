import type { Metadata } from "next";

/** サイトの正規の URL。metadataBase と sitemap の両方がこの値を読む（仕様書 1-5） */
export const SITE_URL = "https://www.cognitive-lens.com";

/** ページの canonical。path は "/ja/about" のようにサイト内のパスで渡し、metadataBase で絶対 URL になる */
export function canonical(path: string): Metadata["alternates"] {
  return { canonical: path };
}
