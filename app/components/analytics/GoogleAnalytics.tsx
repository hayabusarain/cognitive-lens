import Script from "next/script";

/**
 * GA4 の読み込み（仕様書 3-7）
 *
 * 環境変数 NEXT_PUBLIC_GA_MEASUREMENT_ID（G- で始まる測定 ID）があるときだけ gtag.js を読む。
 * ないとき、または形が違うときは何も出さない。値はビルド時に埋め込まれる（environment-variables.md）。
 * 配信はプライバシーポリシーでの公表と同じステップで始める（ステップ 3-19）。それまで本番に値を設定しない。
 * イベントの送信は lib/analytics.ts。ページの遷移は GA4 の拡張計測（履歴の変化）で数える。
 */
export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  // インラインのスクリプトに埋め込むので、測定 ID の形のときだけ使う
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
