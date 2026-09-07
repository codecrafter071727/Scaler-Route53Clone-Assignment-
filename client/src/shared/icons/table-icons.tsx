import type { IconProps } from "./types";

export function RefreshIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13 8a5 5 0 1 1-1.3-3.4M13 3v3.2H9.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SortIcon({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 10 6" fill="currentColor" aria-hidden>
      <path d="M0 0h10L5 6 0 0z" />
    </svg>
  );
}

/** Right split-panel / tools drawer toggle (AWS console style). */
export function SplitPanelIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect
        x="1.75"
        y="2.75"
        width="12.5"
        height="10.5"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.25 3.5h4.25c.414 0 .75.336.75.75v7.5a.75.75 0 0 1-.75.75H9.25V3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
