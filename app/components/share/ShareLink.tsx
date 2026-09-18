"use client";

import { useState } from "react";
import type { TypeCode } from "@/lib/type-codes";
import { trackShare, type ShareContentType } from "@/lib/analytics";
import { Button, type ButtonVariant } from "@/app/components/ui/Button";

/**
 * ページの URL を友達に送るボタン（仕様書 3-4 の共有に追加。2026-09-18）
 *
 * X はフォロワー向けの公開の場で、結果を1対1で見せる相手は LINE のことが多い。
 * navigator.share に URL を渡すと、端末の共有シートに LINE・Instagram・TikTok・メッセージが並ぶ。
 * 共有シートがないブラウザ（多くのパソコン）では、URL をクリップボードに複製して知らせる。
 * ShareImageButton の共有シートは画像のファイル専用で、受け取った人がサイトへ来る URL は付かない。
 */
interface ShareLinkProps {
  /** 共有シートに渡す題名（ページの title 相当） */
  title: string;
  /** 共有シートに渡す一言。URL は text に含めず、url で渡す */
  text: string;
  url: string;
  contentType: ShareContentType;
  itemId: TypeCode;
  label?: string;
  variant?: ButtonVariant;
  className?: string;
}

export function ShareLink({
  title,
  text,
  url,
  contentType,
  itemId,
  label = "友達に送る",
  variant = "secondary",
  className,
}: ShareLinkProps) {
  const [done, setDone] = useState(false);

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        trackShare("share_sheet", contentType, itemId);
        return;
      } catch (error) {
        // 共有シートを閉じただけなら、複製には進まない
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setDone(true);
      window.setTimeout(() => setDone(false), 3000);
      trackShare("clipboard", contentType, itemId);
    } catch {
      // 複製もできない環境では、アドレス欄からコピーしてもらうほかない
    }
  }

  return (
    <Button variant={variant} className={className} onClick={share} aria-live="polite">
      {done ? "リンクをコピーしました" : label}
    </Button>
  );
}
