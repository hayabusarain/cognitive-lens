import React from "react";
import { AbsoluteFill } from "remotion";
import { COLOR_MAP } from "./SingleSlideImage";

export type SlideTitleImageProps = {
  mainTitle: string;
  subTitle: string;
  groupColor: "purple" | "green" | "blue" | "yellow";
  lang?: string;
};

export const SlideTitleImage: React.FC<SlideTitleImageProps> = ({
  mainTitle = "紫（NT）タイプの\n思わず悶絶するギャップ",
  subTitle = "最後のページにまとめがあるよ\n共感したらフォローしてね🤍",
  groupColor = "purple",
  lang = "ja"
}) => {
  const colors = COLOR_MAP[groupColor] || COLOR_MAP.purple;

  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f4f6", fontFamily: "'Noto Sans JP', sans-serif" }}>
      {/* 16P style decorative top border/wave */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "30%",
        backgroundColor: colors.primary,
        borderBottomLeftRadius: "50% 20%", borderBottomRightRadius: "50% 20%",
        zIndex: 0
      }} />

      <AbsoluteFill style={{ 
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
        padding: "300px 60px 450px 60px", zIndex: 10
      }}>
        {/* Main Card */}
        <div style={{
          backgroundColor: "#fff",
          width: "100%",
          padding: "80px 60px",
          borderRadius: "32px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px"
        }}>
          {mainTitle.split("の").map((part, i, arr) => (
            <React.Fragment key={i}>
              <h1 style={{
                fontSize: i === 0 ? "70px" : "85px",
                fontWeight: 800,
                color: i === 0 ? colors.primary : "#1f2937",
                margin: 0,
                lineHeight: 1.3,
                textAlign: "center",
                letterSpacing: "-0.02em"
              }}>
                {part}{i !== arr.length - 1 && <span style={{fontSize: "55px", color: "#6b7280", fontWeight: 600}}>の</span>}
              </h1>
              {i === 0 && (
                <div style={{
                  width: "100px", height: "8px", backgroundColor: colors.light, borderRadius: "4px"
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* サイト誘導バッジ (追加) */}
        <div style={{
          marginTop: "40px",
          backgroundColor: colors.primary,
          color: "#fff",
          padding: "16px 40px",
          borderRadius: "100px",
          fontSize: "36px",
          fontWeight: 800,
          letterSpacing: "0.05em",
          boxShadow: `0 10px 25px ${colors.shadow}`,
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          🔍 診断は『コグニティブレンズ』で検索
        </div>

        {/* Subtitle / CTA Badge */}
        <div style={{
          marginTop: "80px",
          backgroundColor: "#fff",
          padding: "30px 60px",
          borderRadius: "9999px", // Pill shape
          border: `4px solid ${colors.primary}40`,
          color: "#4b5563",
          fontSize: "40px",
          fontWeight: 700,
          textAlign: "center",
          whiteSpace: "pre-wrap",
          lineHeight: 1.5,
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)"
        }}>
          {subTitle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
