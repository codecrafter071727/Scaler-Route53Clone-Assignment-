"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getMe } from "@/features/auth/api/auth-api";
import { clientEnv } from "@/shared/config/env";

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
        if (active) router.replace(clientEnv.loginPath);
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
