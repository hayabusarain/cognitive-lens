import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export type SingleSlideImageProps = {
  mbtiType: string;
  catchphrase: string;
  groupColor: "purple" | "green" | "blue" | "yellow";
  points: string[];
  lang?: string;
};

export const COLOR_MAP = {
  purple: {
    primary: "#a855f7",
    light: "#d8b4fe",
    bg: "linear-gradient(to bottom right, #2e1065, #4c1d95, #1e1b4b)",
    shadow: "rgba(168, 85, 247, 0.4)"
  },
  green: {
    primary: "#22c55e",
    light: "#86efac",
    bg: "linear-gradient(to bottom right, #14532d, #166534, #052e16)",
    shadow: "rgba(34, 197, 94, 0.4)"
  },
  blue: {
    primary: "#3b82f6",
    light: "#93c5fd",
    bg: "linear-gradient(to bottom right, #1e3a8a, #1d4ed8, #172554)",
    shadow: "rgba(59, 130, 246, 0.4)"
  },
  yellow: {
    primary: "#eab308",
    light: "#fef08a",
    bg: "linear-gradient(to bottom right, #713f12, #a16207, #422006)",
    shadow: "rgba(234, 179, 8, 0.4)"
  }
};

export const SingleSlideImage: React.FC<SingleSlideImageProps> = ({
  mbtiType = "INTJ",
  catchphrase = "INTJの脈ありサイン",
  groupColor = "purple",
  points = Array(10).fill("脈ありサインのサンプルテキストです。"),
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

      <AbsoluteFill style={{ padding: "200px 40px 300px 40px", display: "flex", flexDirection: "column" }}>
        
        {/* ヘッダーエリア (横並びでコンパクトに) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "40px",
          padding: "20px 40px",
          backgroundColor: "rgba(0,0,0,0.3)",
          borderRadius: "40px",
          border: `2px solid ${colors.primary}44`,
          boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{
              backgroundColor: colors.primary,
              color: "#fff",
              fontWeight: 900,
              fontSize: "32px",
              padding: "8px 24px",
              borderRadius: "100px",
              display: "inline-block",
              boxShadow: `0 5px 20px ${colors.shadow}`,
              alignSelf: "flex-start"
            }}>
              {mbtiType}
            </div>
            <h1 style={{
              fontSize: "44px",
              fontWeight: 900,
              color: "#ffffff",
              margin: 0,
              textShadow: `0 0 20px ${colors.shadow}`,
            }}>
              {catchphrase}
            </h1>
          </div>

          {/* キャラ画像 */}
          <div style={{ position: "relative", width: "180px", height: "180px" }}>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "160px",
              height: "160px",
              background: `radial-gradient(circle, ${colors.primary}66 0%, transparent 70%)`,
              zIndex: 0
            }} />
            <Img 
              src={staticFile(`/characters/${mbtiType}.png`)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                zIndex: 1,
                filter: `drop-shadow(0 10px 20px ${colors.shadow})`
              }}
            />
          </div>
        </div>

        {/* 特徴リスト（7項目対応） */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px", // ギャップを広げる
          flex: 1,
          justifyContent: "center",
        }}>
          {points.map((point, index) => (
            <div key={index} style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              padding: "20px 30px", // パディングを広げる
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: `0 5px 15px rgba(0,0,0,0.2)`
            }}>
              {/* 番号アイコン */}
              <div style={{
                backgroundColor: colors.primary,
                color: "#fff",
                fontSize: "36px", // 大きくする
                fontWeight: 900,
                width: "64px", // 大きくする
                height: "64px", // 大きくする
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                flexShrink: 0,
                boxShadow: `0 0 15px ${colors.shadow}`
              }}>
                {index + 1}
              </div>
              
              {/* テキスト */}
              <p style={{
                color: "#fff",
                fontSize: "30px", // フォントサイズを大きく
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.4,
              }}>
                {point}
              </p>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
