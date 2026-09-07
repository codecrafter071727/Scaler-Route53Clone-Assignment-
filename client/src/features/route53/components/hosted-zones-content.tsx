"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  listHostedZones,
  type HostedZoneListItem,
} from "@/features/route53/api/hosted-zones-api";
import {
  ActionBtn,
  DisabledBtn,
  PrimaryBtn,
} from "@/features/route53/components/hosted-zones-action-buttons";
import { HostedZoneDetailsPanel } from "@/features/route53/components/hosted-zone-details-panel";
import { HostedZonesPropertyFilter } from "@/features/route53/components/hosted-zones-property-filter";
import { useDetailsPanel } from "@/features/route53/context/details-panel-context";
import {
  tokensToApiFilters,
  type FilterToken,
} from "@/features/route53/data/filter-properties";
import { tableColumns } from "@/features/route53/data/nav-data";
import { RefreshIcon, SettingsIcon, SortIcon } from "@/shared/icons";

export function HostedZonesContent() {
  const router = useRouter();
  const [zones, setZones] = useState<HostedZoneListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState<FilterToken[]>([]);
  const [freeText, setFreeText] = useState("");
  const {
    selectedId,
    detailsOpen,
    selectZone,
    setSelectedId,
    setDetailsOpen,
  } = useDetailsPanel();

  function openZoneDetails(id: number) {
    router.push(`/hostedzones/${id}`);
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {
        ...tokensToApiFilters(tokens),
        ...(freeText.trim() ? { q: freeText.trim() } : {}),
      };
      const data = await listHostedZones(filters);
      setZones(data);
      setSelectedId((prev) => {
        if (prev != null && data.some((z) => z.id === prev)) return prev;
        return null;
      });
    } catch {
      setError("Unable to load hosted zones.");
      setZones([]);
      setSelectedId(null);
      setDetailsOpen(false);
    } finally {
      setLoading(false);
    }
  }, [tokens, freeText, setSelectedId, setDetailsOpen]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedCount = selectedId == null ? 0 : 1;
  const countLabel =
    selectedCount > 0
      ? `${selectedCount}/${zones.length}`
      : String(zones.length);
  const hasFilter = tokens.length > 0 || Boolean(freeText.trim());

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      <main className="min-w-0 flex-1 overflow-auto bg-white px-6 pb-4 pt-5 text-[14px] leading-5 text-[#0f141a]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-[24px] font-bold leading-8 text-[#0f141a]">
            Hosted zones{" "}
            <span className="font-normal text-[#656871]">({countLabel})</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-label="Refresh hosted zones"
              onClick={() => void load()}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#006ce0] bg-white text-[#006ce0]"
            >
              <RefreshIcon className="h-[18px] w-[18px]" />
            </button>
            {selectedId != null ? (
              <>
                <ActionBtn onClick={() => openZoneDetails(selectedId)}>
                  View details
                </ActionBtn>
                <ActionBtn
                  onClick={() => router.push(`/hostedzones/${selectedId}/edit`)}
                >
                  Edit
                </ActionBtn>
                <ActionBtn onClick={() => undefined}>Delete</ActionBtn>
              </>
            ) : (
              <>
                <DisabledBtn>View details</DisabledBtn>
                <DisabledBtn>Edit</DisabledBtn>
                <DisabledBtn>Delete</DisabledBtn>
              </>
            )}
            <PrimaryBtn href="/hostedzones/create">Create hosted zone</PrimaryBtn>
          </div>
        </div>

        <p className="mt-2 mb-5 max-w-3xl text-[14px] leading-5 text-[#0f141a]">
          Automatic mode is the current search behavior optimized for best filter
          results.{" "}
          <a href="#" className="text-[#006ce0] underline underline-offset-2">
            To change modes go to settings.
          </a>
        </p>

        <div className="mb-0 flex items-start justify-between gap-6 border-b border-[#d5dbdb] pb-3">
          <HostedZonesPropertyFilter
            tokens={tokens}
            onTokensChange={setTokens}
            onFreeTextSearch={setFreeText}
          />
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

        {error ? <p className="mt-3 text-[13px] text-[#d13212]">{error}</p> : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="border-y border-[#d5dbdb]">
                <th className="relative w-10 px-3 py-3 align-middle after:absolute after:right-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-[#d5dbdb]">
                  <span className="sr-only">selection</span>
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
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-[#545b64]"
                  >
                    Loading hosted zones…
                  </td>
                </tr>
              ) : zones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="bg-white p-0">
                    <div className="flex w-full flex-col items-center px-6 pt-10 pb-12">
                      <div className="text-[16px] font-bold leading-5 text-[#545b64]">
                        {hasFilter ? "No matches" : "No hosted zones"}
                      </div>
                      <div className="mt-1.5 text-center text-[13px] font-normal leading-5 text-[#687078]">
                        {hasFilter
                          ? "No hosted zones match the current filter."
                          : "There are no hosted zones created for this account."}
                      </div>
                      {!hasFilter ? (
                        <Link
                          href="/hostedzones/create"
                          className="mt-4 inline-flex h-8 items-center rounded-[20px] border-2 border-[#ff9900] bg-[#ff9900] px-5 text-[14px] font-bold leading-none text-[#0f141a] hover:border-[#ec7211] hover:bg-[#ec7211]"
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
                      onClick={() => selectZone(zone.id)}
                      className={`cursor-pointer border-b border-[#d5dbdb] ${
                        selected
                          ? "rounded-sm bg-[#f2f8fd] outline outline-2 outline-[#006ce0] -outline-offset-2"
                          : "hover:bg-[#fafafa]"
                      }`}
                    >
                      <td className="px-3 py-3 align-middle">
                        <input
                          type="radio"
                          name="hosted-zone-selection"
                          checked={selected}
                          onChange={() => selectZone(zone.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="align-middle accent-[#006ce0]"
                          aria-label={`Select ${zone.domain_name}`}
                        />
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <button
                          type="button"
                          className="text-left text-[#006ce0] hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openZoneDetails(zone.id);
                          }}
                        >
                          {zone.domain_name}
                        </button>
                      </td>
                      <td className="px-3 py-3 align-middle capitalize">
                        {zone.zone_type}
                      </td>
                      <td className="px-3 py-3 align-middle">
                        {zone.created_by}
                      </td>
                      <td className="px-3 py-3 align-middle">
                        {zone.record_count}
                      </td>
                      <td className="px-3 py-3 align-middle">
                        {zone.description || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {detailsOpen ? (
        <HostedZoneDetailsPanel
          zoneId={selectedId}
          onClose={() => setDetailsOpen(false)}
        />
      ) : null}
    </div>
  );
}
