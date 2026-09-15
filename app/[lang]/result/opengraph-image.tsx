import { notFound } from "next/navigation";
import { renderPageOgImage } from "@/lib/og/page-image";

/**
 * 16タイプ一覧 /ja/result の OG 画像（仕様書 4-2 の共通デザインにページ名を入れる）。
 * タイプ別の /ja/result/{TYPE} は、自分の区画の opengraph-image.tsx を使う
 */
export const alt = "CognitiveLens 16タイプ一覧";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 画像のルートはレイアウトの generateStaticParams を引き継がないので、ここでも lang を返してビルド時に作る
export function generateStaticParams() {
  return [{ lang: "ja" }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ja") notFound();
  return renderPageOgImage({ title: "16タイプ一覧" });
}
