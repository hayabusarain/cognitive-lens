import type { Metadata } from "next";
import { canonical } from "@/lib/site";
import { Heading } from "@/app/components/ui/Heading";
import {
  ExternalTextLink,
  InfoPage,
  InfoSection,
  X_ACCOUNT_HANDLE,
  X_ACCOUNT_URL,
} from "@/app/[lang]/_components/InfoPage";

/**
 * プライバシーポリシー /ja/privacy（ステップ 3-19）
 *
 * GA4 の節は、GA4 を読み込むビルド（NEXT_PUBLIC_GA_MEASUREMENT_ID がある）でだけ出す。
 * GA4 の配信とポリシーでの公表を同じ公開で始めるため（仕様書 3-7）。値はビルド時に埋め込まれる（environment-variables.md）。
 *
 * GA4 の節に書いた「結果ページの URL に入る割合（?p=）を送る前に取り除く」は、コードではなく GA4 の管理画面で行う。
 * 測定 ID を本番に設定する前に、ウェブのデータストリームの「データの除去」で、クエリパラメータ p を除去の対象に入れること。
 * GA4 の page_view は page_location にクエリを含めて送るため、設定しないと割合が Google に届く。
 */

/** GA4 を読み込むか。app/components/analytics/GoogleAnalytics.tsx と同じ条件（G- で始まる測定 ID）にする */
function isGa4Enabled(): boolean {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return !!id && /^G-[A-Z0-9]+$/.test(id);
}

/** GA4 の節がない版の最終更新日 */
const UPDATED_AT = "2026-09-16";
/** GA4 の節がある版の最終更新日。本番で GA4 の配信を始める公開の日付に書き換える */
const UPDATED_AT_WITH_GA4 = "2026-09-16";

const GA4 = isGa4Enabled();

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: GA4
    ? "CognitiveLens が扱う情報と使い道です。アクセス解析（Vercel Web Analytics と Google アナリティクス）で送る情報や、脈あり度チェックの AI 文で OpenAI に送る情報を載せています。"
    : "CognitiveLens が扱う情報と使い道です。アクセス解析（Vercel Web Analytics）で送る情報や、脈あり度チェックの AI 文で OpenAI に送る情報を載せています。",
  // openGraph は書かない。書くと [lang]/opengraph-image（トップの OG 画像）を引き継がなくなる（2026-09-16 のビルドで確認）
  alternates: canonical("/ja/privacy"),
};

/** GA4 に送るイベント（lib/analytics.ts の3つ。仕様書 3-7） */
const GA4_EVENTS = [
  {
    name: "診断の完了",
    when: "自己診断か相手診断を終えて、結果ページへ移るとき",
    params: "型コード、自己診断か相手診断か",
  },
  {
    name: "共有",
    when: "X への投稿ボタンを押したとき",
    params: "型コード、結果かビンゴか",
  },
  {
    name: "画像の保存",
    when: "結果やビンゴの画像を保存したとき。長押しでの保存を案内したときも含みます",
    params: "型コード、結果かビンゴか、保存の方法",
  },
] as const;

