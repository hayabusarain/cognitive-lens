import { notFound } from "next/navigation";

/**
 * 言語の区画のレイアウト
 *
 * サイトは日本語のみ（docs/decisions.md 0章）。lang は ja だけを受け付け、
 * それ以外（/foo、/api/result など）は 404 にする。
 * 静的に生成するページは dynamicParams = false で 404 になるが、
 * 実行時に描画するページ（/[lang]/result）には効かないため、ここでも判定する。
 * /en と /ko の旧 URL は proxy.ts が 301 で /ja へ転送する（lib/redirects.ts の R11）。
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "ja" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== "ja") notFound();
  return children;
}
