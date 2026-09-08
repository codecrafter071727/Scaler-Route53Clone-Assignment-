import type { RecordSet } from "@/features/route53/api/hosted-zones-api";

export const RECORD_SORT_COLUMNS = [
  "Record name",
  "Type",
  "Routing policy",
  "Differentiator",
  "Alias",
  "Value/Route traffic to",
  "TTL (seconds)",
  "Health check ID",
  "Evaluate target health",
  "Record ID",
] as const;

export type RecordSortColumn = (typeof RECORD_SORT_COLUMNS)[number];
export type SortDir = "asc" | "desc";

function sortValue(record: RecordSet, column: RecordSortColumn): string | number {
  switch (column) {
    case "Record name":
      return record.record_name;
    case "Type":
      return record.record_type;
    case "Routing policy":
      return record.routing_policy;
    case "Differentiator":
      return record.differentiator ?? "";
    case "Alias":
      return record.alias ? 1 : 0;
    case "Value/Route traffic to":
      return record.value.join(" ");
    case "TTL (seconds)":
      return record.ttl;
    case "Health check ID":
      return record.health_check_id ?? "";
    case "Evaluate target health":
      return record.evaluate_target_health ? 1 : 0;
    case "Record ID":
      return record.record_id ?? "";
  }
}

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, {
    sensitivity: "base",
    numeric: true,
  });
}

export function sortRecordSets(
  records: RecordSet[],
  column: RecordSortColumn,
  dir: SortDir,
): RecordSet[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...records].sort((left, right) => {
    const cmp = compareValues(sortValue(left, column), sortValue(right, column));
    return cmp === 0 ? left.id - right.id : cmp * factor;
  });
}

export function nextRecordSortState(
  currentColumn: RecordSortColumn | null,
  currentDir: SortDir,
  clicked: RecordSortColumn,
): { column: RecordSortColumn; dir: SortDir } {
  if (currentColumn === clicked) {
    return { column: clicked, dir: currentDir === "asc" ? "desc" : "asc" };
  }
  return { column: clicked, dir: "asc" };
}