export default function PrivacyPage() {
  return (
    <InfoPage
      title="プライバシーポリシー"
      path="/ja/privacy"
      updatedAt={GA4 ? UPDATED_AT_WITH_GA4 : UPDATED_AT}
      lead="当サイトが扱う情報と、その使い道を説明します。"
    >
      <InfoSection id="privacy-input" title="会員登録と入力欄">
        <p>当サイトには会員登録がありません。名前やメールアドレスを入力する欄もありません。</p>
      </InfoSection>

      <InfoSection id="privacy-diagnosis" title="診断の回答と結果の URL">
        <p>
          自己診断と相手診断の回答は、お使いのブラウザの中で計算します。回答を当サイトのサーバーへは送りません。
        </p>
        <p>
          途中まで答えた内容は、ブラウザの sessionStorage に保存します。再読み込みしても続きから答えるためのもので、診断を終えるかタブを閉じると消えます。
        </p>
        <p>
          結果ページの URL には、4つの軸の割合が入ります。アドレス欄の URL をそのまま人に送ると、割合も伝わります。X
          への投稿ボタンで共有する URL には、割合は入りません。
        </p>
      </InfoSection>

      <InfoSection id="privacy-ai" title="脈あり度チェックの AI 文">
        <p>
          脈あり度チェックでは、選んだタイプと「はい・いいえ」の答えを当サイトのサーバーに送ります。サーバーは、相手のタイプと脈あり度、「はい」と答えた設問の文を
          OpenAI の API に送ります。返ってきた文章を、結果の下に表示します。
        </p>
        <p>
          OpenAI での扱いは、
          <ExternalTextLink href="https://openai.com/policies/privacy-policy/">OpenAI のプライバシーポリシー</ExternalTextLink>
          をご覧ください。
        </p>
      </InfoSection>

      <InfoSection id="privacy-log" title="アクセスの記録">
        <p>
          当サイトは、Vercel Inc. のサービス Vercel の上で動いています。ページを開くと、IP
          アドレス、ブラウザの種類、見たページの URL、日時が記録されます。
        </p>
        <p>IP アドレスは、AI 文を短い時間に何度も作らせないよう、回数を数えるのにも使います。</p>
      </InfoSection>

      <InfoSection id="privacy-vercel" title="アクセス解析（Vercel Web Analytics）">
        <p>
          アクセス数を知るために、Vercel Web Analytics を使っています。送られるのは、見たページの
          URL、参照元、国や地域、ブラウザと OS、端末の種類、日時です。
        </p>
        <p>
          訪問者の区別に Cookie は使わず、アクセスの情報から作った値を使います。その値は24時間で破棄されます。詳しくは
          <ExternalTextLink href="https://vercel.com/docs/analytics/privacy-policy">
            Vercel Web Analytics のデータの扱い（英語）
          </ExternalTextLink>
          にあります。
        </p>
      </InfoSection>

      {GA4 && (
        <InfoSection id="privacy-ga4" title="アクセス解析（Google アナリティクス）">
          <p>
            サイトの使われ方を知るために、Google アナリティクス 4（GA4）を使っています。GA4 は Cookie を使って、閲覧の情報を
            Google LLC に送ります。
          </p>
          <p>
            送るのは、見たページの URL とタイトル、参照元、日時、ブラウザや端末の種類、おおよその地域です。よく読まれるページや、診断を最後まで終えた人の数を知り、サイトの改善に使います。
          </p>

          <Heading level={3} id="privacy-ga4-events" className="mt-2">
            送るイベント
          </Heading>
          <p>次の3つの操作をしたときは、そのことも送ります。</p>
          <ul aria-labelledby="privacy-ga4-events" className="grid gap-3">
            {GA4_EVENTS.map((event) => (
              <li key={event.name} className="rounded-panel bg-surface px-4 py-3">
                <p className="font-bold">{event.name}</p>
                <dl className="mt-1 grid gap-x-4 gap-y-0.5 sm:grid-cols-[7rem_1fr]">
                  <dt className="text-note font-bold text-muted sm:text-body">送るとき</dt>
                  <dd>{event.when}</dd>
                  <dt className="mt-1 text-note font-bold text-muted sm:mt-0 sm:text-body">送る内容</dt>
                  <dd>{event.params}</dd>
                </dl>
              </li>
            ))}
          </ul>
          <p>
            回答の内容と、4つの軸の割合は送りません。結果ページの URL に入る割合も、Google に送る前に取り除きます。
          </p>

          <Heading level={3} className="mt-2">
            Google による情報の扱い
          </Heading>
          <p>
            Google に送った情報は Google が管理し、日本以外の国で保存されることがあります。Google での使われ方は、
            <ExternalTextLink href="https://policies.google.com/technologies/partner-sites?hl=ja">
              Google のサービスを使うサイトやアプリから収集した情報の Google による使用
            </ExternalTextLink>
            と
            <ExternalTextLink href="https://policies.google.com/privacy?hl=ja">Google プライバシーポリシー</ExternalTextLink>
            で確かめられます。
          </p>

          <Heading level={3} className="mt-2">
            送信を止める方法
          </Heading>
          <p>
            パソコンのブラウザでは、
            <ExternalTextLink href="https://tools.google.com/dlpage/gaoptout?hl=ja">
              Google アナリティクス オプトアウト アドオン
            </ExternalTextLink>
            で GA4 への送信を止められます。スマートフォンでは、コンテンツブロッカーなどで Google
            アナリティクスの読み込みを止めてください。
          </p>
        </InfoSection>
      )}

      <InfoSection id="privacy-third-party" title="第三者への提供">
        <p>
          このページに書いた送信先のほかに、集めた情報を第三者へ渡すことはありません。例外は、法令にもとづく場合、人の命や体、財産を守るために必要な場合、ご本人の同意がある場合です。
        </p>
      </InfoSection>

      <InfoSection id="privacy-minor" title="13歳未満の方へ">
        <p>13歳未満の方は、保護者の方と一緒にお使いください。</p>
      </InfoSection>

      <InfoSection id="privacy-change" title="このポリシーの変更">
        <p>
          このポリシーは、サイトの変更に合わせて改めることがあります。改めたときは、このページの最終更新日を書き換えます。
        </p>
      </InfoSection>

      <InfoSection id="privacy-contact" title="お問い合わせ">
        <p>
          このポリシーについてのご質問は、X のアカウント{" "}
          <ExternalTextLink href={X_ACCOUNT_URL}>{X_ACCOUNT_HANDLE}</ExternalTextLink>
          への DM でお送りください。
        </p>
      </InfoSection>
    </InfoPage>
  );
}
