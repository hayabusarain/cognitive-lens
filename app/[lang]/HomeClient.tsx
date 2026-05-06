"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Languages, FlaskConical, Zap, Shield, BarChart2, Video, Heart } from "lucide-react";
import AdSenseUnit from "@/app/components/ads/AdSenseUnit";
import { useEffect, useState } from "react";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function HomeClient({ dict, lang }: { dict: any, lang: string }) {
  return (
    <>
      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-mid" />
      </div>

      <main className="content-layer flex flex-col">
        {/* Nav */}
        <nav className="nav-blur flex items-center justify-between px-6 md:px-8 py-4 sticky top-0 z-50">
          <span className="text-sm font-extrabold tracking-tighter text-slate-800">
            cognitive
            <span style={{ color: "#00e5ff", textShadow: "0 0 12px rgba(0,229,255,0.3)" }}>lens</span>
          </span>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="text-[10px] px-3 py-1 rounded-full font-bold tracking-widest badge-neon">
              β BETA
            </span>
          </div>
        </nav>

        {/* Hero */}
        <section className="flex flex-col items-center px-6 pt-8 pb-12 text-center">
          <div className="max-w-2xl mx-auto w-full">

            {/* Badge */}
            <div className="bubble mb-8">
              <Sparkles size={12} className="text-cyan-500" />
              <span>{dict.home.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.2] mb-5 tracking-tighter text-slate-800 break-keep">
              {dict.home.headline_1}
              <br />
              <span className="inline-block">{dict.home.headline_2}</span>
              <br />
              <span
                className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-500 via-violet-500 to-fuchsia-500"
                style={{ filter: "drop-shadow(0 0 16px rgba(0,229,255,0.3))" }}
              >
                {dict.home.headline_3}
              </span>
            </h1>

            <p className="text-base mb-8 max-w-md mx-auto leading-relaxed tracking-tight text-slate-500">
              {dict.home.description}
            </p>

            <div className="mb-10 text-center animate-fade-in-up">
              <p className="inline-flex flex-col sm:flex-row items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-700 bg-cyan-50/80 backdrop-blur border border-cyan-200 px-5 py-3 rounded-2xl shadow-sm">
                <span className="text-cyan-500 shrink-0"><Sparkles size={16} /></span>
                <span>{dict.home.hint}</span>
              </p>
            </div>

            {/* ── 機能リスト (統一ボタン形式) ────────────────────────── */}
            <div className="flex flex-col gap-4 mb-10 w-full">
              
              {/* 1. 通常診断 */}
              <Link
                href={`/${lang}/test`}
                className="flex items-center gap-4 p-4 md:p-5 glass-card rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all group border-l-4 border-cyan-400 bg-white/80"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-md">
                  <Sparkles size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-extrabold text-sm md:text-lg text-slate-800 mb-1">
                    {dict.home.cta_button}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                    {lang === "en" 
                      ? "Uncover your deep psychology and interpersonal friction habits using the 16 cognitive function models." 
                      : "16の認知機能モデルから、あなたの深層心理と対人摩擦のクセを暴き出します。"}
                  </p>
                </div>
                <div className="shrink-0 pl-1">
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              {/* 2. 脈ありチェッカー */}
              <Link
                href={`/${lang}/romance-checker`}
                className="flex items-center gap-4 p-4 md:p-5 glass-card rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all group border-l-4 border-fuchsia-400 bg-white/80"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-fuchsia-400 to-pink-500 text-white shadow-md">
                  <Heart size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-extrabold text-sm md:text-lg text-slate-800 mb-1">
                    {lang === "en" ? "Romance Reverse-Lookup Checker" : "脈あり・恋愛逆引きチェッカー"}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                    {lang === "en"
                      ? "Scan their MBTI and pulse rate simply by tapping the target's common behaviors."
                      : "気になる相手の「あるある行動」をタップするだけで、MBTIと脈あり度をスキャン。"}
                  </p>
                </div>
                <div className="shrink-0 pl-1">
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-fuchsia-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              {/* AdSense Space (Mid List) */}
              <div className="my-2 rounded-3xl p-4 bg-slate-50 border border-slate-200 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
                <div className="w-full text-left mb-2 relative z-10">
                  <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Sponsored</span>
                </div>
                <div className="relative z-10 w-full flex-1 flex items-center justify-center overflow-hidden">
                  <AdSenseUnit id="adsense-home-mid" slotId="1111111111" />
                </div>
              </div>

              {/* 3. コミュニケーション翻訳 */}
              <Link
                href={`/${lang}/translate`}
                className="flex items-center gap-4 p-4 md:p-5 glass-card rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all group border-l-4 border-blue-400 bg-white/80"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-400 to-indigo-500 text-white shadow-md">
                  <Languages size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-extrabold text-sm md:text-lg text-slate-800 mb-1">
                    {dict.home.translate_title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                    {dict.home.translate_desc}
                  </p>
                </div>
                <div className="shrink-0 pl-1">
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              {/* 4. ターゲット攻略判定 */}
              <Link
                href={`/${lang}/target-diagnosis`}
                className="flex items-center gap-4 p-4 md:p-5 glass-card rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all group border-l-4 border-violet-500 bg-white/80"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
                  <Zap size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-extrabold text-sm md:text-lg text-slate-800 mb-1">
                    {dict.home.target_title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                    {dict.home.target_desc}
                  </p>
                </div>
                <div className="shrink-0 pl-1">
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>



            {/* AdSense: Bottom */}
            <div className="mt-6">
              <AdSenseUnit id="adsense-bottom" slotId="2222222222" />
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
