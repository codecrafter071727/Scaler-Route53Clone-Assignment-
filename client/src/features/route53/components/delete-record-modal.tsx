"use client";

import { useEffect, useId, useState } from "react";
import {
  deleteRecordSet,
  type RecordSet,
} from "@/features/route53/api/hosted-zones-api";
import { getApiErrorMessage } from "@/features/auth/lib/api-error";
import { CloseIcon } from "@/shared/icons";

type Props = {
  zoneId: string;
  records: RecordSet[];
  open: boolean;
  onClose: () => void;
  onDeleted: (deleted: RecordSet[]) => void;
};

export function DeleteRecordModal({
  zoneId,
  records,
  open,
  onClose,
  onDeleted,
}: Props) {
  const labelId = useId();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const canDelete = confirmText.trim().toLowerCase() === "delete";
  const isMulti = records.length > 1;
  const title = isMulti
    ? `Delete ${records.length} records?`
    : `Delete record ${records[0]?.record_name ?? ""}?`;

  useEffect(() => {
    if (!open) return;
    setConfirmText("");
    setError("");
    setDeleting(false);
  }, [open, records]);

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

  if (!open || records.length === 0) return null;

  async function handleDelete() {
    if (!canDelete || deleting) return;
    setDeleting(true);
    setError("");
    try {
      for (const record of records) {
        await deleteRecordSet(zoneId, record.id);
      }
      onDeleted(records);
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to delete record"));
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
            {title}
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
            {isMulti
              ? "Delete these records permanently? This action cannot be undone."
              : `Delete record ${records[0].record_type} for ${records[0].record_name} permanently? This action cannot be undone.`}
          </p>

          {isMulti ? (
            <ul className="list-disc space-y-1 pl-6 text-foreground">
              {records.map((r) => (
                <li key={r.id}>
                  {r.record_name} ({r.record_type})
                </li>
              ))}
            </ul>
          ) : null}

          <div className="pt-1">
            <label
              htmlFor={`${labelId}-confirm`}
              className="block text-[14px] font-bold leading-5 text-foreground"
            >
              To confirm that you want to delete{" "}
              {isMulti ? "these records" : "this record"}, enter <i>delete</i>{" "}
              in the field.
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
