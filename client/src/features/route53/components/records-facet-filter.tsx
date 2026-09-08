"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SearchIcon } from "@/shared/icons";

type Option = { value: string; label: string };

type Props = {
  label: string;
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
};

export function RecordsFacetFilter({
  label,
  options,
  value,
  onChange,
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        opt.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setHighlight(0);
  }, [filtered]);

  const display = value
    ? options.find((o) => o.value === value)?.label ?? value
    : label;

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-9 max-w-[160px] items-center gap-1.5 rounded-[8px] border bg-surface px-3 text-[14px] font-bold text-foreground ${
          value || open
            ? "border-aws-blue"
            : "border-border-strong"
        }`}
      >
        <span className="truncate">{display}</span>
        <span
          className={`inline-block h-0 w-0 border-x-[4px] border-x-transparent border-t-[5px] border-t-aws-blue transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="absolute left-0 z-40 mt-1 w-[220px] overflow-hidden rounded-[8px] border border-border bg-surface shadow-[0_5px_15px_rgba(0,28,36,0.15)]">
          <div className="border-b border-border p-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlight((h) =>
                      Math.min(h + 1, Math.max(filtered.length - 1, 0)),
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlight((h) => Math.max(h - 1, 0));
                  } else if (e.key === "Enter" && filtered[highlight]) {
                    e.preventDefault();
                    onChange(filtered[highlight].value);
                    setOpen(false);
                  } else if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
                placeholder="Find"
                className="h-8 w-full rounded-[8px] border border-aws-blue bg-input py-0 pl-8 pr-2 text-[14px] text-foreground outline-none"
                aria-controls={listId}
              />
            </div>
          </div>
          <div
            id={listId}
            role="listbox"
            className="max-h-[240px] overflow-y-auto py-1"
          >
            {value ? (
              <button
                type="button"
                role="option"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="mx-1 mb-1 block w-[calc(100%-8px)] rounded-lg px-3 py-2 text-left text-[14px] text-aws-blue hover:bg-pill-active"
              >
                Clear filter
              </button>
            ) : null}
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-[14px] text-muted-2">No matches</p>
            ) : (
              filtered.map((opt, index) => {
                const active = highlight === index || value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={value === opt.value}
                    onMouseEnter={() => setHighlight(index)}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`mx-1 block w-[calc(100%-8px)] rounded-lg border px-3 py-2 text-left text-[14px] leading-5 text-foreground ${
                      active
                        ? "border-border bg-pill-active"
                        : "border-transparent hover:bg-surface-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
