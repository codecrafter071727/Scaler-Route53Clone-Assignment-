import type { IconProps } from "./types";

export function ToolboxIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M5.5 2.5h5v1.5h2.75A1.25 1.25 0 0 1 14.5 5.25v2H9.25v-.75h-2.5v.75H1.5v-2A1.25 1.25 0 0 1 2.75 4H5.5V2.5zm0 1.5v.5h5v-.5h-5zM1.5 8.5h5.25v1h2.5v-1H14.5v4.25A1.25 1.25 0 0 1 13.25 15H2.75A1.25 1.25 0 0 1 1.5 13.75V8.5z" />
    </svg>
  );
}

export function MobileAppIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="4" y="1.5" width="8" height="13" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 12.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M11.2 5.2 13 3.4M13 3.4h-1.6M13 3.4V5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
