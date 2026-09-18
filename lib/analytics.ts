import type { TypeCode } from "@/lib/type-codes";

/**
 * GA4 のイベント送信（仕様書 3-7）
 *
 * gtag は app/components/analytics/GoogleAnalytics.tsx が読み込む。
 * 測定 ID がない環境や読み込み前は window.gtag がないので、何もしない。
 * 回答内容と各軸の割合は送らない。引数の型で、送れる値を型コードと決まった文字列だけに絞っている。
 */

/** 共有・保存の対象（content_type）。romance は脈あり度チェックの共有で、item_id は相手のタイプ（脈あり度の数字は送らない） */
export type ShareContentType = "result" | "bingo" | "romance";

/** リンクを共有した経路（ShareOnX と ShareLink の分岐） */
export type ShareMethod = "x" | "share_sheet" | "clipboard";

/** 画像保存の経路（ShareImageButton の分岐） */
export type SaveImageMethod = "share_sheet" | "download" | "long_press";

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params: Record<string, string>) => void;
  }
}

function send(eventName: string, params: Record<string, string>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  // page_location を指定しないと、gtag はそのときの URL をそのまま送る。結果ページの URL には
  // 各軸の割合（?p=）が入るので、PageView と同じくクエリを外した URL を明示する
  // （プライバシーポリシーの「結果ページの URL に入る割合も、Google に送る前に取り除きます」）
  const pageLocation = `${window.location.origin}${window.location.pathname}`;
  window.gtag("event", eventName, { ...params, page_location: pageLocation });
}

/** 自己診断か相手診断で、結果ページへ遷移する直前に送る */
export function trackDiagnosisComplete(type: TypeCode, mode: "self" | "target"): void {
  send("diagnosis_complete", { type, mode });
}

/** リンクの共有（X への投稿、端末の共有シート、URL の複製）を行ったときに送る */
export function trackShare(method: ShareMethod, contentType: ShareContentType, itemId: TypeCode): void {
  send("share", { method, content_type: contentType, item_id: itemId });
}

/** 共有シートかダウンロードが成功したとき、または長押しの案内を表示したときに送る */
export function trackSaveImage(method: SaveImageMethod, contentType: ShareContentType, itemId: TypeCode): void {
  send("save_image", { method, content_type: contentType, item_id: itemId });
}
