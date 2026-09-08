"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  getHostedZone,
  listHostedZoneTags,
  type HostedZoneDetail,
  type HostedZoneTag,
} from "@/features/route53/api/hosted-zones-api";
import { HostedZoneTagsPanel } from "@/features/route53/components/hosted-zone-tags-panel";
import { SettingsIcon, ChevronTiny } from "@/shared/icons";

type Props = {
  zoneId: number | null;
  onClose: () => void;
};

type TabId = "details" | "tags";

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-3">
      <div className="break-all text-[14px] font-bold leading-5 text-foreground">
        {label}
      </div>
      <div className="break-all text-[14px] font-normal leading-5 text-foreground">
        {children}
      </div>
    </div>
  );
}

function DetailSection({ children }: { children: ReactNode }) {
  return <div className="my-2.5 w-full">{children}</div>;
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-[31px] w-[27px] items-center justify-center rounded-full p-1 text-sidebar-text hover:bg-surface-muted"
    >
      {children}
    </button>
  );
}

function PanelHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="shrink-0 px-4 pl-5 pr-4">
      <div className="my-3.5 flex items-start justify-between gap-2">
        <h2 className="mt-[5px] min-w-0 flex-1 text-[18px] font-bold leading-[22px] tracking-[-0.18px] text-foreground">
          {title}
        </h2>
        <div className="ml-2 flex shrink-0 items-center">
          <IconBtn label="Split panel preferences">
            <SettingsIcon className="h-4 w-4" />
          </IconBtn>
          <span className="mx-2 my-1 h-[23px] w-px bg-border" aria-hidden />
          <IconBtn label="Close" onClick={onClose}>
            <ChevronTiny className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>
    </div>
  );
}

function EmptySelection() {
  return (
    <p className="text-[14px] font-normal leading-5 text-foreground">
      Select a hosted zone to see its details
    </p>
  );
}

function ZoneDetailFields({ detail }: { detail: HostedZoneDetail }) {
  return (
    <div className="flex flex-col px-4">
      <DetailSection>
        <DetailField label="Hosted zone name">{detail.domain_name}</DetailField>
        <DetailField label="Hosted zone ID">{detail.hosted_zone_id}</DetailField>
        <DetailField label="Description">{detail.description || "—"}</DetailField>
      </DetailSection>
      <DetailSection>
        <DetailField label="Type">
          {detail.zone_type === "private"
            ? "Private hosted zone"
            : "Public hosted zone"}
        </DetailField>
        <DetailField label="Record count">{detail.record_count}</DetailField>
      </DetailSection>
      {detail.zone_type === "private" ? (
        <DetailSection>
          <DetailField label="Associated VPCs">
            {detail.vpcs.length === 0
              ? "—"
              : detail.vpcs.map((vpc, index) => (
                  <div key={`${vpc.vpc_id}-${index}`}>
                    {vpc.vpc_id} | {vpc.region}
                  </div>
                ))}
          </DetailField>
        </DetailSection>
      ) : null}
    </div>
  );
}

function ZoneDetails({ zoneId }: { zoneId: number }) {
  const [detail, setDetail] = useState<HostedZoneDetail | null>(null);
  const [tags, setTags] = useState<HostedZoneTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [error, setError] = useState("");
  const [tagsError, setTagsError] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("details");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setDetail(null);
    setActiveTab("details");

    getHostedZone(zoneId)
      .then((zone) => {
        if (active) setDetail(zone);
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

  if (loading) return <p className="px-4 py-6 text-muted-2">Loading details…</p>;
  if (error) return <p className="px-4 py-6 text-danger">{error}</p>;
  if (!detail) return null;

  const tabClass = (tab: TabId) =>
    `flex-1 border-b-2 px-3 py-2 text-center text-[14px] font-bold leading-5 ${
      activeTab === tab
        ? "border-aws-blue text-aws-blue"
        : "border-transparent text-muted-2 hover:text-foreground"
    }`;

  const tagsCountLabel = tagsLoading ? "…" : String(tags.length);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-px border-b border-border bg-surface-muted px-4">
        <button
          type="button"
          onClick={() => setActiveTab("details")}
          className={tabClass("details")}
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tags")}
          className={tabClass("tags")}
        >
          Hosted zone tags ({tagsCountLabel})
        </button>
      </div>

      {activeTab === "details" ? <ZoneDetailFields detail={detail} /> : null}
      {activeTab === "tags" ? (
        <div className="px-4">
          <HostedZoneTagsPanel
            tags={tags}
            loading={tagsLoading}
            error={tagsError}
          />
        </div>
      ) : null}
    </div>
  );
}

export function HostedZoneDetailsPanel({ zoneId, onClose }: Props) {
  const empty = zoneId == null;

  return (
    <>
      <button
        type="button"
        aria-label="Close details panel"
        className="absolute inset-0 z-30 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      <aside className="absolute inset-y-0 right-0 z-40 flex h-full w-[min(320px,92vw)] flex-col overflow-auto border-l border-border bg-surface text-[14px] leading-5 text-foreground shadow-xl lg:static lg:z-0 lg:w-[282px] lg:shrink-0 lg:shadow-none">
        <PanelHeader
          title={empty ? "0 hosted zone selected" : "Hosted zone details"}
          onClose={onClose}
        />
        <div className="min-h-0 flex-1 pb-5 pt-0">
          {empty ? (
            <div className="px-4">
              <EmptySelection />
            </div>
          ) : (
            <ZoneDetails zoneId={zoneId} />
          )}
        </div>
      </aside>
    </>
  );
}
