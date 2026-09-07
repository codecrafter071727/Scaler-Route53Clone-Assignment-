import type { IconProps } from "./types";

export function InfoCircleIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 4.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Zm.1 2.5h1.3v4.5h-1.3V7.25Z" />
    </svg>
  );
}

export function InfoCircleOutlineIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="6.1" fill="white" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8" cy="5" r="1" fill="currentColor" />
      <rect x="7.1" y="6.85" width="1.8" height="4.4" rx="0.5" fill="currentColor" />
    </svg>
  );
}

export function CloseIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
