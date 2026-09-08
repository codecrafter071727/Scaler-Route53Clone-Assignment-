import { api } from "@/shared/api";
import type { RecordListFilters } from "@/features/route53/data/record-filter-options";
import {
  DEFAULT_PAGE_SIZE,
  type PageParams,
  type Paginated,
} from "@/features/route53/lib/pagination";

const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX;
if (!API_PREFIX) {
  throw new Error("NEXT_PUBLIC_API_PREFIX is not set");
}

export type ZoneType = "public" | "private";

export type HostedZoneListItem = {
  id: number;
  hosted_zone_id: string;
  domain_name: string;
  description: string;
  zone_type: ZoneType;
  record_count: number;
  created_by: string;
};

export type HostedZoneCreatePayload = {
  domain_name: string;
  description: string;
  zone_type: ZoneType;
  vpcs: { region: string; vpc_id: string }[];
  tags: { key: string; value: string }[];
};

export type HostedZoneTag = {
  key: string;
  value: string;
};

export type RecordSet = {
  id: number;
  record_name: string;
  record_type: string;
  routing_policy: string;
  differentiator: string | null;
  alias: boolean;
  value: string[];
  ttl: number;
  health_check_id: string | null;
  evaluate_target_health: boolean;
  record_id: string | null;
};

export type HostedZoneDetail = HostedZoneListItem & {
  user_id: number;
  vpcs: { region: string; vpc_id: string }[];
  tags: HostedZoneTag[];
};

export type HostedZoneListFilters = {
  domain_name?: string;
  zone_type?: string;
  created_by?: string;
  record_count?: string;
  description?: string;
  hosted_zone_id?: string;
  q?: string;
} & PageParams;

export async function listHostedZones(filters: HostedZoneListFilters = {}) {
  const { data } = await api.get<Paginated<HostedZoneListItem>>(
    `${API_PREFIX}/hosted-zones`,
    {
      params: {
        page: filters.page ?? 1,
        page_size: filters.page_size ?? DEFAULT_PAGE_SIZE,
        domain_name: filters.domain_name,
        zone_type: filters.zone_type,
        created_by: filters.created_by,
        record_count: filters.record_count,
        description: filters.description,
        hosted_zone_id: filters.hosted_zone_id,
        q: filters.q,
      },
    },
  );
  return data;
}

export async function listHostedZoneFilterOptions() {
  const { data } = await api.get<Record<string, string[]>>(
    `${API_PREFIX}/hosted-zones/filter-options`,
  );
  return data;
}

export async function listHostedZonePropertyValues(property: string) {
  const options = await listHostedZoneFilterOptions();
  return options[property] ?? [];
}

export async function getHostedZone(hostedZoneId: string) {
  const { data } = await api.get<HostedZoneDetail>(
    `${API_PREFIX}/hosted-zones/${encodeURIComponent(hostedZoneId)}`,
  );
  return data;
}

export async function listHostedZoneTags(hostedZoneId: string) {
  const { data } = await api.get<HostedZoneTag[]>(
    `${API_PREFIX}/hosted-zones/${encodeURIComponent(hostedZoneId)}/tags`,
  );
  return data;
}

export async function listRecordSets(
  hostedZoneId: string,
  filters: RecordListFilters & PageParams = {},
) {
  const { data } = await api.get<Paginated<RecordSet>>(
    `${API_PREFIX}/hosted-zones/${encodeURIComponent(hostedZoneId)}/record-sets`,
    {
      params: {
        ...filters,
        page: filters.page ?? 1,
        page_size: filters.page_size ?? DEFAULT_PAGE_SIZE,
      },
    },
  );
  return data;
}

export async function listRecordSetFilterOptions(hostedZoneId: string) {
  const { data } = await api.get<Record<string, string[]>>(
    `${API_PREFIX}/hosted-zones/${encodeURIComponent(hostedZoneId)}/record-sets/filter-options`,
  );
  return data;
}

export type RecordSetCreatePayload = {
  record_name: string;
  record_type: string;
  routing_policy?: string;
  differentiator?: string | null;
  alias?: boolean;
  value: string[];
  ttl?: number;
  health_check_id?: string | null;
  evaluate_target_health?: boolean;
  record_id?: string | null;
};

export async function createRecordSet(
  hostedZoneId: string,
  payload: RecordSetCreatePayload,
) {
  const { data } = await api.post<RecordSet>(
    `${API_PREFIX}/hosted-zones/${encodeURIComponent(hostedZoneId)}/record-sets`,
    payload,
  );
  return data;
}

export async function deleteRecordSet(
  hostedZoneId: string,
  recordId: number,
) {
  await api.delete(
    `${API_PREFIX}/hosted-zones/${encodeURIComponent(hostedZoneId)}/record-sets/${recordId}`,
  );
}

export type HostedZoneUpdatePayload = {
  description: string;
  vpcs: { region: string; vpc_id: string }[];
  tags: { key: string; value: string }[];
};

export async function updateHostedZone(
  hostedZoneId: string,
  payload: HostedZoneUpdatePayload,
) {
  const { data } = await api.patch<HostedZoneDetail>(
    `${API_PREFIX}/hosted-zones/${encodeURIComponent(hostedZoneId)}`,
    payload,
  );
  return data;
}

export async function deleteHostedZone(hostedZoneId: string) {
  await api.delete(
    `${API_PREFIX}/hosted-zones/${encodeURIComponent(hostedZoneId)}`,
  );
}

export async function createHostedZone(payload: HostedZoneCreatePayload) {
  const { data } = await api.post<HostedZoneDetail>(
    `${API_PREFIX}/hosted-zones`,
    payload,
  );
  return data;
}
