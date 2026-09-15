import type { ReactNode } from "react";

/**
 * 注意書き（docs/design-system.md）
 * 本文の流れの中に置く補足。免責の一言、保存できないときの案内など。
 * 急ぎの警告ではないので role="alert" にはせず、role="note" にする
 */
interface NoticeProps {
  /** 太字の1行目（省略可） */
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Notice({ title, children, className = "" }: NoticeProps) {
  return (
    <div role="note" className={`rounded-panel border-l-4 border-muted bg-surface px-4 py-3 ${className}`}>
      {title && <p className="font-bold">{title}</p>}
      <div className="text-body text-fg/90">{children}</div>
    </div>
  );
}
