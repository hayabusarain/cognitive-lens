import type { ReactNode } from "react";

/**
 * 見出し（docs/design-system.md）
 *   level 1 …… ページの見出し（text-h1）
 *   level 2 …… 節の見出し。左にタイプ色の短い棒を付ける（marker={false} で外せる）
 *   level 3 …… カードの中の見出し
 * 外側の余白は持たない。置く側で mt・mb を付ける
 */
interface HeadingProps {
  level: 1 | 2 | 3;
  children: ReactNode;
  id?: string;
  /** level 2 の左の棒 */
  marker?: boolean;
  className?: string;
}

export function Heading({ level, children, id, marker = true, className = "" }: HeadingProps) {
  if (level === 1) {
    return (
      <h1 id={id} className={`palt text-phrase font-black text-h1 ${className}`}>
        {children}
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h2 id={id} className={`palt flex items-center gap-3 font-black text-h2 ${className}`}>
        {marker && <span aria-hidden="true" className="h-[22px] w-2.5 shrink-0 rounded-[3px] bg-type" />}
        <span className="text-phrase min-w-0">{children}</span>
      </h2>
    );
  }
  return (
    <h3 id={id} className={`palt text-phrase font-black text-h3 ${className}`}>
      {children}
    </h3>
  );
}

/** 見出しの上に置く小さなラベル（例：16タイプ性格診断） */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-label font-bold tracking-[0.08em] text-muted ${className}`}>{children}</p>;
}

/** 見出しの中の英数字（型コード・数字）を表示用の書体にする。例：<Latin>16</Latin>タイプ一覧 */
export function Latin({ children }: { children: ReactNode }) {
  return <span className="font-display font-normal tracking-[0.01em]">{children}</span>;
}
