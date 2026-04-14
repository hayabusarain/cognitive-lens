import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "免責事項 | CognitiveLens",
  description: "CognitiveLensの免責事項について",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen content-layer">
      <nav className="nav-blur flex items-center gap-4 px-6 py-4 sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-1.5 text-xs font-medium transition-colors">
          <ArrowLeft size={14} /> ホームに戻る
        </Link>
        <span className="text-sm font-bold tracking-[0.1em]" >cognitive<span>lens</span></span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-10 text-slate-800">免責事項</h1>
        
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b border-slate-100 text-slate-800">
              診断結果について
            </h2>
            <p>
              当サービス「CognitiveLens」が提供するMBTI診断・認知機能分析・対人関係アドバイス等のコンテンツは、心理学の理論をベースにした自己理解・エンターテインメント目的の参考情報として提供されるものです。
              医学的、心理学的、あるいは法的な専門的診断の代替として機能するものではありません。
            </p>
            <p className="mt-3">
              当サービスが提供する情報に基づいて行われたご自身の判断および行動により生じたいかなる損害についても、当サービスの運営者は一切の責任を負いません。重要な精神的・法的・医療的な問題については、必ず専門家（医師・カウンセラー・弁護士等）の指示を仰いでください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b border-slate-100 text-slate-800">
              AI生成コンテンツについて
            </h2>
            <p>
              当サービスの一部（プロファイリング生成、チャット翻訳機能等）において、生成AIモデルを使用しております。出力される結果や分析テキストは機械学習に基づき自動生成されており、特定の個人や団体を貶める意図はありません。
              また、AIが生成するその性質上、情報の正確性・妥当性・完全性を保証するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b border-slate-100 text-slate-800">
              サービスの中断および変更
            </h2>
            <p>
              当サービスは事前通知なく機能の変更、追加、一時停止、または終了する場合があります。これによりユーザーに生じたいかなる不利益についても責任を負いかねます。
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
