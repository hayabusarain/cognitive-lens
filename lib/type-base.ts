import type { TypeCode } from "@/lib/type-codes";

/**
 * タイプごとの、言語や文章に依存しない情報（仕様書 5-2）
 * 相性の相手（compatibility）は、文章を書くステップ 2-4・2-5 で足す
 */
export interface TypeBase {
  image: { src: string; trimmed: string; width: 800; height: 1000 };
  /** タイプ色。1タイプ1色（decisions Q20）。暗い背景の上で文字に使ってもコントラスト比 4.5 以上 */
  color: string;
}

const image = (code: TypeCode): TypeBase["image"] => ({
  src: `/characters/${code}.png`,
  trimmed: `assets/characters/trimmed/${code}.png`,
  width: 800,
  height: 1000,
});

/** 色は呼称（lib/type-names.ts）のモチーフに寄せ、色相環に散らしている。案の根拠は docs/colors.md */
export const TYPE_BASE = {
  ENTJ: { image: image("ENTJ"), color: "#FF5A5F" }, // ドラゴン：赤
  ENFJ: { image: image("ENFJ"), color: "#FF8A4C" }, // フェニックス：朱
  ISFJ: { image: image("ISFJ"), color: "#F2C14E" }, // グリフォン：守る宝の金
  ESFP: { image: image("ESFP"), color: "#E6DC4A" }, // サラマンダー：炎の黄
  ENTP: { image: image("ENTP"), color: "#A6DD55" }, // キマイラ：混ざり合う黄緑
  ESFJ: { image: image("ESFJ"), color: "#6FD66A" }, // ドライアド：若葉
  ISTJ: { image: image("ISTJ"), color: "#45D492" }, // ゴーレム：苔むした石
  INTJ: { image: image("INTJ"), color: "#3FCFC0" }, // スフィンクス：ファイアンスの青緑
  ISFP: { image: image("ISFP"), color: "#45C3E0" }, // マーメイド：浅い海
  INFP: { image: image("INFP"), color: "#62B0F5" }, // ペガサス：空
  INTP: { image: image("INTP"), color: "#6E95FF" }, // リヴァイアサン：深海
  ISTP: { image: image("ISTP"), color: "#8E8EFF" }, // フェンリル：夜の氷
  INFJ: { image: image("INFJ"), color: "#B08CFF" }, // ユニコーン：薄紫
  ESTJ: { image: image("ESTJ"), color: "#D07CF5" }, // ケルベロス：冥界の門の紫
  ENFP: { image: image("ENFP"), color: "#FF78D2" }, // ピクシー：桃色の火花
  ESTP: { image: image("ESTP"), color: "#FF6E96" }, // ミノタウロス：闘牛の布の紅
} satisfies Record<TypeCode, TypeBase>;
