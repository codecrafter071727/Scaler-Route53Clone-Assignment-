"use client";

import Link from "next/link";
import type { HostedZoneListItem } from "@/features/route53/api/hosted-zones-api";
import { tableColumns } from "@/features/route53/data/nav-data";
import type { SortColumn, SortDir } from "@/features/route53/lib/sort-hosted-zones";
import { SortIcon } from "@/shared/icons";

type Props = {
  zones: HostedZoneListItem[];
  loading: boolean;
  hasFilter: boolean;
  selectedId: number | null;
  sortColumn: SortColumn | null;
  sortDir: SortDir;
  onSort: (column: SortColumn) => void;
  onSelect: (id: number) => void;
  onOpenDetails: (id: number) => void;
};

export function HostedZonesTable({
  zones,
  loading,
  hasFilter,
  selectedId,
  sortColumn,
  sortDir,
  onSort,
  onSelect,
  onOpenDetails,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] border-collapse text-left">
        <thead>
          <tr className="border-y border-border">
            <th className="relative w-10 px-3 py-3 align-middle after:absolute after:right-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-border">
              <span className="sr-only">selection</span>
            </th>
            {tableColumns.map((col, index) => {
              const active = sortColumn === col;
              return (
                <th
                  key={col}
                  className={`relative px-3 py-3 align-middle ${
                    index < tableColumns.length - 1
                      ? "after:absolute after:right-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-border"
                      : ""
                  }`}
                  aria-sort={
                    active
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    type="button"
                    onClick={() => onSort(col)}
                    className="flex w-full items-center justify-between gap-2 bg-transparent p-0 text-[14px] font-bold leading-5 text-sidebar-text hover:text-foreground"
                  >
                    <span>{col}</span>
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
          {loading ? (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-muted-2">
                Loading hosted zones…
              </td>
            </tr>
          ) : zones.length === 0 ? (
            <tr>
              <td colSpan={7} className="bg-surface p-0">
                <div className="flex w-full flex-col items-center px-6 pt-10 pb-12">
                  <div className="text-[16px] font-bold leading-5 text-muted-2">
                    {hasFilter ? "No matches" : "No hosted zones"}
                  </div>
                  <div className="mt-1.5 text-center text-[13px] font-normal leading-5 text-muted-3">
                    {hasFilter
                      ? "No hosted zones match the current filter."
                      : "There are no hosted zones created for this account."}
                  </div>
                  {!hasFilter ? (
                    <Link
                      href="/hostedzones/create"
                      className="mt-4 inline-flex h-8 items-center rounded-[20px] border-2 border-aws-orange bg-aws-orange px-5 text-[14px] font-bold leading-none text-on-orange hover:border-aws-orange-hover hover:bg-aws-orange-hover"
                    >
                      Create hosted zone
                    </Link>
                  ) : null}
                </div>
              </td>
            </tr>
          ) : (
            zones.map((zone) => {
              const selected = selectedId === zone.id;
              return (
                <tr
                  key={zone.id}
                  onClick={() => onSelect(zone.id)}
                  className={`cursor-pointer border-b border-border ${
                    selected
                      ? "rounded-sm bg-info outline outline-2 outline-outline-row -outline-offset-2"
                      : "hover:bg-table-hover"
                  }`}
                >
                  <td className="px-3 py-3 align-middle">
                    <input
                      type="radio"
                      name="hosted-zone-selection"
                      checked={selected}
                      onChange={() => onSelect(zone.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="align-middle accent-aws-blue"
                      aria-label={`Select ${zone.domain_name}`}
                    />
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <button
                      type="button"
                      className="text-left text-aws-blue hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetails(zone.id);
                      }}
                    >
                      {zone.domain_name}
                    </button>
                  </td>
                  <td className="px-3 py-3 align-middle capitalize">
                    {zone.zone_type}
                  </td>
                  <td className="px-3 py-3 align-middle">{zone.created_by}</td>
                  <td className="px-3 py-3 align-middle">{zone.record_count}</td>
                  <td className="px-3 py-3 align-middle">
                    {zone.description || "—"}
                  </td>
                  <td
                    className="max-w-[160px] truncate px-3 py-3 align-middle"
                    title={zone.hosted_zone_id}
                  >
                    {zone.hosted_zone_id}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
