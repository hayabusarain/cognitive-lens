import type { Tuple } from "@/lib/tuple";
import type { Section } from "@/lib/type-content/schema";

/**
 * タイプ別の恋愛コラム（仕様書 3-16、7-2・7-3）。ファイルは lib/articles/{TYPE}.ts で、article をエクスポートする。
 *
 * 狙うキーワードは「{TYPE} 恋愛」「{TYPE} 脈ありサイン」。特徴全般・相性・適職は結果ページ /ja/result/{TYPE} に任せ、
 * ここでは詳しく書かずにリンクする（7-3）。文章の長さの決まりは TypeContent と同じ（scripts/check-content.mjs）。
 */
export interface ArticleContent {
  /** h1 と title の本体。「{TYPE}（{呼称}）の恋愛」で始め、40字以内。「MBTI」を入れない */
  title: string;
  /** meta description。120字以内。「MBTI」を入れない */
  description: string;
  /** 導入 */
  lead: string;
  /** 好きになるまで／好きな人への態度／すれ違いやすいところ／距離を縮めるには、の順の4節 */
  sections: Tuple<Section, 4>;
  /** 脈ありサイン。1つ45字以内 */
  signs: Tuple<string, 5>;
  /** 更新日（YYYY-MM-DD）。sitemap の lastmod に使う */
  updatedAt: string;
}
