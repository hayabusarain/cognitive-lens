import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import React from "react";
import { MBTI_COLORS } from "../lib/article-data";
import { SiteIntroSequence, SITE_INTRO_DURATION } from "./SiteIntroSequence";

export interface PieChartVideoProps {
  theme: string;
  charts: {
    mbtiType: string;
    slices: {
      label: string;
      percentage: number; // 0 to 100
    }[];
  }[];
}

const colorToHex = (colorClass: string) => {
  if (colorClass.includes("cyan")) return "#06b6d4";
  if (colorClass.includes("rose")) return "#e11d48";
  if (colorClass.includes("emerald")) return "#10b981";
  if (colorClass.includes("purple")) return "#a855f7";
  if (colorClass.includes("amber")) return "#f59e0b";
  if (colorClass.includes("indigo")) return "#6366f1";
  if (colorClass.includes("pink")) return "#ec4899";
  if (colorClass.includes("blue")) return "#3b82f6";
  return "#737373";
};

const SLICE_COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // yellow
  "#8b5cf6", // purple
  "#ec4899", // pink
];

const ChartSequence: React.FC<{ mbtiType: string; slices: { label: string; percentage: number }[] }> = ({ mbtiType, slices }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hexColor = colorToHex(MBTI_COLORS[mbtiType] || "");

  const drawProgress = spring({ frame: frame - 15, fps, config: { damping: 100, mass: 1, stiffness: 50 } });
  
  let currentAngle = 0;
  const gradientStops = slices.map((slice, i) => {
    const start = currentAngle;
    const sliceAngle = slice.percentage * drawProgress;
    const end = start + sliceAngle;
    currentAngle = end;
    
    const color = SLICE_COLORS[i % SLICE_COLORS.length];
    return `${color} ${start}% ${end}%`;
  }).join(", ");

  const finalGradient = `conic-gradient(${gradientStops}${currentAngle < 100 ? `, transparent ${currentAngle}% 100%` : ''})`;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "40px", display: "flex", flexDirection: "column", gap: "64px" }}>
      
      {/* MBTI Title */}
      <div style={{
        backgroundColor: "#171717",
        border: "4px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "9999px",
        padding: "16px 48px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        opacity: interpolate(frame, [0, 10], [0, 1])
      }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%", backgroundColor: hexColor,
          boxShadow: `0 0 20px ${hexColor}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
        }}>
          <Img src={staticFile(`characters/${mbtiType}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "60px", letterSpacing: "0.1em" }}>{mbtiType}</span>
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" }}>
        {/* The Pie Chart */}
        <div style={{
          position: "relative",
          width: "400px", height: "400px",
          borderRadius: "50%",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.5)",
          border: "12px solid #262626",
          background: finalGradient
        }}>
          {/* Inner circle for donut hole */}
          <div style={{
            position: "absolute", inset: 0, margin: "auto", width: "160px", height: "160px",
            backgroundColor: "#0a0a0a", borderRadius: "50%", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ fontSize: "50px" }}>🧠</span>
          </div>
        </div>

        {/* Legend / Labels */}
        <div style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {slices.map((slice, i) => {
            const labelOpacity = spring({ frame: frame - 30 - i * 10, fps, config: { damping: 14 } });
            const color = SLICE_COLORS[i % SLICE_COLORS.length];
            return (
              <div 
                key={i} 
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "20px 24px", borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  opacity: labelOpacity, transform: `translateX(${(1 - labelOpacity) * 50}px)`
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", backgroundColor: color }} />
                  <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: "28px" }}>{slice.label}</span>
                </div>
                <span style={{ color, fontWeight: 900, fontSize: "36px" }}>{slice.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
      
    </AbsoluteFill>
  );
};

export const PieChartVideo: React.FC<PieChartVideoProps> = ({
  theme,
  charts,
}) => {
  const { fps } = useVideoConfig();
  
  const chartDuration = 240;
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", fontFamily: "sans-serif" }}>
      {/* Fallback pattern using CSS instead of external image */}
      <AbsoluteFill style={{ opacity: 0.1, backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "20px 20px" }} />

      {/* Combined Site Intro + Title */}
      <Sequence durationInFrames={SITE_INTRO_DURATION}>
        <SiteIntroSequence theme={theme} accentColor="#d946ef" />
      </Sequence>

      {/* Persistent Theme Header */}
      <Sequence from={SITE_INTRO_DURATION}>
        <AbsoluteFill>
          <div style={{
            position: "absolute", top: "64px", left: "50%", transform: "translateX(-50%)",
            width: "90%", maxWidth: "800px", textAlign: "center", backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)", padding: "16px 32px", borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.1)", zIndex: 50
          }}>
            <h2 style={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: "bold", fontSize: "28px", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {theme}
            </h2>
          </div>
        </AbsoluteFill>
      </Sequence>

      {charts.map((chart, index) => {
        const startFrame = SITE_INTRO_DURATION + index * chartDuration;
        return (
          <Sequence key={index} from={startFrame} durationInFrames={chartDuration}>
            <ChartSequence mbtiType={chart.mbtiType} slices={chart.slices} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
