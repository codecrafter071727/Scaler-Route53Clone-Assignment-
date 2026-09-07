import type { ReactNode } from "react";
import {
  BellIcon,
  GridIcon,
  HelpIcon,
  SearchIcon,
  SettingsIcon,
  TerminalIcon,
} from "@/shared/icons";

export function ConsoleHeader() {
  return (
    <header className="flex h-10 shrink-0 items-center gap-2 bg-[#161d26] px-3 text-[13px] text-[#d1d5db]">
      <span
        role="img"
        aria-label="AWS"
        className="inline-block h-7 w-[52px] shrink-0 bg-white"
        style={{
          WebkitMaskImage: "url(/aws-logo.png)",
          maskImage: "url(/aws-logo.png)",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded text-[#d1d5db] hover:bg-white/10"
        aria-label="Services"
      >
        <GridIcon className="h-[18px] w-[18px]" />
      </button>

      <div className="relative ml-1 flex h-8 min-w-0 flex-1 max-w-[520px] items-center">
        <SearchIcon className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[#9ca3af]" />
        <input
          type="search"
          placeholder="Search"
          className="h-8 w-full rounded border border-[#3f4754] bg-[#0f141a] py-0 pl-8 pr-16 text-[13px] text-white outline-none placeholder:text-[#9ca3af] focus:border-[#539fe5]"
        />
        <span className="pointer-events-none absolute right-2 rounded border border-[#4b5563] px-1.5 py-0.5 text-[11px] text-[#9ca3af]">
          [Alt+S]
        </span>
      </div>

      <div className="ml-auto flex items-center gap-0.5">
        <IconBtn label="CloudShell">
          <TerminalIcon />
        </IconBtn>
        <IconBtn label="Notifications">
          <BellIcon />
        </IconBtn>
        <IconBtn label="Support">
          <HelpIcon />
        </IconBtn>
        <IconBtn label="Settings">
          <SettingsIcon />
        </IconBtn>
        <button
          type="button"
          className="ml-1 flex h-8 items-center gap-1 rounded px-2 hover:bg-white/10"
        >
          <span>Global</span>
          <Caret />
        </button>
        <button
          type="button"
          className="flex h-8 max-w-[280px] items-center gap-1 truncate rounded px-2 hover:bg-white/10"
        >
          <span className="truncate">Anshul bhathija (452857281268)</span>
          <Caret />
        </button>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
    >
      {children}
    </button>
  );
}

function Caret() {
  return (
    <svg className="h-2.5 w-2.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M3 6h10l-5 6z" />
    </svg>
  );
}
