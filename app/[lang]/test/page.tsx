import type { Metadata } from "next";
import { ITEMS, TIEBREAKERS } from "@/lib/diagnosis/items";
import { BASE_OPEN_GRAPH, canonical } from "@/lib/site";
import { Heading } from "@/app/components/ui/Heading";
import { DiagnosisFlow } from "../_diagnosis/DiagnosisFlow";

/**
 * 自己診断 /ja/test（仕様書 2-1、3-5）
 * 静的に生成し、設問データを HTML に含める（最初の描画は1問目）。進行はクライアントの DiagnosisFlow。
 */
const TITLE = "16タイプ診断（無料・24問）";
const DESCRIPTION = "24問に6段階で答えると、16タイプのうち近いタイプと、4つの軸の割合がわかります。登録なしで、無料で診断できます。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical("/ja/test"),
  openGraph: { ...BASE_OPEN_GRAPH, title: TITLE, description: DESCRIPTION, url: "/ja/test" },
};

export default function TestPage() {
  return (
    <main className="mx-auto w-full max-w-[37.5rem] px-4 pb-12 pt-2">
      <Heading level={1}>16タイプ診断</Heading>
      <p className="mt-1 text-note text-muted">ふだんの自分に近いものを、直感で選んでください。</p>
      <div className="mt-5">
        <DiagnosisFlow mode="self" items={ITEMS} tiebreakers={TIEBREAKERS} />
      </div>
    </main>
  );
}
