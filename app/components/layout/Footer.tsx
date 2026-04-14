import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full px-6 py-8 text-center mt-auto border-t border-black/5 content-layer antialiased">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs mb-4">
        <Link href="/about" className="text-slate-500 hover:text-slate-800 transition-colors underline underline-offset-4">
          運営者情報
        </Link>
        <Link href="/disclaimer" className="text-slate-500 hover:text-slate-800 transition-colors underline underline-offset-4">
          免責事項
        </Link>
        <Link href="/privacy" className="text-slate-500 hover:text-slate-800 transition-colors underline underline-offset-4">
          プライバシーポリシー
        </Link>
      </div>
      <p className="text-[10px] text-slate-400">
        © 2025 CognitiveLens — Interpersonal Friction Analytics. All rights reserved.
      </p>
    </footer>
  );
}
