import type { Metadata } from "next";
import { Suspense } from "react";
import ResultContent from "./ResultContent";
import { getTypeInfo } from "@/lib/data-provider";
import { TYPE_INFO, DEFAULT_TYPE } from "@/lib/type-info";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { type = "INTP" } = await searchParams;
  const typeKey = type.toUpperCase().slice(0, 4);
  const typeInfoMap = getTypeInfo(lang);
  const info = typeInfoMap[typeKey] ?? typeInfoMap["INTP"] ?? DEFAULT_TYPE;
  const ogImageUrl = `/api/og?type=${typeKey}&lang=${lang}`;

  return {
    title: `${typeKey} ${info.name} — 深層心理プロファイリング | CognitiveLens`,
    description: info.tagline,
    openGraph: {
      title: `${typeKey} — ${info.name}`,
      description: info.tagline,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${typeKey} ${info.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${typeKey} — ${info.name}`,
      description: info.tagline,
      images: [ogImageUrl],
    },
  };
}

export default async function ResultPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(20,184,166,0.1)" }}>
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(20,184,166,0.3)", borderTopColor: "#14b8a6" }} />
            </div>
            <p className="text-xs" >プロファイリング処理中...</p>
          </div>
        </div>
      }
    >
      <ResultContent lang={lang} />
    </Suspense>
  );
}
