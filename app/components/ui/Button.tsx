import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * ボタン（docs/design-system.md）
 *   primary …… その場のタイプ色の面（タイプの文脈がなければ明るい面）。1画面に1〜2個まで
 *   secondary … 枠線だけ
 * 押せる高さは md が 52px、lg が 64px。lg は右端に meta（「24問」など）を置ける
 */
export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "lg";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 右端に小さく添える補足（例：24問） */
  meta?: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-type text-ink hover:brightness-110",
  secondary: "border-line bg-transparent text-fg hover:bg-surface",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  md: "min-h-13 px-5 py-2.5 text-body",
  lg: "min-h-16 px-5 py-3 text-lead",
};

/** ボタンの見た目のクラス。部品にできない場所（フォームの送信ボタンなど）で使う */
export function buttonClassName({
  variant = "primary",
  size = "md",
  hasMeta = false,
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  hasMeta?: boolean;
  className?: string;
} = {}): string {
  return [
    "inline-flex items-center gap-2 rounded-panel border-2 font-bold leading-snug no-underline",
    "cursor-pointer select-none motion-safe:transition motion-safe:active:translate-y-0.5",
    "disabled:cursor-not-allowed disabled:opacity-60",
    hasMeta ? "justify-between text-left" : "justify-center text-center",
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className,
  ].join(" ");
}

function Meta({ children }: { children: ReactNode }) {
  return <span className="shrink-0 text-note font-normal opacity-85">{children}</span>;
}

type ButtonLinkProps = ButtonStyleProps &
  Omit<ComponentPropsWithoutRef<"a">, "href"> & {
    href: string;
    /** サイトの外へのリンク。新しいタブで開き、読み上げでもそう伝える */
    external?: boolean;
  };

/** リンクとして動くボタン（ページの移動、外部サイト） */
export function ButtonLink({ href, external = false, variant, size, meta, className, children, ...rest }: ButtonLinkProps) {
  const classes = buttonClassName({ variant, size, hasMeta: meta != null, className });
  const content = (
    <>
      <span>
        {children}
        {external && <span className="sr-only">（新しいタブで開きます）</span>}
      </span>
      {meta != null && <Meta>{meta}</Meta>}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}

type ButtonProps = ButtonStyleProps & ComponentPropsWithoutRef<"button">;

/** その場で処理をするボタン。type の既定は "button" */
export function Button({ variant, size, meta, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClassName({ variant, size, hasMeta: meta != null, className })} {...rest}>
      <span>{children}</span>
      {meta != null && <Meta>{meta}</Meta>}
    </button>
  );
}
