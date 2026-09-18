import type { Metadata } from "next";
import { ButtonLink } from "@/app/components/ui/Button";
import { Heading } from "@/app/components/ui/Heading";

// title は app/layout.tsx の template で「… | CognitiveLens」になる
export const metadata: Metadata = {
  title: "ページが見つかりません",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-prose flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-h1 text-muted">404</p>
      <Heading level={1} className="mt-2">
        ページが見つかりません
      </Heading>
      <p className="mt-3 text-muted">URL が間違っているか、ページが移動・削除されています。</p>
      <ButtonLink href="/ja" className="mt-8">
        トップへ戻る
      </ButtonLink>
    </main>
  );
}
