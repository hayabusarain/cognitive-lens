import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLOR_MAP } from "./SingleSlideImage";

export type SlideSummaryImageProps = {
  summaryTitle: string;
  groupColor: "purple" | "green" | "blue" | "yellow";
  items: {
    mbtiType: string;
    summaryText: string;
  }[];
  lang?: string;
};

export const SlideSummaryImage: React.FC<SlideSummaryImageProps> = ({
  summaryTitle = "紫タイプ（NT）のまとめ",
  groupColor = "purple",
  items = [
    { mbtiType: "INTJ", summaryText: "行動が全て！密かに分析しつつ尽くす" },
    { mbtiType: "INTP", summaryText: "不器用ながらも必死に近づいてくる" },
    { mbtiType: "ENTJ", summaryText: "ストレートな問題解決と時間投資" },
    { mbtiType: "ENTP", summaryText: "からかいつつも完全にロックオン" }
  ],
  lang = "ja"
}) => {
  const colors = COLOR_MAP[groupColor] || COLOR_MAP.purple;
  const isEnglish = lang === "en";
  const searchPrompt = isEnglish ? "🔍 Search 'CognitiveLens' for deeper match test" : "🔍 詳しい相性診断は『対人課題解決プラットフォーム』で検索！";

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

      <AbsoluteFill style={{ padding: "250px 40px 350px 40px", display: "flex", flexDirection: "column" }}>
        
        {/* タイトル */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px",
          marginTop: "20px"
        }}>
          <h1 style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            textShadow: `0 0 30px ${colors.shadow}`,
          }}>
            {summaryTitle}
          </h1>
          <div style={{
            width: "150px",
            height: "8px",
            backgroundColor: colors.primary,
            borderRadius: "4px",
            margin: "20px auto 0",
            boxShadow: `0 0 20px ${colors.primary}`
          }} />
        </div>

        {/* 2x2 グリッド */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          flex: 1,
          marginBottom: "40px"
        }}>
          {items.map((item, index) => (
            <div key={index} style={{
              backgroundColor: "rgba(0,0,0,0.4)",
              borderRadius: "40px",
              border: `2px solid ${colors.primary}66`,
              boxShadow: `0 15px 30px rgba(0,0,0,0.5)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "30px",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* 背景の光 */}
              <div style={{
                position: "absolute",
                top: "30%", left: "50%", transform: "translate(-50%, -50%)",
                width: "150px", height: "150px",
                background: `radial-gradient(circle, ${colors.primary}55 0%, transparent 70%)`,
                zIndex: 0
              }} />

              {/* キャラ画像 */}
              <Img 
                src={staticFile(`/characters/${item.mbtiType}.png`)}
                style={{
                  width: "160px",
                  height: "160px",
                  objectFit: "contain",
                  zIndex: 1,
                  filter: `drop-shadow(0 10px 15px ${colors.shadow})`
                }}
              />
              
              {/* MBTI名 */}
              <div style={{
                backgroundColor: colors.primary,
                color: "#fff",
                fontWeight: 900,
                fontSize: "32px",
                padding: "8px 30px",
                borderRadius: "100px",
                marginTop: "-20px",
                zIndex: 2,
                boxShadow: `0 5px 15px ${colors.shadow}`,
              }}>
                {item.mbtiType}
              </div>

              {/* 総括テキスト */}
              <p style={{
                color: "#fff",
                fontSize: "26px",
                fontWeight: 700,
                textAlign: "center",
                marginTop: "30px",
                lineHeight: 1.5,
                zIndex: 2
              }}>
                {item.summaryText}
              </p>
            </div>
          ))}
        </div>

        {/* サイト誘導 (CTA) */}
        <div style={{
          backgroundColor: "#ffffff",
          borderRadius: "60px",
          padding: "30px",
          textAlign: "center",
          boxShadow: `0 20px 40px rgba(0,0,0,0.6), 0 0 60px ${colors.shadow}`,
          border: `6px solid ${colors.primary}`
        }}>
          <p style={{
            color: "#000",
            fontSize: "34px",
            fontWeight: 900,
            margin: 0,
            letterSpacing: "0.02em"
          }}>
            {searchPrompt}
          </p>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
