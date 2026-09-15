import { notFound } from "next/navigation";
import { renderPageOgImage } from "@/lib/og/page-image";

/**
 * トップ /ja の OG 画像（仕様書 4-2 の共通デザイン）。
 * 下の階層のページは、自分の opengraph-image を置くまでこの画像を引き継ぐ
 */
export const alt = "CognitiveLens 16タイプ性格診断";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 画像のルートはレイアウトの generateStaticParams を引き継がない（書かないと実行時の生成になった。2026-09-16 のビルドで確認）。
// ビルド時に作るため、ここでも lang を返す
export function generateStaticParams() {
  return [{ lang: "ja" }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ja") notFound();
  return renderPageOgImage({ title: "16タイプ\n性格診断" });
}
