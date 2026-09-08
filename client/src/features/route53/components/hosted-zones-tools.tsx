"use client";

import { InfoCircleOutlineIcon, SplitPanelIcon } from "@/shared/icons";
import { useDetailsPanel } from "@/features/route53/context/details-panel-context";

/** Breadcrumb-bar tools: blue split-panel toggle + info (AWS console). */
export function HostedZonesTools() {
  const { detailsOpen, toggleDetails } = useDetailsPanel();

  return (
    <div className="mr-0.5 flex items-center gap-1 sm:mr-1 sm:gap-1.5">
      <button
        type="button"
        aria-label={detailsOpen ? "Close split panel" : "Open split panel"}
        aria-pressed={detailsOpen}
        title="Open split panel"
        onClick={toggleDetails}
        className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9 ${
          detailsOpen
            ? "bg-aws-blue text-white"
            : "bg-transparent text-sidebar-text hover:bg-surface-muted"
        }`}
      >
        <SplitPanelIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Info"
        title="Info"
        className="hidden h-9 w-9 items-center justify-center rounded-full text-sidebar-text hover:bg-surface-muted sm:flex"
      >
        <InfoCircleOutlineIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
