"use client";

import { useState } from "react";
import { AUTH_COPY } from "@/features/auth/data/auth-copy";

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="mt-0.5 shrink-0 text-[#006ce0]">
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12V7M8 6V4" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function AuthBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="mx-auto mb-8 w-full max-w-[940px] px-4">
      <div className="relative flex flex-wrap items-start gap-3 rounded-xl border-[1.6px] border-[#006ce0] bg-[#f0fbff] px-4 py-3.5 pr-10">
        <InfoIcon />
        <div className="min-w-0 flex-1 basis-[min(100%,280px)]">
          <p className="font-amazon-bold text-[14px] leading-5 text-[#0f141a]">
            {AUTH_COPY.bannerTitle}
          </p>
          <p className="text-[14px] leading-5 text-[#0f141a]">
            Starting in mid-2026,{" "}
            <a href="https://aws.amazon.com/" className="text-[#006ce0] underline">
              Amazon Web Services (AWS)
            </a>{" "}
            is introducing updates to the AWS sign-in and sign-up pages. These updates include new
            options for how you create and access your account.{" "}
            <a
              href="https://aws.amazon.com/blogs/security/updates-to-your-aws-sign-in-experience"
              className="text-[#006ce0] underline"
              target="_blank"
              rel="noreferrer"
            >
              {AUTH_COPY.learnMore}
            </a>
          </p>
        </div>
        <button
          type="button"
          className="h-fit shrink-0 whitespace-nowrap rounded-full border border-[#424650] bg-transparent px-5 py-1 font-amazon-bold text-[14px] text-[#424650]"
        >
          {AUTH_COPY.bannerCta}
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setOpen(false)}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center text-[#424650]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="m2 1.71 12 12M2 13.71l12-12" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
