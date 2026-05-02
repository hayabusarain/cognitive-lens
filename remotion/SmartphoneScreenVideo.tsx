import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import React from "react";
import { MBTI_COLORS } from "../lib/article-data";
import { SiteIntroSequence, SITE_INTRO_DURATION } from "./SiteIntroSequence";

export interface SmartphoneScreenVideoProps {
  theme: string;
  type: "search" | "notification";
  sections: {
    mbtiType: string;
    items: string[]; // Search queries or notification texts
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

const SearchItem: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const typeDuration = 30; // 1 second to type
  const startType = delay;
  const charsToShow = Math.max(0, Math.min(text.length, Math.floor(((frame - startType) / typeDuration) * text.length)));
  const currentText = text.substring(0, charsToShow);

  const opacity = spring({ frame: frame - delay + 10, fps, config: { damping: 200 } });
  const scale = spring({ frame: frame - delay + 10, fps, config: { damping: 12 } });

  if (frame < delay - 10) return null;

  return (
    <div style={{
      backgroundColor: "#262626",
      borderRadius: "9999px",
      padding: "24px 32px",
      display: "flex",
      alignItems: "center",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      border: "1px solid #404040",
      opacity,
      transform: `scale(${scale})`,
      marginBottom: "24px"
    }}>
      <div style={{ width: "32px", height: "32px", marginRight: "20px", color: "#a3a3a3" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <div style={{ fontSize: "48px", color: "#ffffff", fontWeight: 700, flex: 1, display: "flex", alignItems: "center" }}>
        {currentText}
        {(frame - startType) % 20 < 10 && charsToShow < text.length ? (
          <span style={{ display: "inline-block", width: "4px", height: "50px", backgroundColor: "#3b82f6", marginLeft: "6px" }}></span>
        ) : null}
      </div>
    </div>
  );
};

const NotificationItem: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  
  if (frame < delay) return null;

  return (
    <div style={{
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      padding: "40px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      width: "100%",
      maxWidth: "600px",
      margin: "0 auto",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      opacity: progress,
      transform: `translateY(${(1 - progress) * 50}px) scale(${0.95 + progress * 0.05})`,
      marginBottom: "24px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "16px", backgroundColor: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg style={{ width: "36px", height: "36px", color: "#ffffff" }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.03 2 11c0 2.85 1.48 5.38 3.75 7.03L5 22l3.4-1.14A10.6 10.6 0 0012 20c5.52 0 10-4.03 10-9s-4.48-9-10-9z" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: "bold", fontSize: "28px", letterSpacing: "0.05em" }}>LINE</span>
          <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "20px" }}>今</span>
        </div>
      </div>
      <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "44px", lineHeight: "1.4", margin: 0 }}>
        {text}
      </p>
    </div>
  );
};

export const SmartphoneScreenVideo: React.FC<SmartphoneScreenVideoProps> = ({
  theme,
  type,
  sections,
}) => {
  const { fps } = useVideoConfig();
  
  const sectionDuration = 180; // 6 seconds per MBTI section
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a", fontFamily: "sans-serif" }}>
      {/* Background Ambience */}
      <AbsoluteFill style={{ opacity: 0.3 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(49, 46, 129, 0.5), rgba(136, 19, 55, 0.5))" }} />
      </AbsoluteFill>

      {/* Combined Site Intro + Title */}
      <Sequence durationInFrames={SITE_INTRO_DURATION}>
        <SiteIntroSequence theme={theme} accentColor="#6366f1" />
      </Sequence>

      {/* MBTI Sections */}
      {sections.map((section, index) => {
        const startFrame = SITE_INTRO_DURATION + index * sectionDuration;
        const hexColor = colorToHex(MBTI_COLORS[section.mbtiType] || "");
        
        return (
          <Sequence key={index} from={startFrame} durationInFrames={sectionDuration}>
            <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: "40px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
                
                {/* MBTI Label */}
                <div style={{
                  backgroundColor: "#171717",
                  border: "3px solid rgba(255, 255, 255, 0.2)",
                  padding: "20px 48px",
                  borderRadius: "9999px",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  zIndex: 20
                }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: hexColor, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <Img src={staticFile(`characters/${section.mbtiType}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "64px", letterSpacing: "0.1em" }}>{section.mbtiType}</span>
                </div>

                {/* Smartphone Frame */}
                <div style={{
                  position: "relative",
                  width: "640px",
                  height: "1150px",
                  backgroundColor: "#171717",
                  borderRadius: "80px",
                  border: "16px solid #262626",
                  boxShadow: "0 0 120px rgba(0, 0, 0, 0.8)",
                  overflow: "hidden"
                }}>
                  {/* Notch */}
                  <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "200px", height: "40px", backgroundColor: "#262626", borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px", zIndex: 30 }} />
                  
                  {/* Wallpaper */}
                  <div style={{ position: "absolute", inset: 0, opacity: 0.4, background: "linear-gradient(135deg, #1e3a8a, #312e81)" }} />

                  {/* Content */}
                  <div style={{ position: "absolute", inset: 0, paddingTop: "120px", paddingLeft: "32px", paddingRight: "32px", display: "flex", flexDirection: "column" }}>
                    {type === "search" && (
                      <div style={{ display: "flex", flexDirection: "column", marginTop: "40px" }}>
                        <div style={{ textAlign: "center", marginBottom: "40px" }}>
                          <span style={{ color: "rgba(255, 255, 255, 0.6)", fontWeight: "bold", fontSize: "80px", letterSpacing: "-0.05em" }}>Google</span>
                        </div>
                        {section.items.map((item, i) => (
                          <SearchItem key={i} text={item} delay={15 + i * 25} />
                        ))}
                      </div>
                    )}

                    {type === "notification" && (
                      <div style={{ display: "flex", flexDirection: "column", marginTop: "40px" }}>
                        <div style={{ textAlign: "center", marginBottom: "40px" }}>
                          <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "88px", letterSpacing: "-0.05em", display: "block", marginBottom: "8px" }}>09:41</span>
                          <span style={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 500, fontSize: "28px" }}>5月2日 水曜日</span>
                        </div>
                        {section.items.map((item, i) => (
                          <NotificationItem key={i} text={item} delay={20 + i * 20} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
