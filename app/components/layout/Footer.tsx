"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const lang = pathname?.startsWith("/en") ? "en" : "ja";

  return (
    <footer className="w-full px-6 py-8 text-center mt-auto border-t border-black/5 content-layer antialiased">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs mb-4">
        <Link href={`/${lang}/about`} className="text-slate-500 hover:text-slate-800 transition-colors underline underline-offset-4">
          {lang === "en" ? "About Us" : "運営者情報"}
        </Link>
        <Link href={`/${lang}/downloads`} className="text-slate-500 hover:text-slate-800 transition-colors underline underline-offset-4">
          {lang === "en" ? "Free Characters" : "キャラ素材無料配布"}
        </Link>
        <Link href={`/${lang}/disclaimer`} className="text-slate-500 hover:text-slate-800 transition-colors underline underline-offset-4">
          {lang === "en" ? "Disclaimer" : "免責事項"}
        </Link>
        <Link href={`/${lang}/privacy`} className="text-slate-500 hover:text-slate-800 transition-colors underline underline-offset-4">
          {lang === "en" ? "Privacy Policy" : "プライバシーポリシー"}
        </Link>
      </div>
      <p className="text-[10px] text-slate-400">
        © 2025 CognitiveLens — Interpersonal Friction Analytics. All rights reserved.
      </p>
    </footer>
  );
}
