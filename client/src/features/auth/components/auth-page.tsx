"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe } from "@/features/auth/api/auth-api";
import { AccountCreatedDialog } from "./account-created-dialog";
import { AuthBanner } from "./auth-banner";
import { AuthCard } from "./auth-card";
import { AuthFooter } from "./auth-footer";
import { AuthLogo } from "./auth-logo";
import { AuthMarketing } from "./auth-marketing";
import { AuthTopBar } from "./auth-top-bar";

type AuthMode = "signin" | "signup";

const afterAuthPath = process.env.NEXT_PUBLIC_AFTER_AUTH_PATH;
if (!afterAuthPath) {
  throw new Error("NEXT_PUBLIC_AFTER_AUTH_PATH is not set");
}

export function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showCreated, setShowCreated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    getMe()
      .then(() => {
        // Already signed in — hosted zones is the app home
        if (active) router.replace(afterAuthPath);
      })
      .catch(() => {
        if (active) setCheckingSession(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  function handleSignInSuccess() {
    // Replace so browser Back does not return to sign-in
    router.replace(afterAuthPath);
  }

  function handleSignUpSuccess() {
    setShowCreated(true);
    setMode("signin");
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f2f3f3] text-[14px] text-[#424650]">
        Checking session…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f2f3f3]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -scale-x-100"
        style={{
          backgroundImage: "url('/bacground%20signup.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto 90%",
          backgroundPosition: "right 5% center",
          opacity: 0.08,
          filter: "brightness(1.15)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/bacground%20signup.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto 90%",
          backgroundPosition: "right 5% center",
          opacity: 0.08,
          filter: "brightness(1.15)",
        }}
      />

      <AuthTopBar />
      <AccountCreatedDialog
        open={showCreated}
        onClose={() => setShowCreated(false)}
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[980px] flex-col px-5 pb-6 pt-5">
        <header className="relative mb-2">
          <div className="flex justify-center pt-14">
            <AuthLogo />
          </div>
          <div className="mt-14">
            <AuthBanner />
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-start gap-6 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
          <AuthCard
            mode={mode}
            onModeChange={setMode}
            onSignInSuccess={handleSignInSuccess}
            onSignUpSuccess={handleSignUpSuccess}
          />
          <AuthMarketing />
        </div>

        <AuthFooter />
      </div>
    </div>
  );
}
