"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createHostedZone } from "@/features/route53/api/hosted-zones-api";
import {
  FieldHint,
  FieldLabel,
  InfoLink,
  TextArea,
  TextInput,
} from "@/features/route53/components/form-bits";
import { ZoneTypeSelector } from "@/features/route53/components/zone-type-selector";
import {
  VpcAssociationPanel,
  newVpcRow,
  type VpcRow,
} from "@/features/route53/components/vpc-association-panel";
import {
  TagsPanel,
  type TagRow,
} from "@/features/route53/components/tags-panel";
import { getApiErrorMessage } from "@/features/auth/lib/api-error";
import { routes } from "@/features/route53/lib/routes";

const VALID_CHARS =
  'Valid characters: a-z, 0-9, ! " # $ % & \' ( ) * + , - / : ; < = > ? @ [ \\ ] ^ _ ` { | } . ~';

const DESC_MAX = 256;
const FIELD_WIDTH = "max-w-[960px]";

export function CreateHostedZoneContent() {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [zoneType, setZoneType] = useState<"public" | "private">("public");
  const [vpcs, setVpcs] = useState<VpcRow[]>([newVpcRow()]);
  const [tags, setTags] = useState<TagRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setError("");
    if (!domain.trim()) {
      setError("Domain name is required.");
      return;
    }
    if (zoneType === "private") {
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
    const incompleteTags = tags.some((t) => t.keyName.trim() === "");
    if (incompleteTags) {
      setError("Tag keys cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await createHostedZone({
        domain_name: domain.trim(),
        description: description.trim(),
        zone_type: zoneType,
        vpcs:
          zoneType === "private"
            ? vpcs
                .filter((v) => v.region.trim() && v.vpcId.trim())
                .map((v) => ({ region: v.region.trim(), vpc_id: v.vpcId.trim() }))
            : [],
        tags: tags
          .filter((t) => t.keyName.trim())
          .map((t) => ({ key: t.keyName.trim(), value: t.value.trim() })),
      });
      router.push(routes.hostedZones);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to create hosted zone"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-w-0 flex-1 overflow-auto bg-background px-3 pb-8 pt-4 text-[14px] leading-5 text-foreground sm:px-5">
      <div className="mb-4 flex items-baseline gap-2">
        <h1 className="text-[22px] font-bold leading-7 text-foreground sm:text-[24px]">Create hosted zone</h1>
        <InfoLink />
      </div>

      <section className="rounded-2xl border border-border bg-card px-5 py-4">
        <h2 className="text-[18px] font-bold leading-6 text-foreground">
          Hosted zone configuration
        </h2>
        <p className="mt-1 text-[14px] leading-5 text-muted-2">
          A hosted zone is a container that holds information about how you want to route traffic
          for a domain, such as example.com, and its subdomains.
        </p>

        <div className={`mt-5 ${FIELD_WIDTH}`}>
          <FieldLabel>Domain name</FieldLabel>
          <FieldHint>This is the name of the domain that you want to route traffic for.</FieldHint>
          <TextInput
            aria-label="Domain name"
            value={domain}
            onChange={setDomain}
            placeholder="example.com"
          />
          <p className="mt-1 text-[12px] leading-4 text-muted-3">{VALID_CHARS}</p>
        </div>

        <div className={`mt-5 ${FIELD_WIDTH}`}>
          <FieldLabel>Description - optional</FieldLabel>
          <FieldHint>
            This value lets you distinguish hosted zones that have the same name.
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

        <div className={`mt-5 ${FIELD_WIDTH}`}>
          <FieldLabel>Type</FieldLabel>
          <FieldHint>
            The type indicates whether you want to route traffic on the internet or in an Amazon
            VPC.
          </FieldHint>
          <ZoneTypeSelector value={zoneType} onChange={setZoneType} />
        </div>
      </section>

      {zoneType === "private" && (
        <VpcAssociationPanel rows={vpcs} onChange={setVpcs} />
      )}

      <TagsPanel tags={tags} onChange={setTags} />

      {error ? <p className="mt-4 text-[13px] text-danger">{error}</p> : null}

      <div className="mt-6 flex flex-wrap items-center justify-end gap-4 sm:gap-5">
        <Link
          href={routes.hostedZones}
          className="text-[14px] font-bold leading-5 text-aws-blue hover:underline"
        >
          Cancel
        </Link>
        <button
          type="button"
          disabled={loading}
          onClick={handleCreate}
          className="inline-flex h-8 items-center rounded-[20px] border-2 border-aws-orange bg-aws-orange px-5 text-[14px] font-[700] leading-none text-on-orange hover:border-aws-orange-hover hover:bg-aws-orange-hover disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create hosted zone"}
        </button>
      </div>
    </main>
  );
}
