"use client";

import { FieldLabel, InfoLink } from "@/features/route53/components/form-bits";
import {
  CaretDown,
  CloseIcon,
  ExternalLinkIcon,
  InfoCircleIcon,
  SearchIcon,
} from "@/shared/icons";

export type VpcRow = {
  id: string;
  region: string;
  vpcId: string;
};

export const VPC_REGIONS = [
  "US East (N. Virginia) us-east-1",
  "US East (Ohio) us-east-2",
  "US West (N. California) us-west-1",
  "US West (Oregon) us-west-2",
  "Asia Pacific (Mumbai) ap-south-1",
  "Europe (Ireland) eu-west-1",
];

const BTN =
  "inline-flex h-8 shrink-0 items-center rounded-[20px] border-2 border-[#006ce0] bg-white px-4 text-[14px] font-bold leading-none text-[#006ce0] hover:bg-[#f2f8fd]";

export function newVpcRow(): VpcRow {
  return { id: crypto.randomUUID(), region: "", vpcId: "" };
}

type Props = {
  rows: VpcRow[];
  onChange: (rows: VpcRow[]) => void;
};

export function VpcAssociationPanel({ rows, onChange }: Props) {
  const duplicateIds = new Set(
    rows
      .map((r) => r.vpcId.trim().toLowerCase())
      .filter((id) => id)
      .filter((id, _, all) => all.filter((x) => x === id).length > 1),
  );

  function updateRow(id: string, patch: Partial<VpcRow>) {
    onChange(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeRow(id: string) {
    if (rows.length <= 1) {
      onChange([newVpcRow()]);
      return;
    }
    onChange(rows.filter((row) => row.id !== id));
  }

  return (
    <section className="mt-3 rounded-2xl border border-[#d5dbdb] bg-white px-5 py-4">
      <div className="flex items-center gap-2 text-[18px] font-bold leading-6 text-[#0f141a]">
        <span>VPCs to associate with the hosted zone</span>
        <InfoLink />
      </div>
      <p className="mt-1 max-w-4xl text-[14px] leading-5 text-[#545b64]">
        To use this hosted zone to resolve DNS queries for one or more VPCs, choose the VPCs. To
        associate a VPC with a hosted zone when the VPC was created using a different AWS account,
        you must use a programmatic method, such as the AWS CLI.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-md border border-[#006ce0] bg-[#f2f8fd] px-4 py-3">
        <InfoCircleIcon className="h-4 w-4 shrink-0 text-[#006ce0]" />
        <p className="min-w-0 flex-1 text-[14px] leading-5 text-[#0f141a]">
          For each VPC that you associate with a private hosted zone, you must set the Amazon VPC
          settings{" "}
          <a
            href="https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[#006ce0] underline underline-offset-2 hover:text-[#002b66]"
          >
            enableDnsHostnames and enableDnsSupport
            <ExternalLinkIcon className="h-3 w-3" />
          </a>{" "}
          to true.
        </p>
        <span className="shrink-0 text-[#545b64]" aria-hidden>
          <CloseIcon className="h-3.5 w-3.5 opacity-40" />
        </span>
      </div>

      <div className="mt-4 max-w-[1200px] space-y-3">
        {rows.map((row, index) => {
          const isDuplicate = duplicateIds.has(row.vpcId.trim().toLowerCase());
          return (
          <div
            key={row.id}
            className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          >
            <div className="min-w-0">
              {index === 0 && <FieldLabel>Region</FieldLabel>}
              <div className="relative">
                <select
                  aria-label="Region"
                  value={row.region}
                  onChange={(e) => updateRow(row.id, { region: e.target.value })}
                  className="box-border h-8 w-full appearance-none rounded-[8px] border border-[#7d8998] bg-white py-0 pl-3 pr-9 text-[14px] text-[#0f141a] outline-none focus:border-[#006ce0]"
                >
                  <option value="">Choose region</option>
                  {VPC_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                <CaretDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#006ce0]" />
              </div>
            </div>

            <div className="min-w-0">
              {index === 0 && <FieldLabel>VPC ID</FieldLabel>}
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#656871]" />
                <input
                  aria-label="VPC ID"
                  aria-invalid={isDuplicate}
                  value={row.vpcId}
                  onChange={(e) => updateRow(row.id, { vpcId: e.target.value })}
                  placeholder="Choose VPC"
                  className={`box-border h-8 w-full rounded-[8px] border bg-white py-0 pl-9 pr-3 text-[14px] text-[#0f141a] outline-none placeholder:italic placeholder:text-[#687078] ${
                    isDuplicate
                      ? "border-[#d91515] focus:border-[#d91515]"
                      : "border-[#7d8998] focus:border-[#006ce0]"
                  }`}
                />
              </div>
              {isDuplicate ? (
                <p className="mt-1 text-[12px] font-bold leading-4 text-[#d91515]">
                  VPC ID must be unique.
                </p>
              ) : null}
            </div>

            <div className="min-w-0">
              {index === 0 && <div className="mb-1 h-5" aria-hidden />}
              <button type="button" className={BTN} onClick={() => removeRow(row.id)}>
                Remove VPC
              </button>
            </div>
          </div>
          );
        })}
      </div>

      <button
        type="button"
        className={`${BTN} mt-4`}
        onClick={() => onChange([...rows, newVpcRow()])}
      >
        Add VPC
      </button>
    </section>
  );
}
