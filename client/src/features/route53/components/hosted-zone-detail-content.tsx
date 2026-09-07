"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  getHostedZone,
  listHostedZoneTags,
  type HostedZoneDetail,
  type HostedZoneTag,
} from "@/features/route53/api/hosted-zones-api";
import { HostedZoneRecordsPanel } from "@/features/route53/components/hosted-zone-records-panel";
import { HostedZoneTagsPanel } from "@/features/route53/components/hosted-zone-tags-panel";
import { RecordCreatedFlash } from "@/features/route53/components/record-created-flash";

type TabId = "records" | "tags";

export function HostedZoneDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const zoneId = Number(params.id);

  const [detail, setDetail] = useState<HostedZoneDetail | null>(null);
  const [tags, setTags] = useState<HostedZoneTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [error, setError] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("records");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const [createdRecordName, setCreatedRecordName] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const created = searchParams.get("created");
    if (created) {
      setCreatedRecordName(created);
      router.replace(`/hostedzones/${zoneId}`, { scroll: false });
    }
  }, [searchParams, router, zoneId]);

  useEffect(() => {
    if (!Number.isFinite(zoneId)) {
      setError("Invalid hosted zone.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");
    setDetail(null);

    getHostedZone(zoneId)
      .then((zone) => {
        if (!active) return;
        setDetail(zone);
        setRecordCount(zone.record_count);
      })
      .catch(() => {
        if (active) setError("Unable to load hosted zone details.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [zoneId]);

  useEffect(() => {
    if (!Number.isFinite(zoneId)) return;

    let active = true;
    setTagsLoading(true);
    setTagsError("");
    setTags([]);

    listHostedZoneTags(zoneId)
      .then((zoneTags) => {
        if (active) setTags(zoneTags);
      })
      .catch(() => {
        if (active) setTagsError("Unable to load hosted zone tags.");
      })
      .finally(() => {
        if (active) setTagsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [zoneId]);

  const onCountChange = useCallback((count: number) => {
    setRecordCount(count);
  }, []);

  if (loading) {
    return (
      <main className="min-w-0 flex-1 overflow-auto bg-white px-6 pb-4 pt-5 text-[14px] text-[#545b64]">
        Loading hosted zone…
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="min-w-0 flex-1 overflow-auto bg-white px-6 pb-4 pt-5 text-[14px]">
        <p className="text-[#d13212]">{error || "Hosted zone not found."}</p>
        <Link
          href="/hostedzones"
          className="mt-3 inline-block text-[#006ce0] underline"
        >
          Back to hosted zones
        </Link>
      </main>
    );
  }

  const isPrivate = detail.zone_type === "private";
  const tagsCountLabel = tagsLoading ? "…" : String(tags.length);

  return (
    <main className="min-w-0 flex-1 overflow-auto bg-white px-6 pb-8 pt-5 text-[14px] leading-5 text-[#0f141a]">
      {createdRecordName ? (
        <RecordCreatedFlash
          recordName={createdRecordName}
          onDismiss={() => setCreatedRecordName(null)}
        />
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-bold leading-4 text-white ${
              isPrivate ? "bg-[#414d5c]" : "bg-[#006ce0]"
            }`}
          >
            {isPrivate ? "Private" : "Public"}
          </span>
          <h1 className="truncate text-[24px] font-bold leading-8 text-[#0f141a]">
            {detail.domain_name}
          </h1>
          <a
            href="#"
            className="text-[12px] font-bold leading-4 text-[#006ce0] hover:underline"
          >
            Info
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <OutlineBtn>Delete zone</OutlineBtn>
          <OutlineBtn disabled>Test record</OutlineBtn>
          <OutlineBtn disabled>Configure query logging</OutlineBtn>
        </div>
      </div>

      <section className="mt-4 rounded-2xl border border-[#d5dbdb] bg-white">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setDetailsOpen((open) => !open)}
            className="flex min-w-0 items-center gap-2 text-left text-[16px] font-bold leading-5 text-[#0f141a]"
            aria-expanded={detailsOpen}
          >
            <CaretIcon open={detailsOpen} />
            <span>Hosted zone details</span>
          </button>
          <OutlineBtn>Edit hosted zone</OutlineBtn>
        </div>
        {detailsOpen ? (
          <div className="grid gap-4 border-t border-[#d5dbdb] px-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Hosted zone name" value={detail.domain_name} />
            <DetailItem label="Hosted zone ID" value={detail.hosted_zone_id} />
            <DetailItem
              label="Description"
              value={detail.description || "-"}
            />
            <DetailItem
              label="Type"
              value={
                isPrivate ? "Private hosted zone" : "Public hosted zone"
              }
            />
            <DetailItem
              label="Record count"
              value={String(recordCount || detail.record_count)}
            />
            {isPrivate ? (
              <DetailItem
                label="Associated VPCs"
                value={
                  detail.vpcs.length === 0
                    ? "-"
                    : detail.vpcs
                        .map((v) => `${v.vpc_id} | ${v.region}`)
                        .join(", ")
                }
              />
            ) : null}
          </div>
        ) : null}
      </section>

      <div className="mt-5 flex items-center gap-1 border-b border-[#d5dbdb]">
        <TabButton
          active={activeTab === "records"}
          onClick={() => setActiveTab("records")}
        >
          Records ({recordCount || detail.record_count})
        </TabButton>
        <TabButton
          active={activeTab === "tags"}
          onClick={() => setActiveTab("tags")}
        >
          Hosted zone tags ({tagsCountLabel})
        </TabButton>
      </div>

      <div className="pt-4">
        {activeTab === "records" ? (
          <HostedZoneRecordsPanel
            zoneId={zoneId}
            recordCount={recordCount || detail.record_count}
            onCountChange={onCountChange}
          />
        ) : (
          <section className="rounded-2xl border border-[#d5dbdb] bg-white px-5 py-4">
            <HostedZoneTagsPanel
              tags={tags}
              loading={tagsLoading}
              error={tagsError}
            />
          </section>
        )}
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-2 text-[14px] font-bold leading-5 ${
        active
          ? "border-[#006ce0] text-[#006ce0]"
          : "border-transparent text-[#545b64] hover:text-[#0f141a]"
      }`}
    >
      {children}
    </button>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[14px] font-bold text-[#0f141a]">{label}</div>
      <div className="break-all text-[14px] font-normal text-[#0f141a]">
        {value}
      </div>
    </div>
  );
}

function OutlineBtn({
  children,
  disabled,
}: {
  children: ReactNode;
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

function CaretIcon({ open }: { open: boolean }) {
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
