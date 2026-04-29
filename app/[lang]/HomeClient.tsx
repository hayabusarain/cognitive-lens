"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Languages, FlaskConical, Zap, Shield, BarChart2, Video } from "lucide-react";
import AdSenseUnit from "@/app/components/ads/AdSenseUnit";
import { useEffect, useState } from "react";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function HomeClient({ dict, lang, initialLatestRank }: { dict: any, lang: string, initialLatestRank?: any }) {
  const [latestRank, setLatestRank] = useState<any>(initialLatestRank || null);

  useEffect(() => {
    // If not provided by SSR, attempt to fetch (fallback)
    if (!latestRank) {
      fetch("/latest-rank.json")
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.isTop5 && data.rank1Type) {
            setLatestRank(data);
          }
        })
        .catch(e => console.error("Failed to fetch latest rank", e));
    }
  }, [latestRank]);

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

        {/* ── 動画連動 特大広告バナー（最新ランキングの第1位） ── */}
        {latestRank && (
          <div className="w-full bg-gradient-to-r from-rose-600 to-pink-600 shadow-2xl overflow-hidden relative animate-fade-in-down z-20">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <div className="max-w-4xl mx-auto p-4 md:p-6 text-center text-white relative z-10 flex flex-col md:flex-row items-center gap-6 justify-center">
              
              <div className="flex-1 text-left w-full">
                <div className="inline-flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <Video size={14} className="text-rose-200" />
                  {dict.home.banner_badge}
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-1 leading-tight text-white drop-shadow-md">
                  {dict.home.banner_prefix}{latestRank.title}{dict.home.banner_suffix}<br/>
                  <span className="text-yellow-300 ml-2 text-4xl">{latestRank.rank1Type}</span> !!
                </h2>
                
                {latestRank.rank1Reason && (
                  <div className="mt-4 bg-black/20 p-4 rounded-xl border border-rose-400/30 backdrop-blur-sm w-full md:w-4/5">
                    <p className="text-rose-50 text-sm font-bold leading-relaxed">
                      <span className="text-yellow-300 mb-1 block text-xs">{dict.home.banner_reason_label}</span>
                      {latestRank.rank1Reason}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

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

            {/* ── 2 Routes ─────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link
                href={`/${lang}/test`}
                className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm"
              >
                {dict.home.cta_button}
                <ArrowRight size={15} />
              </Link>
              <Link
                href={`/${lang}/skip-path`}
                className="glass-card inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <FlaskConical size={14} className="text-violet-500" />
                {dict.home.about_link}
              </Link>
            </div>

            {/* ── Bento Grid ────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              {/* ★ メインカード: コミュニケーション翻訳（大きく強調） */}
              <Link
                href={`/${lang}/translate`}
                className="col-span-2 glass-card rounded-3xl p-6 text-left group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute -right-2 -bottom-6 w-32 h-32 transition-transform duration-500 group-hover:scale-110 pointer-events-none drop-shadow-xl z-0">
                  <Image src="/characters/INFJ.png" alt="INFJ" fill className="object-contain" priority />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-4 shadow-md bg-gradient-to-br from-cyan-400 to-blue-500 text-white">
                    <Languages size={20} />
                  </div>
                  <h3 className="font-extrabold text-lg mb-2 tracking-tighter text-slate-800">
                    {dict.home.translate_title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 mb-3">
                    {dict.home.translate_desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 group-hover:text-cyan-700 transition-colors">
                    {dict.home.translate_cta}
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
              {/* ★ メインカード2: ターゲットを勝手に診断する */}
              <Link
                href={`/${lang}/target-diagnosis`}
                className="col-span-2 glass-card rounded-3xl p-6 text-left group relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-violet-500/30 bg-slate-950"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-900/40 via-fuchsia-900/20 to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
                
                {/* Character Mosaics Background */}
                <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
                  <div className="absolute -right-6 -bottom-4 w-32 h-32 transform rotate-12 drop-shadow-2xl transition-transform duration-700 group-hover:scale-110">
                    <Image src="/characters/ENTJ.png" alt="ENTJ" fill className="object-contain" sizes="128px" priority />
                  </div>
                  <div className="absolute right-12 top-4 w-24 h-24 transform -rotate-12 drop-shadow-xl transition-transform duration-1000 group-hover:scale-110">
                    <Image src="/characters/ENFP.png" alt="ENFP" fill className="object-contain" sizes="96px" priority />
                  </div>
                  <div className="absolute right-32 -bottom-2 w-20 h-20 transform rotate-6 drop-shadow-md transition-transform duration-500 group-hover:-translate-y-2">
                    <Image src="/characters/ESTP.png" alt="ESTP" fill className="object-contain" sizes="80px" />
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-4 shadow-[0_0_15px_rgba(192,132,252,0.5)] bg-slate-800 text-fuchsia-400 border border-fuchsia-500/50">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="font-extrabold text-lg mb-2 tracking-tighter text-white drop-shadow-[0_0_5px_rgba(192,132,252,0.5)]">
                    {dict.home.target_title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300 mb-3">
                    {dict.home.target_desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors">
                    {dict.home.target_cta}
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>

              {/* サブカード1: 認知クセの可視化 */}
              <div className="glass-card rounded-3xl p-5 text-left border bg-amber-50 border-amber-200 relative overflow-hidden group">
                <div className="mb-3 w-8 h-8 rounded-xl bg-amber-200 flex items-center justify-center text-amber-600">
                  <BarChart2 size={16} />
                </div>
                <h3 className="font-bold text-sm mb-1 text-slate-800">{dict.home.sub_1_title}</h3>
                <p className="text-xs text-slate-500">{dict.home.sub_1_desc}</p>
              </div>

              {/* サブカード2 */}
              <div className="glass-card rounded-3xl p-5 text-left border bg-emerald-50 border-emerald-200 relative overflow-hidden group">
                <div className="mb-3 w-8 h-8 rounded-xl bg-emerald-200 flex items-center justify-center text-emerald-600">
                  <Shield size={16} />
                </div>
                <h3 className="font-bold text-sm mb-1 text-slate-800">{dict.home.sub_2_title}</h3>
                <p className="text-xs text-slate-500">{dict.home.sub_2_desc}</p>
              </div>
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
