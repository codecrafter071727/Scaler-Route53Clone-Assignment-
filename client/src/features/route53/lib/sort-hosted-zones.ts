import type { HostedZoneListItem } from "@/features/route53/api/hosted-zones-api";
import type { tableColumns } from "@/features/route53/data/nav-data";

export type SortColumn = (typeof tableColumns)[number];
export type SortDir = "asc" | "desc";

const COLUMN_FIELD: Record<SortColumn, keyof HostedZoneListItem> = {
  "Hosted zone name": "domain_name",
  Type: "zone_type",
  "Created by": "created_by",
  "Record count": "record_count",
  Description: "description",
  "Hosted zone ID": "hosted_zone_id",
};

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, {
    sensitivity: "base",
    numeric: true,
  });
}

export function sortHostedZones(
  zones: HostedZoneListItem[],
  column: SortColumn,
  dir: SortDir,
): HostedZoneListItem[] {
  const field = COLUMN_FIELD[column];
  const factor = dir === "asc" ? 1 : -1;
  return [...zones].sort((left, right) => {
    const cmp = compareValues(left[field] ?? "", right[field] ?? "");
    return cmp === 0 ? left.id - right.id : cmp * factor;
  });
}

export function nextSortState(
  currentColumn: SortColumn | null,
  currentDir: SortDir,
  clicked: SortColumn,
): { column: SortColumn; dir: SortDir } {
  if (currentColumn === clicked) {
    return { column: clicked, dir: currentDir === "asc" ? "desc" : "asc" };
  }
  return { column: clicked, dir: "asc" };
}
