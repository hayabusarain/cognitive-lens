import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";

export type StaticInfographicProps = {
  theme: string;
  groupColor: "purple" | "green" | "blue" | "yellow";
  items: {
    mbtiType: string;
    catchphrase: string;
    description: string;
  }[];
};

const COLOR_MAP = {
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

export const StaticInfographicVideo: React.FC<StaticInfographicProps> = ({
  theme = "紫タイプの脈ありサイン",
  groupColor = "purple",
  items = []
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors = COLOR_MAP[groupColor] || COLOR_MAP.purple;

  // アニメーション：全体がフワッと浮かび上がる
  const globalOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  
  // タイトルのアニメーション
  const titleY = spring({ frame, fps, config: { damping: 12 } });
  
  // サイト誘導のアニメーション
  const ctaScale = spring({ frame: frame - 20, fps, config: { damping: 12, mass: 0.5 } });

  const isEnglish = !/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/.test(theme);
  const searchPrompt = isEnglish ? "🔍 Search 'CognitiveLens'" : "🔍 詳しい相性診断は『対人課題解決プラットフォーム』で検索";

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

      <AbsoluteFill style={{ padding: "80px 40px", opacity: globalOpacity, display: "flex", flexDirection: "column" }}>
        
        {/* タイトルセクション */}
        <div style={{
          textAlign: "center",
          marginBottom: "60px",
          transform: `translateY(${(1 - titleY) * -50}px)`,
          opacity: titleY
        }}>
          <h1 style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.3,
            textShadow: `0 0 40px ${colors.shadow}`,
            padding: "0 20px"
          }}>
            {theme}
          </h1>
          <div style={{
            width: "120px",
            height: "8px",
            backgroundColor: colors.primary,
            borderRadius: "4px",
            margin: "20px auto 0",
            boxShadow: `0 0 20px ${colors.primary}`
          }} />

          <div style={{
            marginTop: "30px",
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            border: `2px solid ${colors.primary}`,
            borderRadius: "100px",
            padding: "12px 30px",
            boxShadow: `0 10px 20px rgba(0,0,0,0.3)`
          }}>
             <span style={{ color: "#fff", fontSize: "28px", fontWeight: "bold", letterSpacing: "0.05em" }}>
               {isEnglish ? "🔍 Search 'CognitiveLens'" : "🔍 詳細は『CognitiveLens』で検索"}
             </span>
          </div>
        </div>

        {/* 2x2 グリッド */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "40px",
          flex: 1,
          marginBottom: "60px"
        }}>
          {items.map((item, i) => {
            // 各アイテムを少しずつ遅延させて表示
            const itemScale = spring({
              frame: frame - (10 + i * 5),
              fps,
              config: { damping: 14 }
            });

            return (
              <div key={i} style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "32px",
                border: `2px solid rgba(255, 255, 255, 0.1)`,
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transform: `scale(${itemScale})`,
                opacity: itemScale,
                boxShadow: `0 20px 40px rgba(0,0,0,0.3), inset 0 0 30px ${colors.shadow}`,
                position: "relative",
                overflow: "hidden"
              }}>
                {/* 背景のぼんやりした光 */}
                <div style={{
                  position: "absolute",
                  top: "-20%",
                  left: "-20%",
                  width: "140%",
                  height: "140%",
                  background: `radial-gradient(circle, ${colors.primary}22 0%, transparent 70%)`,
                  zIndex: 0
                }} />

                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                  {/* キャラ画像 */}
                  <Img 
                    src={staticFile(`/characters/${item.mbtiType}.png`)}
                    style={{
                      width: "180px",
                      height: "180px",
                      objectFit: "contain",
                      marginBottom: "16px",
                      filter: `drop-shadow(0 10px 20px ${colors.shadow})`
                    }}
                  />
                  
                  {/* MBTI名バッジ */}
                  <div style={{
                    backgroundColor: colors.primary,
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "28px",
                    padding: "8px 24px",
                    borderRadius: "100px",
                    marginBottom: "24px",
                    letterSpacing: "0.05em",
                    boxShadow: `0 4px 15px ${colors.shadow}`
                  }}>
                    {item.mbtiType}
                  </div>

                  {/* キャッチコピー */}
                  <h2 style={{
                    color: colors.light,
                    fontSize: "32px",
                    fontWeight: 800,
                    margin: "0 0 16px 0",
                    lineHeight: 1.3
                  }}>
                    {item.catchphrase}
                  </h2>

                  {/* 説明テキスト */}
                  <p style={{
                    color: "rgba(255, 255, 255, 0.85)",
                    fontSize: "24px",
                    fontWeight: 600,
                    margin: 0,
                    lineHeight: 1.5,
                    flex: 1,
                    display: "flex",
                    alignItems: "center"
                  }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* サイト誘導 (CTA) */}
        <div style={{
          backgroundColor: "rgba(0,0,0,0.4)",
          border: `2px solid ${colors.primary}`,
          borderRadius: "100px",
          padding: "24px 40px",
          textAlign: "center",
          transform: `scale(${ctaScale})`,
          opacity: ctaScale,
          backdropFilter: "blur(10px)",
          boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 40px ${colors.shadow}`
        }}>
          <p style={{
            color: "#ffffff",
            fontSize: "32px",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "0.05em"
          }}>
            {searchPrompt}
          </p>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
