import { Metadata } from "next";
import RomanceCheckerClient from "./RomanceCheckerClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Pulse & Romance Reverse Checker | CognitiveLens" : "脈あり・恋愛逆引きチェッカー | CognitiveLens",
    description: lang === "en" ? "Reverse-calculate MBTI type and pulse level from the behavior of your crush." : "気になる相手の行動から、MBTIタイプと脈あり度を逆算・判定します。",
  };
}

export default async function RomanceCheckerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <RomanceCheckerClient lang={lang} />;
}
