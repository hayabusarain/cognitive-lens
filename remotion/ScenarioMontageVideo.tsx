import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile, Audio } from "remotion";

export type ScenarioMontageVideoProps = {
  themeTitle: string;
  scenarios: {
    mbtiType: string;
    catchphrase: string;
    subtitles: string[];
    groupColor: string;
  }[];
};

const COLOR_MAP: Record<string, string> = {
  purple: "#8B5CF6", // NT
  green: "#10B981",  // NF
  blue: "#3B82F6",   // SJ
  yellow: "#EAB308", // SP
};

const FadeInWord: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span
      style={{
        color: "white",
        textShadow: "0px 4px 10px rgba(0,0,0,0.8), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
        fontWeight: "bold",
        fontSize: "60px",
        fontFamily: "'Noto Sans JP', sans-serif",
      }}
    >
      {text}
    </span>
  );
};

export const ScenarioMontageVideo: React.FC<ScenarioMontageVideoProps> = ({
  themeTitle = "MBTI別 帰宅後あるある",
  scenarios = []
}) => {
  const { fps } = useVideoConfig();
  
  let currentStartFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f4f6" }}>
      {/* Background Music */}
      <Audio src={staticFile("audio/bgm-pop.mp3")} volume={0.15} loop />
      
      {scenarios.map((scenario, index) => {
        // Calculate scenario duration dynamically based on subtitle lengths
        const scenarioDuration = scenario.subtitles.reduce((acc: number, sub: string) => {
          return acc + Math.round(Math.max(2.5, sub.length / 12) * fps);
        }, 0);
        
        const startFrame = currentStartFrame;
        currentStartFrame += scenarioDuration;

        return (
          <Sequence key={index} from={startFrame} durationInFrames={scenarioDuration}>
            <ScenarioSegment scenario={scenario} duration={scenarioDuration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const ScenarioSegment: React.FC<{ scenario: any; duration: number }> = ({ scenario, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background slight zoom
  const bgScale = interpolate(frame, [0, duration], [1.0, 1.1], { extrapolateRight: "clamp" });
  
  const themeColor = COLOR_MAP[scenario.groupColor] || COLOR_MAP.green;

  // Title Box entrance
  const titleY = spring({ frame, fps, config: { damping: 12 } });
  
  return (
    <AbsoluteFill>
      {/* Background Room */}
      <AbsoluteFill style={{ transform: `scale(${bgScale})`, transformOrigin: "center" }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(to bottom, #fce7f3, #e0e7ff)" }} />
        <Img src={staticFile("images/room_bg.png")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5, position: "absolute" }} />
      </AbsoluteFill>

      {/* Character */}
      {/* Character Image positioned on the right */}
      <div style={{ position: "absolute", bottom: "-20px", right: "150px" }}>
        <Img 
          src={staticFile(`characters/${scenario.mbtiType}.png`)} 
          style={{ 
            height: "900px", 
            objectFit: "contain",
            transform: `translateY(${interpolate(titleY, [0, 1], [100, 0])}px)`,
            opacity: titleY
          }} 
        />
      </div>

      {/* Left side Title Card */}
      <div
        style={{
          position: "absolute",
          top: "250px",
          left: "150px",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            borderLeft: `16px solid ${themeColor}`,
            padding: "20px 40px",
            borderRadius: "0 20px 20px 0",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            transform: `translateX(${interpolate(titleY, [0, 1], [-200, 0])}px)`,
            opacity: titleY
          }}
        >
          <h1 style={{ fontSize: "80px", fontWeight: "900", margin: 0, color: themeColor, fontFamily: "'Inter', sans-serif" }}>
            {scenario.mbtiType}
          </h1>
        </div>

        {/* Speech Bubble */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "30px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
            maxWidth: "700px",
            transform: `scale(${titleY})`,
            transformOrigin: "top left"
          }}
        >
          <h2 style={{ fontSize: "40px", margin: 0, color: "#333", fontWeight: "bold" }}>
            {scenario.catchphrase}
          </h2>
        </div>
      </div>

      {(() => {
        let currentSubStart = 0;
        return scenario.subtitles.map((sub: string, i: number) => {
          const subFrames = Math.round(Math.max(2.5, sub.length / 12) * fps);
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sub)}&tl=en&client=tw-ob`;
          
          const start = currentSubStart;
          currentSubStart += subFrames;

          return (
            <Sequence key={i} from={start} durationInFrames={subFrames}>
              <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "100px" }}>
                <FadeInWord text={sub} />
              </AbsoluteFill>
              <Audio src={ttsUrl} />
            </Sequence>
          );
        });
      })()}
    </AbsoluteFill>
  );
};
