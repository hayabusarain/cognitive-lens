import { ImageResponse } from "next/og";
import { BINGO_DATA, BINGO_TITLES } from "@/lib/bingo-data-ja";
import {
  BOARD_SIZE,
  cellToItem,
  cellsInCompletedLines,
  countLines,
  formatTitle,
  isItemPressed,
  splitTitle,
  titleLevel,
} from "@/lib/bingo/board";
import type { TypeCode } from "@/lib/type-codes";
import { OG_FONT_FAMILY, fitInBox, loadOgFonts, loadTrimmedCharacter, type OgImageSource } from "@/lib/og/assets";
import { OG_COLORS, OG_SITE_LABEL, OG_SIZE, ogTypeColor } from "@/lib/og/theme";

/**
 * ビンゴの生成画像（仕様書 4-2 の OG 画像、4-5 のビンゴカード画像）。
 * 画面（BingoBoard.tsx）と同じく、タイプ色の枠・暗い面・揃ったラインのマスをタイプ色で塗る。
 * 文字は lib/og/assets.ts のサブセットフォントだけで描く。固定文言は assets/fonts/charset.txt にある字で書いている
 * （「偏見だらけの」「ビンゴ」「ライン」「FREE」と英数字）。
 */

/** ビンゴカード画像の大きさ（仕様書 4-5。フィード投稿で切れにくい 4:5） */
export const BINGO_CARD_SIZE = { width: 1080, height: 1350 } as const;

/** 16進の色 a と b を t（0〜1、a の割合）で混ぜる */
function mix(a: string, b: string, t: number): string {
  const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [ca, cb] = [channels(a), channels(b)];
  return `#${ca.map((v, i) => Math.round(v * t + cb[i] * (1 - t)).toString(16).padStart(2, "0")).join("")}`;
}

/** キャラクターの窓（画面の CharacterFigure と同じ、暗い地に下からタイプ色の台座） */
function CharacterArt({ image, color, width, height, radius }: { image: OgImageSource; color: string; width: number; height: number; radius: number }) {
  const fitted = fitInBox(image, width * 0.96, height * 0.96);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        width,
        height,
        flexShrink: 0,
        borderRadius: radius,
        overflow: "hidden",
        backgroundColor: OG_COLORS.art,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -width * 0.12,
          bottom: -height * 0.38,
          width: width * 1.24,
          height: height * 0.78,
          borderTopLeftRadius: `${width * 0.62}px ${height * 0.312}px`,
          borderTopRightRadius: `${width * 0.62}px ${height * 0.312}px`,
          backgroundColor: color,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} width={fitted.width} height={fitted.height} alt="" />
    </div>
  );
}

function SiteName({ fontSize }: { fontSize: number }) {
  return (
    <div style={{ display: "flex", fontSize, fontWeight: 900, lineHeight: 1 }}>
      <span>Cognitive</span>
      <span style={{ color: OG_COLORS.textMuted }}>Lens</span>
    </div>
  );
}

/** 5×5 の小さな盤面の印（OG 画像の飾り）。斜めの1本だけを明るくする */
function BoardGlyph({ color, cell, gap }: { color: string; cell: number; gap: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: BOARD_SIZE }, (_, row) => (
        <div key={row} style={{ display: "flex", gap }}>
          {Array.from({ length: BOARD_SIZE }, (_, col) => (
            <div key={col} style={{ width: cell, height: cell, borderRadius: 3, backgroundColor: row === col ? color : OG_COLORS.line }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * /ja/bingo/{TYPE} の OG 画像 1200×630（仕様書 4-2）。
 * 左 45% はタイプ色の面にキャラクター、右に「偏見だらけの」「{TYPE}」「ビンゴ」
 */
export async function renderBingoOgImage(type: TypeCode): Promise<ImageResponse> {
  const [fonts, image] = await Promise.all([loadOgFonts(), loadTrimmedCharacter(type)]);
  const color = ogTypeColor(type);
  const panelWidth = Math.round(OG_SIZE.width * 0.45);
  const fitted = fitInBox(image, 540, 560);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: OG_COLORS.background,
          color: OG_COLORS.text,
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", width: panelWidth, height: "100%", backgroundColor: color }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} width={fitted.width} height={fitted.height} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: 60 }}>
          <SiteName fontSize={36} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.2 }}>偏見だらけの</div>
            <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1.05, letterSpacing: "0.02em", color }}>{type}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1.2 }}>ビンゴ</div>
              <BoardGlyph color={color} cell={16} gap={5} />
            </div>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: OG_COLORS.textMuted }}>{OG_SITE_LABEL}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

// ── ビンゴカード画像 1080×1350 ─────────────────────────────────────
const CARD_MARGIN = 36;
const CARD_FRAME = 12;
const CARD_PADDING = 36;
const ART_WIDTH = 192;
const ART_HEIGHT = 240;
const BOARD_PADDING = 10;
const BOARD_GAP = 8;

