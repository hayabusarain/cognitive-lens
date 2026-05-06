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
  mainTitle = "紫（NT）タイプの脈ありサイン",
  subTitle = "最後のページにまとめがあるよ！",
  groupColor = "purple",
  lang = "ja"
}) => {
  const colors = COLOR_MAP[groupColor] || COLOR_MAP.purple;

  return (
    <AbsoluteFill style={{ background: colors.bg, fontFamily: "'Noto Sans JP', sans-serif" }}>
      {/* 背景ノイズ */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        backgroundImage: "url('/noise.png')",
        opacity: 0.15,
        mixBlendMode: "overlay"
      }} />

      {/* 装飾用背景サークル */}
      <div style={{
        position: "absolute",
        top: "-10%", left: "-20%", width: "800px", height: "800px",
        background: `radial-gradient(circle, ${colors.primary}44 0%, transparent 70%)`,
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%", right: "-20%", width: "1000px", height: "1000px",
        background: `radial-gradient(circle, ${colors.primary}44 0%, transparent 70%)`,
        zIndex: 0
      }} />

      <AbsoluteFill style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        padding: "250px 60px 400px 60px"
      }}>
        
        {/* メインタイトル */}
        <div style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(20px)",
          padding: "80px 60px",
          borderRadius: "60px",
          border: `4px solid ${colors.primary}88`,
          boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 100px ${colors.shadow}`,
          textAlign: "center",
          width: "100%",
          zIndex: 10
        }}>
          {mainTitle.split("の").map((part, i, arr) => (
            <React.Fragment key={i}>
              <h1 style={{
                fontSize: i === 0 ? "80px" : "110px",
                fontWeight: 900,
                color: "#ffffff",
                margin: i === 0 ? "0 0 20px 0" : "20px 0 0 0",
                lineHeight: 1.2,
                textShadow: `0 0 40px ${colors.shadow}`,
              }}>
                {part}{i !== arr.length - 1 && "の"}
              </h1>
              {i === 0 && (
                <div style={{
                  width: "200px",
                  height: "12px",
                  backgroundColor: colors.primary,
                  borderRadius: "6px",
                  margin: "0 auto",
                  boxShadow: `0 0 30px ${colors.primary}`
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* サブタイトル（まとめがある旨） */}
        <div style={{
          marginTop: "100px",
          backgroundColor: "#ffffff",
          color: colors.primary,
          padding: "30px 60px",
          borderRadius: "100px",
          fontSize: "48px",
          fontWeight: 900,
          boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 50px ${colors.light}88`,
          display: "flex",
          alignItems: "center",
          gap: "20px",
          zIndex: 10
        }}>
          <span>✨</span>
          {subTitle}
          <span>✨</span>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
