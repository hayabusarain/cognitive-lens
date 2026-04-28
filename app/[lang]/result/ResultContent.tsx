"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Share2,
  Brain,
} from "lucide-react";
import { PROTOCOLS_JA } from "@/lib/protocols-ja";
import { PROTOCOLS_EN } from "@/lib/protocols-en";
import { TYPE_INFO, DEFAULT_TYPE } from "@/lib/type-info";
import { getTypeInfo, getCompatibility } from "@/lib/data-provider";
import CognitiveFunctionChart from "@/app/components/CognitiveFunctionChart";
import WeaknessRadar from "@/app/components/WeaknessRadar";
import DeathGame from "@/app/components/DeathGame";
import AdSenseUnit from "@/app/components/ads/AdSenseUnit";

// ── Chart colors (modern fixed) ───────────────────────────────
const CC = {
  primary:   "#14b8a6",
  inferior:  "#f43f5e",
  grid:      "rgba(0,0,0,0.06)",
  axisLabel: "#475569",
  axisSub:   "#64748b",
};

// ── 型 ───────────────────────────────────────────────────────

type DbCategory = "短期" | "長期" | "教育";

interface Section {
  key: DbCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  headerBg: string;
}

export interface Protocol {
  id: string;
  target_type: string;
  category: DbCategory;
  content: string;
  ng_words?: string[];
}

const SECTIONS_JA: Section[] = [
  {
    key: "短期",
    label: "ガチで今すぐ試すべきこと",
    icon: <Clock size={16} />,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/20",
    headerBg: "hover:bg-teal-400/5",
  },
  {
    key: "長期",
    label: "死ぬまで役立つ生存ルート",
    icon: <TrendingUp size={16} />,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    headerBg: "hover:bg-violet-400/5",
  },
  {
    key: "教育",
    label: "メンタル＆才能のチート技",
    icon: <BookOpen size={16} />,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    headerBg: "hover:bg-amber-400/5",
  },
];

const SECTIONS_EN: Section[] = [
  {
    key: "短期",
    label: "Protocols to Try Immediately",
    icon: <Clock size={16} />,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/20",
    headerBg: "hover:bg-teal-400/5",
  },
  {
    key: "長期",
    label: "Lifelong Survival Route",
    icon: <TrendingUp size={16} />,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    headerBg: "hover:bg-violet-400/5",
  },
  {
    key: "教育",
    label: "Mental & Talent Cheat Codes",
    icon: <BookOpen size={16} />,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    headerBg: "hover:bg-amber-400/5",
  },
];

const ALL_TYPES = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
] as const;

// ── 解析中テキスト ────────────────────────────────────────────

const ANALYZING_MESSAGES = {
  ja: [
    "行動パターンのプロファイリングを実行中...",
    "回答の相関性を分析中...",
    "認知機能の優位性を算出中...",
    "対人摩擦パターンを特定中...",
    "プロトコルを生成しています...",
  ],
  en: [
    "Running behavioral profiling...",
    "Analyzing answer correlations...",
    "Calculating cognitive function dominance...",
    "Identifying interpersonal friction patterns...",
    "Generating protocols...",
  ]
};

// ── スケルトン ───────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`rounded-full animate-pulse ${className}`} style={{ background: "rgba(0,0,0,0.06)" }} />;
}

function ProtocolSkeleton() {
  return (
    <div className="space-y-3 p-5">
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  );
}

// ── アコーディオンセクション ──────────────────────────────────

