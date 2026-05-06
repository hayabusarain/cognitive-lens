import type { Metadata } from "next";
import "./globals.css";
import CookieConsentBanner from "@/app/components/CookieConsentBanner";
import Footer from "@/app/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";

import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://cognitive-lens.com"
  ),
  title: "CognitiveLens (コグニティブレンズ) | 16タイプ別 恋愛・対人課題解決プラットフォーム",
  description: "CognitiveLens (コグニティブレンズ) は、MBTIなど16の認知機能モデルを用いて、恋愛やコミュニケーションのすれ違いを最適化・解剖する次世代の診断プラットフォームです。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7201202773518258" />
        <meta name="google-site-verification" content="02VLoI4MqeIcdR9cY5RqXokNW1jGqKaevkoERxU5yXU" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7201202773518258"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <CookieConsentBanner />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
