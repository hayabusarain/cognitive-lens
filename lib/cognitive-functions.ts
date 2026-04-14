// 8つの認知機能スコア定義
// Dom=95, Aux=78, Tert=52, Inf=28
// Shadow(5th=35, 6th=22, 7th=15, 8th=10)

export type CognitiveFunction =
  | "Ni" | "Ne"
  | "Si" | "Se"
  | "Ti" | "Te"
  | "Fi" | "Fe";

export type FunctionScores = Record<CognitiveFunction, number>;

// レーダーチャートの軸表示順（12時→時計回り）
// 直観→感覚→感情→思考 の順でペアを並べる
export const AXIS_ORDER: CognitiveFunction[] = [
  "Ni", "Ne", "Se", "Si", "Fe", "Fi", "Ti", "Te",
];

export const FUNCTION_LABELS: Record<CognitiveFunction, { en: string; ja: string }> = {
  Ni: { en: "Ni", ja: "内向的直観" },
  Ne: { en: "Ne", ja: "外向的直観" },
  Se: { en: "Se", ja: "外向的感覚" },
  Si: { en: "Si", ja: "内向的感覚" },
  Fe: { en: "Fe", ja: "外向的感情" },
  Fi: { en: "Fi", ja: "内向的感情" },
  Ti: { en: "Ti", ja: "内向的思考" },
  Te: { en: "Te", ja: "外向的思考" },
};

// 16タイプ × 8機能スコア
// 各タイプの主機能は95、劣等機能は28
// Shadow機能は逆軸のペア(Ni↔Ne, Si↔Se, Ti↔Te, Fi↔Fe)に割り当て
export const FUNCTION_SCORES: Record<string, FunctionScores> = {
  INTJ: { Ni: 95, Te: 78, Fi: 52, Se: 28, Ne: 35, Ti: 22, Fe: 15, Si: 10 },
  INTP: { Ti: 95, Ne: 78, Si: 52, Fe: 28, Te: 35, Ni: 22, Se: 15, Fi: 10 },
  ENTJ: { Te: 95, Ni: 78, Se: 52, Fi: 28, Ti: 35, Ne: 22, Si: 15, Fe: 10 },
  ENTP: { Ne: 95, Ti: 78, Fe: 52, Si: 28, Ni: 35, Te: 22, Fi: 15, Se: 10 },
  INFJ: { Ni: 95, Fe: 78, Ti: 52, Se: 28, Ne: 35, Fi: 22, Te: 15, Si: 10 },
  INFP: { Fi: 95, Ne: 78, Si: 52, Te: 28, Fe: 35, Ni: 22, Ti: 15, Se: 10 },
  ENFJ: { Fe: 95, Ni: 78, Se: 52, Ti: 28, Fi: 35, Ne: 22, Si: 15, Te: 10 },
  ENFP: { Ne: 95, Fi: 78, Te: 52, Si: 28, Ni: 35, Fe: 22, Ti: 15, Se: 10 },
  ISTJ: { Si: 95, Te: 78, Fi: 52, Ne: 28, Se: 35, Ti: 22, Fe: 15, Ni: 10 },
  ISFJ: { Si: 95, Fe: 78, Ti: 52, Ne: 28, Se: 35, Fi: 22, Te: 15, Ni: 10 },
  ESTJ: { Te: 95, Si: 78, Ne: 52, Fi: 28, Ti: 35, Se: 22, Ni: 15, Fe: 10 },
  ESFJ: { Fe: 95, Si: 78, Ne: 52, Ti: 28, Fi: 35, Se: 22, Ni: 15, Te: 10 },
  ISTP: { Ti: 95, Se: 78, Ni: 52, Fe: 28, Te: 35, Si: 22, Ne: 15, Fi: 10 },
  ISFP: { Fi: 95, Se: 78, Ni: 52, Te: 28, Fe: 35, Si: 22, Ne: 15, Ti: 10 },
  ESTP: { Se: 95, Ti: 78, Fe: 52, Ni: 28, Si: 35, Te: 22, Fi: 15, Ne: 10 },
  ESFP: { Se: 95, Fi: 78, Te: 52, Ni: 28, Si: 35, Fe: 22, Ti: 15, Ne: 10 },
};

// タイプの主機能・劣等機能を取得
export function getDomInf(typeKey: string): {
  dom: CognitiveFunction | null;
  inf: CognitiveFunction | null;
} {
  const scores = FUNCTION_SCORES[typeKey];
  if (!scores) return { dom: null, inf: null };
  let dom: CognitiveFunction | null = null;
  let inf: CognitiveFunction | null = null;
  let maxVal = -1;
  let minPrimaryVal = 999;
  // Primary stack is the 4 functions with the 4 highest scores
  const sorted = (Object.entries(scores) as [CognitiveFunction, number][])
    .sort((a, b) => b[1] - a[1]);
  // Dom = highest
  dom = sorted[0][0];
  // Inf = 4th highest (lowest of primary 4)
  inf = sorted[3][0];
  return { dom, inf };
}
