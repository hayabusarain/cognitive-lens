import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "運営者情報 | CognitiveLens",
  description: "CognitiveLensの運営者について",
};

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
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
          {lang === "en" ? "About Us" : "運営者情報"}
        </h1>
        
        <div className="space-y-6 text-sm text-slate-700">
          <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50">
            <dl className="grid grid-cols-[100px_1fr] gap-y-4">
              <dt className="text-slate-500 font-semibold">{lang === "en" ? "Service" : "サービス名"}</dt>
              <dd className="font-medium text-slate-800">CognitiveLens</dd>

              <dt className="text-slate-500 font-semibold">{lang === "en" ? "Operator" : "運営者"}</dt>
              <dd>{lang === "en" ? "CognitiveLens Development Team" : "CognitiveLens 開発プロジェクトチーム"}</dd>

              <dt className="text-slate-500 font-semibold">{lang === "en" ? "Official SNS" : "公式SNS"}</dt>
              <dd>
                <a 
                  href="https://x.com/CognitiveLens_" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-600 font-bold hover:text-cyan-700 underline underline-offset-2 flex items-center gap-1"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  {lang === "en" ? "Follow us on X" : "X（旧Twitter）公式アカウント"}
                </a>
              </dd>

              <dt className="text-slate-500 font-semibold">{lang === "en" ? "Contact" : "お問い合わせ"}</dt>
              <dd>
                {lang === "en" 
                  ? "For inquiries regarding the service, advertising placements, or other matters, please contact us via the feedback feature within the app or DM us on our official social media accounts."
                  : "サービスに関するお問い合わせ、広告掲載のご相談等は、サービス内のフィードバック機能または公式SNSアカウントへのDMにて承ります。"}
              </dd>
            </dl>
          </div>

          <p className="pt-4 leading-relaxed">
            {lang === "en" 
              ? "We are developing this service with the aim of promoting mutual understanding by verbalizing the 'unconscious friction in interpersonal relationships.' By combining the latest AI technology with cognitive function models, we hope to help you find hints that will make your life a little bit easier."
              : "私たちは「対人関係における無意識の摩擦」を言語化し、相互理解を促進することを目指して本サービスを開発しています。最新のAI技術と認知機能モデルを組み合わせ、少しでもあなたの人生がラクになるヒントを見つけるお手伝いができれば幸いです。"}
          </p>
        </div>
      </div>
    </main>
  );
}
