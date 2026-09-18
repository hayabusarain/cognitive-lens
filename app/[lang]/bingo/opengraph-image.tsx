import { notFound } from "next/navigation";
import { renderPageOgImage } from "@/lib/og/page-image";

/**
 * ビンゴのハブ /ja/bingo の OG 画像（仕様書 4-2 の共通デザイン）。
 * タイプ別のページ /ja/bingo/{TYPE} は、同じ区画の [type]/opengraph-image.tsx で自分の画像を持つ
 */
export const alt = "偏見だらけのMBTIビンゴ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 画像のルートはレイアウトの generateStaticParams を引き継がないので、ビルド時に作るためにここでも返す
export function generateStaticParams() {
  return [{ lang: "ja" }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ja") notFound();
  return renderPageOgImage({ title: "偏見だらけの\nMBTIビンゴ" });
}
