"use client";

import { useState } from "react";
import { Crosshair, Loader2 } from "lucide-react";

interface WeaknessScores {
  irrationality: number;
  antisocial: number;
  arrogance: number;
  emotional: number;
  suspicion: number;
}

const LABELS: { key: keyof WeaknessScores; label: string; color: string }[] = [
  { key: "irrationality", label: "非論理性", color: "#f59e0b" },
  { key: "antisocial",    label: "社会不適合", color: "#8b5cf6" },
  { key: "arrogance",     label: "傲慢", color: "#ef4444" },
  { key: "emotional",     label: "感情過多", color: "#3b82f6" },
  { key: "suspicion",     label: "猜疑心", color: "#10b981" },
];

function polarToXY(angle: number, radius: number, cx: number, cy: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function RadarSVG({ scores }: { scores: WeaknessScores }) {
  const cx = 150, cy = 150, maxR = 110;
  const step = 360 / 5;

  // Grid rings
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Data points
  const points = LABELS.map((l, i) => {
    const value = scores[l.key] / 100;
    const angle = i * step;
    return { ...polarToXY(angle, maxR * value, cx, cy), angle, value, ...l };
  });

  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[280px] mx-auto">
      {/* Grid */}
      {rings.map((r) => (
        <polygon
          key={r}
          points={LABELS.map((_, i) => {
            const p = polarToXY(i * step, maxR * r, cx, cy);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="1"
        />
      ))}

      {/* Axes */}
      {LABELS.map((_, i) => {
        const p = polarToXY(i * step, maxR, cx, cy);
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polygon}
        fill="rgba(239,68,68,0.15)"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data dots + labels */}
      {points.map((p, i) => {
        const labelPos = polarToXY(i * step, maxR + 20, cx, cy);
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill={p.color} />
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-[10px] font-bold fill-slate-600"
            >
              {p.label}
            </text>
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              className="text-[9px] font-bold fill-slate-800"
            >
              {scores[p.key]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function WeaknessRadar({ typeKey }: { typeKey: string }) {
  const [scores, setScores] = useState<WeaknessScores | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/weakness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: typeKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "失敗しました");
      } else {
        setScores(data.scores);
        setComment(data.comment ?? "");
      }
    } catch {
      setError("ネットワークエラー");
    }
    setLoading(false);
  };

  return (
    <div className="rounded-3xl border overflow-hidden bg-white/60 backdrop-blur-sm border-rose-200">
      <div className="flex items-center gap-3 px-5 py-4 bg-rose-50/80 border-b border-rose-100">
        <span className="flex items-center justify-center w-8 h-8 rounded-2xl bg-rose-100 text-rose-500 flex-shrink-0">
          <Crosshair size={16} />
        </span>
        <div className="flex-1">
          <p className="font-semibold text-sm text-slate-800">絶対的弱点レーダーチャート</p>
          <p className="text-xs text-slate-500">AIが5軸の弱点をスコアリング</p>
        </div>
      </div>

      <div className="px-5 py-5">
        {!scores && !loading && (
          <div className="text-center space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              非論理性・社会不適合・傲慢・感情過多・猜疑心の5項目を
              <br />AIが認知機能に基づいてスコアリングします。
            </p>
            <button
              onClick={generate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all duration-150 active:scale-[0.98] bg-rose-500 hover:bg-rose-600"
            >
              <Crosshair size={13} />
              弱点を分析する
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8 space-y-2">
            <Loader2 size={24} className="mx-auto text-rose-400 animate-spin" />
            <p className="text-xs text-slate-500">弱点をスコアリング中...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-xs text-red-500">{error}</p>
            <button onClick={generate} className="mt-2 text-xs underline text-slate-500">再試行</button>
          </div>
        )}

        {scores && (
          <div className="space-y-4">
            <RadarSVG scores={scores} />

            {/* Ad slot after chart */}
            <div
              id="adsense-weakness-mid"
              className="w-full h-24 bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs tracking-widest uppercase rounded-xl"
            >
              Sponsored
            </div>

            {comment && (
              <div className="rounded-2xl bg-rose-50 border border-rose-100 px-4 py-3">
                <p className="text-xs text-rose-700 leading-relaxed font-medium">💀 {comment}</p>
              </div>
            )}

            {/* Ad slot after comment */}
            <div
              id="adsense-weakness-bottom"
              className="w-full h-24 bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs tracking-widest uppercase rounded-xl"
            >
              Sponsored
            </div>

            <button
              onClick={generate}
              className="w-full text-xs text-slate-500 underline underline-offset-2 py-1"
            >
              再スコアリング
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
