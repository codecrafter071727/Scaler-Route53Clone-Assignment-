export const RECORD_TYPES = [
  {
    value: "A",
    label: "A – Routes traffic to an IPv4 address and some AWS resources",
  },
  {
    value: "AAAA",
    label: "AAAA – Routes traffic to an IPv6 address and some AWS resources",
  },
  {
    value: "CNAME",
    label: "CNAME – Routes traffic to another domain name",
  },
  {
    value: "MX",
    label: "MX – Specifies mail servers",
  },
  {
    value: "TXT",
    label: "TXT – Verifies email servers and domains",
  },
  {
    value: "PTR",
    label: "PTR – Maps an IP address to a domain name",
  },
  {
    value: "SRV",
    label: "SRV – Specifies locations of services",
  },
  {
    value: "SPF",
    label: "SPF – Verifies email servers (legacy)",
  },
  {
    value: "NAPTR",
    label: "NAPTR – Rewrites domain names",
  },
  {
    value: "CAA",
    label: "CAA – Specifies certificate authorities",
  },
  {
    value: "NS",
    label: "NS – Delegates a subdomain",
  },
  {
    value: "HTTPS",
    label: "HTTPS – Provides connection configuration",
  },
  {
    value: "SVCB",
    label: "SVCB – Provides service binding information",
  },
] as const;

export const ROUTING_POLICIES = [
  { value: "Simple", label: "Simple routing" },
  { value: "Weighted", label: "Weighted" },
  { value: "Geolocation", label: "Geolocation" },
  { value: "Latency", label: "Latency" },
  { value: "Failover", label: "Failover" },
  { value: "Multivalue answer", label: "Multivalue answer" },
  { value: "Geoproximity", label: "Geoproximity" },
] as const;

export type RecordDraft = {
  id: string;
  subdomain: string;
  recordType: string;
  alias: boolean;
  value: string;
  ttl: string;
  routingPolicy: string;
  endpoint: string;
  region: string;
  open: boolean;
};

export function newRecordDraft(id: string): RecordDraft {
  return {
    id,
    subdomain: "",
    recordType: "A",
    alias: false,
    value: "",
    ttl: "300",
    routingPolicy: "Simple",
    endpoint: "",
    region: "",
    open: true,
  };
}
