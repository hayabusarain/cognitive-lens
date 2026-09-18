"use client";

import { Button, ButtonLink } from "@/app/components/ui/Button";
import { Heading } from "@/app/components/ui/Heading";

/**
 * 実行時の例外を受け止める画面（error.md）
 *
 * app/layout.tsx の内側に入るので、ヘッダーとフッターはそのまま出る。
 * エラー境界はクライアントコンポーネントにする決まりで、metadata は書けない。
 * 本番では error.message が伏せられ、digest（サーバー側のログと突き合わせる値）だけが渡る。
 * 押し直しには unstable_retry を使う。reset と違い、中身を取り直してから描き直す。
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-prose flex-col items-center justify-center px-4 text-center">
      <Heading level={1}>うまく表示できませんでした</Heading>
      <p className="mt-3 text-muted">
        通信が途切れたか、一時的な不具合が起きています。読み込み直すと直ることがあります。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => unstable_retry()}>もう一度読み込む</Button>
        <ButtonLink href="/ja" variant="secondary">
          トップへ戻る
        </ButtonLink>
      </div>
      {error.digest && <p className="mt-6 text-note text-muted">エラー番号：{error.digest}</p>}
    </main>
  );
}
