"use client";

import { CloseIcon } from "@/shared/icons";

type Props = {
  message: string;
  onDismiss: () => void;
};

export function RecordDeletedFlash({ message, onDismiss }: Props) {
  return (
    <div
      role="status"
      className="mb-4 flex items-start gap-3 rounded-lg border border-[#1d8102] bg-[#f2f8f0] px-4 py-3 text-[#0f141a] dark:border-[#69ae34] dark:bg-[#1b3a1b] dark:text-white"
    >
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-[#1d8102] dark:text-[#69ae34]"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M5.2 8.1 7.1 10l3.7-4.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="min-w-0 flex-1 text-[14px] font-bold leading-5 text-inherit">
        {message}
      </p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#545b64] hover:bg-black/5 hover:text-[#0f141a] dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
