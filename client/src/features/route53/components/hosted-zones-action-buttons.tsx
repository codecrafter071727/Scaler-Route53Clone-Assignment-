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
    "inline-flex h-8 items-center rounded-[20px] border-2 border-[#ff9900] bg-[#ff9900] px-5 text-[14px] font-[700] leading-none text-[#0f141a] hover:border-[#ec7211] hover:bg-[#ec7211]";
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
      className="inline-flex h-8 items-center rounded-[20px] border-2 border-[#006ce0] bg-white px-4 text-[14px] font-[700] leading-none text-[#006ce0] hover:bg-[#f2f8fd]"
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
      className="inline-flex h-8 items-center rounded-[20px] border-2 border-[#aab7b8] bg-white px-4 text-[14px] font-[700] leading-none text-[#545b64] opacity-100 disabled:opacity-100"
    >
      {children}
    </button>
  );
}
