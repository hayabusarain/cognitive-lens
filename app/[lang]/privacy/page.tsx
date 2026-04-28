import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy & Disclaimer | CognitiveLens",
  description: "CognitiveLens Privacy Policy, Cookie Usage, and Disclaimer",
};

const LAST_UPDATED = "2025-01-01";

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <main className="min-h-screen">
      {/* Header */}
      <nav className="nav-blur flex items-center gap-4 px-6 py-4 sticky top-0 z-10">
        <Link
          href={`/${lang}`}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
        >
          <ArrowLeft size={14} />
          {lang === "en" ? "Back to Home" : "ホームに戻る"}
        </Link>
        <span className="text-sm font-bold tracking-[0.1em]">
          cognitive<span>lens</span>
        </span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-1">
          {lang === "en" ? "Privacy Policy & Disclaimer" : "プライバシーポリシー・免責事項"}
        </h1>
        <p className="text-xs mb-10">
          {lang === "en" ? `Last Updated: ${LAST_UPDATED}` : `最終更新日：${LAST_UPDATED}`}
        </p>

        <div className="space-y-10 text-sm leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              {lang === "en" ? "1. Disclaimer Regarding Diagnostic Results" : "1. 診断結果の免責事項"}
            </h2>
            <p>
              {lang === "en" 
                ? "The 16-type diagnosis, cognitive function analysis, and interpersonal advice provided by our service 'CognitiveLens' are intended as reference information for self-understanding and entertainment purposes. We do not guarantee the accuracy, completeness, or scientific validity of the diagnostic results. They cannot be used as a substitute for medical diagnoses, psychological evaluations, or legal advice."
                : "当サービス「CognitiveLens」が提供する16タイプ診断・認知機能分析・対人関係アドバイスは、エンターテインメント・自己理解のための参考情報として提供されるものです。診断結果の正確性・完全性・科学的根拠を保証するものではなく、医療的診断・心理的診断・法的アドバイスの代替として使用することはできません。"}
            </p>
            <p className="mt-3">
              {lang === "en"
                ? "We shall not be held liable for any damages resulting from judgments or actions based on the diagnostic results. For critical life decisions, please consult professionals (doctors, counselors, lawyers, etc.)."
                : "診断結果に基づいて行われた判断・行動によって生じたいかなる損害についても、当サービスは一切の責任を負いません。重要な人生の決断には、専門家（医師・カウンセラー・弁護士等）にご相談ください。"}
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              {lang === "en" ? "2. Information We Collect" : "2. 収集する情報"}
            </h2>
            <p>{lang === "en" ? "This service may collect the following information:" : "当サービスは、以下の情報を収集する場合があります。"}</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>
                <strong>{lang === "en" ? "Diagnostic Response Data: " : "診断回答データ："}</strong>
                {lang === "en" 
                  ? "Answers to the questions for 16-type determination (E/I, S/N, T/F, J/P choices). This does not include personally identifiable information."
                  : "16タイプ判定のための設問への回答（E/I, S/N, T/F, J/P の選択結果）。個人を特定する情報は含まれません。"}
              </li>
              <li>
                <strong>{lang === "en" ? "Log Data: " : "ログデータ："}</strong>
                {lang === "en"
                  ? "IP addresses, browser types, referrer URLs, and access dates/times. Used primarily for rate limiting (preventing excessive requests)."
                  : "アクセスIPアドレス、ブラウザ種別、参照元URL、アクセス日時。主にレートリミット（過剰リクエスト防止）に使用されます。"}
              </li>
              <li>
                <strong>{lang === "en" ? "Cookies & Local Storage: " : "Cookie・ローカルストレージ："}</strong>
                {lang === "en"
                  ? "Records of cookie consent and user settings (such as theme preferences)."
                  : "Cookie同意の記録、テーマ設定等のユーザー設定の保存。"}
              </li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              {lang === "en" ? "3. Use of Cookies and Tracking Technologies" : "3. Cookieおよびトラッキング技術の使用"}
            </h2>
            <p>
              {lang === "en" 
                ? "This service uses cookies and similar technologies for the following purposes:"
                : "当サービスは、以下の目的でCookieおよびこれに類する技術を使用します。"}
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>{lang === "en" ? "Essential Cookies: " : "必須Cookie："}</strong>{lang === "en" ? "Required for core service functions (e.g., saving cookie consent states)." : "サービスの基本機能（Cookie同意状態の保存等）に必要"}</li>
              <li><strong>{lang === "en" ? "Analytics Cookies: " : "分析Cookie："}</strong>{lang === "en" ? "Used for access analysis to improve service quality." : "サービス品質の向上のためのアクセス解析"}</li>
              <li><strong>{lang === "en" ? "Advertising Cookies: " : "広告Cookie："}</strong>{lang === "en" ? "Used by Google AdSense to serve personalized ads." : "Google AdSenseによるパーソナライズ広告の配信"}</li>
            </ul>
            <p className="mt-3">
              {lang === "en"
                ? "You can disable cookies from your browser settings; however, some features may not function properly if you do so."
                : "ブラウザの設定からCookieを無効化することができますが、その場合、一部の機能が正常に動作しない可能性があります。"}
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              {lang === "en" ? "4. About Google AdSense" : "4. Google AdSenseについて"}
            </h2>
            <p>
              {lang === "en"
                ? "This service uses Google AdSense, an advertising service provided by Google LLC. Google AdSense uses cookies to display personalized ads based on users' interests."
                : "当サービスは、Google LLC が提供する広告配信サービス「Google AdSense」を使用しています。Google AdSense は、ユーザーの興味・関心に基づいたパーソナライズ広告を表示するためにCookieを使用します。"}
            </p>
            <p className="mt-3">
              {lang === "en" ? "For more details on how Google uses data, please refer to " : "Google によるデータの使用方法については、"}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-600 underline underline-offset-2"
              >
                {lang === "en" ? "Google's Policies and Terms" : "Google のポリシーと規約"}
              </a>
              {lang === "en" ? ". To opt out of personalized advertising, you can visit the " : "をご確認ください。パーソナライズ広告の無効化については、"}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-600 underline underline-offset-2"
              >
                {lang === "en" ? "Ad Settings" : "広告設定"}
              </a>
              {lang === "en" ? " page." : "から行うことができます。"}
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              {lang === "en" ? "5. AI-Generated Content" : "5. AIによるコンテンツ生成"}
            </h2>
            <p>
              {lang === "en"
                ? "This service generates AI content using GPT series models from OpenAI, Inc. Diagnostic responses and texts inputted by users may be sent to OpenAI's servers via API. For OpenAI's privacy policy, please refer "
                : "当サービスは、OpenAI, Inc. の GPT シリーズモデルを使用してAIコンテンツを生成します。ユーザーが入力した診断回答・テキストは、API経由でOpenAIのサーバーに送信される場合があります。OpenAIのプライバシーポリシーは"}
              <a
                href="https://openai.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-600 underline underline-offset-2"
              >
                {lang === "en" ? "here" : "こちら"}
              </a>
              {lang === "en" ? "." : "をご参照ください。"}
            </p>
            <p className="mt-3">
              {lang === "en"
                ? "Content generated by AI is for entertainment purposes, and its accuracy or validity is not guaranteed."
                : "AIが生成するコンテンツはエンターテインメント目的であり、その内容の正確性・妥当性を保証するものではありません。"}
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              {lang === "en" ? "6. Third-Party Information Sharing" : "6. 情報の第三者提供"}
            </h2>
            <p>
              {lang === "en"
                ? "This service does not provide collected information to third parties except in the following cases:"
                : "当サービスは、以下の場合を除き、収集した情報を第三者に提供しません。"}
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>{lang === "en" ? "When user consent is obtained." : "ユーザーの同意がある場合"}</li>
              <li>{lang === "en" ? "When required by law." : "法令に基づく開示要求がある場合"}</li>
              <li>{lang === "en" ? "When necessary for the protection of human life, body, or property." : "人の生命・身体・財産の保護のために必要な場合"}</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              {lang === "en" ? "7. Use by Minors" : "7. 未成年者の利用"}
            </h2>
            <p>
              {lang === "en"
                ? "This service is not intended for use by individuals under the age of 13. If someone under 13 uses the service, it must be done under the supervision of a parent or guardian."
                : "当サービスは13歳未満の方の利用を想定していません。13歳未満の方が利用される場合は、保護者の監督のもとでご利用ください。"}
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              {lang === "en" ? "8. Changes to the Privacy Policy" : "8. プライバシーポリシーの変更"}
            </h2>
            <p>
              {lang === "en"
                ? "This service may change this policy without prior notice due to legal revisions or service updates. The updated content takes effect from the moment it is posted on this page. We recommend checking back periodically."
                : "当サービスは、法令の変更やサービス内容の更新に伴い、本ポリシーを予告なく変更する場合があります。変更後の内容は本ページに掲載した時点から効力を生じます。定期的にご確認いただくことをお勧めします。"}
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              {lang === "en" ? "9. Contact Us" : "9. お問い合わせ"}
            </h2>
            <p>
              {lang === "en"
                ? "If you have any questions or opinions regarding this policy, please reach out via the feedback feature in the service or our public contact information."
                : "本ポリシーに関するご質問・ご意見は、サービス内のフィードバック機能または公開されている連絡先までお寄せください。"}
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
