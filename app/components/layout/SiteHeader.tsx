"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 全ページ共通のヘッダー（app/layout.tsx から出す）
 * スマートフォンではロゴの下に導線を1段で並べる。画面に固定せず、読むときに場所を取らない
 */
const NAV_ITEMS = [
  { href: "/ja/test", label: "診断" },
  { href: "/ja/result", label: "16タイプ一覧" },
  { href: "/ja/bingo", label: "ビンゴ" },
  { href: "/ja/articles", label: "コラム" },
] as const;

export default function SiteHeader() {
  const pathname = usePathname() ?? "";

  return (
    <header className="mx-auto w-full max-w-page px-4 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-x-6 pt-2 md:py-3">
        <Link href="/ja" className="inline-flex min-h-12 items-center font-display text-lg leading-none tracking-[0.01em]">
          Cognitive<span className="text-muted">Lens</span>
        </Link>
        <nav aria-label="主なページ" className="w-full md:w-auto">
          <ul className="-mx-2 flex items-center justify-between md:justify-end md:gap-2">
            {NAV_ITEMS.map((item) => {
              const current = pathname === item.href;
              const inSection = current || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center px-2 font-bold decoration-type decoration-2 underline-offset-8 hover:text-fg ${
                      inSection ? "text-fg underline" : "text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
