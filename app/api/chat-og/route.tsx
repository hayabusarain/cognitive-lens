import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

interface ChatMessage {
  speaker: "type1" | "type2";
  message: string;
}

// Satori requires explicit display:flex on every container div
function Bubble({
  msg,
  type1,
  type2,
  showLabel,
}: {
  msg: ChatMessage;
  type1: string;
  type2: string;
  showLabel: boolean;
}) {
  const isRight = msg.speaker === "type2";
  const label = isRight ? type2 : type1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isRight ? "flex-end" : "flex-start",
        marginBottom: "20px",
        width: "100%",
      }}
    >
      {showLabel && (
        <div
          style={{
            display: "flex",
            color: isRight ? "#7c6af7" : "#6b7280",
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "3px",
            marginBottom: "8px",
            paddingLeft: isRight ? "0" : "18px",
            paddingRight: isRight ? "18px" : "0",
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          display: "flex",
          maxWidth: "72%",
          backgroundColor: isRight ? "#4c1d95" : "#1a1a2e",
          borderRadius: isRight ? "28px 28px 6px 28px" : "28px 28px 28px 6px",
          padding: "22px 30px",
          border: isRight ? "1px solid #6d28d9" : "1px solid #27273a",
        }}
      >
        <div
          style={{
            display: "flex",
            color: isRight ? "#e9d5ff" : "#d1d5db",
            fontSize: "30px",
            lineHeight: 1.55,
            fontFamily: "sans-serif",
          }}
        >
          {msg.message}
        </div>
      </div>
    </div>
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type1 = (searchParams.get("type1") ?? "TYPE1").toUpperCase();
    const type2 = (searchParams.get("type2") ?? "TYPE2").toUpperCase();
    const raw = searchParams.get("d") ?? "[]";

    let messages: ChatMessage[] = [];
    try {
      messages = JSON.parse(raw).slice(0, 7);
    } catch {
      messages = [];
    }

    // Track which speaker appeared before to suppress repeated labels
    const seenSpeakers = new Set<string>();
    const labelFlags = messages.map((m) => {
      if (seenSpeakers.has(m.speaker)) return false;
      seenSpeakers.add(m.speaker);
      return true;
    });

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#080810",
            padding: "70px 55px 55px 55px",
            fontFamily: "sans-serif",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "44px",
            }}
          >
            {/* Brand */}
            <div
              style={{
                display: "flex",
                color: "#4ade80",
                fontSize: "22px",
                letterSpacing: "5px",
                fontWeight: 600,
                marginBottom: "28px",
              }}
            >
              COGNITIVELENS
            </div>

            {/* Type vs Type */}
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div
                style={{
                  display: "flex",
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #2d2d4e",
                  borderRadius: "16px",
                  padding: "14px 32px",
                  color: "#9ca3af",
                  fontSize: "36px",
                  fontWeight: 800,
                  letterSpacing: "4px",
                }}
              >
                {type1}
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#374151",
                  fontSize: "32px",
                  fontWeight: 300,
                }}
              >
                ×
              </div>
              <div
                style={{
                  display: "flex",
                  background: "linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)",
                  border: "1px solid #7c3aed",
                  borderRadius: "16px",
                  padding: "14px 32px",
                  color: "#e9d5ff",
                  fontSize: "36px",
                  fontWeight: 800,
                  letterSpacing: "4px",
                }}
              >
                {type2}
              </div>
            </div>

            {/* Subtitle */}
            <div
              style={{
                display: "flex",
                color: "#374151",
                fontSize: "22px",
                letterSpacing: "3px",
                marginTop: "16px",
              }}
            >
              認知機能の断絶 — Cognitive Clash
            </div>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "1px",
                backgroundColor: "#18182e",
                marginTop: "36px",
              }}
            />
          </div>

          {/* ── Chat bubbles ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {messages.map((msg, i) => (
              <Bubble
                key={i}
                msg={msg}
                type1={type1}
                type2={type2}
                showLabel={labelFlags[i]}
              />
            ))}
          </div>

          {/* ── Footer ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid #18182e",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#1f2937",
                fontSize: "20px",
                letterSpacing: "2px",
              }}
            >
              cognitivelens · 深層心理プロファイリング
            </div>
          </div>
        </div>
      ),
      { width: 1080, height: 1920 }
    );
  } catch (e) {
    console.error(e);
    return new Response("画像生成に失敗しました", { status: 500 });
  }
}
