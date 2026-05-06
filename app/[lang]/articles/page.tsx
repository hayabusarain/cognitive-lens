import { getArticleData } from "@/lib/data-provider";
import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return {
    title: lang === "en" ? "16 Personality Types Romance & Communication Columns | CognitiveLens" : "16タイプ別 恋愛・コミュニケーションコラム一覧 | CognitiveLens",
    description: lang === "en" ? "Deep dive into the romantic tendencies and communication habits of all 16 MBTI personality types." : "16タイプの恋愛傾向やコミュニケーションのクセを深掘りしたコラム記事一覧です。",
  };
}

export default async function ArticlesIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const articleData = getArticleData(lang);
  const types = Object.keys(articleData);

  const title = lang === "en" ? "Romance & Communication Columns" : "恋愛・コミュニケーションコラム";
  const desc = lang === "en" 
    ? "Deeply analyze the unconscious habits, romantic tendencies, and communication friction of all 16 types." 
    : "16タイプの無意識のクセ、恋愛傾向、そして対人摩擦の原因を深く解剖したコラム記事一覧です。";

  return (
    <>
      <div className="aurora-bg">
        <div className="aurora-mid" />
      </div>

      <main className="content-layer flex flex-col min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto w-full">
          
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-6 shadow-lg shadow-indigo-500/30">
              <BookOpen size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
              {title}
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {types.map((type) => {
              const article = articleData[type];
              return (
                <Link 
                  key={type} 
                  href={`/${lang}/article/${type}`}
                  className="glass-card p-6 rounded-3xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full border border-white/40 shadow-sm hover:shadow-xl relative overflow-hidden bg-white/40"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-fuchsia-500/10 to-blue-500/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 drop-shadow-sm">
                      {type}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Sparkles size={14} />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 line-clamp-3 mt-auto">
                    {article.basic}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link 
              href={`/${lang}`}
              className="inline-block px-6 py-3 rounded-full bg-white/60 text-slate-600 font-bold hover:bg-white transition-colors shadow-sm"
            >
              {lang === "en" ? "Back to Home" : "トップページに戻る"}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
