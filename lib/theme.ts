export type Theme = "cyber" | "modern" | "neobrutalism" | "glassmorphism" | "aurora";

export const DEFAULT_THEME: Theme = "aurora";

export function resolveTheme(value: string | undefined): Theme {
  if (
    value === "cyber" ||
    value === "modern" ||
    value === "neobrutalism" ||
    value === "glassmorphism" ||
    value === "aurora"
  ) {
    return value;
  }
  return DEFAULT_THEME;
}

// ── Chart colors ──────────────────────────────────────────────

export interface ChartColors {
  primary: string;
  compare: string;
  inferior: string;
  grid: string;
  axisLabel: string;
  axisSub: string;
  cardBg: string;
}

export const CHART_COLORS: Record<Theme, ChartColors> = {
  aurora: {
    primary: "#00e5ff",
    compare: "#a78bfa",
    inferior: "#fb7185",
    grid: "rgba(255,255,255,0.08)",
    axisLabel: "rgba(255,255,255,0.65)",
    axisSub: "rgba(255,255,255,0.35)",
    cardBg: "bg-transparent",
  },
  cyber: {
    primary: "#2dd4bf",
    compare: "#a78bfa",
    inferior: "#f43f5e",
    grid: "rgba(45,212,191,0.2)",
    axisLabel: "#ccfbf1",
    axisSub: "#5eead4",
    cardBg: "bg-stone-950",
  },
  modern: {
    primary: "#14b8a6",
    compare: "#a78bfa",
    inferior: "#f43f5e",
    grid: "#e2e8f0",
    axisLabel: "#334155",
    axisSub: "#94a3b8",
    cardBg: "bg-white",
  },
  neobrutalism: {
    primary: "#000000",
    compare: "#dc2626",
    inferior: "#dc2626",
    grid: "#374151",
    axisLabel: "#111827",
    axisSub: "#6b7280",
    cardBg: "bg-yellow-50",
  },
  glassmorphism: {
    primary: "#c4b5fd",
    compare: "#67e8f9",
    inferior: "#f9a8d4",
    grid: "rgba(255,255,255,0.18)",
    axisLabel: "#f0f9ff",
    axisSub: "rgba(255,255,255,0.65)",
    cardBg: "bg-transparent",
  },
};

// ── UI class maps ─────────────────────────────────────────────

export interface ThemeClasses {
  /** <body> 背景・テキスト */
  body: string;
  /** ページ最外殻 <main> */
  pageBg: string;
  /** Nav バー */
  nav: string;
  navLogoAccent: string;
  navBadge: string;
  /** サブテキスト */
  secondaryText: string;
  /** プライマリボタン */
  btnPrimary: string;
  /** ボタン（アウトライン） */
  btnOutline: string;
  /** カード（汎用） */
  card: string;
  /** バッジ */
  badge: string;
  /** プログレスバー */
  progressBar: string;
  /** テスト回答ボタン */
  answerBtn: string;
  /** フッター */
  footer: string;
  /** ボーダー区切り */
  divider: string;
  /** ヒーロー グラデーションテキスト */
  heroGradient: string;
  /** アクセントカラー（テキスト） */
  accent: string;
  /** 質問カード（テストページ） */
  questionCard: string;
  /** 入力フィールド */
  input: string;
}

