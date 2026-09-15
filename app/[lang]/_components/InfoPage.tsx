import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { Heading } from "@/app/components/ui/Heading";

/**
 * 運営者情報・免責事項・プライバシーポリシー・素材配布の骨組み（ステップ 3-19・3-20）
 * パンくず、h1、最終更新日、リード文を出す。本文は InfoSection を並べる。
 * フォルダ名の先頭の _ は、ルートにしないための印（Next.js の private folder）
 */

/** X のアカウント。フッターのお問い合わせと同じ */
export const X_ACCOUNT_URL = "https://x.com/CognitiveLens_";
export const X_ACCOUNT_HANDLE = "@CognitiveLens_";

/** "2026-09-16" → "2026年9月16日" */
export function formatJaDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

interface InfoPageProps {
  title: string;
  /** サイト内のパス（パンくずの最後の項目） */
  path: string;
  /** 最終更新日（YYYY-MM-DD） */
  updatedAt?: string;
  lead?: ReactNode;
  children: ReactNode;
}

export function InfoPage({ title, path, updatedAt, lead, children }: InfoPageProps) {
  return (
    <main className="mx-auto w-full max-w-page px-4 pt-4 md:px-10">
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/ja" },
          { name: title, href: path },
        ]}
      />
      <div className="max-w-prose">
        <Heading level={1} className="mt-4">
          {title}
        </Heading>
        {updatedAt && (
          <p className="mt-2 text-note text-muted">
            最終更新日：<time dateTime={updatedAt}>{formatJaDate(updatedAt)}</time>
          </p>
        )}
        {lead && <p className="text-phrase mt-6 text-lead text-muted">{lead}</p>}
      </div>
      {children}
    </main>
  );
}

/** 本文の節。文章の段は max-w-prose に収める。wide で幅の制限を外す（素材配布の一覧など） */
export function InfoSection({
  id,
  title,
  children,
  wide = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section aria-labelledby={id} className={`mt-12 ${wide ? "" : "max-w-prose"}`}>
      <Heading level={2} id={id} className="mb-4">
        {title}
      </Heading>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

const TEXT_LINK_CLASS = "font-bold underline underline-offset-4 hover:text-muted";

/** 本文の中のサイト内リンク */
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={TEXT_LINK_CLASS}>
      {children}
    </Link>
  );
}

/** 本文の中の外部サイトへのリンク。新しいタブで開き、読み上げでもそう伝える */
export function ExternalTextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={TEXT_LINK_CLASS}>
      {children}
      <ExternalLink aria-hidden="true" className="mx-0.5 inline size-4 align-[-0.125em]" />
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  );
}
