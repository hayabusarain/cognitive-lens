import type { Metadata } from "next";
import { TARGET_ITEMS, TARGET_TIEBREAKERS } from "@/lib/target/items";
import { TYPE_TAGLINES } from "@/lib/type-content";
import { BASE_OPEN_GRAPH, canonical } from "@/lib/site";
import { Heading } from "@/app/components/ui/Heading";
import { DiagnosisFlow } from "../_diagnosis/DiagnosisFlow";

/**
 * 相手診断 /ja/target-diagnosis（仕様書 2-3、3-5）
 * 静的に生成し、設問データを HTML に含める（最初の描画は1問目）。進行はクライアントの DiagnosisFlow。
 * 候補のカードに添える一行説明は、16タイプの文章全体をクライアントへ送らないよう、ここで短文だけを渡す。
 */
const TITLE = "気になる相手の性格タイプ診断（24問）";
const DESCRIPTION =
  "好きな人や友達など、気になる相手の様子を思い出して24問に答えると、16タイプのどれに近いかがわかります。判断できない設問は「わからない」を選べます。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonical("/ja/target-diagnosis"),
  openGraph: { ...BASE_OPEN_GRAPH, title: TITLE, description: DESCRIPTION, url: "/ja/target-diagnosis" },
};

export default function TargetDiagnosisPage() {
  return (
    <main className="mx-auto w-full max-w-[37.5rem] px-4 pb-12 pt-2">
      <Heading level={1}>気になる相手の16タイプ診断</Heading>
      <p className="mt-1 text-note text-muted">「あの人」の最近の様子を思い出して選んでください。</p>
      <div className="mt-5">
        <DiagnosisFlow mode="target" items={TARGET_ITEMS} tiebreakers={TARGET_TIEBREAKERS} taglines={TYPE_TAGLINES} />
      </div>
    </main>
  );
}
