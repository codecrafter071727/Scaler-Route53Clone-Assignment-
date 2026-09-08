"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  createRecordSet,
  getHostedZone,
  listRecordSets,
  type HostedZoneDetail,
  type RecordSet,
} from "@/features/route53/api/hosted-zones-api";
import { InfoLink } from "@/features/route53/components/form-bits";
import { ExistingRecordsSection } from "@/features/route53/components/existing-records-section";
import { QuickCreateRecordCard } from "@/features/route53/components/quick-create-record-card";
import {
  newRecordDraft,
  type RecordDraft,
} from "@/features/route53/data/record-form-options";
import { getApiErrorMessage } from "@/features/auth/lib/api-error";
import { routes } from "@/features/route53/lib/routes";

export function CreateRecordContent() {
  const params = useParams();
  const router = useRouter();
  const zoneId =
    typeof params.zoneId === "string" ? decodeURIComponent(params.zoneId) : "";
  const draftKey = useId();

  const [zone, setZone] = useState<HostedZoneDetail | null>(null);
  const [existing, setExisting] = useState<RecordSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  const [existingOpen, setExistingOpen] = useState(true);
  const [drafts, setDrafts] = useState<RecordDraft[]>(() => [
    newRecordDraft(`${draftKey}-1`),
  ]);

  const load = useCallback(async () => {
    if (!zoneId) {
      setError("Invalid hosted zone.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [zoneData, recordsPage] = await Promise.all([
        getHostedZone(zoneId),
        listRecordSets(zoneId, { page: 1, page_size: 100 }),
      ]);
      setZone(zoneData);
      setExisting(recordsPage.items);
    } catch {
      setError("Unable to load hosted zone.");
      setZone(null);
      setExisting([]);
    } finally {
      setLoading(false);
    }
  }, [zoneId]);

  useEffect(() => {
    void load();
  }, [load]);

  function resolveRecordName(subdomain: string, domain: string) {
    const root = domain.replace(/\.$/, "");
    const sub = subdomain.trim();
    if (!sub) return root;
    if (sub === root || sub.endsWith(`.${root}`)) return sub;
    return `${sub}.${root}`;
  }

  function addDraft() {
    setDrafts((rows) => [
      ...rows,
      newRecordDraft(`${draftKey}-${rows.length + 1}`),
    ]);
  }

  async function handleCreate() {
    if (!zone) return;
    setSubmitError("");
    setSaving(true);
    const startedAt = Date.now();
    try {
      for (const draft of drafts) {
        const ttl = Number(draft.ttl);
        if (!draft.alias && !draft.value.trim()) {
          throw new Error("Value is required when Alias is off.");
        }
        if (!Number.isFinite(ttl) || ttl < 0) {
          throw new Error("TTL must be a valid number.");
        }
        const values = draft.alias
          ? [draft.endpoint, draft.region].filter(Boolean)
          : draft.value
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);

        await createRecordSet(zoneId, {
          record_name: resolveRecordName(draft.subdomain, zone.domain_name),
          record_type: draft.recordType,
          routing_policy: draft.routingPolicy,
          alias: draft.alias,
          value: values,
          ttl: draft.alias ? 300 : ttl,
        });
      }

      const elapsed = Date.now() - startedAt;
      const waitMs = Math.max(0, 2000 - elapsed);
      if (waitMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }

      const lastName = resolveRecordName(
        drafts[drafts.length - 1]?.subdomain ?? "",
        zone.domain_name,
      );
      router.push(
        `${routes.hostedZone(zoneId)}?created=${encodeURIComponent(lastName)}`,
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? getApiErrorMessage(err, err.message)
          : getApiErrorMessage(err, "Unable to create records"),
      );
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-w-0 flex-1 overflow-auto bg-background px-6 pb-8 pt-5 text-[14px] text-muted-2">
        Loading…
      </main>
    );
  }

  if (error || !zone) {
    return (
      <main className="min-w-0 flex-1 overflow-auto bg-background px-6 pb-8 pt-5 text-[14px]">
        <p className="text-danger">{error || "Hosted zone not found."}</p>
        <Link href={routes.hostedZones} className="mt-3 inline-block text-aws-blue underline">
          Back to hosted zones
        </Link>
      </main>
    );
  }

  return (
    <main className="relative min-w-0 flex-1 overflow-auto bg-background px-3 pb-10 pt-5 text-[14px] leading-5 text-foreground sm:px-6">
      {saving ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="status"
          aria-live="polite"
          aria-label="Creating records"
        >
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface px-8 py-6 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
            <span
              className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-aws-blue"
              aria-hidden
            />
            <p className="text-[14px] font-bold text-foreground">
              Creating records…
            </p>
          </div>
        </div>
      ) : null}
      <div className="mb-4 flex items-baseline gap-2">
        <h1 className="text-[28px] font-bold leading-8 text-foreground">
          Create record
        </h1>
        <InfoLink />
      </div>

      <section className="rounded-2xl border border-border bg-card px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[18px] font-bold leading-6 text-foreground">
            Quick create record
          </h2>
          <a href="#" className="text-[14px] font-bold text-aws-blue hover:underline">
            Switch to wizard
          </a>
        </div>

        <div className="mt-4 space-y-4">
          {drafts.map((draft, index) => (
            <QuickCreateRecordCard
              key={draft.id}
              index={index}
              domainName={zone.domain_name}
              draft={draft}
              canDelete={drafts.length > 1}
              onChange={(next) =>
                setDrafts((rows) =>
                  rows.map((row) => (row.id === draft.id ? next : row)),
                )
              }
              onDelete={() =>
                setDrafts((rows) => rows.filter((row) => row.id !== draft.id))
              }
            />
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <OutlineBtn onClick={addDraft}>Add another record</OutlineBtn>
        </div>
      </section>

      {submitError ? (
        <p className="mt-4 text-[14px] text-danger">{submitError}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-end gap-4">
        <Link
          href={routes.hostedZone(zoneId)}
          className="text-[14px] font-bold text-aws-blue hover:underline"
        >
          Cancel
        </Link>
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleCreate()}
          className="inline-flex h-8 items-center rounded-[20px] border-2 border-aws-orange bg-aws-orange px-5 text-[14px] font-[700] leading-none text-on-orange hover:border-aws-orange-hover hover:bg-aws-orange-hover disabled:opacity-60"
        >
          {saving ? "Creating…" : "Create records"}
        </button>
      </div>

      <ExistingRecordsSection
        domainName={zone.domain_name}
        records={existing}
        open={existingOpen}
        onToggle={() => setExistingOpen((v) => !v)}
        onRefresh={() => void load()}
      />
    </main>
  );
}

function OutlineBtn({
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
      className="inline-flex h-8 items-center rounded-[20px] border-2 border-aws-blue bg-surface px-4 text-[14px] font-[700] leading-none text-aws-blue hover:bg-info"
    >
      {children}
    </button>
  );
}
