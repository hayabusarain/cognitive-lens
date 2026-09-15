import Link from "next/link";
import type { ReactNode } from "react";

/**
 * 暗い面のカード（docs/design-system.md）。タイプ色の太い枠のカードは type/TypeFrame を使う
 *   accent="top"  …… 上辺にタイプ色の線（特徴の3項目など）
 *   accent="ring" …… 内側にタイプ色の枠（向く仕事など、対の片方を目立たせる）
 *   href を渡すと、カード全体がリンクになる（トップの入口など）
 */
export type CardAccent = "none" | "top" | "ring";

interface CardProps {
  children: ReactNode;
  accent?: CardAccent;
  href?: string;
  as?: "div" | "section" | "article" | "li";
  className?: string;
  "aria-labelledby"?: string;
}

const ACCENT_CLASS: Record<CardAccent, string> = {
  none: "",
  top: "border-t-4 border-t-type",
  ring: "ring-2 ring-inset ring-type",
};

export function Card({ children, accent = "none", href, as: Tag = "div", className = "", ...rest }: CardProps) {
  const base = `rounded-panel bg-surface p-4 ${ACCENT_CLASS[accent]}`;
  if (href) {
    return (
      <Link
        href={href}
        className={`${base} block border border-line text-fg no-underline hover:border-muted motion-safe:transition motion-safe:hover:-translate-y-0.5 ${className}`}
        {...rest}
      >
        {children}
      </Link>
    );
  }
  return (
    <Tag className={`${base} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
