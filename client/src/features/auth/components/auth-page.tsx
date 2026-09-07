"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthBanner } from "./auth-banner";
import { AuthCard } from "./auth-card";
import { AuthFooter } from "./auth-footer";
import { AuthLogo } from "./auth-logo";
import { AuthMarketing } from "./auth-marketing";
import { AuthTopBar } from "./auth-top-bar";

type AuthMode = "signin" | "signup";

const AUTH_FLAG = "aws-console-authenticated";

export function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");

  function handleSuccess() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_FLAG, "1");
    }
    router.push("/hostedzones");
  }

  return (
    <div className="relative min-h-screen bg-[#f2f3f3]">
      {/* AWS-style cube watermark - left side (mirrored) */}
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
      {/* AWS-style cube watermark - right side */}
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

      {/* Top links pinned to the viewport right edge */}
      <AuthTopBar />

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
            onSuccess={handleSuccess}
          />
          <AuthMarketing />
        </div>

        <AuthFooter />
      </div>
    </div>
  );
}
