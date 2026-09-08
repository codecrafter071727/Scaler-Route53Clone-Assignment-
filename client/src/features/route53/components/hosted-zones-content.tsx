"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import { DeleteHostedZoneModal } from "@/features/route53/components/delete-hosted-zone-modal";
import { HostedZoneDeletedFlash } from "@/features/route53/components/hosted-zone-deleted-flash";
import { HostedZoneDetailsPanel } from "@/features/route53/components/hosted-zone-details-panel";
import { HostedZonesPropertyFilter } from "@/features/route53/components/hosted-zones-property-filter";
import { HostedZonesTable } from "@/features/route53/components/hosted-zones-table";
import { TablePagination } from "@/features/route53/components/table-pagination";
import { useDetailsPanel } from "@/features/route53/context/details-panel-context";
import {
  tokensToApiFilters,
  type FilterToken,
} from "@/features/route53/data/filter-properties";
import { DEFAULT_PAGE_SIZE } from "@/features/route53/lib/pagination";
import { routes } from "@/features/route53/lib/routes";
import {
  nextSortState,
  sortHostedZones,
  type SortColumn,
  type SortDir,
} from "@/features/route53/lib/sort-hosted-zones";
import { RefreshIcon } from "@/shared/icons";

export function HostedZonesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [zones, setZones] = useState<HostedZoneListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState<FilterToken[]>([]);
  const [freeText, setFreeText] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletedDomain, setDeletedDomain] = useState<string | null>(null);
  const {
    selectedZoneId,
    detailsOpen,
    selectZone,
    setSelectedZoneId,
    setDetailsOpen,
  } = useDetailsPanel();

  const selectedZone =
    selectedZoneId == null
      ? null
      : (zones.find((z) => z.hosted_zone_id === selectedZoneId) ?? null);

  useEffect(() => {
    const deleted = searchParams.get("deleted");
    if (!deleted) return;
    setDeletedDomain(deleted);
    router.replace(routes.hostedZones, { scroll: false });
  }, [searchParams, router]);

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
        page,
        page_size: DEFAULT_PAGE_SIZE,
      };
      const data = await listHostedZones(filters);
      setZones(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
      if (data.total_pages > 0 && page > data.total_pages) {
        setPage(data.total_pages);
      }
      setSelectedZoneId((prev) => {
        if (prev != null && data.items.some((z) => z.hosted_zone_id === prev)) {
          return prev;
        }
        return null;
      });
    } catch {
      setError("Unable to load hosted zones.");
      setZones([]);
      setTotal(0);
      setTotalPages(0);
      setSelectedZoneId(null);
      setDetailsOpen(false);
    } finally {
      setLoading(false);
    }
  }, [tokens, freeText, page, setSelectedZoneId, setDetailsOpen]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [tokens, freeText]);

  const selectedCount = selectedZoneId == null ? 0 : 1;
  const countLabel =
    selectedCount > 0 ? `${selectedCount}/${total}` : String(total);
  const hasFilter = tokens.length > 0 || Boolean(freeText.trim());

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1">
      <main className="min-w-0 flex-1 overflow-auto bg-background px-3 pb-4 pt-4 text-[14px] leading-5 text-foreground sm:px-6 sm:pt-5">
        {deletedDomain ? (
          <HostedZoneDeletedFlash
            domainName={deletedDomain}
            onDismiss={() => setDeletedDomain(null)}
          />
        ) : null}

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
            {selectedZoneId != null ? (
              <>
                <ActionBtn
                  onClick={() =>
                    router.push(routes.hostedZone(selectedZoneId))
                  }
                >
                  View details
                </ActionBtn>
                <ActionBtn
                  onClick={() =>
                    router.push(routes.hostedZoneEdit(selectedZoneId))
                  }
                >
                  Edit
                </ActionBtn>
                <ActionBtn
                  onClick={() => {
                    if (selectedZone) setDeleteOpen(true);
                  }}
                >
                  Delete
                </ActionBtn>
              </>
            ) : (
              <>
                <DisabledBtn>View details</DisabledBtn>
                <DisabledBtn>Edit</DisabledBtn>
                <DisabledBtn>Delete</DisabledBtn>
              </>
            )}
            <PrimaryBtn href={routes.hostedZonesCreate}>
              Create hosted zone
            </PrimaryBtn>
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
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        {error ? <p className="mt-3 text-[13px] text-danger">{error}</p> : null}

        <HostedZonesTable
          zones={sortedZones}
          loading={loading}
          hasFilter={hasFilter}
          selectedZoneId={selectedZoneId}
          sortColumn={sortColumn}
          sortDir={sortDir}
          onSort={handleSort}
          onSelect={selectZone}
          onOpenDetails={(hostedZoneId) =>
            router.push(routes.hostedZone(hostedZoneId))
          }
        />
      </main>

      {detailsOpen ? (
        <HostedZoneDetailsPanel
          zoneId={selectedZoneId}
          onClose={() => setDetailsOpen(false)}
        />
      ) : null}

      {selectedZone ? (
        <DeleteHostedZoneModal
          zoneId={selectedZone.hosted_zone_id}
          domainName={selectedZone.domain_name}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onDeleted={() => {
            const name = selectedZone.domain_name;
            setDeleteOpen(false);
            setSelectedZoneId(null);
            setDetailsOpen(false);
            setDeletedDomain(name);
            void load();
          }}
        />
      ) : null}
    </div>
  );
}
