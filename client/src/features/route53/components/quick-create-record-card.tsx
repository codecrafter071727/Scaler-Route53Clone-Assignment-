"use client";

import { FieldLabel } from "@/features/route53/components/form-bits";
import { AwsSelect } from "@/features/route53/components/aws-select";
import {
  RECORD_TYPES,
  ROUTING_POLICIES,
  type RecordDraft,
} from "@/features/route53/data/record-form-options";

type Props = {
  index: number;
  domainName: string;
  draft: RecordDraft;
  canDelete: boolean;
  onChange: (next: RecordDraft) => void;
  onDelete: () => void;
};

const FIELD =
  "box-border block w-full min-w-0 rounded-[8px] border border-[#7d8998] bg-white text-[14px] leading-5 text-[#0f141a] outline-none placeholder:italic placeholder:text-[#687078] focus:border-[#006ce0]";

export function QuickCreateRecordCard({
  index,
  domainName,
  draft,
  canDelete,
  onChange,
  onDelete,
}: Props) {
  const suffix = domainName.replace(/\.$/, "");

  function patch(partial: Partial<RecordDraft>) {
    onChange({ ...draft, ...partial });
  }

  return (
    <div className="border-t border-[#d5dbdb] pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => patch({ open: !draft.open })}
          className="flex items-center gap-2 text-[16px] font-bold leading-5 text-[#0f141a]"
          aria-expanded={draft.open}
        >
          <Caret open={draft.open} />
          <span>Record {index + 1}</span>
        </button>
        <button
          type="button"
          disabled={!canDelete}
          onClick={onDelete}
          className="inline-flex h-8 items-center rounded-[20px] border border-[#7d8998] bg-white px-4 text-[14px] font-bold text-[#0f141a] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:border-[#d5dbdb] disabled:text-[#687078]"
        >
          Delete
        </button>
      </div>

      {draft.open ? (
        <div className="mt-4 grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-2">
          <div>
            <FieldLabel>Record name</FieldLabel>
            <div className="flex items-center gap-2">
              <input
                aria-label="Record name"
                value={draft.subdomain}
                onChange={(e) => patch({ subdomain: e.target.value })}
                placeholder="subdomain"
                className={`${FIELD} h-8 min-w-0 flex-1 px-3`}
              />
              <span className="shrink-0 text-[14px] text-[#0f141a]">
                .{suffix}
              </span>
            </div>
            <p className="mt-1 text-[14px] leading-5 text-[#545b64]">
              Keep blank to create a record for the root domain.
            </p>
          </div>

          <div>
            <FieldLabel>Record type</FieldLabel>
            <AwsSelect
              aria-label="Record type"
              value={draft.recordType}
              options={RECORD_TYPES}
              onChange={(recordType) => patch({ recordType })}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <AliasToggle
                checked={draft.alias}
                onChange={(alias) => patch({ alias })}
              />
              <span className="text-[14px] font-normal leading-5 text-[#16191f]">
                Alias
              </span>
            </div>
          </div>

          {draft.alias ? (
            <>
              <div>
                <FieldLabel>Route traffic to</FieldLabel>
                <div className="space-y-2">
                  <AwsSelect
                    aria-label="Choose endpoint"
                    value={draft.endpoint || "__endpoint__"}
                    options={[
                      { value: "__endpoint__", label: "Choose endpoint" },
                      {
                        value: "alias-a",
                        label:
                          "Alias to Application and Classic Load Balancer",
                      },
                      {
                        value: "alias-s3",
                        label: "Alias to S3 website endpoint",
                      },
                      {
                        value: "alias-cloudfront",
                        label: "Alias to CloudFront distribution",
                      },
                      {
                        value: "alias-another",
                        label: "Alias to another record in this hosted zone",
                      },
                    ]}
                    onChange={(endpoint) =>
                      patch({
                        endpoint: endpoint === "__endpoint__" ? "" : endpoint,
                      })
                    }
                  />
                  <AwsSelect
                    aria-label="Choose Region"
                    value={draft.region || "__region__"}
                    options={[
                      { value: "__region__", label: "Choose Region" },
                      { value: "us-east-1", label: "US East (N. Virginia)" },
                      { value: "us-west-2", label: "US West (Oregon)" },
                      { value: "eu-west-1", label: "Europe (Ireland)" },
                      { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
                    ]}
                    onChange={(region) =>
                      patch({ region: region === "__region__" ? "" : region })
                    }
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Routing policy</FieldLabel>
                <AwsSelect
                  aria-label="Routing policy"
                  value={draft.routingPolicy}
                  options={ROUTING_POLICIES}
                  onChange={(routingPolicy) => patch({ routingPolicy })}
                />
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-2 lg:max-w-[calc(50%-1.25rem)]">
                <FieldLabel>Value</FieldLabel>
                <textarea
                  aria-label="Value"
                  value={draft.value}
                  onChange={(e) => patch({ value: e.target.value })}
                  placeholder="192.0.2.235"
                  rows={4}
                  className={`${FIELD} min-h-[96px] resize-y px-3 py-2`}
                />
                <p className="mt-1 text-[14px] leading-5 text-[#545b64]">
                  Enter multiple values on separate lines.
                </p>
              </div>

              <div>
                <FieldLabel>TTL (seconds)</FieldLabel>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    aria-label="TTL (seconds)"
                    value={draft.ttl}
                    onChange={(e) => patch({ ttl: e.target.value })}
                    className={`${FIELD} h-8 w-[140px] shrink-0 px-3`}
                  />
                  {[
                    { label: "1m", seconds: "60" },
                    { label: "1h", seconds: "3600" },
                    { label: "1d", seconds: "86400" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => patch({ ttl: preset.seconds })}
                      className="inline-flex h-8 items-center rounded-[20px] border-2 border-[#006ce0] bg-white px-3.5 text-[14px] font-bold text-[#006ce0] hover:bg-[#f2f8fd]"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[14px] leading-5 text-[#545b64]">
                  Recommended values: 60 to 172800 (two days)
                </p>
              </div>

              <div>
                <FieldLabel>Routing policy</FieldLabel>
                <AwsSelect
                  aria-label="Routing policy"
                  value={draft.routingPolicy}
                  options={ROUTING_POLICIES}
                  onChange={(routingPolicy) => patch({ routingPolicy })}
                />
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function AliasToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Alias"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-4 w-8 shrink-0 items-center rounded-full p-[2px] transition-colors ${
        checked ? "bg-[#006ce0]" : "bg-[#545b64]"
      }`}
    >
      <span
        className={`block h-3 w-3 rounded-full bg-white transition-transform duration-150 ease-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-2.5 w-2.5 shrink-0 text-[#0f141a] transition-transform ${
        open ? "" : "-rotate-90"
      }`}
      viewBox="0 0 10 10"
      fill="currentColor"
      aria-hidden
    >
      <path d="M1.5 3.2 5 7.2 8.5 3.2H1.5Z" />
    </svg>
  );
}
