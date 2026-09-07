import type { IconProps } from "./types";

export function MenuIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <rect x="2" y="3.4" width="12" height="1.75" rx="0.55" />
      <rect x="2" y="7.125" width="12" height="1.75" rx="0.55" />
      <rect x="2" y="10.85" width="12" height="1.75" rx="0.55" />
    </svg>
  );
}

export function ChevronLeft({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M10.5 3.5 6 8l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CaretDown({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M2 5h12L8 12.5 2 5z" />
    </svg>
  );
}

export function ExternalLinkIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M14 8.25V13.5A1.5 1.5 0 0 1 12.5 15h-10A1.5 1.5 0 0 1 1 13.5v-10A1.5 1.5 0 0 1 2.5 2H7.75v1.5H2.5v10h10V8.25H14ZM15 1v5.5l-1.93-1.93L8.75 8.89 7.11 7.25l4.32-4.32L9.5 1H15Z" />
    </svg>
  );
}

export function ChevronTiny({ className = "h-3 w-3" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
