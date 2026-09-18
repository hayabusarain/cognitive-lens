import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/site";

/**
 * パンくず（docs/design-system.md）
 * 画面の表示と、同じ内容の BreadcrumbList の JSON-LD を出す（json-ld.md の書き方）。
 * items は先頭（トップ）から現在のページまでを順に渡す。最後の項目は現在のページとしてリンクにしない。
 */
export interface BreadcrumbItem {
  name: string;
  /** サイト内のパス（例：/ja/result） */
  href: string;
}

export function Breadcrumbs({ items, className = "" }: { items: readonly BreadcrumbItem[]; className?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <nav aria-label="パンくずリスト" className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ol className="flex flex-wrap items-center gap-x-1 text-note text-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex min-w-0 items-center gap-x-1">
              {isLast ? (
                <span aria-current="page" className="inline-flex min-h-11 items-center text-fg">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-fg">
                    {item.name}
                  </Link>
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
