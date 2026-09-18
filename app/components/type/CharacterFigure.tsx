import type { TypeCode } from "@/lib/type-codes";
import { typeColorStyle } from "@/lib/type-display";

/**
 * タイプの窓（仕様書 4-1）
 * 縦横比 4:5 の暗い地に、下からタイプ色の台座を出す。幅は置く側で決める。
 *
 * 2026-09-19：キャラクター画像16枚は、既存の性格診断サイトの画像を変換したものだと分かったため、
 * サイトから外した（docs/asset-credits.md 1-1）。差し替えが済むまで、ここは型コードを薄く大きく置く（地紋の扱い。カード上部の型コードと重ねて読ませない）。
 * 文字の大きさは窓の幅に対する割合（cqw）で決めるので、一覧の小さいカードでも結果ページの
 * 大きなカードでも同じ見え方になる。幻獣版ができたら、この部品に画像を戻す。
 *   sizes・loading …… 画像を戻したときに使う。いまは受け取るだけ
 */
interface CharacterFigureProps {
  type: TypeCode;
  sizes: string;
  loading?: "eager" | "lazy";
  className?: string;
}

export function CharacterFigure({ type, className = "" }: CharacterFigureProps) {
  return (
    <div className={`type-art ${className}`} style={typeColorStyle(type)}>
      <div className="absolute inset-0 grid place-items-center">
        <span aria-hidden="true" className="font-display text-[27cqw] leading-none tracking-[0.02em] text-fg/15">
          {type}
        </span>
      </div>
    </div>
  );
}
