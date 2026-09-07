import type { ReactNode } from "react";
import Link from "next/link";
import { tableColumns } from "@/features/route53/data/nav-data";
import {
  RefreshIcon,
  SearchIcon,
  SettingsIcon,
  SortIcon,
} from "@/shared/icons";

export function HostedZonesContent() {
  return (
    <main className="min-w-0 flex-1 overflow-auto bg-white px-6 pb-4 pt-5 text-[14px] leading-5 text-[#0f141a]">
      {/* Title + actions */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-[24px] font-bold leading-8 text-[#0f141a]">
          Hosted zones <span className="font-normal text-[#656871]">(0)</span>
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-label="Refresh hosted zones"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#006ce0] bg-white text-[#006ce0]"
          >
            <RefreshIcon className="h-[18px] w-[18px]" />
          </button>
          <DisabledBtn>View details</DisabledBtn>
          <DisabledBtn>Edit</DisabledBtn>
          <DisabledBtn>Delete</DisabledBtn>
          <PrimaryBtn href="/hostedzones/create">Create hosted zone</PrimaryBtn>
        </div>
      </div>

      <p className="mt-2 mb-5 max-w-3xl text-[14px] leading-5 text-[#0f141a]">
        Automatic mode is the current search behavior optimized for best filter results.{" "}
        <a href="#" className="text-[#006ce0] underline underline-offset-2">
          To change modes go to settings.
        </a>
      </p>

      {/* Filter + pagination */}
      <div className="mb-0 flex items-center justify-between gap-6 border-b border-[#d5dbdb] pb-3">
        <div className="relative w-full max-w-[640px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#656871]" />
          <input
            aria-label="Filter records by property or value"
            placeholder="Filter records by property or value"
            className="h-9 w-full rounded-[8px] border border-[#7d8998] bg-white py-0 pl-9 pr-3 text-[14px] text-[#0f141a] outline-none placeholder:italic placeholder:text-[#656871] focus:border-[#006ce0]"
          />
        </div>
        <div className="flex shrink-0 items-center self-center">
          <div className="flex items-center gap-3.5 pr-2.5">
            <button
              type="button"
              aria-label="Previous page"
              className="text-[18px] font-normal leading-none text-[#b4b4bb]"
              disabled
            >
              &lt;
            </button>
            <span className="text-[15px] font-bold leading-none text-[#0f141a]">1</span>
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left">
          <thead>
            <tr className="border-y border-[#d5dbdb]">
              <th className="relative w-10 px-3 py-3 align-middle after:absolute after:right-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-[#d5dbdb]">
                <span className="sr-only">selection</span>
                <input type="checkbox" disabled className="align-middle" />
              </th>
              {tableColumns.map((col, index) => (
                <th
                  key={col}
                  className={`relative px-3 py-3 align-middle ${
                    index < tableColumns.length - 1
                      ? "after:absolute after:right-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-[#d5dbdb]"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 bg-transparent p-0 text-[14px] font-bold leading-5 text-[#424650]"
                  >
                    <span>{col}</span>
                    <SortIcon className="h-2 w-2.5 shrink-0 text-[#424650]" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="bg-white p-0">
                <div className="flex w-full flex-col items-center px-6 pt-10 pb-12">
                  <div className="text-[16px] font-bold leading-5 text-[#545b64]">
                    No hosted zones
                  </div>
                  <div className="mt-1.5 text-center text-[13px] font-normal leading-5 text-[#687078]">
                    There are no hosted zones created for this account.
                  </div>
                  <Link
                    href="/hostedzones/create"
                    className="mt-4 inline-flex h-8 items-center rounded-[20px] border-2 border-[#ff9900] bg-[#ff9900] px-5 text-[14px] font-bold leading-none text-[#0f141a] hover:border-[#ec7211] hover:bg-[#ec7211]"
                  >
                    Create hosted zone
                  </Link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}

function PrimaryBtn({ children, href }: { children: ReactNode; href?: string }) {
  const className =
    "inline-flex h-8 items-center rounded-[20px] border-2 border-[#ff9900] bg-[#ff9900] px-5 text-[14px] font-[700] leading-none text-[#0f141a] hover:border-[#ec7211] hover:bg-[#ec7211]";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={className}>
      {children}
    </button>
  );
}

function DisabledBtn({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex h-8 items-center rounded-[20px] border-2 border-[#aab7b8] bg-white px-4 text-[14px] font-[700] leading-none text-[#545b64] opacity-100 disabled:opacity-100"
    >
      {children}
    </button>
  );
}
