import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Video,
  Img,
  Sequence,
  staticFile
} from "remotion";

export interface AestheticPOVProps {
  mbtiType: string;
  title: string;
  texts: string[];
  backgroundUrl?: string; // Optional URL for background video or image
  lang?: string;
}

export const AestheticPOVVideo: React.FC<AestheticPOVProps> = ({
  mbtiType,
  title,
  texts,
  backgroundUrl,
  lang = "ja"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Layout timing config
  // Each text will be shown for 3 seconds (90 frames) + 0.5 sec gap
  const TEXT_DURATION = 3.0 * fps;
  const GAP_DURATION = 0.5 * fps;
  const SEQUENCE_DURATION = TEXT_DURATION + GAP_DURATION;

  // Title fades in for 2 seconds, stays for 1, fades out for 1
  const titleOpacity = interpolate(frame, [0, 30, 90, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isVideo = backgroundUrl?.endsWith(".mp4") || backgroundUrl?.endsWith(".webm");

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      {/* Layer 1: Background Video or Image */}
      {backgroundUrl ? (
        <AbsoluteFill>
          {isVideo ? (
            <Video src={backgroundUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted loop />
          ) : (
            <Img src={backgroundUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </AbsoluteFill>
      ) : null}

      {/* Layer 2: Dark Gradient Overlay */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.8) 50%, rgba(5,5,5,0.95) 100%)",
        }}
      />

      {/* Layer 3: Noise Texture Overlay */}
      <AbsoluteFill
        style={{
          backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')",
          opacity: 0.08,
          mixBlendMode: "overlay",
        }}
      />

      {/* Layer 4: Cinematic Text */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        
        {/* Title Sequence */}
        <Sequence from={0} durationInFrames={120}>
          <div style={{
            opacity: titleOpacity,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "280px 80px 400px 80px"
          }}>
            <h2 style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "64px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.1em",
              marginBottom: "20px"
            }}>
              POV: {mbtiType}
            </h2>
            <p style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: "36px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.05em",
              textAlign: "center"
            }}>
              {title}
            </p>
          </div>
        </Sequence>

        {/* Monologue Texts Sequence */}
        {texts.map((text, i) => {
          const startFrame = 120 + i * SEQUENCE_DURATION;
          return (
            <Sequence key={i} from={startFrame} durationInFrames={TEXT_DURATION}>
              <FadeText text={text} />
            </Sequence>
          );
        })}

        {/* Outro Sequence */}
        <Sequence from={120 + texts.length * SEQUENCE_DURATION} durationInFrames={150}>
          <Outro mbtiType={mbtiType} lang={lang} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Sub-component for Outro
const Outro: React.FC<{ mbtiType: string; lang?: string }> = ({ mbtiType, lang = "ja" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in for 30 frames, stay, fade out for 15 frames
  const opacity = interpolate(
    frame,
    [0, 30, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle zoom in
  const scale = interpolate(frame, [0, durationInFrames], [0.95, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headingText = lang === "en" ? `The truth behind ${mbtiType}'s "fatal bug"` : `${mbtiType}の「致命的バグ」の正体`;
  const btnText = lang === "en" ? `Explained at the link in bio (CognitiveLens)` : `プロフのリンク（CognitiveLens）で解説中`;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", opacity, transform: `scale(${scale})`, padding: "280px 80px 400px 80px" }}>
      <Img 
        src={staticFile(`characters/${mbtiType}.png`)} 
        style={{ width: "350px", height: "350px", objectFit: "contain", marginBottom: "40px", filter: "drop-shadow(0 0 30px rgba(255,255,255,0.2))" }} 
      />
      
      <p style={{
        fontFamily: lang === "en" ? "sans-serif" : "'Noto Serif JP', serif",
        fontSize: lang === "en" ? "28px" : "36px",
        color: "rgba(255,255,255,0.9)",
        letterSpacing: "0.1em",
        marginBottom: "20px",
        textAlign: "center"
      }}>
        {headingText}
      </p>

      <div style={{
        background: "linear-gradient(90deg, rgba(168,85,247,0.3) 0%, rgba(6,182,212,0.3) 100%)",
        padding: "15px 40px",
        borderRadius: "50px",
        border: "1px solid rgba(255,255,255,0.2)"
      }}>
        <p style={{
          fontFamily: "sans-serif",
          fontSize: lang === "en" ? "22px" : "28px",
          fontWeight: "bold",
          color: "white",
          letterSpacing: "0.05em",
        }}>
          {btnText}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Sub-component for individual text fade
const FadeText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in for 0.5 seconds, stay, fade out for 0.5 seconds
  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Subtle upward drift for cinematic feel
  const translateY = interpolate(
    frame,
    [0, durationInFrames],
    [20, -10],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "280px 80px 400px 80px" }}>
      <p style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: "'Noto Serif JP', serif",
        fontSize: "46px",
        fontWeight: 400,
        color: "rgba(255,255,255,0.95)",
        lineHeight: 1.6,
        textAlign: "center",
        textShadow: "0 4px 24px rgba(0,0,0,0.8)",
        letterSpacing: "0.05em",
        whiteSpace: "pre-wrap"
      }}>
        {text}
      </p>
    </AbsoluteFill>
  );
};
