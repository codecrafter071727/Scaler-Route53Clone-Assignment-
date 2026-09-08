"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listRecordSets,
  type RecordSet,
} from "@/features/route53/api/hosted-zones-api";
import { DeleteRecordModal } from "@/features/route53/components/delete-record-modal";
import { InfoLink } from "@/features/route53/components/form-bits";
import { HostedZoneRecordsTable } from "@/features/route53/components/hosted-zone-records-table";
import { RecordsFacetFilter } from "@/features/route53/components/records-facet-filter";
import {
  RecordsOutlineBtn,
  RecordsPrimaryBtn,
} from "@/features/route53/components/records-panel-buttons";
import { RecordsPropertyFilter } from "@/features/route53/components/records-property-filter";
import { RecordDeletedFlash } from "@/features/route53/components/record-deleted-flash";
import { TablePagination } from "@/features/route53/components/table-pagination";
import {
  ALIAS_FACET_OPTIONS,
  ROUTING_FACET_OPTIONS,
  TYPE_FACET_OPTIONS,
  recordTokensToApiFilters,
  type RecordFilterToken,
  type RecordListFilters,
} from "@/features/route53/data/record-filter-options";
import { isProtectedRecord } from "@/features/route53/lib/is-protected-record";
import { DEFAULT_PAGE_SIZE } from "@/features/route53/lib/pagination";
import { routes } from "@/features/route53/lib/routes";
import {
  nextRecordSortState,
  sortRecordSets,
  type RecordSortColumn,
  type SortDir,
} from "@/features/route53/lib/sort-record-sets";
import { RefreshIcon } from "@/shared/icons";

type Props = {
  zoneId: string;
  domainName: string;
  recordCount: number;
  onCountChange?: (count: number) => void;
};

export function HostedZoneRecordsPanel({
  zoneId,
  domainName,
  recordCount,
  onCountChange,
}: Props) {
  const router = useRouter();
  const [records, setRecords] = useState<RecordSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<RecordSortColumn | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [tokens, setTokens] = useState<RecordFilterToken[]>([]);
  const [freeText, setFreeText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [routingFilter, setRoutingFilter] = useState<string | null>(null);
  const [aliasFilter, setAliasFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const apiFilters = useMemo((): RecordListFilters => {
    const fromTokens = recordTokensToApiFilters(tokens);
    return {
      ...fromTokens,
      ...(typeFilter ? { type: typeFilter } : {}),
      ...(routingFilter ? { routing_policy: routingFilter } : {}),
      ...(aliasFilter ? { alias: aliasFilter } : {}),
      ...(freeText.trim() ? { q: freeText.trim() } : {}),
    };
  }, [tokens, typeFilter, routingFilter, aliasFilter, freeText]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listRecordSets(zoneId, {
        ...apiFilters,
        page,
        page_size: DEFAULT_PAGE_SIZE,
      });
      setRecords(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
      onCountChange?.(data.total);
      if (data.total_pages > 0 && page > data.total_pages) {
        setPage(data.total_pages);
      }
      setSelectedIds((prev) => {
        const next = new Set<number>();
        for (const id of prev) {
          if (data.items.some((r) => r.id === id)) next.add(id);
        }
        return next;
      });
    } catch {
      setError("Unable to load records.");
      setRecords([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [zoneId, apiFilters, page, onCountChange]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [apiFilters]);

  const selectedRecords = useMemo(
    () =>
      records.filter(
        (r) => selectedIds.has(r.id) && !isProtectedRecord(r, domainName),
      ),
    [records, selectedIds, domainName],
  );

  const sortedRecords = useMemo(() => {
    if (!sortColumn) return records;
    return sortRecordSets(records, sortColumn, sortDir);
  }, [records, sortColumn, sortDir]);

  const count = loading ? recordCount : total;
  const canDelete = selectedRecords.length > 0;

  function handleSort(column: RecordSortColumn) {
    const next = nextRecordSortState(sortColumn, sortDir, column);
    setSortColumn(next.column);
    setSortDir(next.dir);
  }

  function toggleId(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(ids: number[]) {
    setSelectedIds((prev) => {
      const allOn = ids.length > 0 && ids.every((id) => prev.has(id));
      if (allOn) return new Set();
      return new Set(ids);
    });
  }

  return (
    <>
      {successMessage ? (
        <RecordDeletedFlash
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      ) : null}

      <section className="rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4">
          <div className="flex items-center gap-2 text-[18px] font-bold leading-6 text-foreground">
            <span>Records ({count})</span>
            <InfoLink />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-label="Refresh records"
              onClick={() => void load()}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-aws-blue bg-surface text-aws-blue"
            >
              <RefreshIcon className="h-[18px] w-[18px]" />
            </button>
            <RecordsOutlineBtn
              disabled={!canDelete}
              onClick={() => setDeleteOpen(true)}
            >
              Delete record
            </RecordsOutlineBtn>
            <RecordsOutlineBtn>Import zone file</RecordsOutlineBtn>
            <RecordsPrimaryBtn
              onClick={() =>
                router.push(routes.hostedZoneCreateRecord(zoneId))
              }
            >
              Create record
            </RecordsPrimaryBtn>
          </div>
        </div>

        <p className="mt-3 px-5 text-[14px] leading-5 text-foreground">
          Automatic mode is the current search behavior optimized for best
          filter results.{" "}
          <a href="#" className="text-aws-blue underline underline-offset-2">
            To change modes go to settings.
          </a>
        </p>
        <p className="mt-1 px-5 text-[13px] leading-5 text-muted-2">
          Default NS and SOA records for this zone cannot be selected or
          deleted. Create another record to use the checkboxes and Delete.
        </p>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 pb-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-start gap-2">
            <RecordsPropertyFilter
              zoneId={zoneId}
              tokens={tokens}
              onTokensChange={setTokens}
              onFreeTextSearch={setFreeText}
            />
            <RecordsFacetFilter
              label="Type"
              options={TYPE_FACET_OPTIONS}
              value={typeFilter}
              onChange={setTypeFilter}
            />
            <RecordsFacetFilter
              label="Routing p..."
              options={ROUTING_FACET_OPTIONS}
              value={routingFilter}
              onChange={setRoutingFilter}
            />
            <RecordsFacetFilter
              label="Alias"
              options={ALIAS_FACET_OPTIONS}
              value={aliasFilter}
              onChange={setAliasFilter}
            />
          </div>
          <div className="flex shrink-0 items-center self-center">
            <TablePagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>

        {error ? (
          <p className="px-5 py-6 text-[14px] text-danger">{error}</p>
        ) : loading ? (
          <p className="px-5 py-6 text-[14px] text-muted-2">Loading records…</p>
        ) : (
          <HostedZoneRecordsTable
            records={sortedRecords}
            domainName={domainName}
            selectedIds={selectedIds}
            sortColumn={sortColumn}
            sortDir={sortDir}
            onSort={handleSort}
            onToggle={toggleId}
            onToggleAll={toggleAll}
          />
        )}
      </section>

      <DeleteRecordModal
        zoneId={zoneId}
        records={selectedRecords}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={(deleted) => {
          setSelectedIds(new Set());
          setDeleteOpen(false);
          if (deleted.length === 1) {
            setSuccessMessage(
              `Successfully deleted record ${deleted[0].record_name} (${deleted[0].record_type})`,
            );
          } else {
            setSuccessMessage(
              `Successfully deleted ${deleted.length} records`,
            );
          }
          void load();
        }}
      />
    </>
  );
}
