"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  getHostedZone,
  listHostedZoneTags,
  type HostedZoneDetail,
  type HostedZoneTag,
} from "@/features/route53/api/hosted-zones-api";
import { DeleteHostedZoneModal } from "@/features/route53/components/delete-hosted-zone-modal";
import {
  DetailCaretIcon,
  DetailItem,
  DetailOutlineBtn,
  DetailTabButton,
} from "@/features/route53/components/hosted-zone-detail-ui";
import { HostedZoneRecordsPanel } from "@/features/route53/components/hosted-zone-records-panel";
import { HostedZoneTagsPanel } from "@/features/route53/components/hosted-zone-tags-panel";
import { RecordCreatedFlash } from "@/features/route53/components/record-created-flash";
import { routes } from "@/features/route53/lib/routes";

type TabId = "records" | "tags";

export function HostedZoneDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const zoneId =
    typeof params.zoneId === "string" ? decodeURIComponent(params.zoneId) : "";

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
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const created = searchParams.get("created");
    if (created) {
      setCreatedRecordName(created);
      router.replace(routes.hostedZone(zoneId), { scroll: false });
    }
  }, [searchParams, router, zoneId]);

  useEffect(() => {
    if (!zoneId) {
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
    if (!zoneId) return;

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
      <main className="min-w-0 flex-1 overflow-auto bg-background px-6 pb-4 pt-5 text-[14px] text-muted-2">
        Loading hosted zone…
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="min-w-0 flex-1 overflow-auto bg-background px-6 pb-4 pt-5 text-[14px]">
        <p className="text-danger">{error || "Hosted zone not found."}</p>
        <Link
          href={routes.hostedZones}
          className="mt-3 inline-block text-aws-blue underline"
        >
          Back to hosted zones
        </Link>
      </main>
    );
  }

  const isPrivate = detail.zone_type === "private";
  const tagsCountLabel = tagsLoading ? "…" : String(tags.length);

  return (
    <>
      <main className="min-w-0 flex-1 overflow-auto bg-background px-3 pb-8 pt-5 text-[14px] leading-5 text-foreground sm:px-6">
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
                isPrivate ? "bg-muted" : "bg-aws-blue"
              }`}
            >
              {isPrivate ? "Private" : "Public"}
            </span>
            <h1 className="truncate text-[24px] font-bold leading-8 text-foreground">
              {detail.domain_name}
            </h1>
            <a
              href="#"
              className="text-[12px] font-bold leading-4 text-aws-blue hover:underline"
            >
              Info
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DetailOutlineBtn onClick={() => setDeleteOpen(true)}>
              Delete zone
            </DetailOutlineBtn>
            <DetailOutlineBtn disabled>Test record</DetailOutlineBtn>
            <DetailOutlineBtn disabled>
              Configure query logging
            </DetailOutlineBtn>
          </div>
        </div>

        <section className="mt-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => setDetailsOpen((open) => !open)}
              className="flex min-w-0 items-center gap-2 text-left text-[16px] font-bold leading-5 text-foreground"
              aria-expanded={detailsOpen}
            >
              <DetailCaretIcon open={detailsOpen} />
              <span>Hosted zone details</span>
            </button>
            <DetailOutlineBtn
              onClick={() => router.push(routes.hostedZoneEdit(zoneId))}
            >
              Edit hosted zone
            </DetailOutlineBtn>
          </div>
          {detailsOpen ? (
            <div className="grid gap-4 border-t border-border px-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="mt-5 flex items-center gap-1 border-b border-border">
          <DetailTabButton
            active={activeTab === "records"}
            onClick={() => setActiveTab("records")}
          >
            Records ({recordCount || detail.record_count})
          </DetailTabButton>
          <DetailTabButton
            active={activeTab === "tags"}
            onClick={() => setActiveTab("tags")}
          >
            Hosted zone tags ({tagsCountLabel})
          </DetailTabButton>
        </div>

        <div className="pt-4">
          {activeTab === "records" ? (
            <HostedZoneRecordsPanel
              zoneId={zoneId}
              domainName={detail.domain_name}
              recordCount={recordCount || detail.record_count}
              onCountChange={onCountChange}
            />
          ) : (
            <section className="rounded-2xl border border-border bg-card px-5 py-4">
              <HostedZoneTagsPanel
                tags={tags}
                loading={tagsLoading}
                error={tagsError}
              />
            </section>
          )}
        </div>
      </main>

      <DeleteHostedZoneModal
        zoneId={zoneId}
        domainName={detail.domain_name}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => {
          setDeleteOpen(false);
          router.push(
            `${routes.hostedZones}?deleted=${encodeURIComponent(detail.domain_name)}`,
          );
        }}
      />
    </>
  );
}
