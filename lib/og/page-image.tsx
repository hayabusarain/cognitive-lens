import { ImageResponse } from "next/og";
import type { TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { OG_FONT_FAMILY, fitInBox, loadOgFonts, loadTrimmedCharacter, type OgImageSource } from "@/lib/og/assets";
import { OG_COLORS, OG_SITE_LABEL, OG_SIZE, ogTypeColor } from "@/lib/og/theme";

/**
 * タイプに依らないページの OG 画像 1200×630（仕様書 4-2）。
 * 左にサイト名とページ名、右にキャラクターのカード4枚を扇形に並べる。
 * 対象：/ja、/ja/test、/ja/result、/ja/bingo、/ja/articles、/ja/target-diagnosis、/ja/romance-checker
 *
 * 使い方（app/[lang]/…/opengraph-image.tsx）：
 *   export default function Image() { return renderPageOgImage({ title: "16タイプ\n性格診断" }); }
 * title の文字はフォントのサブセット（assets/fonts/charset.txt）にあるものだけ。改行（\n）で行を分けられる
 */

/** 並べるカードの既定。色相が離れ、同じグループ（NT・NF・SJ・SP）が重ならない4体 */
const DEFAULT_TYPES = ["ENFP", "ISFJ", "INTJ", "ISTP"] as const satisfies readonly TypeCode[];

const PADDING = 60;
const TEXT_WIDTH = 440;

// カードの寸法（画面の TypeCard に合わせ、タイプ色の枠・型コード・キャラクターの窓・呼称の順。重なって隠れるので番号は出さない）
const CARD_WIDTH = 200;
const FRAME = 7;
const CARD_RADIUS = 20;
const ART_MARGIN = 10;
const ART_WIDTH = CARD_WIDTH - FRAME * 2 - ART_MARGIN * 2;
const ART_HEIGHT = Math.round((ART_WIDTH * 5) / 4);
const CARD_STEP = 158;
const CARD_LEFT = OG_SIZE.width - 40 - (CARD_WIDTH + CARD_STEP * 3);
/** カードごとの上端と傾き */
const CARD_POSES = [
  { top: 172, rotate: -9 },
  { top: 136, rotate: -3 },
  { top: 136, rotate: 3 },
  { top: 172, rotate: 9 },
] as const;

/** 1行の幅に収まる文字サイズ。和文は1字 1em、英数字は 0.6em と見積もる */
function titleFontSize(lines: readonly string[]): number {
  const units = Math.max(...lines.map((line) => [...line].reduce((sum, ch) => sum + (ch.charCodeAt(0) < 0x80 ? 0.6 : 1), 0)));
  return Math.max(52, Math.min(88, Math.floor(TEXT_WIDTH / units)));
}

function Card({ type, image, index }: { type: TypeCode; image: OgImageSource; index: number }) {
  const pose = CARD_POSES[index];
  const color = ogTypeColor(type);
  const fitted = fitInBox(image, ART_WIDTH * 0.96, ART_HEIGHT * 0.96);
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_LEFT + CARD_STEP * index,
        top: pose.top,
        width: CARD_WIDTH,
        display: "flex",
        padding: FRAME,
        borderRadius: CARD_RADIUS,
        backgroundColor: color,
        transform: `rotate(${pose.rotate}deg)`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          paddingBottom: 12,
          borderRadius: CARD_RADIUS - FRAME,
          backgroundColor: OG_COLORS.surface,
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1, letterSpacing: "0.02em", padding: "12px 12px 10px" }}>{type}</div>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            width: ART_WIDTH,
            height: ART_HEIGHT,
            margin: `0 ${ART_MARGIN}px`,
            borderRadius: 6,
            overflow: "hidden",
            backgroundColor: OG_COLORS.art,
          }}
        >
          {/* タイプ色の台座（画面の .type-art::before） */}
          <div
            style={{
              position: "absolute",
              left: -ART_WIDTH * 0.12,
              bottom: -ART_HEIGHT * 0.38,
              width: ART_WIDTH * 1.24,
              height: ART_HEIGHT * 0.78,
              borderTopLeftRadius: `${ART_WIDTH * 0.62}px ${ART_HEIGHT * 0.312}px`,
              borderTopRightRadius: `${ART_WIDTH * 0.62}px ${ART_HEIGHT * 0.312}px`,
              backgroundColor: color,
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} width={fitted.width} height={fitted.height} alt="" />
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, padding: "8px 12px 0" }}>{TYPE_NAMES[type]}</div>
      </div>
    </div>
  );
}

export async function renderPageOgImage({
  title,
  types = DEFAULT_TYPES,
}: {
  /** ページ名。\n で改行できる */
  title: string;
  /** 並べる4体 */
  types?: readonly [TypeCode, TypeCode, TypeCode, TypeCode];
}): Promise<ImageResponse> {
  const [fonts, images] = await Promise.all([loadOgFonts(), Promise.all(types.map(loadTrimmedCharacter))]);
  const lines = title.split("\n");
  const fontSize = titleFontSize(lines);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: OG_COLORS.background,
          color: OG_COLORS.text,
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: PADDING,
            top: PADDING,
            bottom: PADDING,
            width: TEXT_WIDTH,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 40, fontWeight: 900, lineHeight: 1 }}>
            <span>Cognitive</span>
            <span style={{ color: OG_COLORS.textMuted }}>Lens</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize, fontWeight: 900, lineHeight: 1.2 }}>
            {lines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: OG_COLORS.textMuted }}>{OG_SITE_LABEL}</div>
        </div>
        {types.map((type, i) => (
          <Card key={type} type={type} image={images[i]} index={i} />
        ))}
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
