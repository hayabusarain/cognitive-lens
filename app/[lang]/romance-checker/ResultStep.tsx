import type { RefObject } from "react";
import type { TypeCode } from "@/lib/type-codes";
import { TYPE_NAMES } from "@/lib/type-names";
import { ROMANCE_STAGES, romanceScore, stageIndex } from "@/lib/romance/items";
import { romanceShareText, type RomanceAiResult } from "@/lib/romance/ai-text";
import { SITE_URL } from "@/lib/site";
import { typeColorStyle } from "@/lib/type-display";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Heading, Latin } from "@/app/components/ui/Heading";
import { Notice } from "@/app/components/ui/Notice";
import { TypeFrame } from "@/app/components/type/TypeFrame";
import { CharacterFigure } from "@/app/components/type/CharacterFigure";
import { ShareOnX } from "@/app/components/share/ShareOnX";
import { ShareLink } from "@/app/components/share/ShareLink";

/**
 * 脈あり度チェックの3段目：脈あり度・段階・AI 文・次の操作。
 * 脈あり度と段階はその場で計算して出し、AI 文の欄だけが読み込み中・表示・失敗で切り替わる
 */

export type AiState =
  | { status: "idle" }
  /** 「はい」が0件で、取りに行かない */
  | { status: "none" }
  | { status: "loading" }
  | { status: "done"; result: RomanceAiResult };

const AI_LABELS = [
  { key: "feelings", label: "相手の気持ち" },
  { key: "nextAction", label: "次にできること" },
  { key: "caution", label: "今は控えたいこと" },
] as const;

interface ResultStepProps {
  headingRef: RefObject<HTMLHeadingElement | null>;
  type: TypeCode;
  answers: readonly boolean[];
  ai: AiState;
  onRetry: () => void;
  /** 最後の設問へ戻る。押し間違えた1問だけを直せるようにする */
  onBack: () => void;
  onReset: () => void;
}

function AiText({ ai, onRetry }: { ai: AiState; onRetry: () => void }) {
  if (ai.status === "idle") return null;

  if (ai.status === "none") {
    return <p className="mt-3 text-muted">「はい」と答えた行動がなかったので、AIのコメントはありません。</p>;
  }

  if (ai.status === "loading") {
    return (
      <div className="mt-3">
        <p role="status" className="text-muted">
          答えた行動から、AIがコメントを書いています…
        </p>
        <div aria-hidden="true" className="mt-3 grid gap-3">
          {AI_LABELS.map(({ key }) => (
            <div key={key} className="rounded-panel bg-surface p-4">
              <div className="h-3 w-24 rounded-full bg-track motion-safe:animate-pulse" />
              <div className="mt-3 h-3 w-full rounded-full bg-surface-2 motion-safe:animate-pulse" />
              <div className="mt-2 h-3 w-4/5 rounded-full bg-surface-2 motion-safe:animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { result } = ai;
  if (result.kind === "error") {
    return result.reason === "rate_limit" ? (
      <Notice title="今はAIのコメントを出せません" className="mt-3">
        短い時間に続けて使われたため、読み込みを止めています。10分ほどたってから、もう一度お試しください。
      </Notice>
    ) : (
      <Notice title="AIのコメントを読み込めませんでした" className="mt-3">
        <p>通信が不安定なときや、混み合っているときに起こります。</p>
        <Button variant="secondary" onClick={onRetry} className="mt-3">
          もう一度読み込む
        </Button>
      </Notice>
    );
  }

  return (
    <>
      <dl className="mt-3 grid gap-3">
        {AI_LABELS.map(({ key, label }) =>
          result.text[key] ? (
            <div key={key} className="rounded-panel border-t-4 border-t-type bg-surface p-4">
              <dt className="text-label font-bold text-type">{label}</dt>
              <dd className="mt-1">{result.text[key]}</dd>
            </div>
          ) : null,
        )}
      </dl>
      <p className="mt-3 text-note text-muted">AIが、「はい」と答えた行動をもとに書いた目安です。</p>
    </>
  );
}

export function ResultStep({ headingRef, type, answers, ai, onRetry, onBack, onReset }: ResultStepProps) {
  const total = answers.length;
  const yes = answers.filter(Boolean).length;
  const score = romanceScore(yes, total);
  const stage = stageIndex(score);
  const name = TYPE_NAMES[type];

  return (
    <section aria-labelledby="result-heading" className="mt-4" style={typeColorStyle(type)}>
      <h2 id="result-heading" ref={headingRef} tabIndex={-1} className="palt text-phrase text-h2 font-black">
        <Latin>{type}</Latin>（{name}）の脈あり度
      </h2>

      <div className="mt-4 grid items-start gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-10">
        <TypeFrame size="md" innerClassName="p-4 md:p-5">
          <div className="flex items-end justify-between gap-3">
            <p className="leading-none">
              <span className="block text-label font-bold text-muted">
                「はい」{yes}問 / {total}問
              </span>
              <span className="mt-2 inline-block font-display text-hero text-type">{score}</span>
              <span className="ml-1 font-display text-h2">%</span>
            </p>
            <div aria-hidden="true" className="w-20 shrink-0 md:w-24">
              <CharacterFigure type={type} sizes="96px" />
            </div>
          </div>

          {/* 4段階のどこにいるか。今の段階までを塗る */}
          <div aria-hidden="true" className="mt-4 grid grid-cols-4 gap-1">
            {ROMANCE_STAGES.map((s, i) => (
              <span key={s.title} className={`h-2.5 rounded-full ${i <= stage ? "bg-type" : "bg-track"}`} />
            ))}
          </div>
          <p className="mt-4 text-label font-bold text-muted">段階{stage + 1}（4段階中）</p>
          <p className="palt text-phrase text-h2 font-black">{ROMANCE_STAGES[stage].title}</p>
          <p className="mt-2">{ROMANCE_STAGES[stage].body}</p>
        </TypeFrame>

        <div>
          <section aria-labelledby="ai-heading" aria-busy={ai.status === "loading"}>
            <Heading level={3} id="ai-heading">
              答えた行動から読み取れること
            </Heading>
            <AiText ai={ai} onRetry={onRetry} />
          </section>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <ShareOnX
              text={romanceShareText(score, total)}
              url={`${SITE_URL}/ja/romance-checker`}
              contentType="romance"
              itemId={type}
              label="Xに投稿"
              variant="primary"
            />
            <ShareLink
              title={`${type}（${name}）の脈あり度`}
              text={romanceShareText(score, total).replace("\n{url}", "")}
              url={`${SITE_URL}/ja/romance-checker`}
              contentType="romance"
              itemId={type}
            />
            <Button variant="secondary" onClick={onBack} className="sm:col-span-2">
              最後の設問に戻る
            </Button>
          </div>
          <p className="mt-2 text-center">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-11 cursor-pointer items-center px-2 text-note text-muted underline underline-offset-4 hover:text-fg"
            >
              最初からやり直す
            </button>
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            <li>
              <Card href={`/ja/article/${type}`} className="h-full">
                <span className="block font-bold">{type}の恋愛コラム</span>
                <span className="text-phrase block text-note text-muted">{name}が好きな人に見せる態度と、脈ありサイン</span>
              </Card>
            </li>
            <li>
              <Card href={`/ja/result/${type}`} className="h-full">
                <span className="block font-bold">{type}の特徴</span>
                <span className="text-phrase block text-note text-muted">恋愛以外の性格と、相性・適職</span>
              </Card>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
