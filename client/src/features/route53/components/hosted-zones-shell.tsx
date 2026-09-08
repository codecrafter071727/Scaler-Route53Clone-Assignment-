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
import {
  HOSTED_ZONE_ID_RE,
  routes,
} from "@/features/route53/lib/routes";

type Props = {
  children: ReactNode;
};

const hz = routes.hostedZones.replace(/\//g, "\\/");
const zoneIdCapture = `(${HOSTED_ZONE_ID_RE})`;

function crumbsForPath(
  pathname: string,
  domainName?: string,
): {
  crumbs: Crumb[];
  showBreadcrumbInfo: boolean;
  showSplitTools: boolean;
} {
  if (pathname.startsWith(routes.hostedZonesCreate)) {
    return {
      showBreadcrumbInfo: true,
      showSplitTools: false,
      crumbs: [
        { label: "Route 53", href: routes.hostedZones },
        { label: "Hosted zones", href: routes.hostedZones },
        { label: "Create hosted zone" },
      ],
    };
  }

  const createRecordMatch = pathname.match(
    new RegExp(`^${hz}/${zoneIdCapture}/create-record/?$`),
  );
  if (createRecordMatch) {
    const hostedZoneId = createRecordMatch[1];
    return {
      showBreadcrumbInfo: true,
      showSplitTools: false,
      crumbs: [
        { label: "Route 53", href: routes.hostedZones },
        { label: "Hosted zones", href: routes.hostedZones },
        {
          label: domainName || "Hosted zone",
          href: routes.hostedZone(hostedZoneId),
        },
        { label: "Create record" },
      ],
    };
  }

  const editMatch = pathname.match(
    new RegExp(`^${hz}/${zoneIdCapture}/edit/?$`),
  );
  if (editMatch) {
    const hostedZoneId = editMatch[1];
    return {
      showBreadcrumbInfo: true,
      showSplitTools: false,
      crumbs: [
        { label: "Route 53", href: routes.hostedZones },
        { label: "Hosted zones", href: routes.hostedZones },
        {
          label: domainName || "Hosted zone",
          href: routes.hostedZone(hostedZoneId),
        },
        { label: "Edit" },
      ],
    };
  }

  const detailMatch = pathname.match(
    new RegExp(`^${hz}/${zoneIdCapture}/?$`),
  );
  if (detailMatch) {
    return {
      showBreadcrumbInfo: false,
      showSplitTools: false,
      crumbs: [
        { label: "Route 53", href: routes.hostedZones },
        { label: "Hosted zones", href: routes.hostedZones },
        { label: domainName || "Hosted zone" },
      ],
    };
  }

  if (pathname === routes.hostedZones || pathname === `${routes.hostedZones}/`) {
    return {
      showBreadcrumbInfo: false,
      showSplitTools: true,
      crumbs: [
        { label: "Route 53", href: routes.hostedZones },
        { label: "Hosted zones" },
      ],
    };
  }

  const pageTitle = titleForPath(pathname);
  if (pageTitle) {
    const section = sectionLabelForPath(pathname);
    const crumbs: Crumb[] = [{ label: "Route 53", href: routes.hostedZones }];
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
    crumbs: [{ label: "Route 53", href: routes.hostedZones }],
  };
}

/** Persistent shell — header, footer, sidebar stay mounted across page changes. */
export function HostedZonesShell({ children }: Props) {
  const pathname = usePathname() || routes.hostedZones;
  const [domainName, setDomainName] = useState("");

  useEffect(() => {
    const match = pathname.match(
      new RegExp(`^${hz}/${zoneIdCapture}(?:/(?:create-record|edit))?/?$`),
    );
    if (!match) {
      setDomainName("");
      return;
    }
    const hostedZoneId = match[1];
    let active = true;
    getHostedZone(hostedZoneId)
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
