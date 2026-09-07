"use client";

import { AUTH_COPY } from "@/features/auth/data/auth-copy";

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden className="ml-1 inline-block">
      <path d="m4 6 4 5 4-5" fill="currentColor" />
    </svg>
  );
}

export function AuthTopBar() {
  return (
    <div className="absolute right-4 top-5 z-20 flex flex-wrap items-center justify-end gap-1 text-[14px] leading-5 sm:right-8 sm:top-6 sm:gap-2">
      <button
        type="button"
        className="rounded-full px-3 py-1 font-amazon-bold text-aws-blue hover:underline sm:px-4"
      >
        {AUTH_COPY.feedback}
      </button>
      <button
        type="button"
        className="inline-flex items-center rounded-full px-3 py-1 font-amazon-bold text-aws-blue hover:underline sm:px-4"
      >
        {AUTH_COPY.multiSession}
        <ChevronDown />
      </button>
      <button
        type="button"
        className="inline-flex items-center rounded-full px-3 py-1 font-amazon-bold text-aws-blue hover:underline sm:px-4"
      >
        {AUTH_COPY.language}
        <ChevronDown />
      </button>
    </div>
  );
}
