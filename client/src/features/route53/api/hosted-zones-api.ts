import { api } from "@/shared/api";

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

export async function listHostedZones(filters?: {
  domain_name?: string;
  zone_type?: string;
  created_by?: string;
  record_count?: string;
  description?: string;
  hosted_zone_id?: string;
  q?: string;
}) {
  const { data } = await api.get<HostedZoneListItem[]>(
    `${API_PREFIX}/hosted-zones`,
    { params: filters },
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

export async function getHostedZone(id: number) {
  const { data } = await api.get<HostedZoneDetail>(`${API_PREFIX}/hosted-zones/${id}`);
  return data;
}

export async function listHostedZoneTags(id: number) {
  const { data } = await api.get<HostedZoneTag[]>(
    `${API_PREFIX}/hosted-zones/${id}/tags`,
  );
  return data;
}

export async function listRecordSets(hostedZoneId: number) {
  const { data } = await api.get<RecordSet[]>(
    `${API_PREFIX}/hosted-zones/${hostedZoneId}/record-sets`,
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
  hostedZoneId: number,
  payload: RecordSetCreatePayload,
) {
  const { data } = await api.post<RecordSet>(
    `${API_PREFIX}/hosted-zones/${hostedZoneId}/record-sets`,
    payload,
  );
  return data;
}

export async function createHostedZone(payload: HostedZoneCreatePayload) {
  const { data } = await api.post<HostedZoneDetail>(
    `${API_PREFIX}/hosted-zones`,
    payload,
  );
  return data;
}
