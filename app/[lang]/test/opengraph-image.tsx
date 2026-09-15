import { notFound } from "next/navigation";
import { renderPageOgImage } from "@/lib/og/page-image";

/** /ja/test の OG 画像（仕様書 4-2 の共通デザインにページ名を入れる） */
export const alt = "CognitiveLens 16タイプ診断";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 画像のルートはレイアウトの generateStaticParams を引き継がないので、ビルド時に作るためここでも返す
export function generateStaticParams() {
  return [{ lang: "ja" }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ja") notFound();
  return renderPageOgImage({ title: "16タイプ\n診断" });
}
