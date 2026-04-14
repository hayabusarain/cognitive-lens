import type { Metadata } from "next";
import "./globals.css";
import CookieConsentBanner from "@/app/components/CookieConsentBanner";
import Footer from "@/app/components/layout/Footer";

import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://cognitive-lens.com"
  ),
  title: "CognitiveLens | 対人課題解決プラットフォーム",
  description: "16の認知機能モデルによる対人摩擦の最適化",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7201202773518258"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen antialiased pb-24 md:pb-0">
        {children}
        <CookieConsentBanner />
        <Footer />
      </body>
    </html>
  );
}