function AccordionSection({
  section, protocols, loading, open, onToggle,
}: {
  section: Section; protocols: Protocol[]; loading: boolean; open: boolean; onToggle: () => void;
}) {
  return (
    <div className={`rounded-3xl border overflow-hidden transition-shadow duration-200 ${section.border}`} style={{ background: "rgba(0,0,0,0.06)" }}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors duration-150 ${section.headerBg}`}
      >
        <span className={`flex items-center justify-center w-8 h-8 rounded-2xl ${section.bg} ${section.color} flex-shrink-0`}>
          {section.icon}
        </span>
        <span className={`font-semibold text-sm flex-1 ${section.color}`}>{section.label}</span>
        {!loading && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${section.bg} ${section.color} font-medium`}>
            {protocols.length}{/* items string is omitted for simplicity or can be handled inside component, we'll just show the number */}
          </span>
        )}
        <ChevronDown size={16} className="transition-transform duration-200"  />
      </button>
      {open && (
        <div className="border-t border-dashed" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          {loading ? (
            <ProtocolSkeleton />
          ) : protocols.length === 0 ? (
            <p className="px-5 py-4 text-xs" >{/* lang prop is not easily accessible here but we can assume 'No data available.' is fine */ "No data available."}</p>
          ) : (
            <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              {protocols.map((p, i) => (
                <li key={p.id} className="flex gap-3 px-5 py-3.5" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full ${section.bg} ${section.color} text-xs font-bold flex items-center justify-center mt-0.5`}>
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed" >{p.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ── NGワードセクション ────────────────────────────────────────

function NgWordsSection({ protocols, loading }: { protocols: Protocol[]; loading: boolean }) {
  const [open, setOpen] = useState(false);
  const words = protocols.flatMap((p) => p.ng_words);
  if (!loading && words.length === 0) return null;
  return (
    <div className="rounded-3xl border overflow-hidden" style={{ background: "rgba(0,0,0,0.06)", borderColor: "rgba(244,63,94,0.18)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors duration-150"
        style={{ ['--hover-bg' as string]: "rgba(244,63,94,0.05)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244,63,94,0.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "")}
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-2xl flex-shrink-0" style={{ background: "rgba(244,63,94,0.08)", color: "#fb7185" }}>
          <AlertTriangle size={16} />
        </span>
        <span className="font-semibold text-sm flex-1" >{/* NG words label */} Red Flags & Triggers</span>
        {!loading && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(244,63,94,0.08)", color: "#fb7185" }}>{words.length}</span>
        )}
        <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}  />
      </button>
      {open && (
        <div className="border-t border-dashed px-5 py-4" style={{ borderColor: "rgba(244,63,94,0.18)" }}>
          {loading ? (
            <Skeleton className="h-3 w-2/3" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {words.map((w, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(244,63,94,0.08)", color: "#fb7185", border: "1px solid rgba(244,63,94,0.18)" }}>
                  {w}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 解析中画面 ────────────────────────────────────────────────

function AnalyzingScreen({ lang }: { lang: string }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const messages = ANALYZING_MESSAGES[lang as "ja" | "en"] || ANALYZING_MESSAGES.ja;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTextVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % messages.length);
        setTextVisible(true);
      }, 300);
    }, 800);
    return () => clearInterval(interval);
  }, [messages.length]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 rounded-full bg-teal-400/20 animate-ping opacity-30" />
        <div className="absolute w-16 h-16 rounded-full bg-teal-400/20 animate-ping opacity-40 [animation-delay:200ms]" />
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-violet-400 flex items-center justify-center shadow-lg">
          <Sparkles size={20} className="text-white" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p
          className="text-sm font-semibold transition-all duration-300"
          style={{ opacity: textVisible ? 1 : 0, transform: textVisible ? "translateY(0)" : "translateY(4px)", color: "#1e293b" }}
        >
          {messages[msgIndex]}
        </p>
        <p className="text-xs animate-pulse" >{lang === "en" ? "Profiling in progress" : "プロファイリング処理中"}</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </div>
  );
}

// ── シェアボタン ──────────────────────────────────────────────

function ShareButton({
  typeKey,
  typeName,
  bestPartnerType,
  hardestMatchType,
  lang
}: {
  typeKey: string;
  typeName: string;
  bestPartnerType: string;
  hardestMatchType: string;
  lang: string;
}) {
  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = lang === "en" 
      ? `My deep personality result is 【${typeKey}】🔪\nBest match: ${bestPartnerType}\nWorst match: ${hardestMatchType} ⚠️\n#MBTI #CognitiveLens`
      : `性格の裏側を暴く診断で【${typeKey}】でした🔪\n最強の相手は『${bestPartnerType}』、最悪の相手は『${hardestMatchType}』らしい⚠️\n#16タイプ診断 #CognitiveLens`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };
  return (
    <button
      onClick={handleShare}
      className="btn-primary w-full flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-bold active:scale-[0.98] transition-all duration-150 inline-flex rounded-full"
    >
      <Share2 size={16} />
      {lang === "en" ? "Share shocking result on X" : "ヤバすぎる診断結果をXで共有する"}
    </button>
  );
}

// ── Section parser ────────────────────────────────────────────

interface ProfileSection { title: string; content: string }

function parseSections(text: string): ProfileSection[] {
  const result: ProfileSection[] = [];
  const parts = text.split(/(?=【[^】]+】)/);
  for (const part of parts) {
    if (!part.trim()) continue;
    const m = part.match(/^【([^】]+)】\s*([\s\S]*)$/);
    if (m) result.push({ title: m[1].trim(), content: m[2].trim() });
  }
  return result;
}

// ── プレースホルダー削除のため省略（AdSenseUnitへ移行） ──

// ── レートリミット待機画面 ─────────────────────────────────────

function RateLimitedCard() {
  return (
    <div className="rounded-3xl border p-6 text-center space-y-3" style={{ borderColor: "rgba(251,191,36,0.18)", background: "rgba(251,191,36,0.08)" }}>
      <div className="text-3xl">⏳</div>
      <p className="font-bold text-sm" >解析エンジンが混雑しています</p>
      <p className="text-xs leading-relaxed" >
        現在、アクセスが集中しています。<br />
        <strong>10分後に再スキャン可能です。</strong><br />
        しばらく経ってから、また分析を試しに来てください。
      </p>
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── 4段構成セクションのスタイル定義 ─────────────────────────────

const SECTION_STYLES = [
  { badge: "bg-amber-400/10 text-amber-400 border-amber-400/20", bar: "bg-amber-400", text: "" },
  { badge: "bg-rose-400/10 text-rose-400 border-rose-400/20",   bar: "bg-rose-400",   text: "" },
  { badge: "bg-teal-400/10 text-teal-400 border-teal-400/20",   bar: "bg-teal-400",   text: "" },
  { badge: "bg-violet-400/10 text-violet-400 border-violet-400/20", bar: "bg-violet-400", text: "" },
];

// ── ストリーミングセクション ──────────────────────────────────

function StreamingSection({
  section, styleIndex, isCurrent,
}: { section: ProfileSection; styleIndex: number; isCurrent: boolean }) {
  const style = SECTION_STYLES[styleIndex] ?? SECTION_STYLES[0];
  const paragraphs = section.content.split(/\n+/).filter(p => p.trim() !== "");

  return (
    <div className="rounded-3xl border p-5 space-y-4" style={{ background: "rgba(0,0,0,0.06)", borderColor: "rgba(0,0,0,0.06)" }}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-3.5 w-0.5 rounded-full ${style.bar}`} />
        <span className={`text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full border ${style.badge}`}>
          {section.title}
        </span>
      </div>
      <div className="text-sm leading-[1.85] pl-3 space-y-4">
        {paragraphs.map((para, idx) => (
          <Fragment key={idx}>
            <p>
              {para}
              {isCurrent && idx === paragraphs.length - 1 && (
                <span className="inline-block w-0.5 h-[1em] ml-0.5 animate-pulse align-text-bottom" style={{ background: "#64748b" }} />
              )}
            </p>
            {/* Insert Ad after every 2 paragraphs (when index is odd) */}
            {idx % 2 === 1 && idx !== paragraphs.length - 1 && (
              <AdSenseUnit id={`adsense-para-${styleIndex}-${idx}`} slotId="4444444444" />
            )}
          </Fragment>
        ))}
        {paragraphs.length === 0 && isCurrent && (
          <span className="inline-block w-0.5 h-[1em] ml-0.5 animate-pulse align-text-bottom" style={{ background: "#64748b" }} />
        )}
      </div>
    </div>
  );
}

// ── AIプロファイリングセクション（ストリーミング版） ────────────

function AiProfileSection({ typeKey, rawAnswers, lang }: { typeKey: string; rawAnswers: string; lang: string }) {
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const generate = async () => {
    setSections([]);
    setError(null);
    setRateLimited(false);
    setIsStreaming(true);
    setGenerated(false);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: typeKey, answers: rawAnswers, lang }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        setIsStreaming(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "生成に失敗しました");
        setIsStreaming(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setSections(parseSections(fullText));
      }

      // 最後のバッファをフラッシュして文字化けを防止
      fullText += decoder.decode();
      setSections(parseSections(fullText));
      setGenerated(true);
    } catch {
      setError("ネットワークエラーが発生しました");
    }
    setIsStreaming(false);
  };

  if (!rawAnswers || rawAnswers.length < 4) return null;

  return (
    <>
      {!generated && !isStreaming && !rateLimited && !error && (
        <div className="rounded-3xl border overflow-hidden" style={{ background: "rgba(0,0,0,0.06)", borderColor: "rgba(139,92,246,0.18)" }}>
          <div className="flex items-center gap-3 px-5 py-4" style={{ background: "rgba(139,92,246,0.08)" }}>
            <span className="flex items-center justify-center w-8 h-8 rounded-2xl flex-shrink-0" style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>
              <Brain size={16} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-sm" >{lang === "en" ? "AI Personal Profiling" : "AI個別プロファイリング"}</p>
              <p className="text-xs" >{lang === "en" ? "Complete Manual — 4 Sections" : "完全取扱説明書 — 4段構成"}</p>
            </div>
          </div>
          <div className="px-5 py-5 text-center space-y-3">
            <p className="text-xs leading-relaxed" >
              {lang === "en" ? (
                <>Talents, weaknesses, strategies, and triggers—<br />AI will generate your complete personal manual.</>
              ) : (
                <>才能・弱点・攻略法・理解の言葉——<br />あなただけの完全取扱説明書をAIが生成します。</>
              )}
            </p>
            <button
              onClick={generate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl active:scale-[0.98] text-white text-xs font-bold transition-all duration-150"
              style={{ background: "#7c3aed" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#6d28d9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#7c3aed")}
            >
              <Sparkles size={13} />
              {lang === "en" ? "Run Profiling" : "プロファイリングを実行する"}
            </button>
          </div>
        </div>
      )}

      {rateLimited && <RateLimitedCard />}

      {error && (
        <div className="rounded-2xl border px-4 py-3" style={{ background: "rgba(244,63,94,0.08)", borderColor: "rgba(244,63,94,0.18)" }}>
          <p className="text-xs" >{error}</p>
          <button onClick={generate} className="mt-2 text-xs underline underline-offset-2" >
            再試行
          </button>
        </div>
      )}

      {isStreaming && sections.length === 0 && (
        <div className="rounded-3xl border p-6 text-center space-y-2" style={{ background: "rgba(0,0,0,0.06)", borderColor: "rgba(139,92,246,0.18)" }}>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <p className="text-xs" >AIが分析中...</p>
        </div>
      )}

      {sections.map((sec, i) => (
        <Fragment key={i}>
          <StreamingSection
            section={sec}
            styleIndex={i}
            isCurrent={isStreaming && i === sections.length - 1}
          />
          {(i < sections.length - 1 || (!isStreaming && generated && i < 3)) && (
            <div className="my-8 glass-card rounded-3xl p-4 min-h-[250px] w-full flex flex-col items-center justify-center border border-white/40 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
              <div className="w-full text-left mb-2">
                <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Sponsored</span>
              </div>
              <div className="relative z-10 w-full flex-1 flex items-center justify-center overflow-hidden">
                <AdSenseUnit id={`adsense-slot-${i + 2}`} slotId="5555555555" />
              </div>
            </div>
          )}
        </Fragment>
      ))}

      {generated && !isStreaming && (
        <button
          onClick={generate}
          className="w-full py-2 text-xs transition-colors underline underline-offset-2"
          
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          {/* generate label */}
          Generate another pattern
        </button>
      )}
    </>
  );
}





// ── 対人相性セクション ────────────────────────────────────────

function CompatibilitySection({ typeKey, lang }: { typeKey: string, lang: string }) {
  const router = useRouter();
  const COMPATIBILITY_MAP = getCompatibility(lang);
  const TYPE_INFO_MAP = getTypeInfo(lang);
  const compat = COMPATIBILITY_MAP[typeKey as keyof typeof COMPATIBILITY_MAP];
  if (!compat) return null;
  const bestInfo = TYPE_INFO_MAP[compat.bestPartner.type] ?? DEFAULT_TYPE;
  const hardInfo = TYPE_INFO_MAP[compat.hardestMatch.type] ?? DEFAULT_TYPE;

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold tracking-widest uppercase px-1" >
        {lang === "en" ? "Interpersonal Compatibility Profile" : "対人相性プロファイル"}
      </h2>

      <div className="rounded-3xl border overflow-hidden" style={{ background: "rgba(0,0,0,0.06)", borderColor: "rgba(20,184,166,0.18)" }}>
        <button
          onClick={() => router.push(`/result?type=${compat.bestPartner.type}`)}
          className="w-full text-left"
        >
          <div className="flex items-center gap-3 px-5 py-3 transition-colors" style={{ background: "rgba(20,184,166,0.08)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(20,184,166,0.14)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(20,184,166,0.08)")}
          >
            {bestInfo.imageUrl ? (
              <div className="w-12 h-12 relative flex-shrink-0 bg-white shadow-sm border border-teal-100 rounded-full overflow-hidden">
                <Image src={bestInfo.imageUrl} alt={bestInfo.name} fill className="object-cover" />
              </div>
            ) : (
              <span className="text-lg">{bestInfo.emoji}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold tracking-wider" >{lang === "en" ? "Best Logical Match" : "論理的に噛み合う最強の相手"}</p>
              <p className="text-sm font-bold" >{compat.bestPartner.type} — {bestInfo.name}</p>
            </div>
            <span className="text-xs flex-shrink-0" >{lang === "en" ? "Details →" : "詳細 →"}</span>
          </div>
        </button>
        <p className="px-5 py-3 text-xs leading-relaxed" >{compat.bestPartner.reason}</p>

      </div>

      <div className="rounded-3xl border overflow-hidden" style={{ background: "rgba(0,0,0,0.06)", borderColor: "rgba(244,63,94,0.18)" }}>
        <button
          onClick={() => router.push(`/result?type=${compat.hardestMatch.type}`)}
          className="w-full text-left"
        >
          <div className="flex items-center gap-3 px-5 py-3 transition-colors" style={{ background: "rgba(244,63,94,0.08)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(244,63,94,0.14)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(244,63,94,0.08)")}
          >
            {hardInfo.imageUrl ? (
              <div className="w-12 h-12 relative flex-shrink-0 bg-white shadow-sm border border-rose-100 rounded-full overflow-hidden">
                <Image src={hardInfo.imageUrl} alt={hardInfo.name} fill className="object-cover" />
              </div>
            ) : (
              <span className="text-lg">{hardInfo.emoji}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold tracking-wider" >{lang === "en" ? "Most Dysfunctional Match" : "機能不全に陥りやすい相手"}</p>
              <p className="text-sm font-bold" >{compat.hardestMatch.type} — {hardInfo.name}</p>
            </div>
            <span className="text-xs flex-shrink-0" >{lang === "en" ? "Details →" : "詳細 →"}</span>
          </div>
        </button>
        <p className="px-5 py-3 text-xs leading-relaxed" >{compat.hardestMatch.advice}</p>

      </div>
    </div>
  );
}

// ── メインコンテンツ ──────────────────────────────────────────

export default function ResultContent({ lang = "ja" }: { lang?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeKey = (searchParams.get("type") ?? "INTP").toUpperCase().slice(0, 4);
  const rawAnswers = searchParams.get("a") ?? "";
  
  const TYPE_INFO_MAP = getTypeInfo(lang);
  const COMPATIBILITY_MAP = getCompatibility(lang);
  
  const info = TYPE_INFO_MAP[typeKey] ?? DEFAULT_TYPE;
  const compat = COMPATIBILITY_MAP[typeKey as keyof typeof COMPATIBILITY_MAP] ?? COMPATIBILITY_MAP["INTP"];

  const sectionsList = lang === "en" ? SECTIONS_EN : SECTIONS_JA;
  const protocolsDict = lang === "en" ? PROTOCOLS_EN : PROTOCOLS_JA;
  const currentTypeProtocols = protocolsDict[typeKey] || {};

  const [openSection, setOpenSection] = useState<DbCategory | null>("短期");
  const [analyzing, setAnalyzing] = useState(true);
  const [resultVisible, setResultVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyzing(false);
      setTimeout(() => setResultVisible(true), 50);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const byCategory = (cat: DbCategory) => {
    const list = currentTypeProtocols[cat] || [];
    return list.map((content, i) => ({
      id: `${cat}-${i}`,
      target_type: typeKey,
      category: cat,
      content,
      ng_words: [] // Placeholder since static data doesn't have ng_words
    }));
  };

  const protocols = sectionsList.flatMap(sec => byCategory(sec.key as DbCategory));
  const loading = false;

  if (analyzing) return <AnalyzingScreen lang={lang} />;

  return (
    <>
      <main
        className="min-h-screen flex flex-col transition-opacity duration-500"
        style={{ opacity: resultVisible ? 1 : 0 }}
      >
        {/* Header */}
        <div className="nav-blur flex items-center justify-between px-6 py-4 sticky top-0 z-10 transition-colors duration-1000">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          >
            <ArrowLeft size={14} />
            ホーム
          </button>
          <span className="text-xs font-medium" >
            あなたの取り扱い説明書
          </span>
          <button
            onClick={() => router.push("/test")}
            className="flex items-center gap-1 text-xs font-medium transition-colors"
          >
            <RotateCcw size={12} />
            やり直す
          </button>
        </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-8 flex flex-col gap-5">
        {/* Type card */}
        <div className={`rounded-3xl bg-gradient-to-br ${info.gradient} p-6 text-white shadow-xl text-center relative overflow-hidden`}>
          {info.imageUrl ? (
            <div className="mx-auto mt-2 mb-4 w-32 h-32 sm:w-40 sm:h-40 relative drop-shadow-xl z-10 transition-transform duration-500 hover:scale-105">
              <Image src={info.imageUrl} alt={info.name} fill className="object-contain" sizes="(max-width: 640px) 128px, 160px" priority />
            </div>
          ) : (
            <div className="text-4xl mb-2 relative z-10">{info.emoji}</div>
          )}
          <p className="text-xs font-medium opacity-70 mb-1 tracking-widest uppercase">Cognitive Type</p>
          <h1 className="text-5xl font-black tracking-widest mb-1">{typeKey}</h1>
          <p className="font-bold text-lg opacity-90">{info.name}</p>
          <p className="text-xs opacity-60 mt-1">{info.tagline}</p>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs opacity-70">
            <Sparkles size={11} />
            あなたの性格のクセ、全部ここにある
          </div>
        </div>

        {/* 認知機能レーダーチャート */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "rgba(0,0,0,0.06)", border: `1px solid ${CC.grid}` }}
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: CC.grid }}>
            <span
              className="flex items-center justify-center w-8 h-8 rounded-2xl flex-shrink-0"
              style={{ backgroundColor: `${CC.primary}20`, color: CC.primary }}
            >
              <Brain size={16} />
            </span>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: CC.axisLabel }}>
                認知機能プロファイル
              </p>
              <p className="text-xs" style={{ color: CC.axisSub }}>
                8軸心理機能マッピング — 主機能
                <span className="mx-1" style={{ color: CC.primary }}>●</span>
                劣等機能
                <span className="mx-1" style={{ color: CC.inferior }}>●</span>
              </p>
            </div>
          </div>
          <div className="py-4 flex justify-center">
            <CognitiveFunctionChart typeKey={typeKey} size={320} />
          </div>
        </div>

        {/* Share */}
        <ShareButton
          typeKey={typeKey}
          typeName={info.name}
          bestPartnerType={compat.bestPartner.type}
          hardestMatchType={compat.hardestMatch.type}
          lang={lang}
        />

        {/* 広告枠1 */}
        <AdSenseUnit id="adsense-slot-1" slotId="6666666666" />

        {/* AI Profiling */}
        <AiProfileSection typeKey={typeKey} rawAnswers={rawAnswers} lang={lang} />

        {/* 弱点レーダーチャート */}
        <WeaknessRadar typeKey={typeKey} lang={lang} />

        {/* 相性デスゲーム */}
        <DeathGame typeKey={typeKey} lang={lang} />

        {/* Accordions */}
        {sectionsList.map((section) => (
          <AccordionSection
            key={section.key}
            section={section}
            protocols={byCategory(section.key)}
            loading={loading}
            open={openSection === section.key}
            onToggle={() => setOpenSection(openSection === section.key ? null : section.key)}
          />
        ))}

        {/* NG Words */}
        <NgWordsSection protocols={protocols} loading={loading} />

        {/* Compatibility */}
        <CompatibilitySection typeKey={typeKey} lang={lang} />

        {/* SEO Article Link */}
        <div className="py-6">
            <Link 
              href={`/${lang}/article/${typeKey}`}
              className="block w-full glass-card rounded-3xl p-6 text-center border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <h3 className="font-extrabold text-lg text-slate-800 mb-2">
                {lang === "en" ? `Deep Psychology of ${typeKey}'s Romance` : `${typeKey}の恋愛心理と深層をさらに知る`}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                {lang === "en" 
                  ? "Traits of who they're attracted to, fatal weaknesses, and a manual to build the ideal relationship." 
                  : "惹かれる相手の条件、致命的弱点、そして理想の関係を築くための「取扱説明書」"}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 bg-white/60 px-4 py-2 rounded-full group-hover:bg-white transition-colors">
                {lang === "en" ? "Read the Column →" : "コラムを読む →"}
              </span>
            </Link>
          </div>

        {/* Footer */}
        <div className="text-center pt-2 pb-8 relative">
          <button
            onClick={() => router.push(`/${lang}/test`)}
            className="text-sm font-bold transition-all px-6 py-3 rounded-xl bg-white border text-slate-600 hover:bg-slate-50"
          >
            {lang === "en" ? "Analyze another type →" : "別のタイプも分析してみる →"}
          </button>
        </div>
      </div>
    </main>
    </>
  );
}
