import type { TypeCode } from "@/lib/type-codes";

/**
 * 適職の職業名（decisions N1・N9）
 *
 * どのタイプにどの職業を挙げるかは、現行の lib/career-data.ts（hellJob・survivalRoute）のまま。
 * 職業を見下す言い回しだけを、仕様書 5-2 の書き換え表で中立な職業名に直した。
 * 説明文は lib/type-content/{TYPE}.ts の career に書く。禁止語の検査の対象外（職業名のため）。
 */
export const CAREER_JOBS = {
  ENFJ: { avoid: "一日中ひとりで進めるPC作業", fit: "教師・コーチ・人事採用" },
  ENFP: { avoid: "厳格な経理・データ入力", fit: "PR・イベント企画・営業" },
  ENTJ: { avoid: "定型業務が中心の事務職", fit: "起業家・プロジェクトマネージャー" },
  ENTP: { avoid: "公務員・銀行員", fit: "新規事業開発・マーケター" },
  ESFJ: { avoid: "フルリモートで人と話す機会が少ない仕事", fit: "営業・カスタマーサクセス" },
  ESFP: { avoid: "データ分析・ひとりで進める作業", fit: "エンタメ・アパレル・イベント業" },
  ESTJ: { avoid: "決まった手順のないフリーランス", fit: "現場監督・プロジェクトマネージャー" },
  ESTP: { avoid: "デスクワーク・地道な研究職", fit: "不動産営業・起業・スポーツ関連" },
  INFJ: { avoid: "ノルマの厳しい営業職", fit: "心理カウンセラー・人事・ライター" },
  INFP: { avoid: "クレーム対応・上下関係の厳しい職場", fit: "クリエイター・フリーランス" },
  INTJ: { avoid: "コールセンター・窓口業務", fit: "データサイエンティスト・研究職" },
  INTP: { avoid: "飛び込み営業・接客業", fit: "フルリモートのITエンジニア" },
  ISFJ: { avoid: "成果主義の強い外資系企業", fit: "医療事務・バックオフィス・秘書" },
  ISFP: { avoid: "スピードと効率を最優先する職場", fit: "デザイナー・アーティスト・職人" },
  ISTJ: { avoid: "クリエイティブ系のベンチャー", fit: "公務員・経理・品質管理" },
  ISTP: { avoid: "感情労働・カウンセラー", fit: "職人・エンジニア・メカニック" },
} as const satisfies Record<TypeCode, { avoid: string; fit: string }>;
