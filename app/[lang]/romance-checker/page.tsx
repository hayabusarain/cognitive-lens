import { Metadata } from "next";
import RomanceCheckerClient from "./RomanceCheckerClient";

export const metadata: Metadata = {
  title: "脈あり・恋愛逆引きチェッカー | CognitiveLens",
  description: "気になる相手の行動から、MBTIタイプと脈あり度を逆算・判定します。",
};

export default async function RomanceCheckerPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <RomanceCheckerClient lang={lang} />;
}
