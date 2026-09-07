import type { IconProps } from "./types";

export function InfoCircleIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 4.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Zm.1 2.5h1.3v4.5h-1.3V7.25Z" />
    </svg>
  );
}
