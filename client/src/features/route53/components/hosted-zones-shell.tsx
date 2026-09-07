"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ConsoleShell, type Crumb } from "@/features/console";
import { getHostedZone } from "@/features/route53/api/hosted-zones-api";
import { HostedZonesTools } from "@/features/route53/components/hosted-zones-tools";
import { DetailsPanelProvider } from "@/features/route53/context/details-panel-context";

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

  return {
    showBreadcrumbInfo: false,
    showSplitTools: true,
    crumbs: [
      { label: "Route 53", href: "/hostedzones" },
      { label: "Hosted zones" },
    ],
  };
}

/** Persistent shell — header, footer, sidebar stay mounted across page changes. */
export function HostedZonesShell({ children }: Props) {
  const pathname = usePathname() || "/hostedzones";
  const [domainName, setDomainName] = useState("");

  useEffect(() => {
    const match = pathname.match(/^\/hostedzones\/(\d+)(?:\/create-record)?\/?$/);
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
