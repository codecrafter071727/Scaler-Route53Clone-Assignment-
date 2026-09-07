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

export type HostedZoneDetail = HostedZoneListItem & {
  user_id: number;
  vpcs: { region: string; vpc_id: string }[];
  tags: { key: string; value: string }[];
};

export async function listHostedZones() {
  const { data } = await api.get<HostedZoneListItem[]>(`${API_PREFIX}/hosted-zones`);
  return data;
}

export async function createHostedZone(payload: HostedZoneCreatePayload) {
  const { data } = await api.post<HostedZoneDetail>(
    `${API_PREFIX}/hosted-zones`,
    payload,
  );
  return data;
}
