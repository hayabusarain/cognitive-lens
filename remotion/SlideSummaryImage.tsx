import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLOR_MAP } from "./SingleSlideImage";

export type SlideSummaryImageProps = {
  summaryTitle: string;
  groupColor: "purple" | "green" | "blue" | "yellow";
  items: { mbtiType: string; summaryText: string; }[];
  lang?: string;
};

export const SlideSummaryImage: React.FC<SlideSummaryImageProps> = ({
  summaryTitle = "紫タイプ（NT）のまとめ", groupColor = "purple",
  items = [
    { mbtiType: "INTJ", summaryText: "冷徹な戦略家が見せる素顔" },
    { mbtiType: "INTP", summaryText: "誰よりも深く愛している" },
    { mbtiType: "ENTJ", summaryText: "二人きりで見せる大型犬" },
    { mbtiType: "ENTP", summaryText: "たった一人への深い執着" }
  ], lang = "ja"
}) => {
  const colors = COLOR_MAP[groupColor] || COLOR_MAP.purple;
  const isEnglish = lang === "en";
  const searchPrompt = isEnglish ? "Search 'CognitiveLens'!" : "🔍 あなたのタイプも検索して診断！";

  const scatterPositions = [
    { top: "5%", left: "5%", transform: "rotate(-10deg) scale(0.9)" },
    { top: "15%", right: "8%", transform: "rotate(15deg) scale(1)" },
    { top: "45%", left: "4%", transform: "rotate(-5deg) scale(0.85)" },
    { top: "50%", right: "5%", transform: "rotate(12deg) scale(0.95)" },
    { bottom: "10%", left: "8%", transform: "rotate(-20deg) scale(1.1)" },
    { bottom: "5%", right: "10%", transform: "rotate(10deg) scale(0.8)" },
    { top: "85%", left: "45%", transform: "rotate(5deg) scale(0.9)" },
    { top: "5%", right: "45%", transform: "rotate(-8deg) scale(1)" }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f4f6", fontFamily: "'Noto Sans JP', sans-serif" }}>
      
      {/* Scattered Chibi-style Characters in Background */}
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {scatterPositions[i * 2] && (
            <Img src={staticFile(`/characters/${item.mbtiType}.png`)} style={{
              position: "absolute",
              top: scatterPositions[i * 2].top, left: scatterPositions[i * 2].left, right: scatterPositions[i * 2].right, bottom: scatterPositions[i * 2].bottom,
              transform: scatterPositions[i * 2].transform,
              width: "130px", height: "130px", objectFit: "contain", opacity: 0.35, zIndex: 1, pointerEvents: "none", filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.05))"
            }} />
          )}
          {scatterPositions[i * 2 + 1] && (
            <Img src={staticFile(`/characters/${item.mbtiType}.png`)} style={{
              position: "absolute",
              top: scatterPositions[i * 2 + 1].top, left: scatterPositions[i * 2 + 1].left, right: scatterPositions[i * 2 + 1].right, bottom: scatterPositions[i * 2 + 1].bottom,
              transform: scatterPositions[i * 2 + 1].transform,
              width: "130px", height: "130px", objectFit: "contain", opacity: 0.35, zIndex: 1, pointerEvents: "none", filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.05))"
            }} />
          )}
        </React.Fragment>
      ))}

      {/* Safe zones implemented: top 250px, bottom 400px */}
      <AbsoluteFill style={{ padding: "250px 40px 420px 40px", display: "flex", flexDirection: "column", zIndex: 10 }}>
        
        {/* Title Board */}
        <div style={{
          textAlign: "center", marginBottom: "50px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "20px"
        }}>
          <h1 style={{ fontSize: "56px", fontWeight: 800, color: "#1f2937", margin: 0 }}>
            {summaryTitle}
          </h1>
          <div style={{ width: "80px", height: "8px", backgroundColor: colors.primary, borderRadius: "4px" }} />
        </div>

        {/* 2x2 Grid Clean Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", flex: 1, marginBottom: "40px" }}>
          {items.map((item, index) => (
            <div key={index} style={{
              backgroundColor: "#fff", borderRadius: "32px",
              boxShadow: "0 15px 30px -10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: "40px", position: "relative"
            }}>
              <div style={{ zIndex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                {/* Type Badge (Pill) */}
                <div style={{
                  backgroundColor: colors.primary, color: colors.text,
                  fontWeight: 800, fontSize: "40px", padding: "12px 48px", borderRadius: "9999px",
                  marginBottom: "40px", boxShadow: `0 4px 12px ${colors.primary}40`,
                  letterSpacing: "0.05em"
                }}>
                  {item.mbtiType}
                </div>

                {/* Summary Text */}
                <p style={{ color: "#4b5563", fontSize: "32px", fontWeight: 700, textAlign: "center", margin: 0, lineHeight: 1.5 }}>
                  {item.summaryText}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner Clean */}
        <div style={{
          backgroundColor: "#fff", borderRadius: "9999px", padding: "30px", textAlign: "center",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", border: `2px solid ${colors.light}`
        }}>
          <p style={{ color: colors.primary, fontSize: "40px", fontWeight: 800, margin: 0 }}>
            {searchPrompt}
          </p>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
