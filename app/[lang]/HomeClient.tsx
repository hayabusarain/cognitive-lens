"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Languages, FlaskConical, Zap, Shield, BarChart2, Video, Heart, BookOpen } from "lucide-react";
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
          </div>
        </nav>

        {/* Hero */}
        <section className="relative flex flex-col items-center px-6 pt-12 md:pt-20 pb-12 text-center overflow-hidden">
          
          {/* Floating Characters (Decorations) */}
          <div className="absolute top-12 left-2 md:left-[10%] w-24 h-24 md:w-36 md:h-36 opacity-80 hover:opacity-100 transition-all duration-300 drop-shadow-2xl animate-float pointer-events-none z-0" style={{ animationDelay: "0s", transform: "rotate(-10deg)" }}>
            <Image src="/characters/ENFP.png" alt="ENFP" fill className="object-contain" priority sizes="(max-width: 640px) 96px, 144px" />
          </div>
          <div className="absolute top-4 right-2 md:right-[10%] w-20 h-20 md:w-32 md:h-32 opacity-80 hover:opacity-100 transition-all duration-300 drop-shadow-2xl animate-float pointer-events-none z-0" style={{ animationDelay: "1.5s", transform: "rotate(15deg)" }}>
            <Image src="/characters/INFP.png" alt="INFP" fill className="object-contain" priority sizes="(max-width: 640px) 80px, 128px" />
          </div>
          <div className="absolute top-48 left-[-10px] md:left-[5%] w-16 h-16 md:w-24 md:h-24 opacity-60 hover:opacity-100 transition-all duration-300 drop-shadow-xl animate-float pointer-events-none z-0" style={{ animationDelay: "2.5s", transform: "rotate(-25deg)" }}>
            <Image src="/characters/ESFP.png" alt="ESFP" fill className="object-contain" sizes="(max-width: 640px) 64px, 96px" />
          </div>
          <div className="absolute top-40 right-[-10px] md:right-[5%] w-24 h-24 md:w-32 md:h-32 opacity-70 hover:opacity-100 transition-all duration-300 drop-shadow-2xl animate-float pointer-events-none z-0" style={{ animationDelay: "0.8s", transform: "rotate(20deg)" }}>
            <Image src="/characters/ENTP.png" alt="ENTP" fill className="object-contain" sizes="(max-width: 640px) 96px, 128px" />
          </div>

          <div className="max-w-2xl mx-auto w-full relative z-10">

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
                      ? "Analyze your brain's OS and communication protocol across 16 system architectures." 
                      : "あなたの脳の\"OS仕様\"と\"通信プロトコル\"を16パターンに分類して解析します。"}
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
                    {lang === "en" ? "Target's Pulse Scanner" : "気になるあの人の「脈あり度」スキャン"}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                    {lang === "en"
                      ? "Tap their common behaviors to reverse-scan their affection level."
                      : "相手の「あるある行動」をタップするだけで、あなたへの脈あり度（接続希望度）をスキャン。"}
                  </p>
                </div>
                <div className="shrink-0 pl-1">
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-fuchsia-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              {/* 3. MBTIビンゴ */}
              <Link
                href={`/${lang}/bingo`}
                className="flex items-center gap-4 p-4 md:p-5 glass-card rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all group border-l-4 border-cyan-400 bg-white/80"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-extrabold text-sm md:text-lg text-slate-800 mb-1">
                    {lang === "en" ? "Biased MBTI Bingo" : "偏見だらけのMBTIビンゴ"}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                    {lang === "en"
                      ? "Check off the relatable traits for your type and share your bingo card!"
                      : "「あるある」をタップしてビンゴを作ろう！完成したカードは画像として保存してSNSにシェアできます。"}
                  </p>
                </div>
                <div className="shrink-0 pl-1">
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>

              {/* AdSense Space (Mid List) */}
              <div className="w-full flex items-center justify-center overflow-hidden">
                <AdSenseUnit id="adsense-home-mid" slotId="1111111111" />
              </div>


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

              {/* 5. コラム・記事一覧 */}
              <Link
                href={`/${lang}/articles`}
                className="flex items-center gap-4 p-4 md:p-5 glass-card rounded-3xl hover:-translate-y-1 hover:shadow-lg transition-all group border-l-4 border-emerald-400 bg-white/80"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-extrabold text-sm md:text-lg text-slate-800 mb-1">
                    {lang === "en" ? "16 System Architecture Deep Dive" : "16タイプ別 OS仕様＆通信プロトコル解析コラム"}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed">
                    {lang === "en" ? "Deep dive into each type's system architecture, hidden specs, and communication protocols." : "全16タイプの隠れたスペックや通信の癖を、IT比喩で知的に深掘りした記事まとめ。"}
                  </p>
                </div>
                <div className="shrink-0 pl-1">
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>



            {/* AdSense: Bottom */}
            <div className="mt-6">
              <AdSenseUnit id="adsense-bottom" slotId="2222222222" />
            </div>

            {/* SEO & Context Article Block (for Google AdSense / Crawlers) */}
            <article className="mt-16 text-left space-y-8 bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-sm">
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-cyan-500 rounded-full inline-block"></span>
                  {lang === "en" ? "What is CognitiveLens?" : "CognitiveLens（コグニティブレンズ）とは？"}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {lang === "en" ? (
                    <>Human personality is complicated and exhausting, right? CognitiveLens is an interpersonal friction analytics platform that "reinterprets" the 16 personality types (based on Jung's cognitive function model) into an IT/smartphone metaphor tailored for Gen Z.<br/>By treating human personalities and behavioral patterns as "basic OS specifications" and "communication protocols," it helps you logically debug those unconscious bugs ("Why is this person so hard to talk to?") without getting overly emotional.</>
                  ) : (
                    <>そもそも人間の性格って、複雑すぎてめんどくさいですよね？ CognitiveLensは、ユングの心理学的類型論（認知機能モデル）をベースとした16タイプの性格分類を、Z世代向けのIT・スマホメタファーで「再解釈」した対人課題解決プラットフォームです。<br/>人間の性格や行動パターンを「OSの基本仕様」や「通信プロトコル（意思疎通の規格）」に見立てることで、日常でよくある「なんでこの人、こんなに話が通じないの？」といった無意識のバグ（すれ違い）を、感情論抜きで論理的にデバッグ（解消）しちゃおう、というコンセプトで作られています。</>
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-fuchsia-400 rounded-full inline-block"></span>
                  {lang === "en" ? "Why use an IT Metaphor for Personality Analysis?" : "なぜ性格診断に「ITメタファー」が必要なのか"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {lang === "en" ? (
                    <>Traditional psychological explanations are full of jargon, making them hard to quickly apply to real-world relationships (school, work, dating). Therefore, we translated "Extraverted Feeling (Fe)" into a "Wide-Area Wi-Fi Router (constantly scanning the room's vibe)", and "Introverted Thinking (Ti)" into "Strict Local Compilation (internal logical consistency)".<br/>This allows you to view interpersonal clashes objectively ("We just run on different OSs") instead of taking it personally ("They're just a bad person"), functioning as a practical self-understanding tool to maintain your mental health.</>
                  ) : (
                    <>従来の心理学的な解説って、専門用語ばかりで実際の対人関係（学校、職場、恋愛など）でパッと使うにはちょっとハードルが高いんです。そこで当サイトでは、「外向的感情（Fe）」を『広域Wi-Fiルーター（常に周囲の空気を探知）』、「内向的思考（Ti）」を『ローカル内での厳密なコンパイル（自分の中の論理整合性）』といった独自の言語体系に翻訳しました。<br/>これによって、自分と相手の「どうしても合わない部分」を、「あいつ性格悪いな」ではなく「単にOSが違うだけか」と客観視できるようになり、メンタルヘルスを保つための実用的な自己理解ツールとして機能します。</>
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-violet-400 rounded-full inline-block"></span>
                  {lang === "en" ? "Unique Algorithms and Tool Applications" : "各ツールの独自アルゴリズムと活用方法"}
                </h3>
                <ul className="text-sm text-slate-600 leading-relaxed font-medium space-y-3 list-none pl-0">
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-slate-400 before:rounded-full">
                    <strong className="text-slate-700">{lang === "en" ? "Target's Pulse Scanner:" : "脈あり度（接続希望度）スキャン："}</strong>
                    {lang === "en" ? " An AI reverse-engineers their 'interest level' based on their minor behaviors (texting speed, eye contact) using cognitive functions. It decodes not only obvious affection but also the awkward, specific approaches unique to each type." : "相手の些細な言動（LINEの返信速度、視線の動きなど）から、認知機能に基づいた「あなたへの関心度」をAIが逆算分析します。分かりやすい好意だけでなく、そのタイプ特有の「不器用すぎるアプローチ」を見逃さないための診断ツールです。"}
                  </li>
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-slate-400 before:rounded-full">
                    <strong className="text-slate-700">{lang === "en" ? "Biased MBTI Bingo:" : "偏見だらけの16タイプビンゴ："}</strong>
                    {lang === "en" ? " An entertainment feature placing extreme behavioral patterns on a 24-cell bingo card. Visualizes how closely you follow your type's 'basic specs' or if you carry exceptional bugs." : "各タイプの「あるある行動（ステレオタイプ）」を24個のセルに配置したエンタメ機能。自分がどれだけそのタイプの「基本スペック」に忠実か、あるいは例外的なバグを持っているかを可視化します。"}
                  </li>
                  <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-slate-400 before:rounded-full">
                    <strong className="text-slate-700">{lang === "en" ? "16 Type OS Specs Columns:" : "16タイプ別 OS仕様解析コラム："}</strong>
                    {lang === "en" ? " Detailed articles covering thought circuits, behavioral principles, ideal careers, and 'absolute red flag behaviors' you must never do to them." : "各タイプの思考回路、行動原理、適職、そして「絶対にやってはいけないNG行動（地雷）」を網羅した詳細な解説記事です。"}
                  </li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === "en" 
                    ? "※This site (CognitiveLens) is an independent entertainment and self-understanding platform, not affiliated with the Myers-Briggs Foundation or the official MBTI® assessment. Results and AI-generated content are provided for reference only and are not a substitute for professional medical diagnosis."
                    : "※本サイト（CognitiveLens）は、マイヤーズ・ブリッグス財団や公式のMBTI®テストとは一切関係のない独立したエンターテインメント・自己理解プラットフォームです。診断結果およびAI生成コンテンツは参考情報として提供されており、医療的診断を代行するものではありません。"}
                </p>
              </div>
            </article>

          </div>
        </section>
      </main>
    </>
  );
}
