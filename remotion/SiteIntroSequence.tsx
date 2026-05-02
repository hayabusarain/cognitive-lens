// 動画冒頭：サイト誘導 + タイトルを1画面にまとめたコンポーネント（全フォーマット共通）
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const SITE_INTRO_DURATION = 150; // 5 seconds at 30fps（旧: イントロ90 + フック120 → 統合150）

interface SiteIntroProps {
  theme: string;
  accentColor?: string; // フォーマットごとのアクセントカラー
}

export const SiteIntroSequence: React.FC<SiteIntroProps> = ({ theme, accentColor = "#06b6d4" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // アニメーション
  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 12 } });
  const searchOpacity = spring({ frame: frame - 25, fps, config: { damping: 20 } });
  const titleScale = spring({ frame: frame - 45, fps, config: { damping: 14 } });
  const titleOpacity = spring({ frame: frame - 45, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
      padding: "48px",
    }}>
      {/* Accent glow */}
      <div style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }} />
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)`,
        bottom: "15%",
        right: "20%",
      }} />

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
        width: "100%",
      }}>
        {/* ── 上部：サイトロゴ + 検索誘導 ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          transform: `scale(${logoScale})`,
        }}>
          <span style={{
            fontSize: "56px",
            fontWeight: 900,
            background: "linear-gradient(135deg, #06b6d4, #a855f7)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            letterSpacing: "0.05em",
          }}>
            CognitiveLens
          </span>
          <p style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "28px",
            fontWeight: 700,
            margin: 0,
            opacity: searchOpacity,
            textAlign: "center",
          }}>
            {/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]/.test(theme) 
              ? "🔍「対人課題解決プラットフォーム」で検索" 
              : "🔍 Search 'CognitiveLens'"}
          </p>
        </div>

        {/* ── 区切り線 ── */}
        <div style={{
          width: "60%",
          height: "2px",
          background: `linear-gradient(to right, transparent, ${accentColor}66, transparent)`,
          opacity: searchOpacity,
        }} />

        {/* ── 下部：お題タイトル ── */}
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          padding: "36px 48px",
          borderRadius: "32px",
          border: `1px solid ${accentColor}44`,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px ${accentColor}15`,
          maxWidth: "900px",
          textAlign: "center",
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}>
          <h1 style={{
            color: "#ffffff",
            fontWeight: 900,
            fontSize: "58px",
            lineHeight: 1.3,
            margin: 0,
          }}>
            {theme}
          </h1>
        </div>
      </div>
    </AbsoluteFill>
  );
};
