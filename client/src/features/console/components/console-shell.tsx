"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ConsoleFooter } from "@/features/console/components/console-footer";
import { ConsoleHeader } from "@/features/console/components/console-header";
import { SideNav } from "@/features/route53";
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
}: ConsoleShellProps) {
  const [navOpen, setNavOpen] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setNavOpen(readStoredNavOpen(true));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.sessionStorage.setItem(NAV_STORAGE_KEY, navOpen ? "1" : "0");
  }, [navOpen, ready]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#fcfcfd]">
      <ConsoleHeader />

      <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-[#d5dbdb] bg-white px-3">
        <button
          type="button"
          aria-label={navOpen ? "Close side navigation" : "Open side navigation"}
          onClick={() => setNavOpen((open) => !open)}
          className="flex h-8 w-8 items-center justify-center text-[#0f141a] hover:text-[#006ce0]"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <nav aria-label="Breadcrumbs" className="flex min-w-0 flex-1 items-center gap-1.5 text-[15px]">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-[#656871]">&gt;</span>}
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="text-[#006ce0] underline underline-offset-2">
                    {crumb.label}
                  </Link>
                ) : isLast ? (
                  <span className="font-bold text-[#656871]">{crumb.label}</span>
                ) : (
                  <span className="text-[#006ce0] underline underline-offset-2">{crumb.label}</span>
                )}
              </span>
            );
          })}
        </nav>
        {showBreadcrumbInfo && (
          <button
            type="button"
            aria-label="Info"
            className="mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#687078] hover:text-[#545b64]"
          >
            <InfoCircleOutlineIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {navOpen && <SideNav onClose={() => setNavOpen(false)} />}
        {children}
      </div>

      <ConsoleFooter />
    </div>
  );
}
