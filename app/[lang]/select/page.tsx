"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TYPE_INFO } from "@/lib/type-info";

const TYPES = [
  ["INTJ", "INTP", "ENTJ", "ENTP"],
  ["INFJ", "INFP", "ENFJ", "ENFP"],
  ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  ["ISTP", "ISFP", "ESTP", "ESFP"],
] as const;

const AXIS_LABELS = ["NT — 分析系", "NF — 理想主義系", "SJ — 管理系", "SP — 探索系"];

export default function SelectPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="nav-blur flex items-center justify-between px-6 py-4 sticky top-0 z-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          
        >
          <ArrowLeft size={14} />
          ホーム
        </button>
        <span className="text-xs font-bold tracking-[0.18em]" >
          TYPE SELECTOR
        </span>
        <div className="w-14" />
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-5 py-10 flex flex-col gap-8">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1
            className="text-xl font-bold"
            style={{ letterSpacing: "-0.03em", color: "#1e293b" }}
          >
            プロファイルを直接選択
          </h1>
          <p className="text-xs leading-relaxed max-w-sm mx-auto" >
            すでに自身の認知タイプを把握している場合、
            <br />診断をスキップして直接プロトコルを参照できます。
          </p>
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-5">
          {TYPES.map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-col gap-2">
              <p
                className="text-[10px] font-bold tracking-[0.18em] uppercase px-1"
                
              >
                {AXIS_LABELS[rowIdx]}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {row.map((type) => {
                  const info = TYPE_INFO[type];
                  return (
                    <button
                      key={type}
                      onClick={() => router.push(`/result?type=${type}`)}
                      className="glass-card group relative flex flex-col items-center justify-center gap-1.5 py-5 px-3 active:scale-[0.97] transition-all duration-150 rounded-2xl"
                    >
                      <span className="text-2xl">{info.emoji}</span>
                      <span
                        className="text-base font-black tracking-widest transition-colors"
                        
                      >
                        {type}
                      </span>
                      <span className="text-xs font-medium" >
                        {info.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs pt-2" >
          タイプに確信がない場合は{" "}
          <button
            onClick={() => router.push("/test")}
            className="underline underline-offset-2 transition-colors"
            
          >
            20問の診断
          </button>
          {" "}を推奨します。
        </p>
      </div>
    </main>
  );
}
