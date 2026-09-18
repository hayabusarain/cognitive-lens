import { parseMask } from "@/lib/bingo/board";
import { isTypeCode } from "@/lib/type-codes";
import { renderBingoCardImage } from "../../bingo-image";

/**
 * ビンゴカード画像 /ja/bingo/{TYPE}/card/{mask}（仕様書 4-5、2-5）
 *
 * mask は FREE を除く24マスの押した状態を表す6桁の16進数（小文字）。形が違えば 404。
 * generateStaticParams が空配列なので、ビルド時には作らず、初回のアクセスで生成してキャッシュする（generate-static-params.md「All paths at runtime」）。
 * 実行時にフォントと切り詰め版の画像を読むため、next.config.ts の outputFileTracingIncludes にこのルートを足してある。
 */
export function generateStaticParams() {
  return [];
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; type: string; mask: string }> }) {
  const { lang, type, mask } = await params;
  const value = parseMask(mask);
  if (lang !== "ja" || !isTypeCode(type) || value === null) {
    return new Response("Not Found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return renderBingoCardImage(type, value);
}
