import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export type SingleSlideImageProps = {
  mbtiType: string;
  catchphrase: string;
  groupColor: "purple" | "green" | "blue" | "yellow";
  points: string[];
  lang?: string;
};

// 16Personalities style colors (slightly muted but distinct)
export const COLOR_MAP = {
  purple: { primary: "#88619a", light: "#d6c9dd", text: "#fff" },
  green: { primary: "#33a474", light: "#bce3d2", text: "#fff" },
  blue: { primary: "#4298b4", light: "#c2e1ea", text: "#fff" },
  yellow: { primary: "#e4ae3a", light: "#f8e7bf", text: "#fff" }
};

export const SingleSlideImage: React.FC<SingleSlideImageProps> = ({
  mbtiType = "INTJ", catchphrase = "INTJの尊いギャップ", groupColor = "purple",
  points = Array(7).fill("魅力のサンプルテキストです。"), lang = "ja"
}) => {
  const colors = COLOR_MAP[groupColor] || COLOR_MAP.purple;

  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f4f6", fontFamily: "'Noto Sans JP', sans-serif" }}>
      
      {/* Decorative top wave/blob */}
      <div style={{
        position: "absolute", top: -100, right: -100, width: "600px", height: "600px",
        backgroundColor: colors.light, borderRadius: "50%", opacity: 0.5, zIndex: 0
      }} />

      {/* Scattered Chibi-style Characters in Background */}
      {[
        { top: "8%", left: "8%", transform: "rotate(-15deg) scale(0.9)", opacity: 0.4 },
        { top: "12%", right: "6%", transform: "rotate(20deg) scale(1.1)", opacity: 0.3 },
        { top: "40%", left: "3%", transform: "rotate(-5deg) scale(0.8)", opacity: 0.35 },
        { top: "45%", right: "4%", transform: "rotate(15deg) scale(0.95)", opacity: 0.4 },
        { bottom: "10%", left: "10%", transform: "rotate(-25deg) scale(1)", opacity: 0.3 },
        { bottom: "8%", right: "12%", transform: "rotate(10deg) scale(0.85)", opacity: 0.35 },
        { bottom: "25%", left: "50%", transform: "rotate(-8deg) scale(0.7)", opacity: 0.3 }
      ].map((pos, idx) => (
        <Img key={idx} src={staticFile(`/characters/${mbtiType}.png`)} style={{
          position: "absolute",
          top: pos.top,
          left: pos.left,
          right: pos.right,
          bottom: pos.bottom,
          transform: pos.transform,
          width: "140px",
          height: "140px",
          objectFit: "contain",
          opacity: pos.opacity,
          zIndex: 1,
          pointerEvents: "none",
          filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.05))"
        }} />
      ))}

      {/* Safe zones implemented: top 300px, bottom 450px */}
      <AbsoluteFill style={{ padding: "300px 40px 450px 40px", display: "flex", flexDirection: "column", zIndex: 10 }}>
        
        {/* Main Card */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "32px",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
          display: "flex", flexDirection: "column", flex: 1,
          padding: "50px", position: "relative"
        }}>
          {/* Foreground Content */}
          <div style={{ zIndex: 2, position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Header Area */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: `2px solid ${colors.light}`, paddingBottom: "30px", marginBottom: "40px"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                {/* Type Badge (Pill) */}
                <div style={{
                  backgroundColor: colors.primary, color: colors.text, fontWeight: 800, fontSize: "42px",
                  padding: "12px 40px", borderRadius: "9999px", display: "inline-block",
                  alignSelf: "flex-start", letterSpacing: "0.05em",
                  boxShadow: `0 8px 20px ${colors.primary}40`
                }}>
                  {mbtiType}
                </div>
                <h1 style={{
                  fontSize: "44px", fontWeight: 800, color: "#1f2937", margin: 0,
                  lineHeight: 1.3, letterSpacing: "-0.02em"
                }}>
                  {catchphrase}
                </h1>
              </div>
            </div>

            {/* Points List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "30px", flex: 1, justifyContent: "center" }}>
              {points.map((point, index) => (
                <div key={index} style={{
                  display: "flex", alignItems: "flex-start", gap: "25px"
                }}>
                  {/* Clean Number Badge */}
                  <div style={{
                    backgroundColor: colors.light, color: colors.primary, fontSize: "28px", fontWeight: 800,
                    width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "50%", flexShrink: 0, marginTop: "4px"
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ color: "#374151", fontSize: "32px", fontWeight: 700, margin: 0, lineHeight: 1.5, letterSpacing: "-0.01em" }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
