"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, Sparkles, ChevronRight } from "lucide-react";
import { TYPE_INFO } from "@/lib/type-info";
import AdSenseUnit from "@/app/components/ads/AdSenseUnit";

const TYPES_GRID = [
  ["INTJ", "INTP", "ENTJ", "ENTP"],
  ["INFJ", "INFP", "ENFJ", "ENFP"],
  ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  ["ISTP", "ISFP", "ESTP", "ESFP"],
] as const;

const AXIS_LABELS = ["NT — 分析系", "NF — 理想主義系", "SJ — 管理系", "SP — 探索系"];

interface ProfileSection {
  title: string;
  content: string;
}

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

const SECTION_ACCENTS = [
  { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)",  bar: "#fbbf24", badge: "rgba(251,191,36,0.15)", badgeText: "#fbbf24" },
  { bg: "rgba(244,63,94,0.08)",   border: "rgba(244,63,94,0.2)",   bar: "#f43f5e", badge: "rgba(244,63,94,0.15)",  badgeText: "#fb7185" },
  { bg: "rgba(20,184,166,0.08)",  border: "rgba(20,184,166,0.2)",  bar: "#14b8a6", badge: "rgba(20,184,166,0.15)", badgeText: "#2dd4bf" },
  { bg: "rgba(139,92,246,0.08)",  border: "rgba(139,92,246,0.2)",  bar: "#8b5cf6", badge: "rgba(139,92,246,0.15)", badgeText: "#a78bfa" },
];

function SectionCard({
  section,
  styleIndex,
  isCurrent,
}: {
  section: ProfileSection;
  styleIndex: number;
  isCurrent: boolean;
}) {
  const accent = SECTION_ACCENTS[styleIndex] ?? SECTION_ACCENTS[0];
  return (
    <div
      className="rounded-3xl p-5 space-y-2"
      style={{ background: accent.bg, border: `1px solid ${accent.border}` }}
    >
      <div className="flex items-center gap-2">
        <div className="h-3.5 w-0.5 rounded-full" style={{ background: accent.bar }} />
        <span
          className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full"
          style={{ background: accent.badge, color: accent.badgeText }}
        >
          {section.title}
        </span>
      </div>
      <p className="text-sm leading-[1.85] pl-3" >
        {section.content}
        {isCurrent && (
          <span
            className="inline-block w-0.5 h-[1em] ml-0.5 animate-pulse align-text-bottom"
            style={{ background: "#6366f1" }}
          />
        )}
      </p>
    </div>
  );
}

