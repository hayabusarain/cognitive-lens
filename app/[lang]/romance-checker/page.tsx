import type { Metadata } from "next";
import { BASE_OPEN_GRAPH, canonical } from "@/lib/site";
import { Heading } from "@/app/components/ui/Heading";
import { Breadcrumbs } from "@/app/components/ui/Breadcrumbs";
import { RomanceChecker } from "./RomanceChecker";

/**
 * 脈あり度チェック /ja/romance-checker（仕様書 2-4、3-5、ステップ 3-17）
 * ページ（見出しと metadata）はサーバーで出し、タイプの選択・設問・結果の進行はクライアント部品 RomanceChecker が持つ。
 * 最初の画面（16タイプの選択）は、そのまま HTML に出る
 */

// title・description に「MBTI」を使わない（decisions N3・N11）
const TITLE = "脈あり診断：相手のタイプ別の12問で脈あり度をチェック";
const DESCRIPTION =
  "気になる相手のタイプを16から選び、そのタイプらしい行動12問に「はい」「いいえ」で答えると、脈あり度が0〜100%で出ます。4段階の説明と、AIによる次の一歩のヒントも読めます。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical("/ja/romance-checker"),
  openGraph: { ...BASE_OPEN_GRAPH, title: TITLE, description: DESCRIPTION, url: "/ja/romance-checker" },
};

export default function RomanceCheckerPage() {
  return (
    <main className="mx-auto w-full max-w-page px-4 pb-16 pt-4 md:px-10">
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/ja" },
          { name: "脈あり度チェック", href: "/ja/romance-checker" },
        ]}
      />
      <Heading level={1} className="mt-2">
        脈あり度チェック
      </Heading>
      <RomanceChecker />
    </main>
  );
}
