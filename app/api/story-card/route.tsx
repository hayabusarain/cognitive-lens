import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getTypeInfo, getDefaultType, getArticleData } from "@/lib/data-provider";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type") ?? "INTJ";
    const lang = searchParams.get("lang") ?? "ja";
    const TYPE_INFO_MAP = getTypeInfo(lang);
    const ARTICLE_DATA_MAP = getArticleData(lang);
    const typeKey = typeParam.toUpperCase().slice(0, 4);
    const info = TYPE_INFO_MAP[typeKey] ?? getDefaultType(lang);
    const article = ARTICLE_DATA_MAP[typeKey];

    // toxicなテキストを抽出
    const toxicText = article?.weakness || (lang === "en" ? "A ball of pride who keeps looking away from their weaknesses." : "自分の弱点から目を背け続ける、プライドの塊。");

    return new ImageResponse(
      (
        <div
          style={{
            width: "1080px",
            height: "1920px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#0f172a", // ダークテーマベース
            padding: "80px",
            fontFamily: "sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 背景の装飾 */}
          <div
            style={{
              position: "absolute",
              top: "-200px",
              right: "-200px",
              width: "1000px",
              height: "1000px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${info.colorFrom}40 0%, transparent 70%)`,
              filter: "blur(80px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-200px",
              left: "-200px",
              width: "800px",
              height: "800px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${info.colorTo}40 0%, transparent 70%)`,
              filter: "blur(80px)",
            }}
          />

          {/* ヘッダー */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                padding: "16px 40px",
                borderRadius: "100px",
              }}
            >
              <span style={{ color: "white", fontSize: "28px", fontWeight: "bold", letterSpacing: "4px" }}>
                COGNITIVELENS — PROFILING
              </span>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              width: "100%",
            }}
          >
            {/* キャラクター/絵文字 */}
            {info.imageUrl ? (
              <img
                src={`${new URL(request.url).origin}${info.imageUrl}`}
                alt={typeKey}
                width={360}
                height={360}
                style={{
                  marginBottom: "40px",
                  borderRadius: "50%",
                  border: `8px solid ${info.colorFrom}`,
                  boxShadow: `0 0 60px ${info.colorFrom}80`,
                  objectFit: "cover",
                }}
              />
            ) : (
              <div style={{ fontSize: "180px", marginBottom: "40px", display: "flex" }}>
                {info.emoji}
              </div>
            )}

            {/* ラベル */}
            <div
              style={{
                display: "flex",
                color: info.colorTo,
                fontSize: "36px",
                fontWeight: "bold",
                letterSpacing: "8px",
                marginBottom: "20px",
              }}
            >
              【{lang === "en" ? "Your Toxic Nature" : "あなたのヤバい本性"}】
            </div>

            {/* タイプ名 */}
            <div
              style={{
                display: "flex",
                fontSize: "200px",
                fontWeight: 900,
                color: "white",
                letterSpacing: "12px",
                lineHeight: 1,
                marginBottom: "20px",
              }}
            >
              {typeKey}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "64px",
                fontWeight: 700,
                color: "#e2e8f0",
                marginBottom: "80px",
              }}
            >
              {info.name}
            </div>

            {/* 毒舌テキストボックス */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(0, 0, 0, 0.6)",
                border: `4px solid ${info.colorFrom}`,
                borderRadius: "40px",
                padding: "60px 50px",
                width: "90%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "36px",
                  color: "white",
                  lineHeight: 1.6,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {toxicText}
              </div>
            </div>
          </div>

          {/* フッター */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "24px",
                color: "#94a3b8",
                letterSpacing: "4px",
                marginBottom: "16px",
              }}
            >
              {lang === "en" ? "Wanna expose your own type? 👇" : "自分のタイプも暴いてみる？👇"}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "32px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              🔍 CognitiveLens
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1920,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate story card image", { status: 500 });
  }
}
