import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません | CognitiveLens",
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-bold tracking-[0.2em] text-slate-400 mb-3">404</p>
      <h1 className="text-2xl font-bold text-slate-800 mb-3">ページが見つかりません</h1>
      <p className="text-sm text-slate-500 mb-8">URL が変わったか、ページが削除された可能性があります。</p>
      <Link
        href="/ja"
        className="inline-block px-6 py-3 rounded-full bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-colors"
      >
        トップへ戻る
      </Link>
    </main>
  );
}
