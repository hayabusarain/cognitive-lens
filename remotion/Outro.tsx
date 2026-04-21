import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // フェードインやポップアニメーション
  const textScale = spring({
    frame: frame - 15, // 少し遅らせてポップ
    fps,
    config: {
      damping: 12,
      stiffness: 200,
    },
  });

  const searchBoxScale = spring({
    frame: frame - 30, // さらに遅れて検索バーがポップ
    fps,
    config: {
      damping: 12,
      stiffness: 200,
    },
  });

  const opacity = Math.min(frame / 15, 1); // 15フレームかけてフェードイン

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity, justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
      
      {/* サイト宣伝のメインテキスト */}
      <h1
        style={{
          transform: `scale(${textScale})`,
          fontSize: "80px",
          fontWeight: 900,
          fontFamily: "'Dela Gothic One', sans-serif",
          color: "white",
          WebkitTextStroke: "3px black",
          textShadow: "0px 0px 30px rgba(0,255,255,1)",
          marginBottom: "60px",
          textAlign: "center",
          lineHeight: "1.4"
        }}
      >
        自己診断・相性診断は<br/>WEBサイトで！
      </h1>

      {/* 検索エンジンの入力枠風のUI */}
      <div
        style={{
          transform: `scale(${searchBoxScale})`,
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "50px",
          padding: "20px 40px",
          width: "80%",
          maxWidth: "800px",
          boxShadow: "0px 20px 50px rgba(0,0,0,0.5)",
          border: "4px solid #00ffff"
        }}
      >
        <span style={{ fontSize: "50px", marginRight: "20px" }}>🔍</span>
        <span style={{ 
          fontSize: "65px", 
          fontWeight: "bold", 
          fontFamily: "sans-serif",
          color: "#333",
          letterSpacing: "0.05em"
        }}>
          CognitiveLens
        </span>
        {/* カーソルの点滅表現 */}
        <span style={{
           fontSize: "65px",
           color: "#00ffff",
           marginLeft: "5px",
           opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0
        }}>|</span>
      </div>

    </AbsoluteFill>
  );
};
