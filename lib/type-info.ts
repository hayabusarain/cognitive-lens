export interface TypeInfo {
  name: string;
  tagline: string;
  emoji: string;
  gradient: string; // Tailwind gradient classes
  // CSS colors for OGP image (converted from Tailwind)
  colorFrom: string;
  colorTo: string;
}

export const TYPE_INFO: Record<string, TypeInfo> = {
  INTJ: { name: "建築家", tagline: "10手先を読んで、一人で詰める性格のクセ", emoji: "🏛️", gradient: "from-slate-500 to-violet-500", colorFrom: "#64748b", colorTo: "#8b5cf6" },
  INTP: { name: "論理学者", tagline: "「なぜ？」が止まらない、本性は永遠の探求者", emoji: "🔬", gradient: "from-sky-400 to-teal-500", colorFrom: "#38bdf8", colorTo: "#14b8a6" },
  ENTJ: { name: "指揮官", tagline: "生まれながらにして仕切りたい。それが本性", emoji: "⚡", gradient: "from-amber-500 to-orange-500", colorFrom: "#f59e0b", colorTo: "#f97316" },
  ENTP: { name: "討論者", tagline: "反論するのが趣味。でもそれが強み", emoji: "💬", gradient: "from-teal-400 to-cyan-500", colorFrom: "#2dd4bf", colorTo: "#06b6d4" },
  INFJ: { name: "提唱者", tagline: "見えてる未来が人より多い。その孤独も込みで", emoji: "🌸", gradient: "from-violet-400 to-purple-500", colorFrom: "#a78bfa", colorTo: "#a855f7" },
  INFP: { name: "仲介者", tagline: "感情の解像度が高すぎる。それが全ての根っこ", emoji: "🌿", gradient: "from-rose-400 to-pink-500", colorFrom: "#fb7185", colorTo: "#ec4899" },
  ENFJ: { name: "主人公", tagline: "あなたがいるだけでその場の空気が変わる", emoji: "✨", gradient: "from-orange-400 to-rose-500", colorFrom: "#fb923c", colorTo: "#f43f5e" },
  ENFP: { name: "広報運動家", tagline: "可能性を語らせたら右に出る者なし", emoji: "🎨", gradient: "from-yellow-400 to-amber-500", colorFrom: "#facc15", colorTo: "#f59e0b" },
  ISTJ: { name: "管理者", tagline: "「前例通り」が最強の武器だとわかってる", emoji: "🏗️", gradient: "from-stone-400 to-slate-500", colorFrom: "#a8a29e", colorTo: "#64748b" },
  ISFJ: { name: "擁護者", tagline: "気づいてないだろうけど、あなたが一番支えてる", emoji: "🌱", gradient: "from-green-400 to-emerald-500", colorFrom: "#4ade80", colorTo: "#10b981" },
  ESTJ: { name: "幹部", tagline: "ルールがあるから動ける。それが本性", emoji: "📋", gradient: "from-blue-400 to-sky-500", colorFrom: "#60a5fa", colorTo: "#0ea5e9" },
  ESFJ: { name: "領事", tagline: "みんなの顔色、全部見えてる。それが重荷にもなる", emoji: "🫶", gradient: "from-pink-400 to-rose-400", colorFrom: "#f472b6", colorTo: "#fb7185" },
  ISTP: { name: "巨匠", tagline: "余計なことは言わない。でも手を動かせば本物", emoji: "🔧", gradient: "from-cyan-400 to-teal-500", colorFrom: "#22d3ee", colorTo: "#14b8a6" },
  ISFP: { name: "冒険家", tagline: "枠に収まりたくない。それがこの性格のクセの核心", emoji: "🎭", gradient: "from-lime-400 to-green-500", colorFrom: "#a3e635", colorTo: "#22c55e" },
  ESTP: { name: "起業家", tagline: "考えるより先に体が動く。それが強さ", emoji: "🚀", gradient: "from-red-400 to-rose-500", colorFrom: "#f87171", colorTo: "#f43f5e" },
  ESFP: { name: "エンターテイナー", tagline: "その場にいるだけで全員笑顔にする、本性は太陽", emoji: "🎉", gradient: "from-yellow-300 to-amber-400", colorFrom: "#fde047", colorTo: "#fbbf24" },
};

export const DEFAULT_TYPE: TypeInfo = {
  name: "分析者",
  tagline: "あなたの性格のクセを解読中",
  emoji: "🔍",
  gradient: "from-teal-400 to-teal-600",
  colorFrom: "#2dd4bf",
  colorTo: "#0d9488",
};
