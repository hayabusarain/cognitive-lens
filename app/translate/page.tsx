"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle, ChevronDown } from "lucide-react";
import AnalyzingLoader from "@/app/components/AnalyzingLoader";

const ALL_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

interface TranslateResult {
  trueRequest: string;
  mineWords: string;
  optimalReply: string;
}

function TypeSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-widest uppercase" >
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-dark w-full appearance-none rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none transition-all pr-8"
        >
          <option value="">指定なし</option>
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          
        />
      </div>
    </div>
  );
}

function ResultCard({
  label,
  color,
  content,
}: {
  label: string;
  color: string;
  content: string;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${color}`}
      style={{ background: "rgba(0,0,0,0.06)", border: "1px solid #94a3b8" }}
    >
      <p className="text-xs font-bold tracking-widest mb-3 uppercase" >
        {label}
      </p>
      <p className="text-sm leading-relaxed" >{content}</p>
    </div>
  );
}

const TRANSLATE_LOADER_MESSAGES = [
  "感情層の解析を開始...",
  "言語外コミュニケーションを検出中...",
  "深層心理をスキャン中...",
  "摩擦パターンをマッピング中...",
  "最適応答プロトコルを生成中...",
  "プロトコルを変換中...",
];

export default function TranslatePage() {
  const [message, setMessage] = useState("");
  const [senderType, setSenderType] = useState("");
  const [receiverType, setReceiverType] = useState("");
  const [result, setResult] = useState<TranslateResult | null>(null);
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [isApiDone, setIsApiDone] = useState(false);
  const pendingResult = useRef<TranslateResult | null>(null);
  const pendingError = useRef<string>("");

  const handleSubmit = async () => {
    if (!message.trim() || message.trim().length < 2) return;
    pendingResult.current = null;
    pendingError.current = "";
    setIsApiDone(false);
    setShowLoader(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          senderType: senderType || undefined,
          receiverType: receiverType || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");
      pendingResult.current = data;
    } catch (e: unknown) {
      pendingError.current = e instanceof Error ? e.message : "エラーが発生しました";
    }
    setIsApiDone(true);
  };

  const handleLoaderFinish = () => {
    setShowLoader(false);
    if (pendingError.current) {
      setError(pendingError.current);
    } else if (pendingResult.current) {
      setResult(pendingResult.current);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {showLoader && (
        <AnalyzingLoader
          isApiDone={isApiDone}
          onFinish={handleLoaderFinish}
          messages={TRANSLATE_LOADER_MESSAGES}
        />
      )}
      {/* Nav */}
      <nav className="nav-blur flex items-center justify-between px-6 py-4 sticky top-0 z-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          
        >
          <ArrowLeft size={14} />
          ホーム
        </Link>
        <span className="text-sm font-bold tracking-widest" >
          cognitive<span >lens</span>
        </span>
        <div className="w-16" />
      </nav>

      <div className="flex-1 max-w-xl mx-auto w-full px-5 py-10 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border text-xs font-medium"
            style={{
              background: "rgba(0,0,0,0.06)",
              borderColor: "rgba(0,0,0,0.06)",
              color: "#64748b",
            }}
          >
            <Sparkles size={13} />
            LOVE PROTOCOL CONVERTER
          </div>
          <h1 className="text-2xl font-bold tracking-tight" >
            そのメッセージ、本当は何が言いたい？
          </h1>
          <p className="text-sm leading-relaxed max-w-sm mx-auto" >
            「別にいいよ」「忙しい？」「そうだね」——その一言の裏に隠れた本音と、相手が本当に欲しい言葉を教えます。
          </p>
        </div>

        {/* Input */}
        <div
          className="glass-card rounded-2xl p-5 text-left space-y-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest uppercase" >
              解読したいメッセージ
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="例：「別にいいよ、気にしないで」「最近ちゃんと寝てる？」「そういうとこだよ」「もういい」..."
              rows={4}
              className="input-dark w-full appearance-none rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none transition-all resize-none leading-relaxed"
            />
            <p className="text-xs text-right tabular-nums" >
              {message.length} 文字
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TypeSelect label="送信者タイプ（任意）" value={senderType} onChange={setSenderType} />
            <TypeSelect label="受信者タイプ（任意）" value={receiverType} onChange={setReceiverType} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={showLoader || message.trim().length < 2}
            className="btn-primary w-full py-3.5 font-semibold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 inline-flex items-center justify-center gap-2 px-8 rounded-full"
          >
            深層心理を紐解く
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2.5 rounded-2xl px-4 py-3"
            style={{
              background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.25)",
            }}
          >
            <AlertCircle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed" >{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-widest uppercase px-1" >
              解析結果
            </p>
            <ResultCard
              label="本当は何が欲しかったのか"
              color=""
              content={result.trueRequest}
            />
            <ResultCard
              label="やってはいけない返し方"
              color=""
              content={result.mineWords}
            />
            <ResultCard
              label="魔法の言葉"
              color=""
              content={result.optimalReply}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-6 py-5 text-center" >
        <p className="text-xs" >
          © 2025 CognitiveLens — Interpersonal Friction Analytics
        </p>
        <div className="mt-2">
          <Link href="/privacy" className="text-xs underline underline-offset-4 transition-colors" >
            プライバシーポリシー
          </Link>
        </div>
      </footer>
    </main>
  );
}
