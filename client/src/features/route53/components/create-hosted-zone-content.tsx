"use client";

import Link from "next/link";
import { useState } from "react";
import { FieldHint, FieldLabel, TextInput } from "@/features/route53/components/form-bits";
import { ZoneTypeSelector } from "@/features/route53/components/zone-type-selector";

const VALID_CHARS =
  'Valid characters: a-z, 0-9, ! " # $ % & \' ( ) * + , - / : ; < = > ? @ [ \\ ] ^ _ ` { | } . ~';

const DESC_MAX = 256;

export function CreateHostedZoneContent() {
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [zoneType, setZoneType] = useState<"public" | "private">("public");

  return (
    <main className="min-w-0 flex-1 overflow-auto bg-[#f2f3f3] px-10 pb-10 pt-6 text-[14px] leading-5 text-[#0f141a]">
      <div className="mb-6 flex items-baseline gap-2">
        <h1 className="text-[28px] font-bold leading-9 text-[#0f141a]">Create hosted zone</h1>
        <a href="#" className="text-[14px] text-[#006ce0] hover:underline">
          Info
        </a>
      </div>

      {/* Hosted zone configuration */}
      <section className="rounded-2xl border border-[#d5dbdb] bg-white px-6 py-5">
        <h2 className="text-[18px] font-bold leading-6 text-[#0f141a]">
          Hosted zone configuration
        </h2>
        <p className="mt-1 max-w-4xl text-[14px] leading-5 text-[#545b64]">
          A hosted zone is a container that holds information about how you want to route traffic
          for a domain, such as example.com, and its subdomains.
        </p>

        <div className="mt-5">
          <FieldLabel>Domain name</FieldLabel>
          <FieldHint>This is the name of the domain that you want to route traffic for.</FieldHint>
          <TextInput
            aria-label="Domain name"
            value={domain}
            onChange={setDomain}
            placeholder="example.com"
          />
          <p className="mt-1.5 max-w-3xl text-[12px] leading-4 text-[#687078]">{VALID_CHARS}</p>
        </div>

        <div className="mt-6">
          <FieldLabel>Description - optional</FieldLabel>
          <FieldHint>
            This value lets you distinguish hosted zones that have the same name.
          </FieldHint>
          <textarea
            aria-label="Description"
            value={description}
            maxLength={DESC_MAX}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="The hosted zone is used for..."
            rows={3}
            className="w-full max-w-[640px] resize-y rounded-lg border border-[#7d8998] bg-white px-3 py-2 text-[14px] text-[#0f141a] outline-none placeholder:italic placeholder:text-[#687078] focus:border-[#006ce0]"
          />
          <p className="mt-1.5 text-[12px] leading-4 text-[#687078]">
            The description can have up to {DESC_MAX} characters. {description.length}/{DESC_MAX}
          </p>
        </div>

        <div className="mt-6">
          <FieldLabel>Type</FieldLabel>
          <FieldHint>
            The type indicates whether you want to route traffic on the internet or in an Amazon
            VPC.
          </FieldHint>
          <ZoneTypeSelector value={zoneType} onChange={setZoneType} />
        </div>
      </section>

      {/* Tags */}
      <section className="mt-5 rounded-2xl border border-[#d5dbdb] bg-white px-6 py-5">
        <div className="text-[18px] font-bold leading-6 text-[#0f141a]">
          Tags
          <a
            href="#"
            className="ml-1.5 text-[14px] font-normal leading-5 text-[#006ce0] hover:underline"
          >
            Info
          </a>
        </div>
        <p className="mt-1 text-[14px] leading-5 text-[#545b64]">
          Apply tags to hosted zones to help organize and identify them.
        </p>
        <p className="mt-4 text-[14px] leading-5 text-[#545b64]">
          No tags associated with the resource.
        </p>
        <button
          type="button"
          className="mt-3 inline-flex h-8 items-center rounded-[20px] border-2 border-[#006ce0] bg-white px-5 text-[14px] font-bold leading-none text-[#006ce0] hover:bg-[#f2f8fd]"
        >
          Add tag
        </button>
        <p className="mt-2 text-[12px] leading-4 text-[#687078]">You can add up to 50 more tags.</p>
      </section>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-end gap-5">
        <Link
          href="/hostedzones"
          className="text-[14px] font-bold leading-5 text-[#006ce0] hover:underline"
        >
          Cancel
        </Link>
        <button
          type="button"
          className="inline-flex h-8 items-center rounded-[20px] border-2 border-[#ff9900] bg-[#ff9900] px-5 text-[14px] font-[700] leading-none text-[#0f141a] hover:border-[#ec7211] hover:bg-[#ec7211]"
        >
          Create hosted zone
        </button>
      </div>
    </main>
  );
}
