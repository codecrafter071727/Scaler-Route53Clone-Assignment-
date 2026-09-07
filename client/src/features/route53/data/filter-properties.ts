export type FilterPropertyKey =
  | "domain_name"
  | "zone_type"
  | "accelerated_recovery"
  | "created_by"
  | "record_count"
  | "description"
  | "hosted_zone_id";

export type FilterProperty = {
  key: FilterPropertyKey;
  label: string;
  /** Operator shown in tokens / value mode (`:` or `=`). */
  operator: ":" | "=";
};

export const FILTER_PROPERTIES: FilterProperty[] = [
  { key: "domain_name", label: "Hosted zone name", operator: ":" },
  { key: "zone_type", label: "Type", operator: ":" },
  { key: "accelerated_recovery", label: "Accelerated recovery", operator: ":" },
  { key: "created_by", label: "Created by", operator: ":" },
  { key: "record_count", label: "Record count", operator: "=" },
  { key: "description", label: "Description", operator: ":" },
  { key: "hosted_zone_id", label: "Hosted zone ID", operator: ":" },
];

export type FilterToken = {
  id: string;
  propertyKey: FilterPropertyKey;
  propertyLabel: string;
  operator: ":" | "=";
  value: string;
};

export type HostedZoneListFilters = {
  domain_name?: string;
  zone_type?: string;
  created_by?: string;
  record_count?: string;
  description?: string;
  hosted_zone_id?: string;
  q?: string;
};

export function tokensToApiFilters(tokens: FilterToken[]): HostedZoneListFilters {
  const filters: HostedZoneListFilters = {};
  for (const token of tokens) {
    if (token.propertyKey === "accelerated_recovery") continue;
    if (token.propertyKey === "domain_name") filters.domain_name = token.value;
    else if (token.propertyKey === "zone_type") filters.zone_type = token.value;
    else if (token.propertyKey === "created_by") filters.created_by = token.value;
    else if (token.propertyKey === "record_count")
      filters.record_count = token.value;
    else if (token.propertyKey === "description")
      filters.description = token.value;
    else if (token.propertyKey === "hosted_zone_id")
      filters.hosted_zone_id = token.value;
  }
  return filters;
}
