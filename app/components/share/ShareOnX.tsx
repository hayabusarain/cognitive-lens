"use client";

import type { TypeCode } from "@/lib/type-codes";
import { trackShare, type ShareContentType } from "@/lib/analytics";
import { ButtonLink, type ButtonVariant } from "@/app/components/ui/Button";

/**
 * X の投稿画面を開くリンク（仕様書 3-4、3-7）。押したら GA4 の share を送る。
 *   text …… 投稿の文面。{url} を含むとその位置に url を入れ、含まなければ url を投稿の末尾に付ける
 *   url ……… 共有するページの URL。クエリ（個人スコア）を付けない（仕様書 3-4）
 */
interface ShareOnXProps {
  text: string;
  url: string;
  contentType: ShareContentType;
  itemId: TypeCode;
  label?: string;
  variant?: ButtonVariant;
  className?: string;
}

export function ShareOnX({ text, url, contentType, itemId, label = "Xに投稿", variant = "secondary", className }: ShareOnXProps) {
  const query = text.includes("{url}")
    ? `text=${encodeURIComponent(text.replaceAll("{url}", url))}`
    : `text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  return (
    <ButtonLink
      href={`https://twitter.com/intent/tweet?${query}`}
      external
      variant={variant}
      className={className}
      onClick={() => trackShare(contentType, itemId)}
    >
      {label}
    </ButtonLink>
  );
}
