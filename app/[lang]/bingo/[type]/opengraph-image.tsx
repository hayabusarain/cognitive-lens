import { notFound } from "next/navigation";
import { TYPE_CODES, isTypeCode } from "@/lib/type-codes";
import { renderBingoOgImage } from "./bingo-image";

/**
 * /ja/bingo/{TYPE} の OG 画像 1200×630（仕様書 4-2 の表：キャラクターと「偏見だらけの{TYPE}ビンゴ」）
 */
export const alt = "偏見だらけのビンゴ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 画像のルートは親の generateStaticParams を引き継がない。ビルド時に16枚を作るため、lang と type をここで返す
export function generateStaticParams() {
  return TYPE_CODES.map((type) => ({ lang: "ja", type }));
}

export default async function Image({ params }: { params: Promise<{ lang: string; type: string }> }) {
  const { lang, type } = await params;
  if (lang !== "ja" || !isTypeCode(type)) notFound();
  return renderBingoOgImage(type);
}
