import { notFound } from "next/navigation";
import { isTypeCode } from "@/lib/type-codes";
import { parseScores } from "@/lib/diagnosis/score";
import { renderResultStoryImage } from "@/app/[lang]/result/_images/result-images";

/**
 * 9:16 結果画像（スコアあり）1080×1920（仕様書 4-3）。URL は /ja/result/ENTP/share-image/61-33-78-50。
 * generateStaticParams が空配列なので、初回アクセス時に作ってキャッシュする。
 * 実行時にフォントと切り詰め版画像を読むため、next.config.ts の outputFileTracingIncludes にこのルートを載せている
 */
export function generateStaticParams() {
  return [];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string; type: string; scores: string }> },
) {
  const { lang, type, scores } = await params;
  if (lang !== "ja" || !isTypeCode(type)) notFound();
  // 結果ページと同じ条件で検証する（仕様書 2-1）。「061」のような別表記は同じ画像を二重にキャッシュしないよう 404 にする
  const values = parseScores(type, scores);
  if (!values || values.join("-") !== scores) notFound();
  return renderResultStoryImage(type, values);
}
