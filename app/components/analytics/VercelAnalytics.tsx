"use client";

import { Analytics } from "@vercel/analytics/react";

/**
 * Vercel Web Analytics の読み込み
 *
 * 既定では、そのときの URL をクエリごと送る。結果ページの URL には各軸の割合（?p=）が入るので、
 * beforeSend でクエリを落としてから送る（GA4 側の PageView・lib/analytics.ts と同じ扱い）。
 * プライバシーポリシーの「回答の内容、4つの軸の割合、脈あり度の数字は送りません」に合わせるため。
 * beforeSend は関数なので、サーバーコンポーネントの app/layout.tsx から直接は渡せない。ここで包む。
 */
export default function VercelAnalytics() {
  return <Analytics beforeSend={(event) => ({ ...event, url: event.url.split("?")[0] })} />;
}
