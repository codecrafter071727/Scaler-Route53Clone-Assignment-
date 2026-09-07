"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getMe } from "@/features/auth/api/auth-api";

const loginPath = process.env.NEXT_PUBLIC_LOGIN_PATH;
if (!loginPath) {
  throw new Error("NEXT_PUBLIC_LOGIN_PATH is not set");
}

type Props = {
  children: ReactNode;
};

export function RequireAuth({ children }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    getMe()
      .then(() => {
        if (active) setReady(true);
      })
      .catch(() => {
        if (active) router.replace(loginPath);
      });
    return () => {
      active = false;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted text-[14px] text-sidebar-text">
        Checking session…
      </div>
    );
  }

  return children;
}
