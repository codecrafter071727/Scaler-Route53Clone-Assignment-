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
