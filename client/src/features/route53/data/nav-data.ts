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
  { label: "Dashboard", href: "/dashboard" },
  { label: "Hosted zones", href: "/hostedzones" },
  { label: "Health checks", href: "/healthchecks" },
  { label: "Profiles", href: "/profiles" },
];

export const navSections: NavSection[] = [
  {
    title: "Global Resolver",
    items: [
      { label: "Global resolvers", href: "/globalresolver/global-resolvers", badge: "New" },
      { label: "Shared DNS views", href: "/globalresolver/shared-dns-views", badge: "New" },
    ],
  },
  {
    title: "VPC Resolver",
    items: [
      { label: "VPCs", href: "/vpcresolver/vpcs" },
      { label: "Inbound endpoints", href: "/vpcresolver/inbound-endpoints" },
      { label: "Outbound endpoints", href: "/vpcresolver/outbound-endpoints" },
      { label: "Rules", href: "/vpcresolver/rules" },
      { label: "Query logging", href: "/vpcresolver/query-logging" },
      { label: "Outposts", href: "/vpcresolver/outposts" },
    ],
  },
  {
    title: "Domains",
    items: [
      { label: "Registered domains", href: "/domains/registered-domains" },
      { label: "Requests", href: "/domains/requests" },
    ],
  },
  {
    title: "IP-based routing",
    items: [
      { label: "CIDR collections", href: "/ip-based-routing/cidr-collections" },
    ],
  },
  {
    title: "Traffic flow",
    items: [
      { label: "Traffic policies", href: "/traffic-flow/traffic-policies" },
      { label: "Policy records", href: "/traffic-flow/policy-records" },
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
