import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Google Cloud Shell のプロキシ経由アクセスを許可
  allowedDevOrigins: [
    "*.cloudshell.dev",
    "*.cs-asia-east1-vger.cloudshell.dev",
    "8080-cs-a923a7da-7c76-4628-b714-95c654175abb.cs-asia-east1-vger.cloudshell.dev",
    "*.googleusercontent.com",
  ],

  // Turbopack を明示的に有効化（Next.js 16 デフォルト）
  turbopack: {},

  // 実行時に画像を作るルートは、readFile で読むフォントと切り詰め版のキャラクター画像を出力に含める（仕様書 4-2、output.md）。
  // キーはルートのパスを picomatch で照合するので、[ ] をエスケープする
  outputFileTracingIncludes: {
    // ビンゴカード画像（仕様書 4-5）
    "/\\[lang\\]/bingo/\\[type\\]/card/\\[mask\\]": ["./assets/fonts/**/*", "./assets/characters/trimmed/**/*"],
  },
};

export default nextConfig;
