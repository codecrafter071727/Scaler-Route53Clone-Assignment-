"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ConsoleShell, type Crumb } from "@/features/console";
import { getHostedZone } from "@/features/route53/api/hosted-zones-api";
import { HostedZonesTools } from "@/features/route53/components/hosted-zones-tools";
import { DetailsPanelProvider } from "@/features/route53/context/details-panel-context";
import {
  sectionLabelForPath,
  titleForPath,
} from "@/features/route53/data/nav-data";

type Props = {
  children: ReactNode;
};

function crumbsForPath(
  pathname: string,
  domainName?: string,
): {
  crumbs: Crumb[];
  showBreadcrumbInfo: boolean;
  showSplitTools: boolean;
} {
  if (pathname.startsWith("/hostedzones/create")) {
    return {
      showBreadcrumbInfo: true,
      showSplitTools: false,
      crumbs: [
        { label: "Route 53", href: "/hostedzones" },
        { label: "Hosted zones", href: "/hostedzones" },
        { label: "Create hosted zone" },
      ],
    };
  }

  const createRecordMatch = pathname.match(
    /^\/hostedzones\/(\d+)\/create-record\/?$/,
  );
  if (createRecordMatch) {
    const zoneId = createRecordMatch[1];
    return {
      showBreadcrumbInfo: true,
      showSplitTools: false,
      crumbs: [
        { label: "Route 53", href: "/hostedzones" },
        { label: "Hosted zones", href: "/hostedzones" },
        {
          label: domainName || "Hosted zone",
          href: `/hostedzones/${zoneId}`,
        },
        { label: "Create record" },
      ],
    };
  }

  const editMatch = pathname.match(/^\/hostedzones\/(\d+)\/edit\/?$/);
  if (editMatch) {
    const zoneId = editMatch[1];
    return {
      showBreadcrumbInfo: true,
      showSplitTools: false,
      crumbs: [
        { label: "Route 53", href: "/hostedzones" },
        { label: "Hosted zones", href: "/hostedzones" },
        {
          label: domainName || "Hosted zone",
          href: `/hostedzones/${zoneId}`,
        },
        { label: "Edit" },
      ],
    };
  }

  const detailMatch = pathname.match(/^\/hostedzones\/(\d+)\/?$/);
  if (detailMatch) {
    return {
      showBreadcrumbInfo: false,
      showSplitTools: false,
      crumbs: [
        { label: "Route 53", href: "/hostedzones" },
        { label: "Hosted zones", href: "/hostedzones" },
        { label: domainName || "Hosted zone" },
      ],
    };
  }

  if (pathname === "/hostedzones" || pathname === "/hostedzones/") {
    return {
      showBreadcrumbInfo: false,
      showSplitTools: true,
      crumbs: [
        { label: "Route 53", href: "/hostedzones" },
        { label: "Hosted zones" },
      ],
    };
  }

  const pageTitle = titleForPath(pathname);
  if (pageTitle) {
    const section = sectionLabelForPath(pathname);
    const crumbs: Crumb[] = [{ label: "Route 53", href: "/hostedzones" }];
    if (section) crumbs.push({ label: section });
    crumbs.push({ label: pageTitle });
    return {
      showBreadcrumbInfo: true,
      showSplitTools: false,
      crumbs,
    };
  }

  return {
    showBreadcrumbInfo: false,
    showSplitTools: false,
    crumbs: [{ label: "Route 53", href: "/hostedzones" }],
  };
}

/** Persistent shell — header, footer, sidebar stay mounted across page changes. */
export function HostedZonesShell({ children }: Props) {
  const pathname = usePathname() || "/hostedzones";
  const [domainName, setDomainName] = useState("");

  useEffect(() => {
    const match = pathname.match(
      /^\/hostedzones\/(\d+)(?:\/(?:create-record|edit))?\/?$/,
    );
    if (!match) {
      setDomainName("");
      return;
    }
    const zoneId = Number(match[1]);
    let active = true;
    getHostedZone(zoneId)
      .then((zone) => {
        if (active) setDomainName(zone.domain_name);
      })
      .catch(() => {
        if (active) setDomainName("");
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  const { crumbs, showBreadcrumbInfo, showSplitTools } = crumbsForPath(
    pathname,
    domainName,
  );

  return (
    <DetailsPanelProvider>
      <ConsoleShell
        crumbs={crumbs}
        showBreadcrumbInfo={showBreadcrumbInfo}
        tools={showSplitTools ? <HostedZonesTools /> : undefined}
      >
        {children}
      </ConsoleShell>
    </DetailsPanelProvider>
  );
}
