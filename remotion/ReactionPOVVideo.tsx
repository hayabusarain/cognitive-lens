import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import React from "react";
import { MBTI_COLORS } from "../lib/article-data";
import { SiteIntroSequence, SITE_INTRO_DURATION } from "./SiteIntroSequence";

export interface ReactionPOVVideoProps {
  theme: string;
  reactions: {
    mbtiType: string;
    text: string;
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

const ReactionItem: React.FC<{ mbtiType: string; text: string }> = ({ mbtiType, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hexColor = colorToHex(MBTI_COLORS[mbtiType] || "");
  
  const popIn = spring({ frame, fps, config: { damping: 12 } });
  const slideUp = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const textOpacity = spring({ frame: frame - 30, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 40px" }}>
      
      {/* Type Badge */}
      <div style={{
        marginBottom: "32px",
        backgroundColor: "#171717",
        border: "4px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "9999px",
        padding: "16px 48px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        transform: `scale(${popIn})`
      }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%", backgroundColor: hexColor,
          boxShadow: `0 0 20px ${hexColor}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative"
        }}>
          <Img src={staticFile(`characters/${mbtiType}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "60px", letterSpacing: "0.1em" }}>{mbtiType}</span>
      </div>

      {/* Reaction Text Box */}
      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(12px)",
        borderRadius: "24px",
        padding: "48px",
        width: "100%",
        maxWidth: "800px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        position: "relative",
        overflow: "hidden",
        opacity: slideUp,
        transform: `translateY(${(1 - slideUp) * 100}px)`
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "8px", backgroundColor: hexColor }} />
        <p style={{
          color: "#ffffff", fontWeight: "bold", fontSize: "56px", lineHeight: "1.5", margin: 0,
          opacity: textOpacity
        }}>
          {text}
        </p>
      </div>
      
    </AbsoluteFill>
  );
};

export const ReactionPOVVideo: React.FC<ReactionPOVVideoProps> = ({
  theme,
  reactions,
}) => {
  const { fps } = useVideoConfig();
  
  const reactionDuration = 210;
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", fontFamily: "sans-serif" }}>
      {/* Dynamic Background Pattern */}
      <AbsoluteFill>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "#171717" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.2, backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, #0a0a0a)" }} />
      </AbsoluteFill>

      {/* Combined Site Intro + Title */}
      <Sequence durationInFrames={SITE_INTRO_DURATION}>
        <SiteIntroSequence theme={theme} accentColor="#e11d48" />
      </Sequence>

      {/* Persistent Theme Header after Intro */}
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

      {/* Reaction Sequences */}
      {reactions.map((reaction, index) => {
        const startFrame = SITE_INTRO_DURATION + index * reactionDuration;
        return (
          <Sequence key={index} from={startFrame} durationInFrames={reactionDuration}>
            <ReactionItem mbtiType={reaction.mbtiType} text={reaction.text} />
          </Sequence>
        );
      })}

    </AbsoluteFill>
  );
};