export const THEME_CLASSES: Record<Theme, ThemeClasses> = {
  aurora: {
    body: "text-white",
    pageBg: "min-h-screen flex flex-col",
    nav: "nav-blur flex items-center justify-between px-6 py-4 sticky top-0 z-10",
    navLogoAccent: "text-cyan-300",
    navBadge:
      "text-xs px-3 py-1 rounded-full badge-neon font-bold tracking-widest",
    secondaryText: "text-white/55",
    btnPrimary:
      "inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-primary font-bold text-sm tracking-tight",
    btnOutline:
      "inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-ghost text-xs font-semibold",
    card: "glass-card rounded-3xl p-5 text-left",
    badge:
      "inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full badge-dark text-xs font-medium",
    progressBar:
      "h-full progress-fill transition-all duration-500 ease-out rounded-full",
    answerBtn:
      "group flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl btn-ghost font-medium text-sm active:scale-[0.98] transition-all duration-150",
    footer: "px-6 py-5 text-center",
    divider: "border-white/8",
    heroGradient:
      "bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent",
    accent: "text-cyan-400",
    questionCard:
      "glass-card rounded-3xl p-7",
    input:
      "input-dark w-full appearance-none rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none transition-all pr-8",
  },
  cyber: {
    body: "bg-black text-white",
    pageBg: "min-h-screen bg-black flex flex-col",
    nav: "flex items-center justify-between px-6 py-4 border-b border-teal-500/30 bg-black/90 backdrop-blur-sm sticky top-0 z-10",
    navLogoAccent: "text-teal-400",
    navBadge:
      "text-xs px-3 py-1 rounded-full bg-teal-900/50 text-teal-400 font-medium border border-teal-500/40",
    secondaryText: "text-teal-300/60",
    btnPrimary:
      "inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-teal-500 text-black font-bold text-sm shadow-lg shadow-teal-500/40 hover:bg-teal-400 hover:shadow-teal-400/60 transition-all duration-200 active:scale-95",
    btnOutline:
      "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent border border-teal-500/40 hover:border-teal-400 hover:bg-teal-900/30 text-xs font-semibold text-teal-400 hover:text-teal-300 shadow-sm transition-all duration-200",
    card: "rounded-3xl p-5 text-left bg-stone-900 border border-teal-500/20 shadow-sm hover:border-teal-500/50 hover:shadow-teal-500/10 hover:shadow-md transition-all duration-200",
    badge:
      "inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-teal-900/40 border border-teal-500/30 text-xs text-teal-400 font-medium",
    progressBar:
      "h-full bg-gradient-to-r from-teal-400 via-teal-500 to-violet-500 transition-all duration-500 ease-out",
    answerBtn:
      "group flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl border border-teal-500/20 bg-stone-900 hover:bg-teal-900/30 hover:border-teal-500/60 hover:text-teal-300 active:scale-[0.98] transition-all duration-150 font-medium text-sm text-stone-300 shadow-sm",
    footer: "px-6 py-5 text-center border-t border-teal-500/20",
    divider: "border-teal-500/20",
    heroGradient:
      "bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent",
    accent: "text-teal-400",
    questionCard:
      "bg-stone-900 rounded-3xl shadow-xl shadow-teal-500/10 border border-teal-500/20 p-7",
    input:
      "w-full appearance-none bg-stone-900 border border-teal-500/30 rounded-xl px-3 py-2.5 text-sm text-teal-100 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all pr-8",
  },

  modern: {
    body: "bg-white text-gray-800",
    pageBg: "min-h-screen bg-white flex flex-col",
    nav: "flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10",
    navLogoAccent: "text-gray-900",
    navBadge:
      "text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-medium",
    secondaryText: "text-gray-400",
    btnPrimary:
      "inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gray-900 text-white font-semibold text-sm hover:bg-gray-700 transition-all duration-200 active:scale-95",
    btnOutline:
      "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-xs font-semibold text-gray-600 hover:text-gray-800 shadow-sm transition-all duration-200",
    card: "rounded-2xl p-5 text-left bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200",
    badge:
      "inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-500 font-medium",
    progressBar:
      "h-full bg-gradient-to-r from-gray-700 to-gray-500 transition-all duration-500 ease-out",
    answerBtn:
      "group flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 active:scale-[0.98] transition-all duration-150 font-medium text-sm text-gray-700 shadow-sm",
    footer: "px-6 py-5 text-center border-t border-gray-100",
    divider: "border-gray-100",
    heroGradient:
      "bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent",
    accent: "text-gray-700",
    questionCard:
      "bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-7",
    input:
      "w-full appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all pr-8",
  },

  neobrutalism: {
    body: "bg-yellow-50 text-black",
    pageBg: "min-h-screen bg-yellow-50 flex flex-col",
    nav: "flex items-center justify-between px-6 py-4 border-b-[3px] border-black bg-yellow-100 sticky top-0 z-10",
    navLogoAccent: "text-black",
    navBadge:
      "text-xs px-3 py-1 bg-black text-yellow-300 font-bold border-2 border-black",
    secondaryText: "text-stone-600",
    btnPrimary:
      "inline-flex items-center gap-2 px-8 py-3.5 bg-black text-white font-black text-sm border-[3px] border-black shadow-[5px_5px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-100 active:shadow-none active:translate-x-[5px] active:translate-y-[5px]",
    btnOutline:
      "inline-flex items-center gap-2 px-5 py-2.5 bg-white font-black text-xs text-black border-[3px] border-black shadow-[3px_3px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100",
    card: "p-5 text-left bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-x-[3px] hover:-translate-y-[3px] transition-all duration-100",
    badge:
      "inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white border-[3px] border-black text-xs text-black font-black shadow-[3px_3px_0_0_#000]",
    progressBar:
      "h-full bg-black transition-all duration-500 ease-out",
    answerBtn:
      "group flex items-center gap-4 w-full text-left px-5 py-4 border-[3px] border-black bg-white shadow-[4px_4px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 font-bold text-sm text-black",
    footer: "px-6 py-5 text-center border-t-[3px] border-black",
    divider: "border-black",
    heroGradient: "text-black",
    accent: "text-black font-black",
    questionCard:
      "bg-white border-[3px] border-black shadow-[6px_6px_0_0_#000] p-7",
    input:
      "w-full appearance-none bg-white border-[3px] border-black px-3 py-2.5 text-sm text-black font-bold focus:outline-none focus:ring-0 focus:border-black transition-all pr-8 shadow-[3px_3px_0_0_#000]",
  },

  glassmorphism: {
    body: "text-white",
    pageBg:
      "min-h-screen bg-gradient-to-br from-purple-700 via-blue-700 to-teal-600 flex flex-col",
    nav: "flex items-center justify-between px-6 py-4 border-b border-white/20 bg-white/5 backdrop-blur-md sticky top-0 z-10",
    navLogoAccent: "text-cyan-300",
    navBadge:
      "text-xs px-3 py-1 rounded-full bg-white/10 text-white font-medium border border-white/20 backdrop-blur-sm",
    secondaryText: "text-white/60",
    btnPrimary:
      "inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/20 backdrop-blur text-white font-semibold text-sm border border-white/30 hover:bg-white/30 shadow-lg transition-all duration-200 active:scale-95",
    btnOutline:
      "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur border border-white/30 hover:bg-white/20 text-xs font-semibold text-white hover:text-white shadow-sm transition-all duration-200",
    card: "rounded-3xl p-5 text-left bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-200",
    badge:
      "inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs text-white font-medium",
    progressBar:
      "h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 transition-all duration-500 ease-out",
    answerBtn:
      "group flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur hover:bg-white/20 hover:border-white/40 hover:text-white active:scale-[0.98] transition-all duration-150 font-medium text-sm text-white/80 shadow-sm",
    footer: "px-6 py-5 text-center border-t border-white/20",
    divider: "border-white/20",
    heroGradient:
      "bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent",
    accent: "text-cyan-300",
    questionCard:
      "bg-white/10 backdrop-blur-md rounded-3xl shadow-xl shadow-black/20 border border-white/20 p-7",
    input:
      "w-full appearance-none bg-white/10 backdrop-blur border border-white/30 rounded-xl px-3 py-2.5 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all pr-8 placeholder:text-white/40",
  },
};
