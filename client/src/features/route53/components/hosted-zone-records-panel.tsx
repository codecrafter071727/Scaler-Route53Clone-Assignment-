"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listRecordSets,
  type RecordSet,
} from "@/features/route53/api/hosted-zones-api";
import { InfoLink } from "@/features/route53/components/form-bits";
import {
  CaretDown,
  RefreshIcon,
  SearchIcon,
  SettingsIcon,
  SortIcon,
} from "@/shared/icons";

type Props = {
  zoneId: number;
  recordCount: number;
  onCountChange?: (count: number) => void;
};

const COLUMNS = [
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

function formatTtl(ttl: number) {
  return ttl.toLocaleString("en-US");
}

function dash(value: string | null | undefined) {
  return value && value.trim() ? value : "-";
}

export function HostedZoneRecordsPanel({
  zoneId,
  recordCount,
  onCountChange,
}: Props) {
  const router = useRouter();
  const [records, setRecords] = useState<RecordSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listRecordSets(zoneId);
      setRecords(data);
      onCountChange?.(data.length);
    } catch {
      setError("Unable to load records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [zoneId, onCountChange]);

  useEffect(() => {
    void load();
  }, [load]);

  const count = loading ? recordCount : records.length;

  return (
    <section className="rounded-2xl border border-[#d5dbdb] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4">
        <div className="flex items-center gap-2 text-[18px] font-bold leading-6 text-[#0f141a]">
          <span>Records ({count})</span>
          <InfoLink />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-label="Refresh records"
            onClick={() => void load()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#006ce0] bg-white text-[#006ce0]"
          >
            <RefreshIcon className="h-[18px] w-[18px]" />
          </button>
          <OutlineBtn disabled>Delete record</OutlineBtn>
          <OutlineBtn>Import zone file</OutlineBtn>
          <PrimaryBtn onClick={() => router.push(`/hostedzones/${zoneId}/create-record`)}>
            Create record
          </PrimaryBtn>
        </div>
      </div>

      <p className="mt-3 px-5 text-[14px] leading-5 text-[#0f141a]">
        Automatic mode is the current search behavior optimized for best filter
        results.{" "}
        <a href="#" className="text-[#006ce0] underline underline-offset-2">
          To change modes go to settings.
        </a>
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#d5dbdb] px-5 pb-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] max-w-[420px] flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#656871]" />
            <input
              aria-label="Filter records by property or value"
              placeholder="Filter records by property or value"
              className="h-9 w-full rounded-[8px] border border-[#7d8998] bg-white py-0 pl-9 pr-3 text-[14px] text-[#0f141a] outline-none placeholder:italic placeholder:text-[#656871] focus:border-[#006ce0]"
            />
          </div>
          <FilterChip label="Type" />
          <FilterChip label="Routing p..." />
          <FilterChip label="Alias" />
        </div>
        <div className="flex shrink-0 items-center">
          <div className="flex items-center gap-3.5 pr-2.5">
            <button
              type="button"
              aria-label="Previous page"
              className="text-[18px] font-normal leading-none text-[#b4b4bb]"
              disabled
            >
              &lt;
            </button>
            <span className="text-[15px] font-bold leading-none text-[#0f141a]">
              1
            </span>
            <button
              type="button"
              aria-label="Next page"
              className="text-[18px] font-normal leading-none text-[#b4b4bb]"
              disabled
            >
              &gt;
            </button>
          </div>
          <div className="mx-1 h-4 w-px bg-[#d5dbdb]" />
          <button
            type="button"
            aria-label="Preferences"
            className="ml-0.5 flex h-7 w-7 items-center justify-center text-[#0f141a]"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error ? (
        <p className="px-5 py-6 text-[14px] text-[#d13212]">{error}</p>
      ) : loading ? (
        <p className="px-5 py-6 text-[14px] text-[#545b64]">Loading records…</p>
      ) : (
        <div className="overflow-x-auto px-1 pb-2">
          <table className="w-full min-w-[1100px] border-collapse text-left text-[14px] text-[#0f141a]">
            <thead>
              <tr className="border-b border-[#d5dbdb] bg-[#fafafa]">
                <th className="w-10 px-3 py-2.5 align-middle">
                  <input type="checkbox" aria-label="Select all records" />
                </th>
                {COLUMNS.map((col, index) => (
                  <th
                    key={col}
                    className={`relative px-3 py-2.5 align-middle ${
                      index < COLUMNS.length - 1
                        ? "after:absolute after:right-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-[#d5dbdb]"
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 bg-transparent p-0 text-[14px] font-bold leading-5 text-[#424650]"
                    >
                      <span className="truncate">{col}</span>
                      <SortIcon className="h-2 w-2.5 shrink-0 text-[#424650]" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[#d5dbdb] hover:bg-[#fafafa]"
                >
                  <td className="px-3 py-2.5 align-top">
                    <input
                      type="checkbox"
                      aria-label={`Select ${record.record_name} ${record.record_type}`}
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#7d8998] bg-white px-3 text-[14px] font-bold text-[#0f141a]"
    >
      {label}
      <CaretDown className="h-3 w-3 text-[#006ce0]" />
    </button>
  );
}

function OutlineBtn({
  children,
  disabled,
}: {
  children: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-8 items-center rounded-[20px] border-2 border-[#006ce0] bg-white px-4 text-[14px] font-[700] leading-none text-[#006ce0] hover:bg-[#f2f8fd] disabled:cursor-not-allowed disabled:border-[#aab7b8] disabled:text-[#545b64] disabled:hover:bg-white"
    >
      {children}
    </button>
  );
}

function PrimaryBtn({
  children,
  onClick,
}: {
  children: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 items-center rounded-[20px] border-2 border-[#ff9900] bg-[#ff9900] px-5 text-[14px] font-[700] leading-none text-[#0f141a] hover:border-[#ec7211] hover:bg-[#ec7211]"
    >
      {children}
    </button>
  );
}
