export function isProtectedRecord(
  record: { record_name: string; record_type: string },
  domainName: string,
) {
  const type = record.record_type.toUpperCase();
  return (
    (type === "NS" || type === "SOA") && record.record_name === domainName
  );
}
