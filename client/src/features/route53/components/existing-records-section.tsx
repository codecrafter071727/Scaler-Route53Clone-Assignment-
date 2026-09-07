"use client";

import { InfoLink } from "@/features/route53/components/form-bits";
import type { RecordSet } from "@/features/route53/api/hosted-zones-api";
import {
  CaretDown,
  RefreshIcon,
  SearchIcon,
  SettingsIcon,
  SortIcon,
} from "@/shared/icons";

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

type Props = {
  domainName: string;
  records: RecordSet[];
  open: boolean;
  onToggle: () => void;
  onRefresh: () => void;
};

export function ExistingRecordsSection({
  domainName,
  records,
  open,
  onToggle,
  onRefresh,
}: Props) {
  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 text-[16px] font-bold text-[#0f141a]"
        aria-expanded={open}
      >
        <Caret open={open} />
        <span>View existing records</span>
      </button>
      <p className="mt-1 text-[14px] text-[#545b64]">
        The following table lists the existing records in {domainName}.
      </p>
      {open ? (
        <div className="mt-3 rounded-2xl border border-[#d5dbdb] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
            <div className="flex items-center gap-2 text-[18px] font-bold text-[#0f141a]">
              <span>Existing records ({records.length})</span>
              <InfoLink />
            </div>
            <button
              type="button"
              aria-label="Refresh records"
              onClick={onRefresh}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#006ce0] bg-white text-[#006ce0]"
            >
              <RefreshIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
          <p className="mt-2 px-5 text-[14px] text-[#0f141a]">
            Automatic mode is the current search behavior optimized for best
            filter results.{" "}
            <a href="#" className="text-[#006ce0] underline underline-offset-2">
              To change modes go to settings.
            </a>
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#d5dbdb] px-5 pb-3">
            <div className="relative min-w-[220px] max-w-[420px] flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#656871]" />
              <input
                aria-label="Filter records by property or value"
                placeholder="Filter records by property or value"
                className="h-9 w-full rounded-[8px] border border-[#7d8998] bg-white py-0 pl-9 pr-3 text-[14px] outline-none placeholder:italic placeholder:text-[#656871] focus:border-[#006ce0]"
              />
            </div>
            <div className="flex items-center gap-2">
              {["Type", "Routing p...", "Alias"].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#7d8998] bg-white px-3 text-[14px] font-bold"
                >
                  {label}
                  <CaretDown className="h-3 w-3 text-[#006ce0]" />
                </button>
              ))}
              <span className="px-2 text-[15px] font-bold">1</span>
              <SettingsIcon className="h-4 w-4" />
            </div>
          </div>
          <div className="overflow-x-auto px-1 pb-2">
            <table className="w-full min-w-[1100px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#d5dbdb] bg-[#fafafa]">
                  <th className="w-10 px-3 py-2.5">
                    <input type="checkbox" aria-label="Select all" />
                  </th>
                  {COLUMNS.map((col) => (
                    <th key={col} className="px-3 py-2.5">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-2 bg-transparent p-0 text-[14px] font-bold text-[#424650]"
                      >
                        <span className="truncate">{col}</span>
                        <SortIcon className="h-2 w-2.5 shrink-0" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-[#d5dbdb]">
                    <td className="px-3 py-2.5 align-top">
                      <input
                        type="checkbox"
                        aria-label={`Select ${record.record_name}`}
                      />
                    </td>
                    <td className="px-3 py-2.5 align-top">{record.record_name}</td>
                    <td className="px-3 py-2.5 align-top">{record.record_type}</td>
                    <td className="px-3 py-2.5 align-top">
                      {record.routing_policy}
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      {record.differentiator || "-"}
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
                    <td className="px-3 py-2.5 align-top">
                      {record.ttl.toLocaleString("en-US")}
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      {record.health_check_id || "-"}
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      {record.evaluate_target_health ? "Yes" : "-"}
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      {record.record_id || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3 w-3 shrink-0 text-[#0f141a] transition-transform ${
        open ? "rotate-90" : ""
      }`}
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3 1.5 7.5 5 3 8.5V1.5Z" />
    </svg>
  );
}
