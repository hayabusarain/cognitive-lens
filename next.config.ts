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

  // 実行時に画像を作るルートへ、readFile で読む素材を含める（仕様書 4-2「フォント」、output.md の outputFileTracingIncludes）。
  // キーはルートのパスに当てる picomatch の glob（contains 一致）なので、[ ] はエスケープする
  outputFileTracingIncludes: {
    // 9:16 結果画像（share-image と、スコアありの share-image/[scores]）
    "/\\[lang\\]/result/\\[type\\]/share-image": ["./assets/fonts/*.otf", "./assets/characters/trimmed/*.png"],
  },
};

export default nextConfig;
