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
};

export default nextConfig;
