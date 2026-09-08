import { routes } from "@/features/route53/lib/routes";

export type NavLink = {
  label: string;
  href?: string;
  badge?: "New";
  external?: boolean;
};

export type NavSection = {
  title: string;
  items: NavLink[];
};

export const topLinks: NavLink[] = [
  { label: "Dashboard", href: routes.dashboard },
  { label: "Hosted zones", href: routes.hostedZones },
  { label: "Health checks", href: routes.healthChecks },
  { label: "Profiles", href: routes.profiles },
];

export const navSections: NavSection[] = [
  {
    title: "Global Resolver",
    items: [
      {
        label: "Global resolvers",
        href: routes.globalResolvers,
        badge: "New",
      },
      {
        label: "Shared DNS views",
        href: routes.sharedDnsViews,
        badge: "New",
      },
    ],
  },
  {
    title: "VPC Resolver",
    items: [
      { label: "VPCs", href: routes.vpcs },
      { label: "Inbound endpoints", href: routes.inboundEndpoints },
      { label: "Outbound endpoints", href: routes.outboundEndpoints },
      { label: "Rules", href: routes.rules },
      { label: "Query logging", href: routes.queryLogging },
      { label: "Outposts", href: routes.outposts },
    ],
  },
  {
    title: "Domains",
    items: [
      { label: "Registered domains", href: routes.registeredDomains },
      { label: "Requests", href: routes.domainRequests },
    ],
  },
  {
    title: "IP-based routing",
    items: [{ label: "CIDR collections", href: routes.cidrCollections }],
  },
  {
    title: "Traffic flow",
    items: [
      { label: "Traffic policies", href: routes.trafficPolicies },
      { label: "Policy records", href: routes.policyRecords },
    ],
  },
];

export const footerLinks: NavLink[] = [
  { label: "DNS Firewall", href: "https://aws.amazon.com/route53/resolver/dns-firewall/", external: true },
  {
    label: "Application Recovery Controller",
    href: "https://aws.amazon.com/r53recovery/",
    external: true,
  },
];

export const tableColumns = [
  "Hosted zone name",
  "Type",
  "Created by",
  "Record count",
  "Description",
  "Hosted zone ID",
] as const;

/** Flat map of path → display title for Coming soon pages. */
export function titleForPath(pathname: string): string | null {
  const path = pathname.replace(/\/$/, "") || "/";
  for (const link of topLinks) {
    if (link.href === path) return link.label;
  }
  for (const section of navSections) {
    for (const item of section.items) {
      if (item.href === path) return item.label;
    }
  }
  return null;
}

export function sectionLabelForPath(pathname: string): string | null {
  const path = pathname.replace(/\/$/, "") || "/";
  for (const section of navSections) {
    for (const item of section.items) {
      if (item.href === path) return section.title;
    }
  }
  return null;
}
