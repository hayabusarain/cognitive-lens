import type { Metadata } from "next";
import { canonical } from "@/lib/site";
import { InfoPage, InfoSection, TextLink } from "@/app/[lang]/_components/InfoPage";

/**
 * 免責事項 /ja/disclaimer（ステップ 3-20）
 * 「性格タイプは傾向を楽しむためのもので、本人を決めつけるものではない」という前提はここに書く（tone-guide 6章）。
 * 「MBTI」は公式の検査との関係を説明する1回だけ（tone-guide 5-4）
 */

const UPDATED_AT = "2026-09-16";

export const metadata: Metadata = {
  title: "免責事項",
  description:
    "CognitiveLens の診断結果、AI が書く文章、キャラクター画像の扱いについての注意です。性格タイプは傾向を楽しむためのもので、本人を決めつけるものではありません。",
  // openGraph は書かない。書くと [lang]/opengraph-image（トップの OG 画像）を引き継がなくなる（2026-09-16 のビルドで確認）
  alternates: canonical("/ja/disclaimer"),
};

export default function DisclaimerPage() {
  return (
    <InfoPage title="免責事項" path="/ja/disclaimer" updatedAt={UPDATED_AT}>
      <InfoSection id="disclaimer-result" title="性格タイプの結果について">
        <p>
          性格タイプは、ふだんの傾向を楽しむためのものです。あなたの性格や能力を決めつけるものではありません。
        </p>
        <p>
          答えたときの気分や状況で、結果が変わることもあります。当てはまらない説明があっても、おかしなことではありません。
        </p>
        <p>
          診断は、医療や心理の専門家による検査ではありません。進路や仕事、人との付き合い方を、結果だけで決めないでください。
        </p>
        <p>気持ちのつらさが続くときは、一人で抱えず、医療機関や公的な相談窓口へ。</p>
      </InfoSection>

      <InfoSection id="disclaimer-others" title="相手診断と脈あり度チェックについて">
        <p>
          相手診断の結果は、あなたから見た相手の様子をもとにした推測です。相手本人が答えた結果とは違います。
        </p>
        <p>
          脈あり度は、「はい」と答えた行動の割合から出す目安です。相手の気持ちを確かめるものではありません。
        </p>
        <p>結果を理由に、相手を責めたり、からかったりしないでください。</p>
      </InfoSection>

      <InfoSection id="disclaimer-ai" title="AI が書く文章について">
        <p>
          脈あり度チェックの結果に添える文章は、OpenAI の AI が自動で書いています。運営者が一つずつ確かめた文章ではありません。
        </p>
        <p>
          答えた内容と合わない文や、事実と違う文が出ることがあります。AI の文は、参考の一つとして扱うのがおすすめです。
        </p>
        <p>
          AI に送る情報は、<TextLink href="/ja/privacy">プライバシーポリシー</TextLink>に書いています。
        </p>
      </InfoSection>

      <InfoSection id="disclaimer-characters" title="キャラクター画像について">
        <p>
          キャラクターは、運営者が画像生成 AI で作った絵です。実在の人物とは関係ありません。
        </p>
        <p>
          いまの絵柄は仮のものです。幻獣をモチーフにした新しい絵ができ次第、差し替えます。
        </p>
        <p>
          服装や持ち物は、タイプの雰囲気を表すための絵柄です。そのタイプの人の職業や趣味を示すものではありません。
        </p>
        <p>
          画像を使うときの条件は、<TextLink href="/ja/downloads">キャラクター素材の配布</TextLink>のページにあります。
        </p>
      </InfoSection>

      <InfoSection id="disclaimer-official" title="公式の検査との関係">
        <p>
          当サイトは、MBTI® の公式の検査や、その提供元とは関係ありません。この名称は The Myers-Briggs Company
          の登録商標です。
        </p>
        <p>
          性格診断サイトの 16Personalities とも関係のない、独立したサイトです。16タイプの呼称、設問、文章は、当サイトで独自に作っています。
        </p>
      </InfoSection>

      <InfoSection id="disclaimer-misc" title="そのほか">
        <p>
          当サイトの内容は、予告なく変更したり、公開をやめたりすることがあります。リンク先の外部サイトの内容については、責任を負いかねます。
        </p>
        <p>
          当サイトの利用で生じた損害について、運営者は責任を負いません。ただし、運営者に故意または重大な過失がある場合は除きます。
        </p>
      </InfoSection>
    </InfoPage>
  );
}
