"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getHostedZone,
  updateHostedZone,
  type HostedZoneDetail,
} from "@/features/route53/api/hosted-zones-api";
import {
  FieldHint,
  FieldLabel,
  InfoLink,
  TextArea,
} from "@/features/route53/components/form-bits";
import {
  TagsPanel,
  type TagRow,
} from "@/features/route53/components/tags-panel";
import {
  VpcAssociationPanel,
  newVpcRow,
  type VpcRow,
} from "@/features/route53/components/vpc-association-panel";
import { getApiErrorMessage } from "@/features/auth/lib/api-error";

const DESC_MAX = 256;
const FIELD_WIDTH = "max-w-[720px]";

export function EditHostedZoneContent() {
  const params = useParams();
  const router = useRouter();
  const zoneId = Number(params.id);

  const [detail, setDetail] = useState<HostedZoneDetail | null>(null);
  const [description, setDescription] = useState("");
  const [vpcs, setVpcs] = useState<VpcRow[]>([newVpcRow()]);
  const [tags, setTags] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!Number.isFinite(zoneId)) {
      setLoadError("Invalid hosted zone.");
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    getHostedZone(zoneId)
      .then((zone) => {
        if (!active) return;
        setDetail(zone);
        setDescription(zone.description || "");
        setVpcs(
          zone.vpcs.length > 0
            ? zone.vpcs.map((v) => ({
                id: crypto.randomUUID(),
                region: v.region,
                vpcId: v.vpc_id,
              }))
            : [newVpcRow()],
        );
        setTags(
          zone.tags.map((t) => ({
            id: crypto.randomUUID(),
            keyName: t.key,
            value: t.value,
          })),
        );
      })
      .catch(() => {
        if (active) setLoadError("Unable to load hosted zone.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [zoneId]);

  async function handleSave() {
    if (!detail) return;
    setError("");

    if (detail.zone_type === "private") {
      const filled = vpcs.filter((v) => v.region.trim() && v.vpcId.trim());
      if (filled.length === 0) {
        setError("Private hosted zones require at least one VPC (region + VPC ID).");
        return;
      }
      const vpcIds = filled.map((v) => v.vpcId.trim().toLowerCase());
      if (new Set(vpcIds).size !== vpcIds.length) {
        setError("Each VPC ID must be unique. Remove duplicate VPC IDs.");
        return;
      }
    }
    if (tags.some((t) => t.keyName.trim() === "")) {
      setError("Tag keys cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      await updateHostedZone(zoneId, {
        description: description.trim(),
        vpcs:
          detail.zone_type === "private"
            ? vpcs
                .filter((v) => v.region.trim() && v.vpcId.trim())
                .map((v) => ({
                  region: v.region.trim(),
                  vpc_id: v.vpcId.trim(),
                }))
            : [],
        tags: tags
          .filter((t) => t.keyName.trim())
          .map((t) => ({ key: t.keyName.trim(), value: t.value.trim() })),
      });
      router.push(`/hostedzones/${zoneId}`);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to save changes"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-w-0 flex-1 overflow-auto bg-background px-5 pb-8 pt-4 text-[14px] text-muted-2">
        Loading…
      </main>
    );
  }

  if (loadError || !detail) {
    return (
      <main className="min-w-0 flex-1 overflow-auto bg-background px-5 pb-8 pt-4 text-[14px]">
        <p className="text-danger">{loadError || "Hosted zone not found."}</p>
        <Link href="/hostedzones" className="mt-3 inline-block text-aws-blue underline">
          Back to hosted zones
        </Link>
      </main>
    );
  }

  const isPrivate = detail.zone_type === "private";

  return (
    <main className="min-w-0 flex-1 overflow-auto bg-background px-5 pb-8 pt-4 text-[14px] leading-5 text-foreground">
      <div className="mb-4 flex items-baseline gap-2">
        <h1 className="text-[28px] font-bold leading-8 text-foreground">
          Edit {detail.domain_name}
        </h1>
        <InfoLink />
      </div>

      <section className="rounded-2xl border border-border bg-card px-5 py-4">
        <h2 className="text-[18px] font-bold leading-6 text-foreground">
          Edit hosted zone
        </h2>
        <p className="mt-1 text-[14px] leading-5 text-muted-2">
          A hosted zone is a container that holds information about how you want
          to route traffic for a domain, such as example.com, and its subdomains.
        </p>

        <div className={`mt-5 space-y-5 ${FIELD_WIDTH}`}>
          <ReadOnlyField label="Domain name" value={detail.domain_name} />
          <ReadOnlyField label="Hosted zone ID" value={detail.hosted_zone_id} />
          <ReadOnlyField
            label="Record count"
            value={String(detail.record_count)}
          />
          <ReadOnlyField
            label="Type"
            value={
              isPrivate ? "Private hosted zone" : "Public hosted zone"
            }
          />

          <div>
            <FieldLabel>Description - optional</FieldLabel>
            <FieldHint>
              This value lets you distinguish hosted zones that have the same
              name.
            </FieldHint>
            <TextArea
              aria-label="Description"
              value={description}
              maxLength={DESC_MAX}
              onChange={setDescription}
              placeholder="The hosted zone is used for..."
            />
            <div className="mt-1 flex justify-between gap-4 text-[12px] leading-4 text-muted-3">
              <span>The description can have up to {DESC_MAX} characters.</span>
              <span className="shrink-0 tabular-nums">
                {description.length}/{DESC_MAX}
              </span>
            </div>
          </div>
        </div>
      </section>

      {isPrivate ? (
        <VpcAssociationPanel rows={vpcs} onChange={setVpcs} />
      ) : null}

      <TagsPanel tags={tags} onChange={setTags} />

      {error ? <p className="mt-4 text-[13px] text-danger">{error}</p> : null}

      <div className="mt-6 flex items-center justify-end gap-5">
        <Link
          href={`/hostedzones/${zoneId}`}
          className="text-[14px] font-bold leading-5 text-aws-blue hover:underline"
        >
          Cancel
        </Link>
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="inline-flex h-8 items-center rounded-[20px] border-2 border-aws-orange bg-aws-orange px-5 text-[14px] font-[700] leading-none text-on-orange hover:border-aws-orange-hover hover:bg-aws-orange-hover disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </main>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-0.5 text-[14px] font-bold leading-5 text-foreground">
        {label}
      </div>
      <div className="break-all text-[14px] font-normal leading-5 text-foreground">
        {value}
      </div>
    </div>
  );
}
