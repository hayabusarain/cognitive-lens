import type { Ref } from "react";
import { ArrowLeft } from "lucide-react";
import type { TypeCode } from "@/lib/type-codes";
import { Button } from "@/app/components/ui/Button";
import { TypeCard } from "@/app/components/type/TypeCard";

/**
 * 相手診断で、判定不能の軸があるときの画面（仕様書 2-3）
 *   candidates …… 判定不能が1〜2軸。候補の2タイプか4タイプをカードで並べ、各結果ページ（from=target）へリンクする
 *   retry ……… 判定不能が3軸以上。候補を出さず、「わからない」と答えた設問の答え直しへ案内する
 */
interface TargetOutcomeProps {
  kind: "candidates" | "retry";
  /** 候補の型コード（candidates のとき2つか4つ） */
  types: readonly TypeCode[];
  /** 候補のリンク先 */
  hrefOf: (type: TypeCode) => string;
  /** カードの一行説明 */
  taglines: Readonly<Record<TypeCode, string>>;
  /** 判定不能の軸で「わからない」と答えた設問の数 */
  unknownCount: number;
  onRevise: () => void;
  onBack: () => void;
  onReset: () => void;
  headingRef: Ref<HTMLHeadingElement>;
}

export function TargetOutcome({ kind, types, hrefOf, taglines, unknownCount, onRevise, onBack, onReset, headingRef }: TargetOutcomeProps) {
  const reviseButton = (
    <Button
      variant={kind === "retry" ? "primary" : "secondary"}
      size="lg"
      meta={`${unknownCount}問`}
      onClick={onRevise}
      className="w-full"
    >
      「わからない」の設問を答え直す
    </Button>
  );

  return (
    <section aria-labelledby="outcome-title">
      {kind === "candidates" ? (
        <>
          <h2 ref={headingRef} id="outcome-title" tabIndex={-1} className="palt text-phrase text-h2 font-black">
            候補は{types.length}タイプです
          </h2>
          <p className="text-phrase mt-2">
            答えから決めきれない部分があったため、近いタイプを{types.length}つ並べました。
            {types.length === 2 ? "読み比べて、あの人に近いほうを選んでください。" : "読み比べて、あの人に近いものを選んでください。"}
          </p>
          <ul className={`mt-5 grid grid-cols-2 gap-3 ${types.length === 4 ? "sm:grid-cols-4" : ""}`}>
            {types.map((type) => (
              <li key={type}>
                <TypeCard
                  type={type}
                  href={hrefOf(type)}
                  description={taglines[type]}
                  imageLoading="eager"
                  imageSizes={types.length === 4 ? "(min-width: 640px) 150px, 50vw" : "(min-width: 640px) 290px, 50vw"}
                />
              </li>
            ))}
          </ul>
          <p className="text-phrase mt-8 text-note text-muted">「わからない」の{unknownCount}問に答えると、候補を絞り込めます。</p>
          <div className="mt-3">{reviseButton}</div>
        </>
      ) : (
        <>
          <h2 ref={headingRef} id="outcome-title" tabIndex={-1} className="palt text-phrase text-h2 font-black">
            まだタイプを絞り込めません
          </h2>
          <p className="text-phrase mt-2">
            「わからない」と答えた設問が{unknownCount}問あり、候補を出せませんでした。あの人の様子を思い出して、答えられる設問だけでも選び直してください。
          </p>
          <div className="mt-6">{reviseButton}</div>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={onBack}>
          <span className="inline-flex items-center gap-1.5">
            <ArrowLeft aria-hidden="true" className="size-4" />
            戻る
          </span>
        </Button>
        <Button variant="secondary" onClick={onReset}>
          最初からやり直す
        </Button>
      </div>
    </section>
  );
}
