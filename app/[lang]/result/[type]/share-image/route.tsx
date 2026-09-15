import { notFound } from "next/navigation";
import { TYPE_CODES, isTypeCode } from "@/lib/type-codes";
import { renderResultStoryImage } from "@/app/[lang]/result/_images/result-images";

/**
 * 9:16 結果画像（スコアなし）1080×1920（仕様書 4-3）。ビルド時に16枚を作る。
 * 旧 /api/story-card?type= は、統合時に R9 でここへ 301 転送する
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return TYPE_CODES.map((type) => ({ lang: "ja", type }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; type: string }> }) {
  const { lang, type } = await params;
  if (lang !== "ja" || !isTypeCode(type)) notFound();
  return renderResultStoryImage(type);
}
