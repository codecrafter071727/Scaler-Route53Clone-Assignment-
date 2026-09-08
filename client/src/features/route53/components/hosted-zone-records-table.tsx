"use client";

import type { RecordSet } from "@/features/route53/api/hosted-zones-api";
import { isProtectedRecord } from "@/features/route53/lib/is-protected-record";
import {
  RECORD_SORT_COLUMNS,
  type RecordSortColumn,
  type SortDir,
} from "@/features/route53/lib/sort-record-sets";
import { SortIcon } from "@/shared/icons";

function formatTtl(ttl: number) {
  return ttl.toLocaleString("en-US");
}

function dash(value: string | null | undefined) {
  return value && value.trim() ? value : "-";
}

type Props = {
  records: RecordSet[];
  domainName: string;
  selectedIds: Set<number>;
  sortColumn: RecordSortColumn | null;
  sortDir: SortDir;
  onSort: (column: RecordSortColumn) => void;
  onToggle: (id: number) => void;
  onToggleAll: (ids: number[]) => void;
};

export function HostedZoneRecordsTable({
  records,
  domainName,
  selectedIds,
  sortColumn,
  sortDir,
  onSort,
  onToggle,
  onToggleAll,
}: Props) {
  const selectableIds = records
    .filter((r) => !isProtectedRecord(r, domainName))
    .map((r) => r.id);
  const allSelected =
    selectableIds.length > 0 &&
    selectableIds.every((id) => selectedIds.has(id));

  return (
    <div className="overflow-x-auto px-1 pb-2">
      <table className="w-full min-w-[1100px] border-collapse text-left text-[14px] text-foreground">
        <thead>
          <tr className="border-b border-border bg-table-hover">
            <th className="w-10 px-3 py-2.5 align-middle">
              <input
                type="checkbox"
                aria-label="Select all records"
                checked={allSelected}
                disabled={selectableIds.length === 0}
                onChange={() => onToggleAll(selectableIds)}
              />
            </th>
            {RECORD_SORT_COLUMNS.map((col, index) => {
              const active = sortColumn === col;
              return (
                <th
                  key={col}
                  className={`relative px-3 py-2.5 align-middle ${
                    index < RECORD_SORT_COLUMNS.length - 1
                      ? "after:absolute after:right-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-border"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSort(col)}
                    className="flex w-full items-center justify-between gap-2 bg-transparent p-0 text-[14px] font-bold leading-5 text-sidebar-text hover:text-foreground"
                  >
                    <span className="truncate">{col}</span>
                    <SortIcon
                      className={`h-2 w-2.5 shrink-0 transition-transform ${
                        active ? "text-aws-blue" : "text-sidebar-text"
                      } ${active && sortDir === "asc" ? "rotate-180" : ""}`}
                    />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const protectedRow = isProtectedRecord(record, domainName);
            const selected = selectedIds.has(record.id);
            return (
              <tr
                key={record.id}
                className={`border-b border-border hover:bg-table-hover ${
                  selected ? "bg-info/40" : ""
                }`}
              >
                <td className="px-3 py-2.5 align-top">
                  <input
                    type="checkbox"
                    aria-label={`Select ${record.record_name} ${record.record_type}`}
                    checked={selected}
                    disabled={protectedRow}
                    title={
                      protectedRow
                        ? "Default NS and SOA records cannot be deleted"
                        : undefined
                    }
                    onChange={() => onToggle(record.id)}
                  />
                </td>
                <td className="px-3 py-2.5 align-top">{record.record_name}</td>
                <td className="px-3 py-2.5 align-top">{record.record_type}</td>
                <td className="px-3 py-2.5 align-top">{record.routing_policy}</td>
                <td className="px-3 py-2.5 align-top">
                  {dash(record.differentiator)}
                </td>
                <td className="px-3 py-2.5 align-top">
                  {record.alias ? "Yes" : "No"}
                </td>
                <td className="px-3 py-2.5 align-top">
                  {record.value.map((line) => (
                    <div key={line} className="whitespace-nowrap">
                      {line}
                    </div>
                  ))}
                </td>
                <td className="px-3 py-2.5 align-top">{formatTtl(record.ttl)}</td>
                <td className="px-3 py-2.5 align-top">
                  {dash(record.health_check_id)}
                </td>
                <td className="px-3 py-2.5 align-top">
                  {record.evaluate_target_health ? "Yes" : "-"}
                </td>
                <td className="px-3 py-2.5 align-top">
                  {dash(record.record_id)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
