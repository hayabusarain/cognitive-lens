import { ARTICLE_DATA } from "@/lib/article-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Zap, ShieldAlert, BookOpen } from "lucide-react";
import AdSenseUnit from "@/app/components/ads/AdSenseUnit";

// 1. SSGのためのパラメータ生成
export async function generateStaticParams() {
  return Object.keys(ARTICLE_DATA).map((type) => ({ type }));
}

// 2. SEOメタデータの生成
export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const article = ARTICLE_DATA[type.toUpperCase()];
  if (!article) return {};
  return {
    title: `${article.title} | CognitiveLens 恋愛心理コラム`,
    description: article.basic.slice(0, 120) + "...",
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const typeKey = type.toUpperCase();
  const article = ARTICLE_DATA[typeKey];

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 relative pb-24 md:pb-0 overflow-hidden font-sans">
      {/* Background Aurora */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-400/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8">
          <ArrowLeft size={16} />
          トップへ戻る
        </Link>
        
        <article className="glass-card rounded-3xl p-6 sm:p-10 border border-white/50 shadow-sm relative overflow-hidden bg-white/60 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="flex-1 w-full text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-relaxed tracking-tight">
                {article.title}
              </h1>
            </div>
            {ARTICLE_DATA[typeKey] && (
              <div className="w-32 h-32 sm:w-40 sm:h-40 relative flex-shrink-0 drop-shadow-lg">
                <Image src={`/characters/${typeKey}.png`} alt={typeKey} fill className="object-contain" sizes="(max-width: 640px) 128px, 160px" priority />
              </div>
            )}
          </div>

          <div className="space-y-10 text-slate-700 leading-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-500"><Heart size={20} /></div>
                <h2 className="text-xl font-bold text-slate-800">基本の恋愛心理</h2>
              </div>
              <p className="text-[15px]">{article.basic}</p>
            </section>

            {/* AdSense In-Article */}
            <div className="my-8 glass-card rounded-3xl p-4 min-h-[250px] w-full flex flex-col items-center justify-center border border-white/40 shadow-sm relative overflow-hidden bg-white/40">
              <div className="w-full text-left mb-2">
                <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Sponsored</span>
              </div>
              <div className="relative z-10 w-full flex-1 flex items-center justify-center overflow-hidden">
                <AdSenseUnit id="adsense-article-mid" slotId="8888888888" />
              </div>
            </div>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-500"><Zap size={20} /></div>
                <h2 className="text-xl font-bold text-slate-800">惹かれる相手と相性</h2>
              </div>
              <p className="text-[15px]">{article.attraction}</p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-violet-50 text-violet-500"><ShieldAlert size={20} /></div>
                <h2 className="text-xl font-bold text-slate-800">致命的弱点と関係崩壊の引き金</h2>
              </div>
              <p className="text-[15px]">{article.weakness}</p>
            </section>

            <section className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-500"><BookOpen size={20} /></div>
                <h2 className="text-lg font-bold text-slate-800">理想の関係を築くためのトリセツ</h2>
              </div>
              <div className="text-[15px] space-y-3">
                {article.manual.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </section>

            {article.pulseSigns && article.pulseSigns.length > 0 && (
              <section className="mt-8 bg-fuchsia-50/50 rounded-2xl p-6 border border-fuchsia-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  <div className="p-2 rounded-xl bg-fuchsia-100 text-fuchsia-500"><Heart size={20} className="fill-fuchsia-500" /></div>
                  <h2 className="text-lg font-bold text-fuchsia-900 tracking-tight">【特別公開】このタイプの脈ありサイン・ガチ5選</h2>
                </div>
                <ul className="space-y-3 relative z-10">
                  {article.pulseSigns.map((sign, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-fuchsia-200 text-fuchsia-600 text-xs font-bold mt-0.5">{i + 1}</span>
                      <span className="text-[14px] text-slate-700 leading-snug">{sign}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link href={`/result?type=${typeKey}`} className="inline-block px-8 py-4 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-700 transition-transform hover:scale-105 shadow-xl">
            {typeKey}のAIプロファイリング診断へ進む
          </Link>
        </div>
      </div>
    </main>
  );
}
