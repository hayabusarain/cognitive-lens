"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * GA4 の page_view を、クエリとハッシュを外した URL で送る（GoogleAnalytics.tsx の説明を参照）。
 * パスが変わるたびに1回送る。gtag の読み込み前なら dataLayer に積まれ、読み込み後に送られる。
 */
export default function PageView() {
  const pathname = usePathname();

  useEffect(() => {
    const w = window as typeof window & { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    // gtag() と同じ形（arguments オブジェクト）で積む
    const gtag = function (..._args: unknown[]) {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    gtag("event", "page_view", {
      page_location: `${window.location.origin}${pathname}`,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
