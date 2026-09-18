import Image from "next/image";
import type { TypeCode } from "@/lib/type-codes";
import { TYPE_BASE } from "@/lib/type-base";
import { characterAlt, typeColorStyle } from "@/lib/type-display";

/**
 * キャラクター画像の窓（仕様書 4-1）
 * 縦横比 4:5 の暗い地に、下からタイプ色の台座を出し、元画像を下揃えで収める。
 * 幅は置く側で決める（親の幅いっぱい。className で w-24 などを付ける）。
 *   sizes …… 表示幅。next/image が srcset を選ぶ（例：一覧は "(min-width: 768px) 25vw, 50vw"）
 *   loading …… 最初の画面に見えるものだけ "eager"。既定は遅延読み込み
 */
interface CharacterFigureProps {
  type: TypeCode;
  sizes: string;
  loading?: "eager" | "lazy";
  className?: string;
}

export function CharacterFigure({ type, sizes, loading, className = "" }: CharacterFigureProps) {
  return (
    <div className={`type-art ${className}`} style={typeColorStyle(type)}>
      <div className="absolute inset-x-[2%] top-[4%] bottom-0">
        <Image
          src={TYPE_BASE[type].image.src}
          alt={characterAlt(type)}
          fill
          sizes={sizes}
          loading={loading}
          className="object-contain object-bottom"
        />
      </div>
    </div>
  );
}
