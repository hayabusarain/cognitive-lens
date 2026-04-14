"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AdSenseUnitProps {
  id: string;
  slotId?: string;
  format?: string;
  fullWidth?: boolean;
}

export default function AdSenseUnit({
  id,
  slotId = "1234567890", // 仮のSlotID
  format = "auto",
  fullWidth = true,
}: AdSenseUnitProps) {
  const pathname = usePathname();
  const adRef = useRef<HTMLModElement>(null);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (isDev) return;

    // ReactのStrictMode等による重複Pushを防止
    if (adRef.current && adRef.current.getAttribute("data-adsbygoogle-status") !== "done") {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense push error:", error);
      }
    }
  }, [pathname, isDev]);

  if (isDev) {
    return (
      <div
        id={id}
        className="w-full min-h-[90px] bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs tracking-widest uppercase my-6 mx-auto max-w-full rounded-xl"
      >
        ダミー広告枠: {id}
      </div>
    );
  }

  return (
    <div id={id} className="w-full my-6 text-center mx-auto overflow-hidden">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-0000000000000000" // 審査後または申請時に書き換える
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={fullWidth ? "true" : "false"}
      />
    </div>
  );
}
