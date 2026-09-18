import type { Metadata } from "next";
import { SITE_URL, canonical } from "@/lib/site";
import { ButtonLink } from "@/app/components/ui/Button";
import {
  ExternalTextLink,
  InfoPage,
  InfoSection,
  TextLink,
  X_ACCOUNT_HANDLE,
  X_ACCOUNT_URL,
} from "@/app/[lang]/_components/InfoPage";

/**
 * 運営者情報 /ja/about（ステップ 3-20）
 * 連絡先は X の DM（フッターと同じ）。以前の contact@cognitivelens.com は他人のドメインで届かないので載せない（decisions Q17）
 */

const UPDATED_AT = "2026-09-16";

export const metadata: Metadata = {
  title: "運営者情報",
  description: "16タイプ性格診断サイト CognitiveLens の運営者と、お問い合わせの方法（X の DM）を載せています。",
  // openGraph は書かない。書くと [lang]/opengraph-image（トップの OG 画像）を引き継がなくなる（2026-09-16 のビルドで確認）
  alternates: canonical("/ja/about"),
};

const ROWS = [
  { term: "サイト名", detail: "CognitiveLens（コグニティブレンズ）" },
  { term: "URL", detail: SITE_URL },
  { term: "運営者", detail: "CognitiveLens 開発プロジェクトチーム" },
  { term: "内容", detail: "16タイプ性格診断、相手診断、脈あり度チェック、タイプ別のビンゴと恋愛コラム" },
  { term: "お問い合わせ", detail: `X のアカウント ${X_ACCOUNT_HANDLE} への DM` },
] as const;

export default function AboutPage() {
  return (
    <InfoPage title="運営者情報" path="/ja/about" updatedAt={UPDATED_AT}>
      <InfoSection id="about-operator" title="サイトと運営者">
        <dl className="divide-y divide-line rounded-panel bg-surface px-4">
          {ROWS.map((row) => (
            <div key={row.term} className="grid gap-0.5 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
              <dt className="text-note font-bold text-muted sm:text-body">{row.term}</dt>
              <dd className="break-words">{row.detail}</dd>
            </div>
          ))}
        </dl>
      </InfoSection>

      <InfoSection id="about-contact" title="お問い合わせ">
        <p>
          ご質問や不具合の報告は、X のアカウント{" "}
          <ExternalTextLink href={X_ACCOUNT_URL}>{X_ACCOUNT_HANDLE}</ExternalTextLink>
          に DM でお送りください。メールでの受け付けはしていません。
        </p>
        <p>
          以前このページに載せていたメールアドレスは、当サイトが管理するアドレスではありません。そちらには送らないでください。
        </p>
        <p>
          キャラクター画像の使い方は、
          <TextLink href="/ja/downloads">キャラクター素材の配布</TextLink>
          のページにまとめています。
        </p>
        <div>
          <ButtonLink href={X_ACCOUNT_URL} external variant="secondary">
            X のアカウントを開く
          </ButtonLink>
        </div>
      </InfoSection>
    </InfoPage>
  );
}
