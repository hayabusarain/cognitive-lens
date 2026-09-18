import { notFound } from "next/navigation";
import { renderPageOgImage } from "@/lib/og/page-image";

/** 脈あり度チェック /ja/romance-checker の OG 画像（仕様書 4-2 の共通デザインに、ページ名を入れる） */
export const alt = "CognitiveLens 脈あり度チェック";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 画像のルートはレイアウトの generateStaticParams を引き継がない。ビルド時に作るため、ここでも lang を返す
export function generateStaticParams() {
  return [{ lang: "ja" }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "ja") notFound();
  return renderPageOgImage({ title: "脈あり度\nチェック" });
}
