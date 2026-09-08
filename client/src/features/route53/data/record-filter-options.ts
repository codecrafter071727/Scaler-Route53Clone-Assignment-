export const RECORD_TYPE_FILTER_OPTIONS = [
  "A",
  "AAAA",
  "CNAME",
  "MX",
  "TXT",
  "PTR",
  "SRV",
  "SPF",
  "NAPTR",
  "CAA",
  "NS",
  "SOA",
  "DS",
  "TLSA",
  "SSHFP",
  "HTTPS",
  "SVCB",
] as const;

export const ROUTING_POLICY_FILTER_OPTIONS = [
  { value: "Simple", label: "Simple" },
  { value: "Weighted", label: "Weighted" },
  { value: "Geolocation", label: "Geolocation" },
  { value: "Latency", label: "Latency" },
  { value: "Failover", label: "Failover" },
  { value: "Multivalue answer", label: "Multivalue answer" },
  { value: "IP-based", label: "IP-based" },
  { value: "Geoproximity", label: "Geoproximity location" },
] as const;

export const ALIAS_FILTER_OPTIONS = [
  { value: "Yes", label: "Alias" },
  { value: "No", label: "Non-alias" },
] as const;

export const TYPE_FACET_OPTIONS = RECORD_TYPE_FILTER_OPTIONS.map((v) => ({
  value: v,
  label: v,
}));

export const ROUTING_FACET_OPTIONS = ROUTING_POLICY_FILTER_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

export const ALIAS_FACET_OPTIONS = ALIAS_FILTER_OPTIONS.map((o) => ({
  value: o.value,
  label: o.label,
}));

export type RecordFilterProperty = {
  key: string;
  label: string;
  operator: ":" | "=";
};

export const RECORD_FILTER_PROPERTIES: RecordFilterProperty[] = [
  { key: "record_name", label: "Record name", operator: ":" },
  { key: "record_type", label: "Type", operator: "=" },
  { key: "routing_policy", label: "Routing policy", operator: "=" },
  { key: "differentiator", label: "Differentiator", operator: ":" },
  { key: "alias", label: "Alias", operator: "=" },
  { key: "value", label: "Value/Route traffic to", operator: ":" },
  { key: "ttl", label: "TTL (seconds)", operator: "=" },
  { key: "health_check_id", label: "Health check ID", operator: ":" },
  {
    key: "evaluate_target_health",
    label: "Evaluate target health",
    operator: "=",
  },
  { key: "record_id", label: "Record ID", operator: ":" },
];

export type RecordFilterToken = {
  id: string;
  propertyKey: string;
  propertyLabel: string;
  operator: ":" | "=";
  value: string;
};

export type RecordListFilters = {
  type?: string;
  routing_policy?: string;
  alias?: string;
  record_name?: string;
  differentiator?: string;
  value?: string;
  ttl?: string;
  health_check_id?: string;
  evaluate_target_health?: string;
  record_id?: string;
  q?: string;
};

export function recordTokensToApiFilters(
  tokens: RecordFilterToken[],
): RecordListFilters {
  const filters: RecordListFilters = {};
  for (const token of tokens) {
    switch (token.propertyKey) {
      case "record_type":
        filters.type = token.value;
        break;
      case "routing_policy":
        filters.routing_policy = token.value;
        break;
      case "alias":
        filters.alias = token.value;
        break;
      case "record_name":
        filters.record_name = token.value;
        break;
      case "differentiator":
        filters.differentiator = token.value;
        break;
      case "value":
        filters.value = token.value;
        break;
      case "ttl":
        filters.ttl = token.value;
        break;
      case "health_check_id":
        filters.health_check_id = token.value;
        break;
      case "evaluate_target_health":
        filters.evaluate_target_health = token.value;
        break;
      case "record_id":
        filters.record_id = token.value;
        break;
    }
  }
  return filters;
}
