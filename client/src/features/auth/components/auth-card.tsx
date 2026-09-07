"use client";

import { AUTH_COPY } from "../data/auth-copy";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

type AuthMode = "signin" | "signup";

type AuthCardProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: () => void;
};

export function AuthCard({ mode, onModeChange, onSuccess }: AuthCardProps) {
  const title =
    mode === "signin" ? AUTH_COPY.signInTitle : AUTH_COPY.signUpTitle;

  return (
    <div className="w-full max-w-[340px] shrink-0">
      <div className="overflow-hidden rounded-2xl border border-[#c6c6cd] bg-white">
        <div className="border-b border-transparent px-5 pb-2 pt-3">
          <h1 className="font-amazon-bold text-[20px] leading-6 tracking-[-0.3px] text-[#0f141a]">
            {title}
          </h1>
        </div>
        <div className="px-5 pb-5 pt-1">
          {mode === "signin" ? (
            <SignInForm
              onSuccess={onSuccess}
              onSwitchToSignUp={() => onModeChange("signup")}
            />
          ) : (
            <SignUpForm
              onSuccess={onSuccess}
              onSwitchToSignIn={() => onModeChange("signin")}
            />
          )}
        </div>
      </div>

      <p className="mt-3 text-[12px] leading-4 tracking-[0.06px] text-[#656871]">
        {AUTH_COPY.agreementPrefix}{" "}
        <a
          href="https://aws.amazon.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#006ce0] underline"
        >
          {AUTH_COPY.customerAgreement}
        </a>{" "}
        {AUTH_COPY.agreementMid}{" "}
        <a
          href="https://aws.amazon.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#006ce0] underline"
        >
          {AUTH_COPY.privacyNotice}
        </a>
        {AUTH_COPY.agreementCookies}{" "}
        <a
          href="https://aws.amazon.com/legal/cookies"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#006ce0] underline"
        >
          {AUTH_COPY.cookieNotice}
        </a>
        {AUTH_COPY.agreementSuffix}
      </p>
    </div>
  );
}
