import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "プライバシーポリシー・免責事項 | CognitiveLens",
  description: "CognitiveLensのプライバシーポリシー、Cookie利用方針、および免責事項",
};

const LAST_UPDATED = "2025年1月1日";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen" >
      {/* Header */}
      <nav className="nav-blur flex items-center gap-4 px-6 py-4 sticky top-0 z-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          
        >
          <ArrowLeft size={14} />
          ホームに戻る
        </Link>
        <span className="text-sm font-bold tracking-[0.1em]" >
          cognitive<span >lens</span>
        </span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-1" >プライバシーポリシー・免責事項</h1>
        <p className="text-xs mb-10" >最終更新日：{LAST_UPDATED}</p>

        <div className="space-y-10 text-sm leading-relaxed" >

          {/* 1 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              1. 診断結果の免責事項
            </h2>
            <p>
              当サービス「CognitiveLens」が提供する16タイプ診断・認知機能分析・対人関係アドバイスは、
              <strong>エンターテインメント・自己理解のための参考情報</strong>として提供されるものです。
              診断結果の正確性・完全性・科学的根拠を保証するものではなく、
              医療的診断・心理的診断・法的アドバイスの代替として使用することはできません。
            </p>
            <p className="mt-3">
              診断結果に基づいて行われた判断・行動によって生じたいかなる損害についても、
              当サービスは一切の責任を負いません。重要な人生の決断には、
              専門家（医師・カウンセラー・弁護士等）にご相談ください。
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              2. 収集する情報
            </h2>
            <p>当サービスは、以下の情報を収集する場合があります。</p>
            <ul className="mt-3 space-y-2 list-disc list-inside" >
              <li>
                <strong>診断回答データ：</strong>
                16タイプ判定のための設問への回答（E/I, S/N, T/F, J/P の選択結果）。
                個人を特定する情報は含まれません。
              </li>
              <li>
                <strong>ログデータ：</strong>
                アクセスIPアドレス、ブラウザ種別、参照元URL、アクセス日時。
                主にレートリミット（過剰リクエスト防止）に使用されます。
              </li>
              <li>
                <strong>Cookie・ローカルストレージ：</strong>
                Cookie同意の記録、テーマ設定等のユーザー設定の保存。
              </li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              3. Cookieおよびトラッキング技術の使用
            </h2>
            <p>
              当サービスは、以下の目的でCookieおよびこれに類する技術を使用します。
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>必須Cookie：</strong>サービスの基本機能（Cookie同意状態の保存等）に必要</li>
              <li><strong>分析Cookie：</strong>サービス品質の向上のためのアクセス解析</li>
              <li><strong>広告Cookie：</strong>Google AdSenseによるパーソナライズ広告の配信</li>
            </ul>
            <p className="mt-3">
              ブラウザの設定からCookieを無効化することができますが、
              その場合、一部の機能が正常に動作しない可能性があります。
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              4. Google AdSenseについて
            </h2>
            <p>
              当サービスは、Google LLC が提供する広告配信サービス「Google AdSense」を使用しています。
              Google AdSense は、ユーザーの興味・関心に基づいたパーソナライズ広告を表示するために
              Cookieを使用します。
            </p>
            <p className="mt-3">
              Google によるデータの使用方法については、
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-600 underline underline-offset-2"
              >
                Google のポリシーと規約
              </a>
              をご確認ください。
              パーソナライズ広告の無効化については、
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-600 underline underline-offset-2"
              >
                広告設定
              </a>
              から行うことができます。
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              5. AIによるコンテンツ生成
            </h2>
            <p>
              当サービスは、OpenAI, Inc. の GPT シリーズモデルを使用してAIコンテンツを生成します。
              ユーザーが入力した診断回答・テキストは、API経由でOpenAIのサーバーに送信される場合があります。
              OpenAIのプライバシーポリシーは
              <a
                href="https://openai.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 hover:text-teal-600 underline underline-offset-2"
              >
                こちら
              </a>
              をご参照ください。
            </p>
            <p className="mt-3">
              AIが生成するコンテンツはエンターテインメント目的であり、
              その内容の正確性・妥当性を保証するものではありません。
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              6. 情報の第三者提供
            </h2>
            <p>
              当サービスは、以下の場合を除き、収集した情報を第三者に提供しません。
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく開示要求がある場合</li>
              <li>人の生命・身体・財産の保護のために必要な場合</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              7. 未成年者の利用
            </h2>
            <p>
              当サービスは13歳未満の方の利用を想定していません。
              13歳未満の方が利用される場合は、保護者の監督のもとでご利用ください。
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              8. プライバシーポリシーの変更
            </h2>
            <p>
              当サービスは、法令の変更やサービス内容の更新に伴い、
              本ポリシーを予告なく変更する場合があります。
              変更後の内容は本ページに掲載した時点から効力を生じます。
              定期的にご確認いただくことをお勧めします。
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-base font-bold mb-3 pb-2 border-b" style={{ color: "#1e293b", borderColor: "rgba(0,0,0,0.06)" }}>
              9. お問い合わせ
            </h2>
            <p>
              本ポリシーに関するご質問・ご意見は、サービス内のフィードバック機能または
              公開されている連絡先までお寄せください。
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
