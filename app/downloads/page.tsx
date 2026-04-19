import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, AlertTriangle, Copyright } from "lucide-react";
import { TYPE_INFO } from "@/lib/type-info";

export const metadata = {
  title: "キャラクター素材ダウンロード | CognitiveLens",
  description: "全16タイプのキャラクター画像をフリー素材として配布しています。",
};

// Next.js 14 の場合、オブジェクトのキーを配列として取得
const ALL_TYPES = Object.keys(TYPE_INFO);

export default function DownloadsPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-6">
      <div className="max-w-4xl w-full">
        {/* Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-500 transition-colors mb-10"
        >
          <ArrowLeft size={16} /> ホームへ戻る
        </Link>
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full font-bold tracking-widest uppercase mb-4 inline-block">
            Free Assets
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tighter">
            キャラクター画像<br className="sm:hidden"/>フリー配布所
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-lg mx-auto">
            16タイプ診断「CognitiveLens」のオリジナルキャラクター画像を、フリー素材としてダウンロードできます。SNSアイコンやブログ等にご活用ください。
          </p>
        </div>

        {/* Terms of Service */}
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 md:p-8 mb-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-pink-500" />
          <div className="flex items-center gap-3 mb-5 text-rose-600 font-bold">
            <AlertTriangle size={24} />
            <h2 className="text-lg tracking-tight">利用規約（必ずお読みください）</h2>
          </div>
          <ul className="space-y-4 text-sm text-slate-700 leading-relaxed font-medium">
            <li className="flex gap-2">
              <span className="text-rose-500 mt-0.5">✖</span>
              <span><strong>商用利用は一切禁止</strong>です。（グッズ販売、有料コンテンツ、企業アカウントでの利用など）</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-600 mt-0.5">✔</span>
              <span>
                <strong>クレジット表記・リンクが必須</strong>です。<br />
                使用する際は、プロフィールやキャプション等に必ず<br />
                <code className="bg-white px-2 py-1 rounded border border-rose-100 text-xs mt-1 inline-block select-all">
                  画像引用元：CognitiveLens（https://cognitive-lens.com）
                </code>
                <br />を明記してください。
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-rose-500 mt-0.5">✖</span>
              <span>自作発言、二次配布、トレス、公序良俗に反する利用、AIへの学習利用は禁止します。</span>
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-600 mt-0.5">✔</span>
              <span>個人のSNSアイコン、無料ブログ、非商用の動画（要クレジット）での使用は大歓迎です！</span>
            </li>
          </ul>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {ALL_TYPES.map((type) => {
            const info = TYPE_INFO[type];
            // 画像パスがない場合はスキップ（今回は全タイプある前提）
            if (!info.imageUrl) return null;

            return (
              <div 
                key={type} 
                className="glass-card rounded-3xl p-5 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-2 hover:shadow-xl bg-white border border-slate-100 group"
              >
                <div 
                  className={`w-full aspect-square relative mb-4 rounded-2xl bg-gradient-to-br ${info.gradient} flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105`}
                >
                  <div className="w-[85%] h-[85%] relative drop-shadow-xl z-10 transition-transform duration-300 group-hover:scale-110">
                    <Image src={info.imageUrl} alt={info.name} fill className="object-contain" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors z-20 pointer-events-none" />
                </div>
                
                <h3 className="font-extrabold text-slate-800 text-lg mb-0.5 tracking-wider">{type}</h3>
                <p className="text-[11px] text-slate-500 font-bold mb-4 px-2 py-0.5 bg-slate-100 rounded-full">{info.name}</p>
                
                <a
                  href={info.imageUrl}
                  download={`${type}_cognitive_lens.png`}
                  className="w-full bg-slate-100 text-slate-700 hover:bg-cyan-500 hover:text-white transition-colors py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Download size={14} /> ダウンロード
                </a>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-1 font-medium">
            <Copyright size={12} />
            <span>2026 CognitiveLens.</span>
          </div>
          <p className="text-[10px]">すべての画像・テキストの無断転載（規定外の利用）を禁じます。</p>
        </footer>
      </div>
    </main>
  );
}