/**
 * マスの文字の大きさ。マスの内側は幅およそ146px・高さ105px（行の高さは 1.25 倍）。
 * 5字までは1行、8字までは2行、それより長いもの（最長15字）は3行に収まる大きさにする
 */
function cellFontSize(text: string): number {
  const length = [...text].length;
  if (length <= 5) return 28;
  if (length <= 8) return 30;
  return 26;
}

/**
 * /ja/bingo/{TYPE}/card/{mask} の画像（仕様書 4-5）。
 * 上から、キャラクターと見出し、ライン数と称号、盤面、サイト名と URL
 */
export async function renderBingoCardImage(type: TypeCode, mask: number): Promise<ImageResponse> {
  const [fonts, image] = await Promise.all([loadOgFonts(), loadTrimmedCharacter(type)]);
  const color = ogTypeColor(type);
  const items = BINGO_DATA[type];
  const lines = countLines(mask);
  const lineCells = cellsInCompletedLines(mask);
  const { tag, name } = splitTitle(formatTitle(BINGO_TITLES[titleLevel(lines)], type));
  const pressedBackground = mix(color, OG_COLORS.background, 0.2);

  const cellStyle = (cell: number) => {
    const item = cellToItem(cell);
    const base = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // 文字の量で列の幅が変わらないよう、幅の基準を 0 にして5等分する
      flexGrow: 1,
      flexBasis: 0,
      minWidth: 0,
      padding: 8,
      borderRadius: 14,
      textAlign: "center",
      // 最後の行に1字だけ残らないよう、行の長さを揃える
      textWrap: "balance",
      lineHeight: 1.25,
    } as const;
    // FREE は1語なので折り返しの調整をせず、ほかのマスと同じ太さの枠を付けて大きさを揃える
    if (item === null) return { ...base, textWrap: "wrap", whiteSpace: "nowrap", backgroundColor: color, color: OG_COLORS.ink, fontSize: 42, fontWeight: 900, border: `4px solid ${color}` };
    const text = items[item];
    const fontSize = cellFontSize(text);
    if (lineCells.has(cell)) return { ...base, backgroundColor: color, color: OG_COLORS.ink, fontSize, fontWeight: 900, border: `4px solid ${color}` };
    if (isItemPressed(mask, item)) return { ...base, backgroundColor: pressedBackground, color: OG_COLORS.text, fontSize, fontWeight: 700, border: `4px solid ${color}` };
    return { ...base, backgroundColor: OG_COLORS.surface, color: OG_COLORS.textMuted, fontSize, fontWeight: 700, border: `4px solid ${OG_COLORS.line}` };
  };

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: CARD_MARGIN,
          backgroundColor: OG_COLORS.background,
          color: OG_COLORS.text,
          fontFamily: OG_FONT_FAMILY,
        }}
      >
        <div style={{ display: "flex", flex: 1, padding: CARD_FRAME, borderRadius: 44, backgroundColor: color }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 24,
              padding: CARD_PADDING,
              borderRadius: 44 - CARD_FRAME,
              backgroundColor: OG_COLORS.surface,
            }}
          >
            {/* キャラクターと見出し */}
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <CharacterArt image={image} color={color} width={ART_WIDTH} height={ART_HEIGHT} radius={12} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.2 }}>偏見だらけの</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
                  <div style={{ fontSize: 120, fontWeight: 900, lineHeight: 1.1, letterSpacing: "0.02em" }}>{type}</div>
                  <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.1 }}>ビンゴ</div>
                </div>
              </div>
            </div>

            {/* ライン数と称号 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 24,
                padding: "18px 32px",
                borderRadius: 20,
                backgroundColor: OG_COLORS.background,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline" }}>
                {/* Satori は子が文字列でない div に display: flex を求める。数値の 1 以上で失敗したので、文字列にして渡す */}
                <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1, color }}>{String(lines)}</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: OG_COLORS.textMuted, marginLeft: 12 }}>/ 12</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: OG_COLORS.textMuted, marginLeft: 16 }}>ライン</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                {tag && <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.3, color }}>{tag}</div>}
                <div style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.25 }}>{name}</div>
              </div>
            </div>

            {/* 盤面 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: BOARD_GAP,
                padding: BOARD_PADDING,
                borderRadius: 24,
                backgroundColor: OG_COLORS.background,
              }}
            >
              {Array.from({ length: BOARD_SIZE }, (_, row) => (
                <div key={row} style={{ display: "flex", flexGrow: 1, flexBasis: 0, minHeight: 0, gap: BOARD_GAP }}>
                  {Array.from({ length: BOARD_SIZE }, (_, col) => {
                    const cell = row * BOARD_SIZE + col;
                    const item = cellToItem(cell);
                    return (
                      <div key={cell} style={cellStyle(cell)}>
                        {item === null ? "FREE" : items[item]}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* サイト名と URL */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SiteName fontSize={34} />
              <div style={{ fontSize: 26, fontWeight: 700, color: OG_COLORS.textMuted }}>{`${OG_SITE_LABEL}/ja/bingo/${type}`}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...BINGO_CARD_SIZE, fonts },
  );
}
