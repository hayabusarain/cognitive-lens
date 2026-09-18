import Link from "next/link";
import type { ReactNode } from "react";
import type { TypeCode } from "@/lib/type-codes";
import { typeColorStyle } from "@/lib/type-display";

/**
 * タイプ色の太い枠と、暗い内面（コレクションカードの外枠。docs/design-system.md）
 * TypeCard のほか、結果ページのヒーロー、相性の相手、ビンゴの盤面の枠に使う。
 *   size …… 枠の太さ。sm 4px、md 6px、lg 8px
 *   type …… 省略すると、外側で指定したタイプ色（--tc）を使う
 *   href …… 渡すとカード全体がリンクになり、ホバーで少し浮く（動きを減らす設定では浮かない）
 */
interface TypeFrameProps {
  children: ReactNode;
  type?: TypeCode;
  size?: "sm" | "md" | "lg";
  href?: string;
  as?: "div" | "article" | "section";
  className?: string;
  innerClassName?: string;
  "aria-labelledby"?: string;
}

export function TypeFrame({
  children,
  type,
  size = "md",
  href,
  as: Tag = "div",
  className = "",
  innerClassName = "",
  ...rest
}: TypeFrameProps) {
  const props = {
    className: `type-frame ${className}`,
    "data-size": size,
    style: type ? typeColorStyle(type) : undefined,
    ...rest,
  };
  const inner = <div className={`type-frame__inner ${innerClassName}`}>{children}</div>;
  if (href) {
    return (
      <Link href={href} {...props}>
        {inner}
      </Link>
    );
  }
  return <Tag {...props}>{inner}</Tag>;
}
