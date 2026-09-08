/** AWS Console–style Route 53 paths. */

export const ROUTE53_BASE = "/route53/v2";

/** Public hosted zone ID segment in URLs (e.g. Z1234567890ABC). */
export const HOSTED_ZONE_ID_RE = "Z[A-Z0-9]+";

export const routes = {
  dashboard: `${ROUTE53_BASE}/dashboard`,
  hostedZones: `${ROUTE53_BASE}/hostedzones`,
  hostedZonesCreate: `${ROUTE53_BASE}/hostedzones/create`,
  hostedZone: (hostedZoneId: string) =>
    `${ROUTE53_BASE}/hostedzones/${encodeURIComponent(hostedZoneId)}`,
  hostedZoneEdit: (hostedZoneId: string) =>
    `${ROUTE53_BASE}/hostedzones/${encodeURIComponent(hostedZoneId)}/edit`,
  hostedZoneCreateRecord: (hostedZoneId: string) =>
    `${ROUTE53_BASE}/hostedzones/${encodeURIComponent(hostedZoneId)}/create-record`,
  healthChecks: `${ROUTE53_BASE}/healthchecks`,
  profiles: `${ROUTE53_BASE}/profiles`,
  globalResolvers: `${ROUTE53_BASE}/globalresolver/global-resolvers`,
  sharedDnsViews: `${ROUTE53_BASE}/globalresolver/shared-dns-views`,
  vpcs: `${ROUTE53_BASE}/vpcresolver/vpcs`,
  inboundEndpoints: `${ROUTE53_BASE}/vpcresolver/inbound-endpoints`,
  outboundEndpoints: `${ROUTE53_BASE}/vpcresolver/outbound-endpoints`,
  rules: `${ROUTE53_BASE}/vpcresolver/rules`,
  queryLogging: `${ROUTE53_BASE}/vpcresolver/query-logging`,
  outposts: `${ROUTE53_BASE}/vpcresolver/outposts`,
  registeredDomains: `${ROUTE53_BASE}/domains/registered-domains`,
  domainRequests: `${ROUTE53_BASE}/domains/requests`,
  cidrCollections: `${ROUTE53_BASE}/ipam/cidr-collections`,
  trafficPolicies: `${ROUTE53_BASE}/trafficpolicy/traffic-policies`,
  policyRecords: `${ROUTE53_BASE}/trafficpolicy/policy-records`,
} as const;

export function isHostedZonesPath(pathname: string): boolean {
  return (
    pathname === routes.hostedZones ||
    pathname.startsWith(`${routes.hostedZones}/`)
  );
}
