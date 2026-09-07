"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ConsoleShell, type Crumb } from "@/features/console";

type Props = {
  children: ReactNode;
};

function crumbsForPath(pathname: string): {
  crumbs: Crumb[];
  showBreadcrumbInfo: boolean;
} {
  if (pathname.startsWith("/hostedzones/create")) {
    return {
      showBreadcrumbInfo: true,
      crumbs: [
        { label: "Route 53", href: "/hostedzones" },
        { label: "Hosted zones", href: "/hostedzones" },
        { label: "Create hosted zone" },
      ],
    };
  }

  return {
    showBreadcrumbInfo: false,
    crumbs: [
      { label: "Route 53", href: "/hostedzones" },
      { label: "Hosted zones" },
    ],
  };
}

/** Persistent shell — header, footer, sidebar stay mounted across page changes. */
export function HostedZonesShell({ children }: Props) {
  const pathname = usePathname() || "/hostedzones";
  const { crumbs, showBreadcrumbInfo } = crumbsForPath(pathname);

  return (
    <ConsoleShell crumbs={crumbs} showBreadcrumbInfo={showBreadcrumbInfo}>
      {children}
    </ConsoleShell>
  );
}
