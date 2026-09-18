import type { CSSProperties, ReactNode } from "react";
import { ImageResponse } from "next/og";
import type { TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { TYPE_CONTENT } from "@/lib/type-content";
import { typeNumber } from "@/lib/type-display";
import { OG_FONT_FAMILY, loadOgFonts } from "@/lib/og/assets";
import { TypeArtText } from "@/lib/og/type-art";
import { OG_COLORS, OG_SITE_LABEL, OG_SIZE, ogTypeColor } from "@/lib/og/theme";

/**
 * 結果ページの生成画像（仕様書 4-2・4-3）。見た目はコレクションカード（タイプ色の枠・暗い内面・台座）に揃える。
 *   renderResultOgImage …… OG 画像 1200×630（opengraph-image.tsx・twitter-image.tsx）
 *   renderResultStoryImage … 9:16 結果画像 1080×1920（share-image の2つのルート）
 * 文字はフォントのサブセット（assets/fonts/charset.txt）にあるものだけ描ける。固定文言を足すときは scripts/lib/charset.mjs も直す
 */

/** 割合バーの負けた側（画面の --color-track） */
const TRACK = "#3A3F4B";

/** 軸名（ScoreBars と同じ）。charset.mjs の「外向・内向 感覚・直観 思考・感情 判断・知覚」に含まれる文字だけ */
const AXIS_LABELS = [
  ["外向", "内向"],
  ["感覚", "直観"],
  ["思考", "感情"],
  ["判断", "知覚"],
] as const;
/** 各軸の前の文字。型コードのこの位置の文字と同じなら、前の文字が勝っている */
const FIRST_LETTERS = "ESTJ";

/**
 * タイプ色の台座（画面の .type-art::before）。幅 width・高さ height の窓の下から出す。
 * 画面の窓は 4:5 で下から 40% の高さまで見えるが、9:16 画像の窓は横長なので、同じ割合だと丘のように大きく見える。
 * 見える高さは visible（窓の高さに対する割合）で決める
 */
function Pedestal({ width, height, color, visible }: { width: number; height: number; color: string; visible: number }) {
  const pedestalWidth = width * 1.24;
  const pedestalHeight = height * visible * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: -width * 0.12,
        bottom: -height * visible,
        width: pedestalWidth,
        height: pedestalHeight,
        borderTopLeftRadius: `${pedestalWidth / 2}px ${pedestalHeight * 0.8}px`,
        borderTopRightRadius: `${pedestalWidth / 2}px ${pedestalHeight * 0.8}px`,
        backgroundColor: color,
      }}
    />
  );
}

/** 文字列の幅の見積もり（em）。和文は1字 1em、英数字は 0.6em */
function textUnits(text: string): number {
  return [...text].reduce((sum, ch) => sum + (ch.charCodeAt(0) < 0x80 ? 0.6 : 1), 0);
}

/** 1行に並べられる幅（em）で、「、」の後ろを区切りに行を組む */
function phraseLines(text: string, maxUnits: number): string[] {
  const lines: string[] = [];
  for (const phrase of text.split(/(?<=、)/)) {
    const last = lines.length - 1;
    if (last >= 0 && textUnits(lines[last] + phrase) <= maxUnits) lines[last] += phrase;
    else lines.push(phrase);
  }
  return lines;
}

function SiteName({ fontSize }: { fontSize: number }) {
  return (
    <div style={{ display: "flex", fontSize, fontWeight: 900, lineHeight: 1 }}>
      <span>Cognitive</span>
      <span style={{ color: OG_COLORS.textMuted }}>Lens</span>
    </div>
  );
}

// ── OG 画像 1200×630 ────────────────────────────────────────────

const OG_PANEL_WIDTH = 540; // 左 45%
const OG_FRAME = 14; // 右の暗い面のまわりに見えるタイプ色の枠
const OG_PADDING = 60; // 外周の余白（文字の位置）
/** 短文の行の幅：右の面 646px − 左右の余白 94px − 左の線と余白 28px */
const OG_CATCH_WIDTH = 524;
const OG_CATCH_FONT_SIZE = 34;

