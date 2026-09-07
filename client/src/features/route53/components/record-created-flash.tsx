"use client";

import { CloseIcon } from "@/shared/icons";

type Props = {
  recordName: string;
  onDismiss: () => void;
};

export function RecordCreatedFlash({ recordName, onDismiss }: Props) {
  return (
    <div
      role="status"
      className="mb-4 flex items-start gap-3 rounded-lg bg-aws-blue px-4 py-3 text-white"
    >
      <svg
        className="mt-0.5 h-[18px] w-[18px] shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8" cy="5.1" r="1" fill="currentColor" />
        <rect x="7.2" y="7" width="1.6" height="4.2" rx="0.4" fill="currentColor" />
      </svg>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold leading-5">
          Record for {recordName} was successfully created.
        </p>
        <p className="mt-0.5 text-[14px] font-normal leading-5">
          Route 53 propagates your changes to all of the Route 53 authoritative
          DNS servers within 60 seconds. Use &apos;View status&apos; button to
          check propagation status.
        </p>
      </div>
      <div className="flex shrink-0 items-start gap-1 pt-0.5">
        <button
          type="button"
          className="inline-flex h-8 items-center rounded-[20px] border border-white bg-transparent px-4 text-[14px] font-bold leading-none text-white hover:bg-white/10"
        >
          View status
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/10"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
