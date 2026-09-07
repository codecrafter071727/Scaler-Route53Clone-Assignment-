"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { signUp } from "@/features/auth/api/auth-api";
import { getApiErrorMessage } from "@/features/auth/lib/api-error";
import { AUTH_COPY } from "@/features/auth/data/auth-copy";

type Props = {
  onSuccess: () => void;
  onSwitchToSignIn: () => void;
};

const fieldLabel = "mb-1 block font-amazon-bold text-[14px] leading-5 text-[#0f141a]";
const fieldInput =
  "box-border h-8 w-full rounded-lg border border-[#8c8c94] bg-white px-3 text-[14px] text-[#0f141a] outline-none focus:border-[#006ce0] focus:ring-1 focus:ring-[#006ce0]";

export function SignUpForm({ onSuccess, onSwitchToSignIn }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp({
        name,
        email,
        phone,
        password,
        confirm_password: confirm,
      });
      onSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to create account"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="signup-name" className={fieldLabel}>
          {AUTH_COPY.name}
        </label>
        <input
          id="signup-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldInput}
        />
      </div>

      <div>
        <label htmlFor="signup-email" className={fieldLabel}>
          {AUTH_COPY.email}
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldInput}
        />
      </div>

      <div>
        <label htmlFor="signup-phone" className={fieldLabel}>
          {AUTH_COPY.phone}
        </label>
        <input
          id="signup-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldInput}
        />
      </div>

      <div>
        <label htmlFor="signup-password" className={fieldLabel}>
          {AUTH_COPY.password}
        </label>
        <input
          id="signup-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldInput}
        />
      </div>

      <div>
        <label htmlFor="signup-confirm" className={fieldLabel}>
          {AUTH_COPY.confirmPassword}
        </label>
        <input
          id="signup-confirm"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={fieldInput}
        />
        <label className="mt-3 inline-flex cursor-pointer items-center text-[14px] text-[#0f141a]">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="mr-2 h-4 w-4 shrink-0 accent-[#006ce0]"
          />
          <span>{AUTH_COPY.showPassword}</span>
        </label>
      </div>

      {error ? <p className="text-[13px] text-[#d13212]">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="h-8 w-full rounded-full border border-[#ff9900] bg-[#ff9900] font-amazon-bold text-[14px] text-[#0f141a] hover:bg-[#ec7211] disabled:opacity-60"
      >
        {loading ? "Creating…" : AUTH_COPY.signUp}
      </button>

      <p className="text-center text-[14px] text-[#0f141a]">
        {AUTH_COPY.alreadyHavePrefix}{" "}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-amazon-bold text-[#006ce0] hover:underline"
        >
          {AUTH_COPY.signIn}
        </button>
      </p>
    </form>
  );
}
