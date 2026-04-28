import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "免責事項 | CognitiveLens",
  description: "CognitiveLensの免責事項について",
};

export default async function DisclaimerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <main className="min-h-screen content-layer">
      <nav className="nav-blur flex items-center gap-4 px-6 py-4 sticky top-0 z-10">
        <Link href={`/${lang}`} className="flex items-center gap-1.5 text-xs font-medium transition-colors">
          <ArrowLeft size={14} /> {lang === "en" ? "Back to Home" : "ホームに戻る"}
        </Link>
        <span className="text-sm font-bold tracking-[0.1em]" >cognitive<span>lens</span></span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-10 text-slate-800">
          {lang === "en" ? "Disclaimer" : "免責事項"}
        </h1>
        
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b border-slate-100 text-slate-800">
              {lang === "en" ? "Regarding Diagnostic Results" : "診断結果について"}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === "en" 
                ? "The content provided by 'CognitiveLens', such as the 16-type diagnosis, cognitive function analysis, and interpersonal advice, is based on psychological theories and is intended solely for self-understanding and entertainment purposes. It does not guarantee the accuracy, completeness, or scientific validity of the content, nor should it serve as a substitute for professional medical diagnoses, psychological evaluations, business judgments, or legal advice."
                : "当サービス「CognitiveLens」が提供する16タイプ診断・認知機能分析・対人関係アドバイス等のコンテンツは、心理学の理論をベースにした自己理解・エンターテインメント目的の参考情報として提供されるものです。コンテンツの正確性・完全性・科学的根拠を保証するものではなく、医療的診断・心理的診断・事業的判断・法的アドバイス等に代わるものではありません。"}
            </p>
            <p className="mt-3">
              {lang === "en" 
                ? "The operators of this service shall not be held liable for any damages arising from judgments or actions taken based on the information provided herein. For critical psychological, legal, or medical matters, please be sure to consult a qualified professional (e.g., doctor, counselor, lawyer)."
                : "当サービスが提供する情報に基づいて行われたご自身の判断および行動により生じたいかなる損害についても、当サービスの運営者は一切の責任を負いません。重要な精神的・法的・医療的な問題については、必ず専門家（医師・カウンセラー・弁護士等）の指示を仰いでください。"}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b border-slate-100 text-slate-800">
              {lang === "en" ? "Regarding AI-Generated Content" : "AI生成コンテンツについて"}
            </h2>
            <p>
              {lang === "en"
                ? "This service utilizes generative AI models in certain features (e.g., profile generation, chat translation). The output results and analysis texts are automatically generated based on machine learning, with no intention of disparaging any specific individual or organization. Due to the nature of AI-generated content, we cannot guarantee the accuracy, validity, or completeness of the information."
                : "当サービスの一部（プロファイリング生成、チャット翻訳機能等）において、生成AIモデルを使用しております。出力される結果や分析テキストは機械学習に基づき自動生成されており、特定の個人や団体を貶める意図はありません。また、AIが生成するその性質上、情報の正確性・妥当性・完全性を保証するものではありません。"}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b border-slate-100 text-slate-800">
              {lang === "en" ? "Service Interruption and Modification" : "サービスの中断および変更"}
            </h2>
            <p>
              {lang === "en"
                ? "This service may modify, add, temporarily suspend, or terminate features without prior notice. We shall not be held liable for any disadvantages incurred by users as a result of such actions."
                : "当サービスは事前通知なく機能の変更、追加、一時停止、または終了する場合があります。これによりユーザーに生じたいかなる不利益についても責任を負いかねます。"}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
