import type { ReactNode } from "react";

const FIELD =
  "box-border block w-full min-w-0 rounded-[8px] border border-border-strong bg-input text-[14px] leading-5 text-foreground outline-none placeholder:italic placeholder:text-placeholder focus:border-aws-blue";

export function InfoLink() {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-3 w-px bg-border" aria-hidden />
      <a
        href="#"
        className="text-[12px] font-bold leading-4 text-aws-blue hover:underline hover:text-aws-blue"
      >
        Info
      </a>
    </span>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-0.5 flex items-center gap-2 text-[14px] font-bold leading-5 text-foreground">
      <span>{children}</span>
      <InfoLink />
    </div>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mb-1 text-[14px] leading-5 text-muted-2">{children}</p>;
}

export function TextInput({
  value,
  onChange,
  placeholder,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label": string;
}) {
  return (
    <input
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${FIELD} h-8 px-3`}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  maxLength,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  "aria-label": string;
}) {
  return (
    <textarea
      aria-label={ariaLabel}
      value={value}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className={`${FIELD} h-[80px] resize-y px-3 py-2`}
    />
  );
}
