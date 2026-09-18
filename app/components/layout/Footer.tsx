import Link from "next/link";
import { X_ACCOUNT_URL } from "@/lib/site";

/**
 * 全ページ共通のフッター（app/layout.tsx から出す）
 */
const LINKS = [
  { href: "/ja/about", label: "運営者情報" },
  { href: "/ja/downloads", label: "キャラ素材の配布" },
  { href: "/ja/disclaimer", label: "免責事項" },
  { href: "/ja/privacy", label: "プライバシーポリシー" },
] as const;

const LINK_CLASS = "inline-flex min-h-11 items-center px-2 text-note text-muted underline underline-offset-4 hover:text-fg";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto w-full max-w-page px-4 py-10 md:px-10">
        <p className="font-display text-lg leading-none tracking-[0.01em]">
          Cognitive<span className="text-muted">Lens</span>
        </p>
        <p className="mt-2 text-note text-muted">16タイプ性格診断</p>
        <nav aria-label="サイトについて" className="mt-6">
          <ul className="-mx-2 flex flex-wrap gap-x-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={X_ACCOUNT_URL} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                お問い合わせ
                <span className="sr-only">（X のアカウントを新しいタブで開きます）</span>
              </a>
            </li>
          </ul>
        </nav>
        <p className="mt-6 text-label text-muted">
          <small className="text-[length:inherit]">© 2026 CognitiveLens</small>
        </p>
      </div>
    </footer>
  );
}
