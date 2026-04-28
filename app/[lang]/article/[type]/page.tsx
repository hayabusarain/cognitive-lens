import { getArticleData } from "@/lib/data-provider";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Zap, ShieldAlert, BookOpen } from "lucide-react";
import AdSenseUnit from "@/app/components/ads/AdSenseUnit";

// 1. SSGのためのパラメータ生成
export async function generateStaticParams() {
  const { ARTICLE_DATA } = await import("@/lib/article-data");
  const types = Object.keys(ARTICLE_DATA);
  const params: { lang: string; type: string }[] = [];
  
  for (const lang of ["ja", "en"]) {
    for (const type of types) {
      params.push({ lang, type });
    }
  }
  
  return params;
}

// 2. SEOメタデータの生成
export async function generateMetadata({ params }: { params: Promise<{ lang: string; type: string }> }) {
  const { lang, type } = await params;
  const articleData = getArticleData(lang);
  const article = articleData[type.toUpperCase()];
  if (!article) return {};
  return {
    title: `${article.title} | CognitiveLens 恋愛心理コラム`,
    description: article.basic.slice(0, 120) + "...",
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ lang: string; type: string }> }) {
  const { lang, type } = await params;
  const typeKey = type.toUpperCase();
  const articleData = getArticleData(lang);
  const article = articleData[typeKey];

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 relative pb-24 md:pb-0 overflow-hidden font-sans">
      {/* Background Aurora */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-400/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
        <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8">
          <ArrowLeft size={16} />
          {lang === "en" ? "Back to Home" : "トップへ戻る"}
        </Link>
        
        <article className="glass-card rounded-3xl p-6 sm:p-10 border border-white/50 shadow-sm relative overflow-hidden bg-white/60 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="flex-1 w-full text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-relaxed tracking-tight">
                {article.title}
              </h1>
            </div>
            {article && (
              <div className="w-32 h-32 sm:w-40 sm:h-40 relative flex-shrink-0 drop-shadow-lg">
                <Image src={`/characters/${typeKey}.png`} alt={typeKey} fill className="object-contain" sizes="(max-width: 640px) 128px, 160px" priority />
              </div>
            )}
          </div>

          <div className="space-y-10 text-slate-700 leading-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-500"><Heart size={20} /></div>
                <h2 className="text-xl font-bold text-slate-800">{lang === "en" ? "Basic Romance Psychology" : "基本の恋愛心理"}</h2>
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
                <h2 className="text-xl font-bold text-slate-800">{lang === "en" ? "Who You're Attracted To & Compatibility" : "惹かれる相手と相性"}</h2>
              </div>
              <p className="text-[15px]">{article.attraction}</p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-violet-50 text-violet-500"><ShieldAlert size={20} /></div>
                <h2 className="text-xl font-bold text-slate-800">{lang === "en" ? "Fatal Weaknesses & Relationship Breakers" : "致命的弱点と関係崩壊の引き金"}</h2>
              </div>
              <p className="text-[15px]">{article.weakness}</p>
            </section>

            <section className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-500"><BookOpen size={20} /></div>
                <h2 className="text-lg font-bold text-slate-800">{lang === "en" ? "Manual for Building the Ideal Relationship" : "理想の関係を築くためのトリセツ"}</h2>
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
                  <h2 className="text-lg font-bold text-fuchsia-900 tracking-tight">{lang === "en" ? "【Special】5 Genuine Signs They Like You" : "【特別公開】このタイプの脈ありサイン・ガチ5選"}</h2>
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

            {/* ── マッチングアプリアフィリエイト誘導用コンポーネント（プレビュー） ── */}
            <div className="mt-12 overflow-hidden relative rounded-3xl bg-gradient-to-br from-pink-500 to-rose-400 p-[2px] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-white/95 backdrop-blur-sm rounded-[22px] p-6 sm:p-8 relative overflow-hidden">
                {/* 装飾用背景 */}
                <Heart className="absolute -right-8 -bottom-8 w-40 h-40 text-pink-50 -rotate-12 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="inline-flex items-center justify-center bg-pink-50 text-pink-600 border border-pink-200 px-3 py-1 rounded-full text-[10px] font-bold mb-4 tracking-widest uppercase">
                    Sponsored
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-4 leading-tight tracking-tight">
                    {lang === "en" ? (
                      <>
                        How to meet the perfect match for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">{typeKey}</span>?
                      </>
                    ) : (
                      <>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                          {typeKey}のあなた
                        </span>
                        と運命の出会いを果たすには？
                      </>
                    )}
                  </h3>
                  
                  <p className="text-[13px] sm:text-[15px] text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
                    {lang === "en" ? (
                      <>
                        The more you understand your own personality,<br className="hidden sm:block"/>the clearer it becomes who you're compatible with.
                        <br />
                        Why not take the next step on Japan's largest app where you can <span className="font-bold text-slate-800 bg-pink-100/50 px-1 rounded">find matches by values and compatibility</span>?
                      </>
                    ) : (
                      <>
                        自分の性格をもっと深く知るほど、<br className="hidden sm:block"/>自分に合った人が見えてきます。
                        <br />
                        <span className="font-bold text-slate-800 bg-pink-100/50 px-1 rounded">価値観や相性で相手を探せる</span>国内最大級のアプリで、
                        次の一歩を踏み出してみませんか？
                      </>
                    )}
                  </p>
                  
                  {/* アフィリエイトリンク先（あとで実際のURLに書き換えてください） */}
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-[0_8px_30px_rgb(244,63,94,0.3)] hover:shadow-[0_8px_40px_rgb(244,63,94,0.5)] overflow-hidden"
                  >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-64 group-hover:h-64 opacity-20"></span>
                    <Heart className="w-4 h-4 mr-2 animate-bounce fill-white/90" />
                    {lang === "en" ? "Find Your Perfect Match (Free)" : "相性ピッタリの相手を探す（登録無料）"}
                  </a>
                  
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-4 max-w-xs mx-auto">
                    {lang === "en" ? "* Free registration. Completely free for women, men can use for free until matching!" : "※登録無料。女性は完全無料・男性もマッチングまで無料で使えます！"}
                  </p>
                </div>
              </div>
            </div>
            {/* ──────────────────────────────────────────────── */}
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link href={`/${lang}/result?type=${typeKey}`} className="inline-block px-8 py-4 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-700 transition-transform hover:scale-105 shadow-xl">
            {lang === "en" ? `Proceed to ${typeKey} AI Profiling` : `${typeKey}のAIプロファイリング診断へ進む`}
          </Link>
        </div>
      </div>
    </main>
  );
}
