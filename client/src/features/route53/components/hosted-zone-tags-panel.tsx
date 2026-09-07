"use client";

import type { HostedZoneTag } from "@/features/route53/api/hosted-zones-api";

type Props = {
  tags: HostedZoneTag[];
  loading: boolean;
  error: string;
};

export function HostedZoneTagsPanel({ tags, loading, error }: Props) {
  if (loading) {
    return <p className="py-6 text-[14px] text-muted-2">Loading tags…</p>;
  }

  if (error) {
    return <p className="py-6 text-[14px] text-danger">{error}</p>;
  }

  if (tags.length === 0) {
    return (
      <p className="py-1 text-[14px] font-normal leading-5 text-muted-2">
        No tags associated with the resource.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[14px] text-foreground">
        <thead>
          <tr className="border-y border-border">
            <th className="px-2 py-2 text-[12px] font-bold uppercase tracking-[0.05em] text-muted-3">
              Key
            </th>
            <th className="px-2 py-2 text-[12px] font-bold uppercase tracking-[0.05em] text-muted-3">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.key} className="border-b border-border">
              <td className="break-all px-2 py-2">{tag.key}</td>
              <td className="break-all px-2 py-2">{tag.value || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
