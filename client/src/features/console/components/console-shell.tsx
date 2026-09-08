"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ConsoleFooter } from "@/features/console/components/console-footer";
import { ConsoleHeader } from "@/features/console/components/console-header";
import { SideNav } from "@/features/route53";
import { useIsDesktop } from "@/shared/hooks/use-is-desktop";
import { InfoCircleOutlineIcon, MenuIcon } from "@/shared/icons";

export type Crumb = {
  label: string;
  href?: string;
};

const NAV_STORAGE_KEY = "aws-console-nav-open";

type ConsoleShellProps = {
  crumbs: Crumb[];
  children: ReactNode;
  showBreadcrumbInfo?: boolean;
  tools?: ReactNode;
};

function readStoredNavOpen(fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  const raw = window.sessionStorage.getItem(NAV_STORAGE_KEY);
  if (raw === "1") return true;
  if (raw === "0") return false;
  return fallback;
}

export function ConsoleShell({
  crumbs,
  children,
  showBreadcrumbInfo = false,
  tools,
}: ConsoleShellProps) {
  const isDesktop = useIsDesktop();
  const [navOpen, setNavOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setNavOpen(isDesktop ? readStoredNavOpen(true) : false);
    setReady(true);
  }, [isDesktop]);

  useEffect(() => {
    if (!ready || !isDesktop) return;
    window.sessionStorage.setItem(NAV_STORAGE_KEY, navOpen ? "1" : "0");
  }, [navOpen, ready, isDesktop]);

  useEffect(() => {
    if (!navOpen || isDesktop) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setNavOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [navOpen, isDesktop]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <ConsoleHeader />

      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-breadcrumb px-2 sm:gap-3 sm:px-3">
        <button
          type="button"
          aria-label={navOpen ? "Close side navigation" : "Open side navigation"}
          onClick={() => setNavOpen((open) => !open)}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground hover:text-aws-blue"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <nav
          aria-label="Breadcrumbs"
          className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden text-[13px] sm:gap-1.5 sm:text-[15px]"
        >
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const hideOnMobile = index === 0 && crumbs.length > 2;
            return (
              <span
                key={`${crumb.label}-${index}`}
                className={`flex min-w-0 items-center gap-1 sm:gap-1.5 ${
                  hideOnMobile ? "hidden sm:flex" : ""
                }`}
              >
                {index > 0 && (
                  <span
                    className={`shrink-0 text-muted ${
                      index === 1 && crumbs.length > 2 ? "hidden sm:inline" : ""
                    }`}
                  >
                    &gt;
                  </span>
                )}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="truncate text-aws-blue underline underline-offset-2"
                  >
                    {crumb.label}
                  </Link>
                ) : isLast ? (
                  <span className="truncate font-bold text-muted">
                    {crumb.label}
                  </span>
                ) : (
                  <span className="truncate text-aws-blue underline underline-offset-2">
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
        <div className="shrink-0">{tools}</div>
        {!tools && showBreadcrumbInfo ? (
          <button
            type="button"
            aria-label="Info"
            className="mr-0.5 hidden h-8 w-8 items-center justify-center rounded-full bg-breadcrumb text-muted-3 hover:text-muted-2 sm:mr-1 sm:flex"
          >
            <InfoCircleOutlineIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="relative flex min-h-0 flex-1">
        {navOpen ? (
          <>
            {!isDesktop ? (
              <button
                type="button"
                aria-label="Close navigation overlay"
                className="absolute inset-0 z-40 bg-black/50"
                onClick={() => setNavOpen(false)}
              />
            ) : null}
            <div
              className={
                isDesktop
                  ? "relative z-0 h-full shrink-0"
                  : "absolute inset-y-0 left-0 z-50 h-full shadow-xl"
              }
            >
              <SideNav onClose={() => setNavOpen(false)} />
            </div>
          </>
        ) : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
      </div>

      <ConsoleFooter />
    </div>
  );
}
