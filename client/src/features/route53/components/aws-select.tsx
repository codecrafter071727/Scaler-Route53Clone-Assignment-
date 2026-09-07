"use client";

import { useEffect, useRef, useState } from "react";
import { CaretDown } from "@/shared/icons";

type Option = { value: string; label: string };

type Props = {
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  "aria-label": string;
};

export function AwsSelect({
  value,
  options,
  onChange,
  "aria-label": ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 w-full items-center justify-between gap-2 rounded-[8px] border bg-white px-3 text-left text-[14px] leading-5 text-[#0f141a] ${
          open ? "border-[#006ce0]" : "border-[#7d8998]"
        }`}
      >
        <span className="truncate">{selected?.label}</span>
        <CaretDown
          className={`h-3 w-3 shrink-0 text-[#006ce0] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-[8px] border border-[#d5dbdb] bg-white py-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} className="border-b border-[#e9ebed] last:border-b-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-[14px] leading-5 text-[#0f141a] hover:bg-[#f2f8fd] ${
                    isSelected ? "outline outline-2 outline-[#006ce0] -outline-offset-2" : ""
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected ? (
                    <svg
                      className="h-4 w-4 shrink-0 text-[#006ce0]"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M3.5 8.2 6.4 11l6.1-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
