"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // 現在の言語を取得
  const currentLang = pathname.startsWith("/en") ? "en" : "ja";

  const changeLanguage = (lang: string) => {
    setIsOpen(false);
    
    // 現在のパスから言語プレフィックスを置換する
    let newPathname = pathname;
    if (pathname.startsWith("/en/") || pathname === "/en") {
      newPathname = pathname.replace(/^\/en/, `/${lang}`);
    } else if (pathname.startsWith("/ja/") || pathname === "/ja") {
      newPathname = pathname.replace(/^\/ja/, `/${lang}`);
    } else {
      newPathname = `/${lang}${pathname === "/" ? "" : pathname}`;
    }
    
    router.push(newPathname);
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white/80 transition-all shadow-sm"
      >
        <Languages size={14} />
        {currentLang.toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden text-sm font-semibold">
          <button 
            onClick={() => changeLanguage("ja")}
            className={`w-full text-left px-4 py-2 hover:bg-cyan-50 transition-colors ${currentLang === 'ja' ? 'text-cyan-600 bg-cyan-50/50' : 'text-slate-600'}`}
          >
            日本語
          </button>
          <button 
            onClick={() => changeLanguage("en")}
            className={`w-full text-left px-4 py-2 hover:bg-cyan-50 transition-colors ${currentLang === 'en' ? 'text-cyan-600 bg-cyan-50/50' : 'text-slate-600'}`}
          >
            English (Gen-Z)
          </button>
        </div>
      )}
    </div>
  );
}
