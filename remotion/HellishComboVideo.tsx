import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import React from "react";
import { MBTI_COLORS } from "../lib/article-data";
import { SiteIntroSequence, SITE_INTRO_DURATION } from "./SiteIntroSequence";

export interface HellishComboVideoProps {
  theme: string;
  combos: {
    typeA: string;
    typeB: string;
    dialogue: {
      speaker: string; // Should match typeA or typeB
      text: string;
    }[];
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

const DialogueBubble: React.FC<{ 
  speaker: string; 
  text: string; 
  isLeft: boolean;
  delay: number;
}> = ({ speaker, text, isLeft, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hexColor = colorToHex(MBTI_COLORS[speaker] || "");
  
  const popIn = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  
  if (frame < delay) return null;

  return (
    <div style={{
      display: "flex", width: "100%", marginBottom: "32px",
      justifyContent: isLeft ? "flex-start" : "flex-end",
      transform: `scale(${popIn})`, transformOrigin: isLeft ? "left bottom" : "right bottom"
    }}>
      <div style={{
        display: "flex", maxWidth: "85%", alignItems: "flex-end", gap: "20px",
        flexDirection: isLeft ? "row" : "row-reverse"
      }}>
        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%", backgroundColor: hexColor,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)", border: "3px solid rgba(255, 255, 255, 0.2)",
            overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Img src={staticFile(`characters/${speaker}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ color: "rgba(255, 255, 255, 0.6)", fontWeight: "bold", fontSize: "16px" }}>{speaker}</span>
        </div>
        
        {/* Bubble */}
        <div style={{
          padding: "32px", borderRadius: "32px",
          borderBottomLeftRadius: isLeft ? "4px" : "32px",
          borderBottomRightRadius: isLeft ? "32px" : "4px",
          backgroundColor: isLeft ? "#262626" : "#ffffff",
          color: isLeft ? "#ffffff" : "#171717",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          position: "relative"
        }}>
          {/* Tail */}
          <div style={{
            position: "absolute", bottom: 0, width: "20px", height: "20px",
            left: isLeft ? "-10px" : "auto", right: isLeft ? "auto" : "-10px",
            backgroundColor: isLeft ? "#262626" : "#ffffff",
            clipPath: isLeft ? 'polygon(100% 0, 0% 100%, 100% 100%)' : 'polygon(0 0, 0% 100%, 100% 100%)'
          }}></div>
          <p style={{ fontWeight: "bold", fontSize: "40px", lineHeight: "1.4", whiteSpace: "pre-wrap", margin: 0 }}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

const ComboSequence: React.FC<{ combo: HellishComboVideoProps["combos"][0] }> = ({ combo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hexA = colorToHex(MBTI_COLORS[combo.typeA] || "");
  const hexB = colorToHex(MBTI_COLORS[combo.typeB] || "");

  const vsOpacity = spring({ frame: frame - 10, fps });

  return (
    <AbsoluteFill style={{ padding: "40px", paddingTop: "120px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* VS Header */}
      <div style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        backgroundColor: "rgba(0, 0, 0, 0.4)", borderRadius: "48px", padding: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        marginBottom: "64px",
        opacity: vsOpacity, transform: `translateY(${(1 - vsOpacity) * -50}px)`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{
            width: "100px", height: "100px", borderRadius: "50%", backgroundColor: hexA,
            boxShadow: `0 0 40px ${hexA}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Img src={staticFile(`characters/${combo.typeA}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "40px", filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.5))" }}>{combo.typeA}</span>
        </div>
        <div style={{ color: "#f43f5e", fontWeight: 900, fontSize: "80px", fontStyle: "italic", filter: "drop-shadow(0 0 20px rgba(225,29,72,0.8))" }}>VS</div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexDirection: "row-reverse" }}>
          <div style={{
            width: "100px", height: "100px", borderRadius: "50%", backgroundColor: hexB,
            boxShadow: `0 0 40px ${hexB}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Img src={staticFile(`characters/${combo.typeB}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "40px", filter: "drop-shadow(0 4px 3px rgba(0,0,0,0.5))" }}>{combo.typeB}</span>
        </div>
      </div>

      {/* Dialogue Area */}
      <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "100px" }}>
        {combo.dialogue.map((msg, i) => {
          const isLeft = msg.speaker === combo.typeA;
          const delay = 30 + i * 60; // Slightly slower dialogue
          return (
            <DialogueBubble 
              key={i}
              speaker={msg.speaker}
              text={msg.text}
              isLeft={isLeft}
              delay={delay}
            />
          );
        })}
      </div>

    </AbsoluteFill>
  );
};

export const HellishComboVideo: React.FC<HellishComboVideoProps> = ({
  theme,
  combos,
}) => {
  const comboDuration = 450; // 15 seconds per combo
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", fontFamily: "sans-serif" }}>
      <AbsoluteFill style={{ opacity: 0.1, backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)", backgroundSize: "40px 40px" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(127,29,29,0.2), transparent)" }} />

      {/* Combined Site Intro + Title */}
      <Sequence durationInFrames={SITE_INTRO_DURATION}>
        <SiteIntroSequence theme={theme} accentColor="#ef4444" />
      </Sequence>

      {/* Persistent Theme Header */}
      <Sequence from={SITE_INTRO_DURATION}>
        <AbsoluteFill>
          <div style={{
            position: "absolute", top: "32px", left: "50%", transform: "translateX(-50%)",
            width: "90%", maxWidth: "800px", textAlign: "center", zIndex: 50
          }}>
            <h2 style={{
              color: "rgba(255, 255, 255, 0.8)", fontWeight: "bold", fontSize: "28px",
              backgroundColor: "rgba(0, 0, 0, 0.6)", padding: "8px 24px", borderRadius: "9999px",
              border: "1px solid rgba(255, 255, 255, 0.1)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.5))"
            }}>{theme}</h2>
          </div>
        </AbsoluteFill>
      </Sequence>

      {combos.map((combo, index) => {
        const startFrame = SITE_INTRO_DURATION + index * comboDuration;
        return (
          <Sequence key={index} from={startFrame} durationInFrames={comboDuration}>
            <ComboSequence combo={combo} />
          </Sequence>
        );
      })}

    </AbsoluteFill>
  );
};
