import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { TYPE_CODES, isTypeCode } from "@/lib/type-codes";
import { splitArticleTitle } from "@/lib/articles";
import { OG_FONT_FAMILY, fitInBox, loadOgFonts, loadTrimmedCharacter } from "@/lib/og/assets";
import { OG_COLORS, OG_SITE_LABEL, OG_SIZE, ogTypeColor } from "@/lib/og/theme";

/**
 * 恋愛コラムの OG 画像 1200×630（仕様書 4-2 の表：キャラクター、型コード、コラムの見出し）
 * 左にタイプ色の枠のカード（型コードとキャラクター）、右にコラムの title を2段で置く。
 * 文字はフォントのサブセットにあるものだけ描ける。コラムの title は scripts/lib/charset.mjs が集めている
 */
export const alt = "16タイプ別の恋愛コラム";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 画像のルートはレイアウトとページの generateStaticParams を引き継がない。ビルド時に16枚作るため、ここで lang と type を返す
export const dynamicParams = false;

export function generateStaticParams() {
  return TYPE_CODES.map((type) => ({ lang: "ja", type }));
}

const PADDING = 60;
// カード：タイプ色の枠、暗い内面、型コード、4:5 のキャラクターの窓（画面の TypeFrame と CharacterFigure に合わせる）
const CARD_WIDTH = 360;
const FRAME = 10;
const CARD_RADIUS = 28;
const ART_MARGIN = 14;
const ART_WIDTH = CARD_WIDTH - FRAME * 2 - ART_MARGIN * 2;
const ART_HEIGHT = Math.round((ART_WIDTH * 5) / 4);
const HEADER_HEIGHT = 96;
const CARD_HEIGHT = FRAME * 2 + HEADER_HEIGHT + ART_HEIGHT + ART_MARGIN;
const TEXT_LEFT = PADDING + CARD_WIDTH + 60;
const TEXT_WIDTH = OG_SIZE.width - TEXT_LEFT - PADDING;
const SIGN_WORD = "脈ありサイン";

/** 和文は1字 1em、英数字は 0.6em と見積もった行の幅（em） */
function lineUnits(line: string): number {
  return [...line].reduce((sum, ch) => sum + (ch.charCodeAt(0) < 0x80 ? 0.6 : 1), 0);
}

/** 副題を「…と」「脈ありサイン」の2行に分ける（16本とも末尾が「脈ありサイン」）。合わなければ1行のまま折り返しに任せる */
function subtitleLines(subtitle: string): string[] {
  if (subtitle.endsWith(SIGN_WORD) && subtitle.length > SIGN_WORD.length) {
    return [subtitle.slice(0, -SIGN_WORD.length), SIGN_WORD];
  }
  return [subtitle];
}

export default async function Image({ params }: { params: Promise<{ lang: string; type: string }> }) {
  const { lang, type } = await params;
  if (lang !== "ja" || !isTypeCode(type)) notFound();

  const [fonts, character] = await Promise.all([loadOgFonts(), loadTrimmedCharacter(type)]);
  const color = ogTypeColor(type);
  const fitted = fitInBox(character, ART_WIDTH * 0.96, ART_HEIGHT * 0.96);
  const { prefix, subtitle } = splitArticleTitle(type);
  const lines = subtitleLines(subtitle);
  // 長い行が枠の幅に収まる大きさ（44〜64px）
  const titleSize = Math.max(44, Math.min(64, Math.floor(TEXT_WIDTH / Math.max(...lines.map(lineUnits)))));
  const prefixSize = Math.min(38, Math.floor(TEXT_WIDTH / lineUnits(prefix || " ")));

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
        {/* カード */}
        <div
          style={{
            position: "absolute",
            left: PADDING,
            top: Math.round((OG_SIZE.height - CARD_HEIGHT) / 2),
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            display: "flex",
            padding: FRAME,
            borderRadius: CARD_RADIUS,
            backgroundColor: color,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              borderRadius: CARD_RADIUS - FRAME,
              backgroundColor: OG_COLORS.surface,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: HEADER_HEIGHT,
                padding: `0 ${ART_MARGIN + 4}px`,
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "0.02em",
              }}
            >
              {type}
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                width: ART_WIDTH,
                height: ART_HEIGHT,
                margin: `0 ${ART_MARGIN}px`,
                borderRadius: 8,
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
              <img src={character.src} width={fitted.width} height={fitted.height} alt="" />
            </div>
          </div>
        </div>

        {/* コラムの title */}
        <div
          style={{
            position: "absolute",
            left: TEXT_LEFT,
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            {prefix && (
              <div style={{ fontSize: prefixSize, fontWeight: 700, lineHeight: 1.3, color }}>{prefix}</div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 18,
                fontSize: titleSize,
                fontWeight: 900,
                lineHeight: 1.25,
              }}
            >
              {lines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: OG_COLORS.textMuted }}>{OG_SITE_LABEL}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
