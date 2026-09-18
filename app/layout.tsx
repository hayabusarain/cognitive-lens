import type { Metadata } from "next";
import { Dela_Gothic_One, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/app/components/layout/SiteHeader";
import Footer from "@/app/components/layout/Footer";
import GoogleAnalytics from "@/app/components/analytics/GoogleAnalytics";
import VercelAnalytics from "@/app/components/analytics/VercelAnalytics";
import { BASE_OPEN_GRAPH, SITE_NAME, SITE_URL } from "@/lib/site";

// 書体（SIL Open Font License 1.1。docs/asset-credits.md 3-1）。ビルド時に取得して自サイトから配信する（font.md）
// 型コード・数字・ロゴなど表示用の書体。ウェイトは 400 だけなので、太字を付けない
const delaGothic = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dela-gothic",
});
// 本文と見出し
const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-zen-kaku",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // ページの title は「{title} | CognitiveLens」になる。すでに「| CognitiveLens」を含む値（TypeContent.seo.title など）は title.absolute で渡す
  title: {
    default: `${SITE_NAME} | 16タイプ性格診断`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "24問に答えて、16タイプのどれに近いかと4つの軸の割合を確かめる性格診断。結果はキャラクターのカード画像で保存でき、タイプ別のビンゴや恋愛コラムも読めます。",
  openGraph: BASE_OPEN_GRAPH,
  twitter: { card: "summary_large_image" },
  // Search Console のサイト確認（手書きの <head> から Metadata API へ移した。generate-metadata.md の verification）
  verification: {
    google: "02VLoI4MqeIcdR9cY5RqXokNW1jGqKaevkoERxU5yXU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${delaGothic.variable} ${zenKaku.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <Footer />
        <VercelAnalytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
