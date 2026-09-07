"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { signIn } from "@/features/auth/api/auth-api";
import { getApiErrorMessage } from "@/features/auth/lib/api-error";
import { AUTH_COPY } from "@/features/auth/data/auth-copy";

type Props = {
  onSuccess: () => void;
  onSwitchToSignUp: () => void;
};

const fieldLabel = "mb-1 block font-amazon-bold text-[14px] leading-5 text-foreground";
const fieldInput =
  "box-border h-8 w-full rounded-lg border border-border-strong bg-surface px-3 text-[14px] text-foreground outline-none focus:border-aws-blue focus:ring-1 focus:ring-aws-blue";

export function SignInForm({ onSuccess, onSwitchToSignUp }: Props) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn({ identifier, password });
      onSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to sign in"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="signin-identifier" className={fieldLabel}>
          {AUTH_COPY.emailOrPhone}
        </label>
        <input
          id="signin-identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className={fieldInput}
        />
      </div>

      <div>
        <label htmlFor="signin-password" className={fieldLabel}>
          {AUTH_COPY.password}
        </label>
        <input
          id="signin-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldInput}
        />
        <div className="mt-3 flex items-center justify-between gap-2">
          <label className="inline-flex cursor-pointer items-center text-[14px] text-foreground">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="mr-2 h-4 w-4 shrink-0 accent-aws-blue"
            />
            <span>{AUTH_COPY.showPassword}</span>
          </label>
          <button type="button" className="text-[14px] text-aws-blue underline decoration-dashed">
            {AUTH_COPY.havingTrouble}
          </button>
        </div>
      </div>

      {error ? <p className="text-[13px] text-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="h-8 w-full rounded-full border border-aws-orange bg-aws-orange font-amazon-bold text-[14px] text-on-orange hover:bg-aws-orange-hover disabled:opacity-60"
      >
        {loading ? "Signing in…" : AUTH_COPY.signIn}
      </button>

      <p className="text-center text-[14px]">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-amazon-bold text-aws-blue hover:underline"
        >
          {AUTH_COPY.createAccount}
        </button>
      </p>
    </form>
  );
}
