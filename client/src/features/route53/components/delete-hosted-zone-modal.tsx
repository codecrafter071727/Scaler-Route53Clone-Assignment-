"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteHostedZone } from "@/features/route53/api/hosted-zones-api";
import { routes } from "@/features/route53/lib/routes";
import { getApiErrorMessage } from "@/features/auth/lib/api-error";
import { CloseIcon } from "@/shared/icons";

type Props = {
  zoneId: string;
  domainName: string;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
};

export function DeleteHostedZoneModal({
  zoneId,
  domainName,
  open,
  onClose,
  onDeleted,
}: Props) {
  const router = useRouter();
  const labelId = useId();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const canDelete = confirmText.trim().toLowerCase() === "delete";

  useEffect(() => {
    if (!open) return;
    setConfirmText("");
    setError("");
    setDeleting(false);
  }, [open, zoneId]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !deleting) onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, deleting, onClose]);

  if (!open) return null;

  async function handleDelete() {
    if (!canDelete || deleting) return;
    setDeleting(true);
    setError("");
    try {
      await deleteHostedZone(zoneId);
      onDeleted();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to delete hosted zone"));
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-10 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="w-full max-w-[600px] rounded-2xl border border-border bg-card text-[14px] leading-5 text-foreground shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
          <h2
            id={labelId}
            className="text-[20px] font-bold leading-7 text-foreground"
          >
            Delete hosted zone {domainName}?
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={deleting}
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded text-muted-2 hover:bg-table-hover hover:text-foreground disabled:opacity-50"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 border-b border-border px-5 pb-4">
          <p className="text-foreground">
            Delete the hosted zone permanently? This action cannot be undone.
            Your domain might become unavailable on the internet.
          </p>

          <div className="rounded-[12px] border-2 border-[#855900] bg-[#fffef0] px-4 py-2 text-[#0f141a]">
            <div className="flex gap-3">
              <WarningIcon className="mt-1 h-4 w-4 shrink-0 text-[#855900]" />
              <div className="min-w-0 flex-1">
                <div className="font-bold leading-5 text-[#0f141a]">
                  Take these actions to delete hosted zone {domainName}
                </div>
                <p className="mt-3.5 text-[#0f141a]">
                  Complete the following steps to successfully delete this hosted
                  zone. If you don&apos;t complete the steps, the deletion might
                  be blocked by Route 53 service validation.
                </p>
                <ul className="mt-3.5 list-disc pl-10 text-[#0f141a]">
                  <li>
                    Delete all records in this hosted zone, except the default NS
                    and SOA records.
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(routes.hostedZone(zoneId));
                  }}
                  className="mt-3.5 inline-flex h-8 items-center rounded-[20px] border-2 border-[#424650] bg-white px-5 text-[14px] font-bold leading-none text-[#424650] hover:bg-[#f9f9fa]"
                >
                  Go to hosted zone details
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label
              htmlFor={`${labelId}-confirm`}
              className="block text-[14px] font-bold leading-5 text-foreground"
            >
              To confirm that you want to delete the hosted zone, enter{" "}
              <i>delete</i> in the field.
            </label>
            <input
              id={`${labelId}-confirm`}
              type="text"
              autoComplete="off"
              placeholder="delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-1 box-border h-8 w-full rounded-[8px] border border-[#8c8c94] bg-input px-3 text-[14px] text-foreground outline-none placeholder:italic placeholder:text-placeholder focus:border-aws-blue dark:border-border-strong"
            />
          </div>

          {error ? <p className="text-[13px] text-danger">{error}</p> : null}
        </div>

        <div className="flex items-center justify-end gap-5 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="text-[14px] font-bold text-aws-blue hover:underline disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canDelete || deleting}
            onClick={() => void handleDelete()}
            className="inline-flex h-8 items-center rounded-[20px] border-2 border-disabled-border bg-surface px-5 text-[14px] font-bold leading-none text-muted-2 disabled:cursor-not-allowed enabled:border-[#d91515] enabled:bg-[#d91515] enabled:text-white enabled:hover:border-[#b50e0e] enabled:hover:bg-[#b50e0e]"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 5v4M8 10v2M6.52 1.88l-5.33 9.76c-.13.23-.19.5-.19.76 0 .88.71 1.59 1.59 1.59H13.4c.88 0 1.59-.71 1.59-1.59 0-.27-.07-.53-.19-.76L9.48 1.88C9.18 1.34 8.62 1 8 1s-1.18.34-1.48.88Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
