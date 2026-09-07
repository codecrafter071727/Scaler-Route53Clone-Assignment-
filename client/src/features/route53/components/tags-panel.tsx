"use client";

import { useState } from "react";
import { InfoLink } from "@/features/route53/components/form-bits";
import { CloseIcon, SearchIcon } from "@/shared/icons";

type TagRow = {
  id: string;
  keyName: string;
  value: string;
};

const MAX_TAGS = 50;

const BTN =
  "inline-flex h-8 shrink-0 items-center rounded-[20px] border-2 border-[#006ce0] bg-white px-4 text-[14px] font-bold leading-none text-[#006ce0] hover:bg-[#f2f8fd] disabled:cursor-not-allowed disabled:border-[#aab7b8] disabled:text-[#687078] disabled:hover:bg-white";

const INPUT =
  "box-border h-8 w-full rounded-[8px] border bg-white py-0 pl-9 pr-3 text-[14px] text-[#0f141a] outline-none placeholder:italic placeholder:text-[#687078]";

function newTag(): TagRow {
  return { id: crypto.randomUUID(), keyName: "", value: "" };
}

export function TagsPanel() {
  const [tags, setTags] = useState<TagRow[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const remaining = MAX_TAGS - tags.length;

  function addTag() {
    if (tags.length >= MAX_TAGS) return;
    setTags((prev) => [...prev, newTag()]);
  }

  function removeTag(id: string) {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
    setTouched((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function updateTag(id: string, patch: Partial<TagRow>) {
    setTags((prev) => prev.map((tag) => (tag.id === id ? { ...tag, ...patch } : tag)));
  }

  return (
    <section className="mt-3 rounded-2xl border border-[#d5dbdb] bg-white px-5 py-4">
      <div className="flex items-center gap-2 text-[18px] font-bold leading-6 text-[#0f141a]">
        <span>Tags</span>
        <InfoLink />
      </div>
      <p className="mt-1 text-[14px] leading-5 text-[#545b64]">
        Apply tags to hosted zones to help organize and identify them.
      </p>

      {tags.length === 0 ? (
        <p className="mt-3 text-[14px] leading-5 text-[#545b64]">
          No tags associated with the resource.
        </p>
      ) : (
        <div className="mt-4 max-w-[1200px] space-y-3">
          {tags.map((tag, index) => {
            const showError = tag.keyName.trim() === "" && Boolean(touched[tag.id]);

            return (
              <div
                key={tag.id}
                className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  {index === 0 && (
                    <div className="mb-1 text-[14px] font-bold leading-5 text-[#0f141a]">Key</div>
                  )}
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#656871]" />
                    <input
                      aria-label="Tag key"
                      aria-invalid={showError}
                      value={tag.keyName}
                      onChange={(e) => updateTag(tag.id, { keyName: e.target.value })}
                      onBlur={() => setTouched((prev) => ({ ...prev, [tag.id]: true }))}
                      placeholder="Enter key"
                      className={`${INPUT} ${
                        showError
                          ? "border-[#d91515] focus:border-[#d91515]"
                          : "border-[#7d8998] focus:border-[#006ce0]"
                      }`}
                    />
                  </div>
                  {showError && (
                    <p className="mt-1 flex items-center gap-1.5 text-[12px] font-bold leading-4 text-[#d91515]">
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#d91515] text-white">
                        <CloseIcon className="h-2 w-2" />
                      </span>
                      Key is empty.
                    </p>
                  )}
                </div>

                <div className="min-w-0">
                  {index === 0 && (
                    <div className="mb-1 text-[14px] font-bold leading-5 text-[#0f141a]">
                      Value - <span className="italic">optional</span>
                    </div>
                  )}
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#656871]" />
                    <input
                      aria-label="Tag value"
                      value={tag.value}
                      onChange={(e) => updateTag(tag.id, { value: e.target.value })}
                      placeholder="Enter value"
                      className={`${INPUT} border-[#7d8998] focus:border-[#006ce0]`}
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  {index === 0 && <div className="mb-1 h-5" aria-hidden />}
                  <button type="button" className={BTN} onClick={() => removeTag(tag.id)}>
                    Remove tag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className={`${BTN} mt-3`}
        onClick={addTag}
        disabled={tags.length >= MAX_TAGS}
      >
        Add tag
      </button>
      <p className="mt-2 text-[12px] leading-4 text-[#687078]">
        You can add up to {remaining} more tag{remaining === 1 ? "" : "s"}.
      </p>
    </section>
  );
}
