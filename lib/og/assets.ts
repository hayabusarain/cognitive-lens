import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { TypeCode } from "@/lib/type-codes";

/**
 * 生成画像（OG 画像・9:16 結果画像・ビンゴカード画像）の素材を読む（仕様書 4-1、4-2）
 *
 * import で同梱せず readFile で読む（ImageResponse のバンドル上限 500KB の対象から外すため。image-response.md）。
 * 実行時に画像を作るルート（4-3・4-5）では、next.config.ts の outputFileTracingIncludes に
 * assets/fonts と assets/characters/trimmed を足さないと、デプロイ先でファイルが見つからない。
 */

/** 生成画像で使う書体の名前。fontFamily にこの値を指定する */
export const OG_FONT_FAMILY = "Noto Sans JP";

const FONT_FILES = [
  { file: "NotoSansJP-Regular.subset.otf", weight: 400 },
  { file: "NotoSansJP-Bold.subset.otf", weight: 700 },
  { file: "NotoSansJP-Black.subset.otf", weight: 900 },
] as const;

/**
 * Noto Sans JP のサブセット3ウェイト（ImageResponse の fonts にそのまま渡す）。
 * 描けるのは assets/fonts/charset.txt にある文字だけ。固定文言を足すときは scripts/lib/charset.mjs に足し、
 * npm run build:font を実行する
 */
export async function loadOgFonts() {
  return Promise.all(
    FONT_FILES.map(async ({ file, weight }) => ({
      name: OG_FONT_FAMILY,
      data: await readFile(join(process.cwd(), "assets/fonts", file)),
      weight,
      style: "normal" as const,
    })),
  );
}

export interface OgImageSource {
  /** img の src にそのまま渡せる data URL */
  src: string;
  width: number;
  height: number;
}

/**
 * 切り詰め版のキャラクター画像（assets/characters/trimmed/{TYPE}.png。prebuild の scripts/build-character-assets.mjs が作る）。
 * 画像ごとに縦横比が違うので、幅と高さも返す（枠に収めるときは fitInBox）
 */
export async function loadTrimmedCharacter(type: TypeCode): Promise<OgImageSource> {
  // パスは TYPE_BASE[type].image.trimmed と同じ。ビルドのファイル追跡がプロジェクト全体に広がらないよう、フォルダを固定して書く
  const png = await readFile(join(process.cwd(), "assets/characters/trimmed", `${type}.png`));
  // PNG の IHDR：16バイト目から幅、20バイト目から高さ（それぞれ4バイト）
  return {
    src: `data:image/png;base64,${png.toString("base64")}`,
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  };
}

/** 縦横比を保ったまま、幅 boxWidth・高さ boxHeight の枠に収まる大きさ（翼などで横に広い画像もはみ出さない） */
export function fitInBox(image: Pick<OgImageSource, "width" | "height">, boxWidth: number, boxHeight: number) {
  const scale = Math.min(boxWidth / image.width, boxHeight / image.height);
  return { width: Math.round(image.width * scale), height: Math.round(image.height * scale) };
}
