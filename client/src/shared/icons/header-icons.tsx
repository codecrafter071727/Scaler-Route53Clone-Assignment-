import type { IconProps } from "./types";

export function SearchIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M11.5 11.5 14 14M7 12A5 5 0 1 1 7 2a5 5 0 0 1 0 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** AWS unified-search / preferences glyph (hexagon + target). */
export function SearchPrefsIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.4 13.2 4.4v7.2L8 14.6 2.8 11.6V4.4L8 1.4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2.4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function GridIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="3" cy="3" r="1.3" />
      <circle cx="8" cy="3" r="1.3" />
      <circle cx="13" cy="3" r="1.3" />
      <circle cx="3" cy="8" r="1.3" />
      <circle cx="8" cy="8" r="1.3" />
      <circle cx="13" cy="8" r="1.3" />
      <circle cx="3" cy="13" r="1.3" />
      <circle cx="8" cy="13" r="1.3" />
      <circle cx="13" cy="13" r="1.3" />
    </svg>
  );
}

export function BellIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1.5a4 4 0 0 1 4 4v2.2l1.2 2.3H2.8L4 7.7V5.5a4 4 0 0 1 4-4zm-2 10.5a2 2 0 0 0 4 0H6z" />
    </svg>
  );
}

export function HelpIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6.4 6.2a1.7 1.7 0 1 1 2.3 1.6c-.5.3-.9.6-.9 1.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.4" r="0.7" />
    </svg>
  );
}

export function SettingsIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z"
        stroke="currentColor"
        strokeWidth="2.1"
      />
      <path
        d="M19.4 13.5a7.8 7.8 0 0 0 .06-1.5 7.8 7.8 0 0 0-.06-1.5l2.04-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.4.96a7.3 7.3 0 0 0-2.6-1.5l-.36-2.54a.5.5 0 0 0-.5-.43h-3.84a.5.5 0 0 0-.5.43l-.36 2.54a7.3 7.3 0 0 0-2.6 1.5l-2.4-.96a.5.5 0 0 0-.6.22L2.4 8.28a.5.5 0 0 0 .12.64L4.56 10.5a7.8 7.8 0 0 0-.06 1.5c0 .5.02 1 .06 1.5L2.52 15.08a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.4-.96a7.3 7.3 0 0 0 2.6 1.5l.36 2.54a.5.5 0 0 0 .5.43h3.84a.5.5 0 0 0 .5-.43l.36-2.54a7.3 7.3 0 0 0 2.6-1.5l2.4.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64L19.4 13.5Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TerminalIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="m4 6 2.2 2L4 10M7.5 10.5H12"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
