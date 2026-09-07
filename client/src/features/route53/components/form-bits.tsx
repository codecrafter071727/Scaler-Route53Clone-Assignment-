import type { ReactNode } from "react";

export function InfoLink() {
  return (
    <a href="#" className="ml-1.5 text-[14px] font-normal leading-5 text-[#006ce0] hover:underline">
      Info
    </a>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-0.5 text-[14px] font-bold leading-5 text-[#0f141a]">
      {children}
      <InfoLink />
    </div>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[14px] leading-5 text-[#545b64]">{children}</p>;
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
      className="h-8 w-full max-w-[480px] rounded-lg border border-[#7d8998] bg-white px-3 text-[14px] text-[#0f141a] outline-none placeholder:italic placeholder:text-[#687078] focus:border-[#006ce0]"
    />
  );
}
