import { notFound } from "next/navigation";
import { TYPE_CODES, isTypeCode } from "@/lib/type-codes";
import { renderResultOgImage } from "@/app/[lang]/result/_images/result-images";

/**
 * 結果ページの twitter:image（opengraph-image.tsx と同じ 1200×630 の画像）。
 * 設定の書き出し（alt・size など）は Next.js がファイルごとに読むので、再エクスポートせずに同じ値を書く
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
