export function normalizeDomainName(domainName: string) {
  return domainName.trim().replace(/\.$/, "").toLowerCase();
}

export function isProtectedRecord(
  record: { record_name: string; record_type: string },
  domainName: string,
) {
  const type = record.record_type.toUpperCase();
  if (type !== "NS" && type !== "SOA") return false;
  return (
    normalizeDomainName(record.record_name) === normalizeDomainName(domainName)
  );
}
