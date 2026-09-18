import type { Metadata } from "next";
import { Download } from "lucide-react";
import { SITE_URL, canonical } from "@/lib/site";
import { TYPE_BASE } from "@/lib/type-base";
import { TYPE_CODES } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { characterAlt } from "@/lib/type-display";
import { Heading } from "@/app/components/ui/Heading";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";
import { TYPE_CARD_IMAGE_SIZES } from "@/app/components/type/TypeCard";
import { TypeFrame } from "@/app/components/type/TypeFrame";
import {
  ExternalTextLink,
  InfoPage,
  InfoSection,
  X_ACCOUNT_HANDLE,
  X_ACCOUNT_URL,
} from "@/app/[lang]/_components/InfoPage";

/**
 * キャラクター素材の配布 /ja/downloads（ステップ 3-20）
 * 配るのは public/characters/{TYPE}.png の元画像（lib/type-base.ts）。出典は docs/asset-credits.md 1章。
 *
 * 2026-09-19：現行の16枚は、ほかの性格診断サイトのキャラクター画像を画像生成 AI に読み込ませて
 * 変換したものだと分かった（運営者の申告）。権利の整理が済むまで PAUSED で配布を止める。
 * 幻獣版（asset-credits.md 1-2）に差し替え、出自を台帳に書いてから false に戻す。
 * 利用条件は以前のページの内容を変えず、文面だけを整えた。画像を幻獣版に差し替えても、このページのコードは変えない
 */

const UPDATED_AT = "2026-09-19";

/** 配布を止めているあいだは true。絵柄を差し替えたら false に戻すと、下の配布の画面がそのまま出る */
const PAUSED: boolean = true;

/** 利用者に載せてもらうクレジットの一文 */
const CREDIT = `画像引用元：CognitiveLens（${SITE_URL}）`;

export const metadata: Metadata = {
  title: "キャラクター素材の配布",
  description:
    "16タイプ性格診断 CognitiveLens のキャラクター素材について。いまは絵柄を作り直しているため、画像の配布を止めています。",
  // openGraph は書かない。書くと [lang]/opengraph-image（トップの OG 画像）を引き継がなくなる（2026-09-16 のビルドで確認）
  alternates: canonical("/ja/downloads"),
};

const PROHIBITED = [
  "商用の利用（グッズの販売、有料のコンテンツ、企業や店のアカウントでの利用など）",
  "自分で作ったと言うこと",
  "画像の再配布",
  "トレス",
  "公序良俗に反する使い方",
  "AI の学習に使うこと",
] as const;

export default function DownloadsPage() {
  if (PAUSED) {
    return (
      <InfoPage
        title="キャラクター素材の配布"
        path="/ja/downloads"
        updatedAt={UPDATED_AT}
        lead="いまは画像の配布を止めています。"
      >
        <InfoSection id="downloads-paused" title="配布を止めています">
          <p>
            キャラクターの絵柄を作り直しているため、画像の配布を止めています。新しい絵柄ができたら、このページで配り直します。
          </p>
          <p>
            再開のお知らせは X（
            <ExternalTextLink href={X_ACCOUNT_URL}>{X_ACCOUNT_HANDLE}</ExternalTextLink>）に出します。
          </p>
        </InfoSection>
      </InfoPage>
    );
  }

  return (
    <InfoPage
      title="キャラクター素材の配布"
      path="/ja/downloads"
      updatedAt={UPDATED_AT}
      lead="16タイプのキャラクター画像を、SNS のアイコンやブログで使えるように配布しています。使う前に、利用条件をお読みください。"
    >
      <InfoSection id="downloads-terms" title="利用条件">
        <p>
          個人の SNS のアイコン、無料のブログ、収益化していない動画に使えます。どの場合も、クレジットの表記が必要です。
        </p>
        <div className="rounded-panel bg-surface px-4 py-3">
          <p className="font-bold">クレジットの書き方</p>
          <p className="text-muted">プロフィール欄や投稿の説明文などに、次の一文を載せてください。</p>
          <p className="mt-2 select-all break-words rounded-chip bg-canvas px-3 py-2 font-bold">{CREDIT}</p>
        </div>
        <div className="rounded-panel border-l-4 border-fg bg-surface px-4 py-3">
          <Heading level={3} id="downloads-prohibited">
            禁止していること
          </Heading>
          <ul aria-labelledby="downloads-prohibited" className="mt-1 list-disc pl-5 marker:text-muted">
            {PROHIBITED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p>
          条件にない使い方をしたいときは、X のアカウント{" "}
          <ExternalTextLink href={X_ACCOUNT_URL}>{X_ACCOUNT_HANDLE}</ExternalTextLink>
          に DM でご相談ください。
        </p>
      </InfoSection>

      <InfoSection id="downloads-about" title="画像について">
        <p>キャラクターは、運営者が画像生成 AI で作ったオリジナルの画像です。画像の権利は運営者にあります。</p>
        <p>形式は PNG、大きさは 800×1000 ピクセルで、背景は透明です。</p>
      </InfoSection>

      <InfoSection id="downloads-list" title="16タイプのキャラクター" wide>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
          {TYPE_CODES.map((type) => (
            <li key={type}>
              <TypeFrame type={type} className="h-full [--frame-radius:14px] [--frame:5px]">
                <p className="px-2 pb-1.5 pt-2 font-display text-[1.375rem] leading-tight tracking-[0.02em] md:text-[1.75rem]">
                  {type}
                </p>
                <CharacterFigure type={type} sizes={TYPE_CARD_IMAGE_SIZES} className="mx-1.5" />
                <p className="px-2 pt-2 text-lead font-black leading-snug">{TYPE_NAMES[type]}</p>
                <div className="mt-auto px-1.5 pb-2 pt-2">
                  <a
                    href={TYPE_BASE[type].image.src}
                    download={`CognitiveLens_${type}.png`}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-panel border-2 border-line px-1 font-bold hover:bg-surface-2"
                  >
                    <Download aria-hidden="true" className="size-4 shrink-0" />
                    <span>
                      <span className="sr-only">{characterAlt(type)}の画像を</span>
                      ダウンロード
                    </span>
                  </a>
                </div>
              </TypeFrame>
            </li>
          ))}
        </ul>
      </InfoSection>
    </InfoPage>
  );
}
