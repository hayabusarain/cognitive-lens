"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "cookie_consent_v1";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage は SSR では使えないため useEffect 内で確認
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTimeout(() => setVisible(true), 0);
      }
    } catch {
      // プライベートモード等で localStorage が使えない場合は表示しない
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // noop
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie同意バナー"
      className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4 pointer-events-none"
    >
      <div className="max-w-2xl mx-auto text-white rounded-2xl shadow-2xl shadow-black/60 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto glass-card" style={{ background: "rgba(3,3,5,0.85)" }}>
        {/* Text */}
        <p className="text-xs leading-relaxed text-white/70 flex-1">
          当サイトでは、ユーザー体験の向上とパーソナライズ広告（Google AdSense）の配信のためにCookieを使用しています。
          サイトの利用を継続することで、これに同意したものとみなされます。
          詳しくは{" "}
          <Link
            href="/privacy"
            className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors"
          >
            プライバシーポリシー
          </Link>
          {" "}をご確認ください。
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleAccept}
            className="btn-primary px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200 active:scale-95"
          >
            同意する
          </button>
          <button
            onClick={handleAccept}
            aria-label="閉じる"
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
