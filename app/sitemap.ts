import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { TYPE_CODES } from "@/lib/type-codes";
import { TYPE_CONTENT } from "@/lib/type-content";
import { ARTICLES } from "@/lib/articles";

/**
 * sitemap.xml（仕様書 1-5）。59件：トップ、診断3つ、16タイプ一覧と結果×16、ビンゴ×17、コラム×17、規約類4つ。
 * 画像・転送元・API は載せない。hreflang は付けない（日本語のみ）。
 *
 * lastmod はビルド時刻ではなく、中身を変えた日にする。
 * 結果ページは TypeContent.updatedAt、コラムは ArticleContent.updatedAt から取る。
 * ほかのページは下の表の日付を使う。ページの文面や設問を変えたら、その行を書き換える。
 */
const PAGE_UPDATED_AT = {
  "/ja": "2026-09-16",
  "/ja/test": "2026-09-16",
  "/ja/result": "2026-09-16",
  "/ja/target-diagnosis": "2026-09-16",
  "/ja/romance-checker": "2026-09-16",
  "/ja/bingo": "2026-09-16",
  /** タイプ別ビンゴ16ページ。項目は lib/bingo-data-ja.ts にまとまっていて、タイプごとの更新日を持たない */
  "/ja/bingo/{TYPE}": "2026-09-16",
  "/ja/articles": "2026-09-16",
  "/ja/about": "2026-09-16",
  "/ja/disclaimer": "2026-09-16",
  "/ja/privacy": "2026-09-16",
  "/ja/downloads": "2026-09-16",
} as const;

type FixedPath = Exclude<keyof typeof PAGE_UPDATED_AT, "/ja/bingo/{TYPE}">;

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = (path: FixedPath) => ({ url: `${SITE_URL}${path}`, lastModified: PAGE_UPDATED_AT[path] });

  return [
    fixed("/ja"),
    fixed("/ja/test"),
    fixed("/ja/result"),
    ...TYPE_CODES.map((type) => ({ url: `${SITE_URL}/ja/result/${type}`, lastModified: TYPE_CONTENT[type].updatedAt })),
    fixed("/ja/target-diagnosis"),
    fixed("/ja/romance-checker"),
    fixed("/ja/bingo"),
    ...TYPE_CODES.map((type) => ({ url: `${SITE_URL}/ja/bingo/${type}`, lastModified: PAGE_UPDATED_AT["/ja/bingo/{TYPE}"] })),
    fixed("/ja/articles"),
    ...TYPE_CODES.map((type) => ({ url: `${SITE_URL}/ja/article/${type}`, lastModified: ARTICLES[type].updatedAt })),
    fixed("/ja/about"),
    fixed("/ja/disclaimer"),
    fixed("/ja/privacy"),
    fixed("/ja/downloads"),
  ];
}
