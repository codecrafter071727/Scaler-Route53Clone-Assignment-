export type NavLink = {
  label: string;
  href?: string;
  active?: boolean;
  badge?: "New";
  external?: boolean;
};

export type NavSection = {
  title: string;
  items: NavLink[];
};

export const topLinks: NavLink[] = [
  { label: "Dashboard" },
  { label: "Hosted zones", href: "/hostedzones", active: true },
  { label: "Health checks" },
  { label: "Profiles" },
];

export const navSections: NavSection[] = [
  {
    title: "Global Resolver",
    items: [
      { label: "Global resolvers", badge: "New" },
      { label: "Shared DNS views", badge: "New" },
    ],
  },
  {
    title: "VPC Resolver",
    items: [
      { label: "VPCs" },
      { label: "Inbound endpoints" },
      { label: "Outbound endpoints" },
      { label: "Rules" },
      { label: "Query logging" },
      { label: "Outposts" },
    ],
  },
  {
    title: "Domains",
    items: [{ label: "Registered domains" }, { label: "Requests" }],
  },
  {
    title: "IP-based routing",
    items: [{ label: "CIDR collections" }],
  },
  {
    title: "Traffic flow",
    items: [{ label: "Traffic policies" }, { label: "Policy records" }],
  },
];

export const footerLinks: NavLink[] = [
  { label: "DNS Firewall", external: true },
  { label: "Application Recovery Controller", external: true },
];

export const tableColumns = [
  "Hosted zone name",
  "Type",
  "Created by",
  "Record count",
  "Description",
  "Hosted zone ID",
] as const;
