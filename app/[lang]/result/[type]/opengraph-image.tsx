import { notFound } from "next/navigation";
import { TYPE_CODES, isTypeCode } from "@/lib/type-codes";
import { renderResultOgImage } from "@/app/[lang]/result/_images/result-images";

/**
 * 結果ページの OG 画像 1200×630（仕様書 4-2）。twitter-image.tsx も同じ画像を返す。
 * 画像のルートはレイアウトとページの generateStaticParams を引き継がないので、ここで16タイプを返してビルド時に作る
 */
export const alt = "16タイプ性格診断の結果カード（型コード・呼称・キャラクター）";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return TYPE_CODES.map((type) => ({ lang: "ja", type }));
}

export default async function Image({ params }: { params: Promise<{ lang: string; type: string }> }) {
  const { lang, type } = await params;
  if (lang !== "ja" || !isTypeCode(type)) notFound();
  return renderResultOgImage(type);
}
