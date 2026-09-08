import { CaretDown } from "@/shared/icons";

export function RecordsFilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-border-strong bg-surface px-3 text-[14px] font-bold text-foreground"
    >
      {label}
      <CaretDown className="h-3 w-3 text-aws-blue" />
    </button>
  );
}

export function RecordsOutlineBtn({
  children,
  disabled,
  onClick,
}: {
  children: string;
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

export function RecordsPrimaryBtn({
  children,
  onClick,
}: {
  children: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 items-center rounded-[20px] border-2 border-aws-orange bg-aws-orange px-5 text-[14px] font-[700] leading-none text-on-orange hover:border-aws-orange-hover hover:bg-aws-orange-hover"
    >
      {children}
    </button>
  );
}
