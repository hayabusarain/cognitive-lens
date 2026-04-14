import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "運営者情報 | CognitiveLens",
  description: "CognitiveLensの運営者について",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen content-layer">
      <nav className="nav-blur flex items-center gap-4 px-6 py-4 sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-1.5 text-xs font-medium transition-colors">
          <ArrowLeft size={14} /> ホームに戻る
        </Link>
        <span className="text-sm font-bold tracking-[0.1em]" >cognitive<span>lens</span></span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-10 text-slate-800">運営者情報</h1>
        
        <div className="space-y-6 text-sm text-slate-700">
          <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50">
            <dl className="grid grid-cols-[100px_1fr] gap-y-4">
              <dt className="text-slate-500 font-semibold">サービス名</dt>
              <dd className="font-medium text-slate-800">CognitiveLens</dd>

              <dt className="text-slate-500 font-semibold">運営者</dt>
              <dd>CognitiveLens 開発プロジェクトチーム</dd>

              <dt className="text-slate-500 font-semibold">お問い合わせ</dt>
              <dd>
                サービスに関するお問い合わせ、広告掲載のご相談等は、サービス内のフィードバック機能または公式SNSアカウントへのDMにて承ります。
              </dd>
            </dl>
          </div>

          <p className="pt-4 leading-relaxed">
            私たちは「対人関係における無意識の摩擦」を言語化し、相互理解を促進することを目指して本サービスを開発しています。
            最新のAI技術と認知機能モデルを組み合わせ、少しでもあなたの人生がラクになるヒントを見つけるお手伝いができれば幸いです。
          </p>
        </div>
      </div>
    </main>
  );
}
