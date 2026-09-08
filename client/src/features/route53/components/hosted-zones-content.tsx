"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { HostedZonesTable } from "@/features/route53/components/hosted-zones-table";
import { useDetailsPanel } from "@/features/route53/context/details-panel-context";
import {
  tokensToApiFilters,
  type FilterToken,
} from "@/features/route53/data/filter-properties";
import {
  nextSortState,
  sortHostedZones,
  type SortColumn,
  type SortDir,
} from "@/features/route53/lib/sort-hosted-zones";
import { RefreshIcon, SettingsIcon } from "@/shared/icons";

export function HostedZonesContent() {
  const router = useRouter();
  const [zones, setZones] = useState<HostedZoneListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState<FilterToken[]>([]);
  const [freeText, setFreeText] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const {
    selectedId,
    detailsOpen,
    selectZone,
    setSelectedId,
    setDetailsOpen,
  } = useDetailsPanel();

  function handleSort(column: SortColumn) {
    const next = nextSortState(sortColumn, sortDir, column);
    setSortColumn(next.column);
    setSortDir(next.dir);
  }

  const sortedZones = useMemo(() => {
    if (!sortColumn) return zones;
    return sortHostedZones(zones, sortColumn, sortDir);
  }, [zones, sortColumn, sortDir]);

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
      ? `${selectedCount}/${sortedZones.length}`
      : String(sortedZones.length);
  const hasFilter = tokens.length > 0 || Boolean(freeText.trim());

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1">
      <main className="min-w-0 flex-1 overflow-auto bg-background px-3 pb-4 pt-4 text-[14px] leading-5 text-foreground sm:px-6 sm:pt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <h1 className="text-[22px] font-bold leading-7 text-foreground sm:text-[24px] sm:leading-8">
            Hosted zones{" "}
            <span className="font-normal text-muted">({countLabel})</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-label="Refresh hosted zones"
              onClick={() => void load()}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-aws-blue bg-surface text-aws-blue"
            >
              <RefreshIcon className="h-[18px] w-[18px]" />
            </button>
            {selectedId != null ? (
              <>
                <ActionBtn onClick={() => router.push(`/hostedzones/${selectedId}`)}>
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

        <p className="mt-2 mb-4 max-w-3xl text-[13px] leading-5 text-foreground sm:mb-5 sm:text-[14px]">
          Automatic mode is the current search behavior optimized for best filter
          results.{" "}
          <a href="#" className="text-aws-blue underline underline-offset-2">
            To change modes go to settings.
          </a>
        </p>

        <div className="mb-0 flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <HostedZonesPropertyFilter
            tokens={tokens}
            onTokensChange={setTokens}
            onFreeTextSearch={setFreeText}
          />
          <div className="flex shrink-0 items-center self-end sm:self-center">
            <div className="flex items-center gap-3.5 pr-2.5">
              <button
                type="button"
                aria-label="Previous page"
                className="text-[18px] font-normal leading-none text-muted"
                disabled
              >
                &lt;
              </button>
              <span className="text-[15px] font-bold leading-none text-foreground">
                1
              </span>
              <button
                type="button"
                aria-label="Next page"
                className="text-[18px] font-normal leading-none text-muted"
                disabled
              >
                &gt;
              </button>
            </div>
            <div className="mx-1 h-4 w-px bg-border" />
            <button
              type="button"
              aria-label="Preferences"
              className="ml-0.5 flex h-7 w-7 items-center justify-center text-foreground"
            >
              <SettingsIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error ? <p className="mt-3 text-[13px] text-danger">{error}</p> : null}

        <HostedZonesTable
          zones={sortedZones}
          loading={loading}
          hasFilter={hasFilter}
          selectedId={selectedId}
          sortColumn={sortColumn}
          sortDir={sortDir}
          onSort={handleSort}
          onSelect={selectZone}
          onOpenDetails={(id) => router.push(`/hostedzones/${id}`)}
        />
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
