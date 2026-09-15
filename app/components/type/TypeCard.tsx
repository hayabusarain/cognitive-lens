import type { TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { typeNumber } from "@/lib/type-display";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";
import { TypeFrame } from "@/app/components/type/TypeFrame";

/**
 * 16タイプのカード（仕様書 4-4）。カード全体が href へのリンク。
 * 上から型コードと通し番号、キャラクター画像、呼称、一行説明。
 * 一覧（/ja/result/{TYPE} へ）とビンゴのハブ（/ja/bingo/{TYPE} へ）で、href と description を差し替えて使う。
 * 見出し要素は出さない（ビンゴのハブは見出しの文言を保持するため。仕様書 9-4）
 */
export const TYPE_CARD_IMAGE_SIZES = "(min-width: 768px) 25vw, 50vw";

interface TypeCardProps {
  type: TypeCode;
  href: string;
  /** 一行説明（例：TypeContent.tagline） */
  description: string;
  /** 最初の画面に見えるカードだけ "eager" */
  imageLoading?: "eager" | "lazy";
  /** 画像の表示幅。既定はスマートフォン 50vw、パソコン 25vw（4列） */
  imageSizes?: string;
  className?: string;
}

export function TypeCard({
  type,
  href,
  description,
  imageLoading,
  imageSizes = TYPE_CARD_IMAGE_SIZES,
  className = "",
}: TypeCardProps) {
  return (
    <TypeFrame type={type} href={href} className={`h-full [--frame-radius:14px] [--frame:5px] ${className}`}>
      {/* 狭いカードでは型コードと番号が1行に収まらない（最も幅を取る ENTP で、型コード22pxのとき143px、28pxのとき約168px要る）ので、番号を出さない */}
      <div className="@container flex items-center justify-between gap-1 px-2 pb-1.5 pt-2">
        <span className="font-display text-[1.375rem] leading-tight tracking-[0.02em] md:text-[1.75rem]">{type}</span>
        <span aria-hidden="true" className="hidden rounded-[4px] bg-type px-1 py-1 font-display text-label leading-none text-ink @min-[9rem]:inline-block md:hidden md:@min-[10.75rem]:inline-block">
          {typeNumber(type)}
        </span>
      </div>
      <CharacterFigure type={type} sizes={imageSizes} loading={imageLoading} className="mx-1.5" />
      <div className="flex flex-1 flex-col gap-0.5 px-2 pb-3 pt-2">
        <span className="text-lead font-black leading-snug">{TYPE_NAMES[type]}</span>
        <span className="text-phrase leading-relaxed text-muted">{description}</span>
      </div>
    </TypeFrame>
  );
}
