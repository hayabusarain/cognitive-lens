import { Metadata } from "next";
import BingoClient from "./BingoClient";

export const metadata: Metadata = {
  title: "偏見だらけのMBTIビンゴ | CognitiveLens",
  description: "あなたのMBTIの「あるある」をビンゴでチェック！SNSにシェアして盛り上がろう。",
};

export default async function BingoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-fuchsia-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="relative z-10">
        <BingoClient lang={lang} />
      </div>
    </div>
  );
}