export async function renderResultOgImage(type: TypeCode): Promise<ImageResponse> {
  const fonts = await loadOgFonts();
  const color = ogTypeColor(type);
  const content = TYPE_CONTENT[type];
  // 短文は24字以内で2行まで。Satori は句の途中でも折り返すので「、」の後ろで行を分け、「、」のない長い1行は文字を少し小さくして収める
  const catchLines = phraseLines(content.og.catch, Math.floor(OG_CATCH_WIDTH / OG_CATCH_FONT_SIZE));
  const catchFontSize = Math.min(OG_CATCH_FONT_SIZE, Math.floor(OG_CATCH_WIDTH / Math.max(...catchLines.map(textUnits))));

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: color,
          color: OG_COLORS.text,
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        {/* 左：タイプ色の面。足もとに影の台座を置き、キャラクターを下揃え */}
        <div
          style={{
            position: "absolute",
            left: (OG_PANEL_WIDTH - 440) / 2,
            bottom: -70,
            width: 440,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(14, 16, 22, 0.16)",
          }}
        />
        <TypeArtText type={type} width={OG_PANEL_WIDTH} height={560} />
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 22,
            display: "flex",
            padding: "8px 12px",
            borderRadius: 8,
            backgroundColor: OG_COLORS.ink,
            color: color,
            fontSize: 22,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {`${typeNumber(type)} / 16`}
        </div>

        {/* 右：暗い面（カードの内面）。型コード → 呼称 → 短文 → サイト表記 */}
        <div
          style={{
            position: "absolute",
            left: OG_PANEL_WIDTH,
            top: OG_FRAME,
            right: OG_FRAME,
            bottom: OG_FRAME,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: `${OG_PADDING - OG_FRAME}px ${OG_PADDING - OG_FRAME}px ${OG_PADDING - OG_FRAME}px 48px`,
            borderRadius: 24,
            backgroundColor: OG_COLORS.surface,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1, letterSpacing: "0.01em" }}>{type}</div>
            <div style={{ marginTop: 18, fontSize: 64, fontWeight: 700, lineHeight: 1.15, color }}>{TYPE_NAMES[type]}</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: 22,
              borderLeft: `6px solid ${color}`,
              fontSize: catchFontSize,
              fontWeight: 700,
              lineHeight: 1.45,
              whiteSpace: "nowrap",
            }}
          >
            {catchLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <SiteName fontSize={24} />
            <div style={{ fontSize: 24, fontWeight: 700, color: OG_COLORS.textMuted }}>{OG_SITE_LABEL}</div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

// ── 9:16 結果画像 1080×1920 ──────────────────────────────────────

export const STORY_SIZE = { width: 1080, height: 1920 } as const;

/** 左右の余白 80px、内容の幅 920px（仕様書 4-3） */
const STORY_LEFT = 80;
const STORY_WIDTH = 920;
/** カードの枠。上端 250px・下端 340px の安全域の外にはみ出るのは枠の飾りだけにする */
const STORY_CARD = { left: 52, top: 206, width: 976, height: 1406, frame: 12, radius: 44 } as const;

/** 仕様書 4-3 の表（上端からの px）。[上端, 下端] */
const STORY_LAYOUT = {
  plain: { art: [350, 1170], name: [1190, 1330], code: [1340, 1410], tagline: [1430, 1480], url: [1530, 1570] },
  scored: { art: [340, 1020], name: [1030, 1170], code: [1180, 1250], tagline: [1265, 1310], bars: [1330, 1508], url: [1535, 1575] },
} as const;

type Band = readonly [number, number];

/** 横幅いっぱい・中央揃えの1行 */
function Line({ band, children, style }: { band: Band; children: ReactNode; style: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        left: STORY_LEFT,
        top: band[0],
        width: STORY_WIDTH,
        height: band[1] - band[0],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** 呼称の文字サイズ。基本は 128px（最長の「リヴァイアサン」7字で 896px）。念のため幅 920px を超える長さなら縮める */
function nameFontSize(name: string): number {
  return Math.min(128, Math.floor(STORY_WIDTH / [...name].length));
}

function ScoreRows({ type, scores, top, color }: { type: TypeCode; scores: readonly number[]; top: number; color: string }) {
  return (
    <>
      {AXIS_LABELS.map(([first, second], i) => {
        const p = scores[i];
        const firstWins = type[i] === FIRST_LETTERS[i];
        const win = { color, fontWeight: 900 } as const;
        const lose = { color: OG_COLORS.textMuted, fontWeight: 700 } as const;
        return (
          <div
            key={first}
            style={{ position: "absolute", left: STORY_LEFT, top: top + i * 46, width: STORY_WIDTH, height: 40, display: "flex", flexDirection: "column" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", height: 24, fontSize: 24, lineHeight: 1 }}>
              <span style={firstWins ? win : lose}>{`${first} ${p}%`}</span>
              <span style={firstWins ? lose : win}>{`${100 - p}% ${second}`}</span>
            </div>
            <div style={{ display: "flex", marginTop: 4, height: 12 }}>
              <div style={{ width: `${p}%`, height: 12, borderRadius: 6, backgroundColor: firstWins ? color : TRACK }} />
              <div style={{ width: 4, height: 12 }} />
              <div style={{ flex: 1, height: 12, borderRadius: 6, backgroundColor: firstWins ? TRACK : color }} />
            </div>
          </div>
        );
      })}
    </>
  );
}

/**
 * 9:16 結果画像。scores を渡すと4軸の割合を入れ、キャラクターを小さくする。
 * scores は parseScores で検証した値を渡す（前の文字 E・S・T・J の割合）
 */
export async function renderResultStoryImage(type: TypeCode, scores?: readonly number[] | null): Promise<ImageResponse> {
  const fonts = await loadOgFonts();
  const color = ogTypeColor(type);
  const content = TYPE_CONTENT[type];
  const name = TYPE_NAMES[type];
  const layout = scores ? STORY_LAYOUT.scored : STORY_LAYOUT.plain;
  const artHeight = layout.art[1] - layout.art[0];

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
        {/* カード：タイプ色の枠と暗い内面 */}
        <div
          style={{
            position: "absolute",
            left: STORY_CARD.left,
            top: STORY_CARD.top,
            width: STORY_CARD.width,
            height: STORY_CARD.height,
            display: "flex",
            padding: STORY_CARD.frame,
            borderRadius: STORY_CARD.radius,
            backgroundColor: color,
          }}
        >
          <div style={{ display: "flex", width: "100%", height: "100%", borderRadius: STORY_CARD.radius - STORY_CARD.frame, backgroundColor: OG_COLORS.surface }} />
        </div>

        {/* 上の行：サイト名と通し番号（250〜310px） */}
        <div
          style={{
            position: "absolute",
            left: STORY_LEFT,
            top: 250,
            width: STORY_WIDTH,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <SiteName fontSize={40} />
          <div
            style={{
              display: "flex",
              padding: "10px 14px",
              borderRadius: 8,
              backgroundColor: color,
              color: OG_COLORS.ink,
              fontSize: 30,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {`${typeNumber(type)} / 16`}
          </div>
        </div>

        {/* キャラクターの窓 */}
        <div
          style={{
            position: "absolute",
            left: STORY_LEFT,
            top: layout.art[0],
            width: STORY_WIDTH,
            height: artHeight,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: 16,
            backgroundColor: OG_COLORS.art,
          }}
        >
          <Pedestal width={STORY_WIDTH} height={artHeight} color={color} visible={0.26} />
          <TypeArtText type={type} width={STORY_WIDTH} height={artHeight} />
        </div>

        {/* 呼称が主役。型コードは下に小さく（OG 画像とは大小が逆） */}
        <Line band={layout.name} style={{ fontSize: nameFontSize(name), fontWeight: 900, letterSpacing: 0 }}>
          {name}
        </Line>
        <Line band={layout.code} style={{ fontSize: 64, fontWeight: 900, color, letterSpacing: "0.04em" }}>
          {type}
        </Line>
        <Line band={layout.tagline} style={{ fontSize: 36, fontWeight: 700 }}>
          {content.tagline}
        </Line>
        {scores && <ScoreRows type={type} scores={scores} top={STORY_LAYOUT.scored.bars[0]} color={color} />}
        <Line band={layout.url} style={{ fontSize: 28, fontWeight: 700, color: OG_COLORS.textMuted }}>
          {`${OG_SITE_LABEL}/ja/result/${type}`}
        </Line>
      </div>
    ),
    { ...STORY_SIZE, fonts },
  );
}
