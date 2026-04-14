import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { TYPE_INFO, DEFAULT_TYPE } from "@/lib/type-info";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type") ?? "INTP";
    const typeKey = typeParam.toUpperCase().slice(0, 4);
    const info = TYPE_INFO[typeKey] ?? DEFAULT_TYPE;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${info.colorFrom} 0%, ${info.colorTo} 100%)`,
            padding: "60px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Brand badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#94a3b8",
              borderRadius: "100px",
              padding: "8px 20px",
              marginBottom: "32px",
            }}
          >
            <span style={{ color: "#1e293b", fontSize: "14px", letterSpacing: "4px", fontWeight: 600 }}>
              COGNITIVELENS — PROFILING
            </span>
          </div>

          {/* Emoji */}
          <div style={{ fontSize: "72px", marginBottom: "16px", display: "flex" }}>
            {info.emoji}
          </div>

          {/* Type code */}
          <div
            style={{
              fontSize: "120px",
              fontWeight: 900,
              color: "white",
              letterSpacing: "12px",
              lineHeight: 1,
              marginBottom: "12px",
              display: "flex",
            }}
          >
            {typeKey}
          </div>

          {/* Type name */}
          <div
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "20px",
              display: "flex",
            }}
          >
            {info.name}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "#64748b",
              borderRadius: "2px",
              marginBottom: "20px",
              display: "flex",
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: "20px",
              color: "#475569",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.6,
              display: "flex",
            }}
          >
            {info.tagline}
          </div>

          {/* Bottom label */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#64748b",
              fontSize: "14px",
              letterSpacing: "2px",
            }}
          >
            深層心理プロファイリング結果
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    console.error(e);
    return new Response("OGP画像の生成に失敗しました", { status: 500 });
  }
}
