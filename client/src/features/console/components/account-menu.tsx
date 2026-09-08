"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, signOut } from "@/features/auth/api/auth-api";

const loginPath = process.env.NEXT_PUBLIC_LOGIN_PATH;
if (!loginPath) {
  throw new Error("NEXT_PUBLIC_LOGIN_PATH is not set");
}

export function AccountMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("Account");
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getMe()
      .then((user) => {
        if (active) setLabel(`${user.name} (${user.id})`);
      })
      .catch(() => {
        /* RequireAuth handles redirect */
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleLogout() {
    setLoading(true);
    try {
      await signOut();
    } catch {
      /* still clear local session view */
    } finally {
      setOpen(false);
      setLoading(false);
      router.replace(loginPath);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 max-w-[120px] items-center gap-1 truncate rounded px-1.5 hover:bg-white/10 sm:max-w-[200px] sm:px-2 lg:max-w-[280px]"
      >
        <span className="truncate">{label}</span>
        <Caret />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded border border-border bg-card py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            disabled={loading}
            onClick={handleLogout}
            className="block w-full px-3 py-2 text-left text-[13px] text-foreground hover:bg-table-hover disabled:opacity-60"
          >
            {loading ? "Signing out…" : "Logout"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Caret() {
  return (
    <svg className="h-2.5 w-2.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M3 6h10l-5 6z" />
    </svg>
  );
}