export default function SkipPathPage() {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<string>("");
  const [failurePattern, setFailurePattern] = useState<string>("");
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const canSubmit = selectedType && failurePattern.trim().length >= 5 && !isStreaming;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSections([]);
    setError(null);
    setRateLimited(false);
    setIsGenerated(false);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          failurePattern: failurePattern.trim(),
        }),
      });

      if (res.status === 429) {
        setRateLimited(true);
        setIsStreaming(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
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

      setSections(parseSections(fullText));
      setIsGenerated(true);
    } catch {
      setError("ネットワークエラーが発生しました");
    }

    setIsStreaming(false);
  };

  const handleRetry = () => {
    setSections([]);
    setError(null);
    setRateLimited(false);
    setIsGenerated(false);
    handleSubmit();
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <nav className="nav-blur flex items-center justify-between px-6 py-4 sticky top-0 z-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          
        >
          <ArrowLeft size={14} />
          ホーム
        </Link>
        <span className="text-sm font-bold tracking-[0.1em]" >
          cognitive<span >lens</span>
        </span>
        <div className="w-20" />
      </nav>

      <div className="flex-1 max-w-xl mx-auto w-full px-5 py-10 flex flex-col gap-8">

        {/* タイトル */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-medium badge-dark">
            <Zap size={12}  />
            <span >
              SHORTCUT SCAN — 回答ログなし精密解析
            </span>
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ letterSpacing: "-0.03em", color: "#1e293b" }}
          >
            自分のタイプを
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              知っている人へ。
            </span>
          </h1>
          <p className="text-sm leading-relaxed" >
            20問の診断をスキップ。タイプと「繰り返す失敗パターン」だけで、
            <br />
            あなたの認知機能がなぜ暴走するのかを徹底解剖します。
          </p>
        </div>

        {/* ステップ1: タイプ選択 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
              style={{
                background: selectedType ? "rgba(0,229,255,0.2)" : "rgba(0,0,0,0.06)",
                color: selectedType ? "#00e5ff" : "#64748b",
              }}
            >
              1
            </span>
            <h2 className="text-sm font-bold" >
              あなたの16タイプを選択
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {TYPES_GRID.map((row, rowIdx) => (
              <div key={rowIdx} className="flex flex-col gap-1.5">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase" >
                  {AXIS_LABELS[rowIdx]}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {row.map((type) => {
                    const info = TYPE_INFO[type];
                    const isSelected = selectedType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className="flex flex-col items-center py-3 px-1 rounded-2xl text-center transition-all duration-150 active:scale-[0.96]"
                        style={isSelected ? {
                          background: "rgba(0,229,255,0.12)",
                          border: "1px solid rgba(0,229,255,0.5)",
                          boxShadow: "0 0 16px rgba(0,229,255,0.2)",
                          transform: "scale(1.03)",
                        } : {
                          background: "rgba(0,0,0,0.06)",
                          border: "1px solid #94a3b8",
                        }}
                      >
                        <span className="text-lg mb-0.5">{info.emoji}</span>
                        <span
                          className="text-[11px] font-black tracking-widest"
                          style={{ color: isSelected ? "#00e5ff" : "#475569" }}
                        >
                          {type}
                        </span>
                        <span
                          className="text-[9px] font-medium mt-0.5"
                          style={{ color: isSelected ? "#00e5ff" : "#64748b" }}
                        >
                          {info.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedType && (
            <p className="text-xs text-center" >
              ✓ {selectedType}（{TYPE_INFO[selectedType]?.name}）を選択中
            </p>
          )}
        </div>

        {/* ステップ2: 失敗パターン入力 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
              style={{
                background: failurePattern.trim().length >= 5 ? "rgba(0,229,255,0.2)" : "rgba(0,0,0,0.06)",
                color: failurePattern.trim().length >= 5 ? "#00e5ff" : "#64748b",
              }}
            >
              2
            </span>
            <h2 className="text-sm font-bold" >
              精密スキャン用データを入力
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3">
            <label className="block">
              <span className="text-xs font-bold tracking-wide" >
                あなたが人生で何度も繰り返してしまう「失敗のパターン」を教えてください
              </span>
              <span className="block text-[10px] mt-0.5" >
                認知機能の暴走として解析します。正直に書くほど精度が上がります。
              </span>
            </label>
            <textarea
              value={failurePattern}
              onChange={(e) => setFailurePattern(e.target.value)}
              placeholder="例：正論を言いすぎて空気を壊す、感情的になって後悔する、など"
              rows={4}
              maxLength={400}
              className="input-dark w-full appearance-none rounded-xl px-3 py-2.5 text-sm font-medium resize-none leading-relaxed"
            />
            <div className="flex justify-between text-[10px]" >
              <span>
                {failurePattern.length < 5
                  ? `あと${5 - failurePattern.length}文字以上入力してください`
                  : "✓ 入力完了"}
              </span>
              <span className="tabular-nums">{failurePattern.length}/400</span>
            </div>
          </div>
        </div>

        {/* 送信ボタン */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed rounded-full btn-primary"
          
        >
          <Sparkles size={15} />
          深層心理を解剖する
          <ChevronRight size={15} />
        </button>

        {/* ストリーミング中（未検出） */}
        {isStreaming && sections.length === 0 && (
          <div
            className="glass-card rounded-3xl p-6 text-center space-y-2"
          >
            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: "#cbd5e1", animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <p className="text-xs" >
              認知機能の暴走パターンを解析中...
            </p>
          </div>
        )}

        {/* レートリミット */}
        {rateLimited && (
          <div
            className="rounded-3xl p-6 text-center space-y-2"
            style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
          >
            <p className="text-2xl">⏳</p>
            <p className="font-bold text-sm" >解析エンジンが混雑中</p>
            <p className="text-xs leading-relaxed" >
              10分後に再スキャン可能です。しばらく経ってから再度お試しください。
            </p>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div
            className="rounded-2xl px-4 py-3"
            style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}
          >
            <p className="text-xs" >{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-xs underline underline-offset-2"
              
            >
              再試行
            </button>
          </div>
        )}

        {/* ストリーミング結果 */}
        {sections.length > 0 && (
          <div className="space-y-4">
            {sections.map((sec, i) => (
              <Fragment key={i}>
                <SectionCard
                  section={sec}
                  styleIndex={i}
                  isCurrent={isStreaming && i === sections.length - 1}
                />
                {(i < sections.length - 1 || (!isStreaming && isGenerated && i < 3)) && (
                  <div className="my-6 glass-card rounded-3xl p-4 min-h-[250px] w-full flex flex-col items-center justify-center border border-white/40 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                    <div className="w-full text-left mb-2">
                      <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">Sponsored</span>
                    </div>
                    <div className="relative z-10 w-full flex-1 flex items-center justify-center overflow-hidden">
                      <AdSenseUnit id={`skip-adsense-slot-${i}`} slotId="7777777777" />
                    </div>
                  </div>
                )}
              </Fragment>
            ))}

            {isGenerated && (
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => router.push(`/result?type=${selectedType}`)}
                  className="w-full py-3.5 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150 rounded-full btn-primary"
                >
                  <Sparkles size={14} />
                  {selectedType} の完全プロファイルを見る
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={handleRetry}
                  className="w-full py-2 text-xs transition-colors underline underline-offset-2"
                  
                >
                  別パターンで再解析する
                </button>
              </div>
            )}
          </div>
        )}

        {/* フッターリンク */}
        <div className="text-center text-xs space-y-1 pt-2" >
          <p>診断から始める場合は</p>
          <Link href="/test" className="underline underline-offset-2" >
            20問の診断へ →
          </Link>
        </div>
      </div>
    </main>
  );
}
