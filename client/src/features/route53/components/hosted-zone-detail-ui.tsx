import type { ReactNode } from "react";

export function DetailTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-2 text-[14px] font-bold leading-5 ${
        active
          ? "border-aws-blue text-aws-blue"
          : "border-transparent text-muted-2 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-[14px] font-bold text-foreground">{label}</div>
      <div className="break-all text-[14px] font-normal text-foreground">
        {value}
      </div>
    </div>
  );
}

export function DetailOutlineBtn({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 items-center rounded-[20px] border-2 border-aws-blue bg-surface px-4 text-[14px] font-[700] leading-none text-aws-blue hover:bg-info disabled:cursor-not-allowed disabled:border-disabled-border disabled:text-muted-2 disabled:hover:bg-surface"
    >
      {children}
    </button>
  );
}

export function DetailCaretIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3 w-3 shrink-0 text-foreground transition-transform ${
        open ? "rotate-90" : ""
      }`}
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3 1.5 7.5 5 3 8.5V1.5Z" />
    </svg>
  );
}
