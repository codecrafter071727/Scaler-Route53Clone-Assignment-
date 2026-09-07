import type { ReactNode } from "react";
import Link from "next/link";

export function PrimaryBtn({
  children,
  href,
}: {
  children: ReactNode;
  href?: string;
}) {
  const className =
    "inline-flex h-8 items-center rounded-[20px] border-2 border-aws-orange bg-aws-orange px-5 text-[14px] font-[700] leading-none text-on-orange hover:border-aws-orange-hover hover:bg-aws-orange-hover";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={className}>
      {children}
    </button>
  );
}

export function ActionBtn({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 items-center rounded-[20px] border-2 border-aws-blue bg-surface px-4 text-[14px] font-[700] leading-none text-aws-blue hover:bg-info"
    >
      {children}
    </button>
  );
}

export function DisabledBtn({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex h-8 items-center rounded-[20px] border-2 border-disabled-border bg-surface px-4 text-[14px] font-[700] leading-none text-muted-2 opacity-100 disabled:opacity-100"
    >
      {children}
    </button>
  );
}
