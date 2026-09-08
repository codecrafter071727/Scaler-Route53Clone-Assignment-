"use client";

import { SettingsIcon } from "@/shared/icons";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPreferences?: boolean;
};

export function TablePagination({
  page,
  totalPages,
  onPageChange,
  showPreferences = true,
}: Props) {
  const pages = Math.max(totalPages, 0);
  const current = pages === 0 ? 0 : Math.min(Math.max(page, 1), pages);
  const canPrev = current > 1;
  const canNext = pages > 0 && current < pages;

  return (
    <div className="flex shrink-0 items-center self-end sm:self-center">
      <div className="flex items-center gap-3.5 pr-2.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(current - 1)}
          className="text-[18px] font-normal leading-none text-muted disabled:opacity-40"
        >
          &lt;
        </button>
        <span className="min-w-[1ch] text-center text-[15px] font-bold leading-none text-foreground">
          {pages === 0 ? "—" : current}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(current + 1)}
          className="text-[18px] font-normal leading-none text-muted disabled:opacity-40"
        >
          &gt;
        </button>
      </div>
      {showPreferences ? (
        <>
          <div className="mx-1 h-4 w-px bg-border" />
          <button
            type="button"
            aria-label="Preferences"
            className="ml-0.5 flex h-7 w-7 items-center justify-center text-foreground"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </>
      ) : null}
    </div>
  );
}
