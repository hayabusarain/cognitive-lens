"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Languages, FlaskConical, Zap, Shield, BarChart2, Video } from "lucide-react";
import AdSenseUnit from "@/app/components/ads/AdSenseUnit";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [latestRank, setLatestRank] = useState<any>(null);

  useEffect(() => {
    // 開発/ローカル環境で自動生成された最新ランキングを取得
    fetch("/latest-rank.json")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.isTop5 && data.rank1Type) {
          setLatestRank(data);
        }
      })
      .catch(e => console.error("Failed to fetch latest rank", e));
  }, []);

  return (
    <>
      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-mid" />
      </div>

      <main className="content-layer min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="nav-blur flex items-center justify-between px-6 md:px-8 py-4 sticky top-0 z-10">
          <span className="text-sm font-extrabold tracking-tighter text-slate-800">
            cognitive
            <span style={{ color: "#00e5ff", textShadow: "0 0 12px rgba(0,229,255,0.3)" }}>lens</span>
          </span>
          <span className="text-[10px] px-3 py-1 rounded-full font-bold tracking-widest badge-neon">
            β BETA
          </span>
        </nav>

        {/* ── 動画連動 特大広告バナー（最新ランキングの第1位） ── */}
        {latestRank && (
          <div className="w-full bg-gradient-to-r from-rose-600 to-pink-600 shadow-2xl overflow-hidden relative animate-fade-in-down z-20">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            <div className="max-w-4xl mx-auto p-4 md:p-6 text-center text-white relative z-10 flex flex-col md:flex-row items-center gap-6 justify-center">
              
              <div className="flex-1 text-left w-full">
                <div className="inline-flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <Video size={14} className="text-rose-200" />
                  TikTok最新動画の答え合わせ！
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-1 leading-tight text-white drop-shadow-md">
                  「{latestRank.title}」<br/>
                  圧倒的第1位は...
                  <span className="text-yellow-300 ml-2 text-4xl">{latestRank.rank1Type}</span> !!
                </h2>
                
                {latestRank.rank1Reason && (
                  <div className="mt-4 bg-black/20 p-4 rounded-xl border border-rose-400/30 backdrop-blur-sm w-full md:w-4/5">
                    <p className="text-rose-50 text-sm font-bold leading-relaxed">
                      <span className="text-yellow-300 mb-1 block text-xs">【選ばれた理由】</span>
                      {latestRank.rank1Reason}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* AdSense: Header */}
        <AdSenseUnit id="adsense-header" slotId="1111111111" />

        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="max-w-2xl mx-auto w-full">

            {/* Badge */}
            <div className="bubble mb-8">
              <Sparkles size={12} className="text-cyan-500" />
              <span>16タイプ × コミュニケーション分析</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.2] mb-5 tracking-tighter text-slate-800 break-keep">
              あなたの奥底に潜む、
              <br />
              <span className="inline-block">無意識のクセを</span>
              <br />
              <span
                className="bg-clip-text text-transparent bg-gradient-to-br from-cyan-500 via-violet-500 to-fuchsia-500"
                style={{ filter: "drop-shadow(0 0 16px rgba(0,229,255,0.3))" }}
              >
                暴いて、言語化する。
              </span>
            </h1>

            <p className="text-base mb-8 max-w-md mx-auto leading-relaxed tracking-tight text-slate-500">
              見たくなかった自分に、嫌でも気づく。
              <br />
              けど、たぶんそれが一番ラクになる近道。
            </p>

            <div className="mb-10 text-center animate-fade-in-up">
              <p className="inline-flex flex-col sm:flex-row items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-700 bg-cyan-50/80 backdrop-blur border border-cyan-200 px-5 py-3 rounded-2xl shadow-sm">
                <span className="text-cyan-500 shrink-0"><Sparkles size={16} /></span>
                <span>迷ったら、仕事中ではなく<span className="text-cyan-600 bg-cyan-100/50 px-1 rounded mx-0.5">『完全に自由な休日の自分』</span>を思い浮かべて答えてね</span>
              </p>
            </div>

            {/* ── 2 Routes ─────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
              <Link
                href="/test"
                className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm"
              >
                無料で診断する
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/skip-path"
                className="glass-card inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <FlaskConical size={14} className="text-violet-500" />
                タイプを知っている方はこちら
              </Link>
            </div>

            {/* ── Bento Grid ────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              {/* ★ メインカード: コミュニケーション翻訳（大きく強調） */}
              <Link
                href="/translate"
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
                    メッセージの深層心理を翻訳
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 mb-3">
                    「別にいいよ」の裏にある本音、「忙しい？」に隠された寂しさ——
                    <br className="hidden sm:block" />
                    相手の言葉の奥にある感情を、AIが的確に読み解きます。
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 group-hover:text-cyan-700 transition-colors">
                    翻訳を試す
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
              {/* ★ メインカード2: ターゲットを勝手に診断する */}
              <Link
                href="/target-diagnosis"
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
                    あの人の16タイプ、勝手に丸裸にする
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300 mb-3">
                    「LINEの返信ペースは？」「フッカル？」— 20の質問に答えるだけで、
                    <br className="hidden sm:block" />
                    ターゲットの思考のクセと本来の姿をまる裸にします。
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors">
                    深淵モードで裏診断する
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>

              {/* サブカード1: 認知クセの可視化 */}
              <div className="glass-card rounded-3xl p-5 text-left border bg-amber-50 border-amber-200 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 transform -rotate-12 transition-transform duration-500 group-hover:-translate-y-1 pointer-events-none drop-shadow-lg z-0">
                  <Image src="/characters/INTP.png" alt="INTP" fill className="object-contain" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-2xl mb-3 shadow-sm border bg-amber-50 border-amber-200">
                    <Zap size={17} className="text-amber-500" />
                  </div>
                  <h3 className="font-extrabold text-sm mb-1.5 tracking-tighter text-slate-800">
                    認知のクセを可視化
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    なんで分かり合えないのか、もう言い訳できないくらいハッキリ見える。
                  </p>
                </div>
              </div>

              {/* AdSense: Bento Grid In-feed */}
              <div className="col-span-2 lg:col-span-1 glass-card rounded-3xl p-4 relative overflow-hidden transition-all hover:shadow-lg min-h-[250px] flex flex-col items-center justify-center border border-white/40">
                <div className="w-full text-left mb-2">
                  <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Sponsored</span>
                </div>
                <div className="relative z-10 w-full flex-1 flex items-center justify-center overflow-hidden">
                  <AdSenseUnit id="adsense-bento-infeed" slotId="2222222222" />
                </div>
              </div>

              {/* サブカード2: 相性マップ */}
              <div className="glass-card rounded-3xl p-5 text-left border bg-violet-50 border-violet-200 relative overflow-hidden group">
                <div className="absolute -right-3 top-2 w-24 h-24 transform rotate-12 transition-transform duration-500 group-hover:scale-110 pointer-events-none drop-shadow-lg z-0">
                  <Image src="/characters/ESFJ.png" alt="ESFJ" fill className="object-contain" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-2xl mb-3 shadow-sm border bg-violet-50 border-violet-200">
                    <Shield size={17} className="text-violet-500" />
                  </div>
                  <h3 className="font-extrabold text-sm mb-1.5 tracking-tighter text-slate-800">
                    人間関係の相性マップ
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    どのタイプと一緒にいると最強で、どのとは確実に詰むのか。その理由まで全部暴く。
                  </p>
                </div>
              </div>

              {/* サブカード3: 弱点レーダー＆相性デスゲーム */}
              <div className="col-span-2 glass-card rounded-3xl p-5 text-left border bg-rose-50 border-rose-200 relative overflow-hidden group">
                <div className="absolute right-4 -bottom-6 w-28 h-28 transform -rotate-6 transition-transform duration-500 group-hover:scale-110 pointer-events-none drop-shadow-xl z-0">
                  <Image src="/characters/ESTJ.png" alt="ESTJ" fill className="object-contain" />
                </div>
                <div className="absolute right-24 -bottom-4 w-20 h-20 transform rotate-12 transition-transform duration-500 group-hover:-translate-x-2 pointer-events-none drop-shadow-md z-0">
                  <Image src="/characters/ISTP.png" alt="ISTP" fill className="object-contain" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-2xl mb-3 shadow-sm border bg-rose-50 border-rose-200">
                    <BarChart2 size={17} className="text-rose-500" />
                  </div>
                  <h3 className="font-extrabold text-sm mb-1.5 tracking-tighter text-slate-800">
                    限界パラメーター＆相性デスゲーム
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    AIが5軸の致命的な欠陥をスコアリング。<br className="hidden sm:block" />さらに2タイプの相性から「最悪の未来」をシミュレーション。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AdSense: Footer */}
        <AdSenseUnit id="adsense-footer" slotId="3333333333" />

        {/* Global Footer */}
        <footer className="w-full py-12 text-center flex flex-col items-center justify-center gap-5 bg-transparent mt-8 border-t border-slate-200/50">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/downloads" className="text-sm font-bold text-slate-500 hover:text-cyan-500 transition-colors">
              キャラクター画像フリー素材
            </Link>
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wider">
            © 2026 CognitiveLens. All Rights Reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
