"use client";

import { InfoCircleOutlineIcon, SplitPanelIcon } from "@/shared/icons";
import { useDetailsPanel } from "@/features/route53/context/details-panel-context";

/** Breadcrumb-bar tools: blue split-panel toggle + info (AWS console). */
export function HostedZonesTools() {
  const { detailsOpen, toggleDetails } = useDetailsPanel();

  return (
    <div className="mr-1 flex items-center gap-1.5">
      <button
        type="button"
        aria-label={detailsOpen ? "Close split panel" : "Open split panel"}
        aria-pressed={detailsOpen}
        title="Open split panel"
        onClick={toggleDetails}
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          detailsOpen
            ? "bg-[#006ce0] text-white"
            : "bg-transparent text-[#424650] hover:bg-[#f2f3f3]"
        }`}
      >
        <SplitPanelIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Info"
        title="Info"
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#424650] hover:bg-[#f2f3f3]"
      >
        <InfoCircleOutlineIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
