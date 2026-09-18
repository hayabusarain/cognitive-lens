import { notFound } from "next/navigation";
import { renderPageOgImage } from "@/lib/og/page-image";

/** 恋愛コラム一覧 /ja/articles の OG 画像（仕様書 4-2 の共通デザインに、ページ名を入れる） */
export const alt = "CognitiveLens 恋愛コラム一覧";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 画像のルートはレイアウトの generateStaticParams を引き継がない。ビルド時に作るため、ここでも lang を返す
export function generateStaticParams() {
  return [{ lang: "ja" }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ja") notFound();
  // 1行5字だと 88px で組まれ、右のカードに重なる（2026-09-16 に画像で確認）。1行3字までに分ける
  return renderPageOgImage({ title: "恋愛\nコラム\n一覧" });
}
