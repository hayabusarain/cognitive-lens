"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, ChevronDown, Download } from "lucide-react";
import AnalyzingLoader from "@/app/components/AnalyzingLoader";

const ALL_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

const LOADER_MESSAGES = [
  "認知機能の断絶パターンを検出中...",
  "タイプ間の摩擦構造を解析中...",
  "最悪の噛み合わなさを生成中...",
  "会話シナリオを構築中...",
  "チャット画像をレンダリング中...",
  "プロトコルを変換中...",
];

interface ChatMessage {
  speaker: "type1" | "type2";
  message: string;
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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold tracking-widest uppercase text-slate-500">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-dark w-full appearance-none rounded-xl px-4 py-3 text-sm font-bold focus:outline-none transition-all pr-8"
        >
          <option value="">選択してください</option>
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
        />
      </div>
    </div>
  );
}

export default function ChatGenPage() {
  const [type1, setType1] = useState("");
  const [type2, setType2] = useState("");
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [isApiDone, setIsApiDone] = useState(false);
  const pendingSrc = useRef<string | null>(null);
  const pendingError = useRef<string>("");

  const handleGenerate = async () => {
    if (!type1 || !type2) return;
    pendingSrc.current = null;
    pendingError.current = "";
    setIsApiDone(false);
    setShowLoader(true);
    setImgSrc(null);
    setError("");

    try {
      const res = await fetch("/api/chat-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type1, type2 }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        pendingError.current = data.error ?? "スクリプト生成に失敗しました";
      } else {
        const messages: ChatMessage[] = data.messages;
        const d = encodeURIComponent(JSON.stringify(messages));
        pendingSrc.current = `/api/chat-og?type1=${type1}&type2=${type2}&d=${d}`;
      }
    } catch (e: unknown) {
      pendingError.current = e instanceof Error ? e.message : "エラーが発生しました";
    }
    setIsApiDone(true);
  };

  const handleLoaderFinish = () => {
    setShowLoader(false);
    if (pendingError.current) {
      setError(pendingError.current);
    } else if (pendingSrc.current) {
      setImgSrc(pendingSrc.current);
    }
  };

  const canGenerate = !!type1 && !!type2 && type1 !== type2;

  return (
    <main className="min-h-screen flex flex-col">
      {showLoader && (
        <AnalyzingLoader
          isApiDone={isApiDone}
          onFinish={handleLoaderFinish}
          messages={LOADER_MESSAGES}
        />
      )}

      {/* Nav */}
      <nav className="nav-blur flex items-center justify-between px-6 py-4 sticky top-0 z-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium transition-colors text-slate-500"
        >
          <ArrowLeft size={14} />
          ホーム
        </Link>
        <span className="text-sm font-bold tracking-widest text-slate-800">
          cognitive<span className="text-slate-800">lens</span>
        </span>
        <div className="w-16" />
      </nav>

      <div className="flex-1 max-w-xl mx-auto w-full px-5 py-10 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="bubble">
            <Zap size={13} className="text-violet-500 mr-1" />
            COGNITIVE CLASH GENERATOR
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            認知機能の断絶を、可視化する。
          </h1>
          <p className="text-sm leading-relaxed max-w-sm mx-auto text-slate-500">
            2つの16タイプの「最悪な噛み合わなさ」を
            シェア可能なチャット画像として生成します。
          </p>
        </div>

        {/* Input */}
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TypeSelect label="あなたのタイプ" value={type1} onChange={setType1} />
            <TypeSelect label="相手のタイプ" value={type2} onChange={setType2} />
          </div>

          {type1 && type2 && type1 === type2 && (
            <p className="text-xs text-amber-600 text-center">
              異なるタイプを選択してください
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={!canGenerate || showLoader}
            className="btn-primary w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40"
          >
            チャット画像を生成する
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-2xl px-4 py-3"
            style={{
              background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.25)",
            }}
          >
            <p className="text-xs" >{error}</p>
          </div>
        )}

        {imgSrc && (
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-widest uppercase px-1 text-slate-500">
              生成完了
            </p>

            <div
              className="rounded-3xl overflow-hidden"
              
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={`${type1} × ${type2} チャット画像`}
                className="w-full h-auto block"
                style={{ aspectRatio: "9/16" }}
              />
            </div>

            {/* Save / Share instruction */}
            <div
              className="glass-card rounded-2xl px-5 py-4 text-center space-y-1"
            >
              <div
                className="flex items-center justify-center gap-2 font-semibold text-sm text-slate-700"
              >
                <Download size={14} />
                画像を保存してシェア
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                画像を長押しして保存し、X や Instagram でシェアしてください
              </p>
            </div>

            {/* Regenerate */}
            <button
              onClick={handleGenerate}
              className="btn-ghost w-full py-3 rounded-2xl text-xs font-semibold transition-all duration-150"
            >
              別パターンを生成する
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-6 py-5 text-center mt-auto" >
        <p className="text-xs text-slate-400">
          © 2025 CognitiveLens — Interpersonal Friction Analytics
        </p>
      </footer>
    </main>
  );
}
