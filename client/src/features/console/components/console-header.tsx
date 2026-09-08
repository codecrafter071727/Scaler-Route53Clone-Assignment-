"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BellIcon,
  GridIcon,
  HelpIcon,
  SearchIcon,
  SearchPrefsIcon,
  SettingsIcon,
  TerminalIcon,
} from "@/shared/icons";
import { useTheme, type Theme } from "@/features/theme";
import { AccountMenu } from "./account-menu";

export function ConsoleHeader() {
  return (
    <header className="flex h-11 shrink-0 items-center gap-1 border-b border-header-search-border bg-chrome px-2 text-[13px] text-header-fg sm:gap-2 sm:px-3">
      <span
        role="img"
        aria-label="AWS"
        className="inline-block h-5 w-8 shrink-0 bg-white sm:h-6 sm:w-11"
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
        className="hidden h-8 w-8 items-center justify-center rounded text-header-fg hover:bg-white/10 sm:flex"
        aria-label="Services"
      >
        <GridIcon className="h-[18px] w-[18px]" />
      </button>

      <div className="relative ml-0.5 flex h-8 min-w-0 max-w-[640px] flex-1 items-center sm:ml-1">
        <SearchIcon className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#9ca3af]" />
        <input
          type="search"
          placeholder="Search"
          className="h-8 w-full rounded-xl border border-[#545b64] bg-[#0f141a] py-0 pl-9 pr-20 text-[13px] text-white outline-none placeholder:italic placeholder:text-[#9ca3af] focus:border-[#539fe5] sm:pr-[5.5rem]"
        />
        <div className="pointer-events-none absolute right-2.5 hidden items-center gap-2 text-[12px] text-[#9ca3af] sm:flex">
          <span>[Alt+S]</span>
          <SearchPrefsIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        <div className="hidden items-center gap-0.5 md:flex">
          <IconBtn label="CloudShell">
            <TerminalIcon />
          </IconBtn>
          <IconBtn label="Notifications">
            <BellIcon />
          </IconBtn>
          <IconBtn label="Support">
            <HelpIcon />
          </IconBtn>
        </div>
        <SettingsMenu />
        <button
          type="button"
          className="ml-0.5 hidden h-8 items-center gap-1 rounded px-2 hover:bg-white/10 lg:flex"
        >
          <span>Global</span>
          <Caret />
        </button>
        <AccountMenu />
      </div>
    </header>
  );
}

function SettingsMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(next: Theme) {
    setTheme(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Settings"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10"
      >
        <SettingsIcon />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Settings"
          className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-md border border-border bg-card py-1 text-[13px] text-foreground shadow-lg"
        >
          <div className="border-b border-border px-3 py-2 text-[12px] font-bold text-muted">
            Appearance
          </div>
          <ThemeOption
            label="Light"
            selected={theme === "light"}
            onSelect={() => pick("light")}
          />
          <ThemeOption
            label="Dark"
            selected={theme === "dark"}
            onSelect={() => pick("dark")}
          />
        </div>
      ) : null}
    </div>
  );
}

function ThemeOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-table-hover ${
        selected ? "font-bold text-aws-blue" : "text-foreground"
      }`}
    >
      <span>{label}</span>
      {selected ? <span aria-hidden>✓</span> : null}
    </button>
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
