import type { TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { SITE_URL } from "@/lib/site";
import { ShareOnX } from "@/app/components/share/ShareOnX";
import { ShareImageButton } from "@/app/components/share/ShareImageButton";
import type { ResultScores } from "@/app/[lang]/result/_components/use-result-query";

/** 相手診断から来たときの投稿文。{name} と {url} は shareText と同じく置き換える */
const TARGET_SHARE_TEXT = "あの人のタイプを診断したら、{name}でした。 {url}";

/**
 * 結果の共有（仕様書 3-4 の3番目）。X への投稿と、9:16 結果画像の保存。
 * 投稿の URL はクエリを付けない canonical にする（個人スコアを第三者のタイムラインに出さない）。
 * 画像は p が正しければスコアあり、なければスコアなし。
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
  const text = (target ? TARGET_SHARE_TEXT : shareText).replaceAll("{name}", `${type}（${TYPE_NAMES[type]}）`);
  const imageUrl = scores ? `/ja/result/${type}/share-image/${scores.join("-")}` : `/ja/result/${type}/share-image`;

  return (
    <section aria-label="結果の共有" className="grid grid-cols-2 gap-3">
      <ShareOnX text={text} url={`${SITE_URL}/ja/result/${type}`} contentType="result" itemId={type} />
      <ShareImageButton imageUrl={imageUrl} fileName={`cognitivelens-${type}.png`} contentType="result" itemId={type} />
    </section>
  );
}
