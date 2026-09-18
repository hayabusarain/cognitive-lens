import type { TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { SITE_URL } from "@/lib/site";
import { ButtonLink } from "@/app/components/ui/Button";
import { ShareOnX } from "@/app/components/share/ShareOnX";
import { ShareLink } from "@/app/components/share/ShareLink";
import { ShareImageButton } from "@/app/components/share/ShareImageButton";
import type { ResultScores } from "@/app/[lang]/result/_components/use-result-query";

/** 相手診断から来たときの投稿文。{name} と {url} は shareText と同じく置き換える */
const TARGET_SHARE_TEXT = "あの人のタイプを診断したら、{name}でした。\n{url}";

/** まだ自分では診断していない人に渡す投稿文。一人称を置かず、タイプの紹介として読める形にする */
const VISITOR_SHARE_TEXT = "{name}はこんなタイプ。あなたは？\n{url}";

/**
 * 結果の共有（仕様書 3-4 の3番目）。X への投稿、友達への送信、9:16 結果画像の保存。
 * 投稿の URL はクエリを付けない canonical にする（個人スコアを第三者のタイムラインに出さない）。
 * 画像は p が正しければスコアあり、なければスコアなし。
 *
 * 割合がないのは、共有された URL やシェア画像、一覧やコラムから来て、自分では診断していない人。
 * この人には「わたしのタイプは」と書いた投稿文も「結果画像」というラベルも合わないので、
 * 文面とラベルを替え、診断への入口を1つ足す（ここは静的な HTML にも入る）。
 * <Suspense> の fallback（スコアなし）と、URL を読んだ後の表示の両方で使う
 */
export function ResultShare({
  type,
  shareText,
  scores = null,
  target = false,
}: {
  type: TypeCode;
  /** TypeContent.share.text（{name} と {url} を含む） */
  shareText: string;
  scores?: ResultScores | null;
  target?: boolean;
}) {
  const name = `${type}（${TYPE_NAMES[type]}）`;
  const pageUrl = `${SITE_URL}/ja/result/${type}`;
  const template = target ? TARGET_SHARE_TEXT : scores ? shareText : VISITOR_SHARE_TEXT;
  // body は URL を抜いた本文。共有シートには URL を別の引数で渡すため
  const body = template.replaceAll("{name}", name).replace("\n{url}", "");
  // ビンゴと同じく、投稿の末尾にタイプとサイトのタグを付ける（X で #INTJ を追う人に届かせる）
  const text = `${body}\n{url}\n#${type} #CognitiveLens`;
  const imageUrl = scores ? `/ja/result/${type}/share-image/${scores.join("-")}` : `/ja/result/${type}/share-image`;

  return (
    <section aria-label="結果の共有" className="grid grid-cols-2 gap-3">
      <ShareOnX text={text} url={pageUrl} contentType="result" itemId={type} />
      <ShareLink title={`${name}の性格タイプ`} text={body} url={pageUrl} contentType="result" itemId={type} />
      <ShareImageButton
        className="col-span-2"
        imageUrl={imageUrl}
        fileName={`cognitivelens-${type}.png`}
        contentType="result"
        itemId={type}
        label={scores ? "結果画像を保存" : `${type}のカードを保存`}
        variant={scores ? "primary" : "secondary"}
      />
      {!scores && (
        <ButtonLink href="/ja/test" className="col-span-2">
          自分のタイプを診断する
        </ButtonLink>
      )}
    </section>
  );
}
