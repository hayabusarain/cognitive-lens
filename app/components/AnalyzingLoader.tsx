"use client";

import { useState, useEffect, useRef } from "react";

const DURATION = 8000;

const COMPLETED_STEPS = [
  "認知機能モデル ロード完了",
  "回答データ 解析完了",
  "プロファイル 構築中",
];

interface Props {
  isApiDone: boolean;
  onFinish: () => void;
  messages?: string[];
}

export default function AnalyzingLoader({
  isApiDone,
  onFinish,
  messages = [
    "深層心理をスキャン中...",
    "認知の歪みを特定中...",
    "プロトコルを変換中...",
    "矛盾パターンを検出中...",
    "最終調整を実行中...",
  ],
}: Props) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const startRef = useRef(Date.now());
  const finishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  useEffect(() => { onFinishRef.current = onFinish; });

  // Progress bar
  useEffect(() => {
    const id = setInterval(() => {
      if (finishedRef.current) return;
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min(Math.floor((elapsed / DURATION) * 100), 99));
    }, 80);
    return () => clearInterval(id);
  }, []);

  // Message rotation
  useEffect(() => {
    const interval = Math.floor(DURATION / messages.length);
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, interval);
    return () => clearInterval(id);
  }, [messages]);

  // Completion: wait for both 8s elapsed AND API done
  useEffect(() => {
    if (!isApiDone) return;
    const id = setInterval(() => {
      if (finishedRef.current) { clearInterval(id); return; }
      const elapsed = Date.now() - startRef.current;
      if (elapsed >= DURATION) {
        clearInterval(id);
        finishedRef.current = true;
        setProgress(100);
        setTimeout(() => {
          setFadingOut(true);
          setTimeout(() => onFinishRef.current(), 500);
        }, 300);
      }
    }, 50);
    return () => clearInterval(id);
  }, [isApiDone]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 px-6"
      style={{
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 500ms ease-out",
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      {/* Progress header */}
      <div className="w-full max-w-sm space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
            Analyzing
          </span>
          <span className="text-3xl font-black text-slate-800 tabular-nums leading-none">
            {progress}
            <span className="text-lg text-slate-400">%</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-px bg-black/10 w-full relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-violet-500"
            style={{
              width: `${progress}%`,
              transition: "width 80ms linear",
            }}
          />
        </div>

        {/* Terminal message */}
        <div className="flex items-center gap-2 h-5">
          <span className="text-teal-600 text-xs font-mono flex-shrink-0">›</span>
          <span
            key={msgIndex}
            className="text-xs font-mono text-teal-400 tracking-wide"
            style={{ animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }}
          >
            {messages[msgIndex]}
          </span>
        </div>
      </div>

      {/* Ad placeholder — center of screen, highest visual attention zone */}
      <div
        style={{ width: 300, height: 250 }}
        className="relative border border-black/10 rounded flex items-center justify-center flex-shrink-0"
      >
        <span className="absolute top-2 right-2.5 text-[9px] font-medium text-slate-300 tracking-widest uppercase">
          Sponsored
        </span>
        {/* AdSense injection point */}
        <div id="adsense-loader-slot" className="w-full h-full" />
      </div>

      {/* Completed steps checklist */}
      <div className="w-full max-w-sm space-y-2">
        {COMPLETED_STEPS.map((step, i) => {
          const threshold = Math.floor(((i + 1) / COMPLETED_STEPS.length) * 80);
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 text-[10px] font-mono"
              style={{
                opacity: progress >= threshold ? 1 : 0.15,
                transition: "opacity 600ms ease",
              }}
            >
              <span
                className={`flex-shrink-0 ${
                  progress >= threshold ? "text-teal-500" : "text-black/20"
                }`}
              >
                ✓
              </span>
              <span className={progress >= threshold ? "text-slate-500" : "text-slate-300"}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
